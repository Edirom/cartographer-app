import { Octokit } from '@octokit/rest'

const TOKEN_KEY = 'gh_access_token'

function decodeBase64Utf8 (encoded) {
  const binary = atob(encoded.replace(/[\n\r]/g, ''))
  const bytes = Uint8Array.from(binary, c => c.charCodeAt(0))
  return new TextDecoder('utf-8').decode(bytes)
}

function encodeBase64Utf8 (text) {
  const bytes = new TextEncoder().encode(text)
  let binary = ''
  bytes.forEach(b => (binary += String.fromCharCode(b)))
  return btoa(binary)
}

export default {
  namespaced: true,

  state: () => ({
    accessToken: localStorage.getItem(TOKEN_KEY) || null,
    user: null,               // { login, name, avatar_url }
    repos: [],                // array of { full_name, name, owner, private }
    repoContents: [],         // current directory listing
    selectedRepo: null,       // { full_name, name, owner }
    currentRepoPath: '',      // current browsing path within the selected repo
    selectedFile: null,       // { name, path, sha } of the file to import
    loadingRepos: false,
    loadingContents: false,
  }),

  mutations: {
    SET_TOKEN (state, token) {
      state.accessToken = token
      if (token) localStorage.setItem(TOKEN_KEY, token)
      else localStorage.removeItem(TOKEN_KEY)
    },
    SET_USER (state, user) {
      state.user = user
    },
    SET_REPOS (state, repos) {
      state.repos = repos
    },
    SET_REPO_CONTENTS (state, contents) {
      state.repoContents = contents
    },
    SET_SELECTED_REPO (state, repo) {
      state.selectedRepo = repo
      state.currentRepoPath = ''
      state.repoContents = []
      state.selectedFile = null
    },
    CLEAR_SELECTED_REPO (state) {
      state.selectedRepo = null
      state.currentRepoPath = ''
      state.repoContents = []
      state.selectedFile = null
    },
    SET_CURRENT_REPO_PATH (state, path) {
      state.currentRepoPath = path
    },
    SET_SELECTED_FILE (state, file) {
      state.selectedFile = file
    },
    SET_LOADING_REPOS (state, bool) {
      state.loadingRepos = bool
    },
    SET_LOADING_CONTENTS (state, bool) {
      state.loadingContents = bool
    },
  },

  actions: {
    /** Redirect the browser to the GitHub OAuth authorization page. */
    login () {
      const clientId = process.env.VUE_APP_CLIENT_ID
      const callbackUrl = process.env.VUE_APP_CALL_BACK
      const params = new URLSearchParams({
        client_id: clientId,
        redirect_uri: callbackUrl,
        scope: 'repo user:email',
      })
      window.location.href = `https://github.com/login/oauth/authorize?${params}`
    },

    /** Exchange the OAuth authorization code for an access token via the proxy server. */
    async authenticate ({ commit, dispatch }, code) {
      const res = await fetch('/authenticate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code }),
      })
      if (!res.ok) {
        const body = await res.json().catch(() => ({}))
        throw new Error(body.error || `Token exchange failed (${res.status})`)
      }
      const { access_token } = await res.json()
      commit('SET_TOKEN', access_token)
      await dispatch('fetchUser')
    },

    /** Restore the user session from a stored token on app startup. */
    async restoreSession ({ state, commit, dispatch }) {
      if (!state.accessToken) return
      try {
        await dispatch('fetchUser')
      } catch {
        // Token is expired or revoked — clear it silently
        commit('SET_TOKEN', null)
        commit('SET_USER', null)
      }
    },

    /** Fetch the authenticated user's GitHub profile. */
    async fetchUser ({ state, commit }) {
      if (!state.accessToken) return
      const octokit = new Octokit({ auth: state.accessToken })
      const { data } = await octokit.rest.users.getAuthenticated()
      commit('SET_USER', {
        login: data.login,
        name: data.name || data.login,
        avatar_url: data.avatar_url,
      })
    },

    /** Fetch repositories accessible by the authenticated user. */
    async fetchRepos ({ state, commit }) {
      if (!state.accessToken) return
      commit('SET_LOADING_REPOS', true)
      try {
        const octokit = new Octokit({ auth: state.accessToken })
        const { data } = await octokit.rest.repos.listForAuthenticatedUser({
          sort: 'updated',
          per_page: 100,
          affiliation: 'owner,collaborator,organization_member',
        })
        commit('SET_REPOS', data.map(r => ({
          full_name: r.full_name,
          name: r.name,
          owner: r.owner.login,
          private: r.private,
        })))
      } finally {
        commit('SET_LOADING_REPOS', false)
      }
    },

    /** Select a repository and load its root contents. */
    async selectRepo ({ commit, dispatch }, repo) {
      commit('SET_SELECTED_REPO', repo)
      await dispatch('fetchRepoContents', { repo, path: '' })
    },

    /** Deselect the current repository and return to the repo list. */
    clearSelectedRepo ({ commit }) {
      commit('CLEAR_SELECTED_REPO')
    },

    /** Fetch the contents of a directory within the selected repository. */
    async fetchRepoContents ({ state, commit }, { repo, path }) {
      if (!state.accessToken) return
      commit('SET_LOADING_CONTENTS', true)
      try {
        const octokit = new Octokit({ auth: state.accessToken })
        const { data } = await octokit.rest.repos.getContent({
          owner: repo.owner,
          repo: repo.name,
          path: path || '',
        })
        const items = Array.isArray(data) ? data : [data]
        commit('SET_REPO_CONTENTS',
          items
            .map(i => ({ name: i.name, path: i.path, type: i.type, sha: i.sha }))
            .sort((a, b) => {
              if (a.type !== b.type) return a.type === 'dir' ? -1 : 1
              return a.name.localeCompare(b.name)
            })
        )
        commit('SET_CURRENT_REPO_PATH', path || '')
        commit('SET_SELECTED_FILE', null)
      } finally {
        commit('SET_LOADING_CONTENTS', false)
      }
    },

    /** Mark a file item as selected for import. */
    selectFile ({ commit }, file) {
      commit('SET_SELECTED_FILE', file)
    },

    /** Fetch and decode the content of a file from GitHub. Returns { xml, sha, path }. */
    async getFileContent ({ state }, { repo, path }) {
      const octokit = new Octokit({ auth: state.accessToken })
      const { data } = await octokit.rest.repos.getContent({
        owner: repo.owner,
        repo: repo.name,
        path,
      })
      if (Array.isArray(data)) throw new Error(`${path} is a directory, not a file`)
      const xml = decodeBase64Utf8(data.content)
      return { xml, sha: data.sha, path: data.path }
    },

    /** Commit updated file content back to GitHub. Returns the new blob SHA. */
    async commitFile ({ state }, { repo, path, sha, content, message }) {
      const octokit = new Octokit({ auth: state.accessToken })
      const encoded = encodeBase64Utf8(content)
      const { data } = await octokit.rest.repos.createOrUpdateFileContents({
        owner: repo.owner,
        repo: repo.name,
        path,
        message: message || 'Update MEI file via Cartographer',
        content: encoded,
        sha,
      })
      return data.content ? data.content.sha : null
    },

    /** Clear all auth state and remove the stored token. */
    logout ({ commit }) {
      commit('SET_TOKEN', null)
      commit('SET_USER', null)
      commit('SET_REPOS', [])
      commit('SET_REPO_CONTENTS', [])
      commit('CLEAR_SELECTED_REPO')
    },
  },

  getters: {
    isAuthenticated: state => state.accessToken !== null,
    user:            state => state.user,
    accessToken:     state => state.accessToken,
    repos:           state => state.repos,
    repoContents:    state => state.repoContents,
    selectedRepo:    state => state.selectedRepo,
    currentRepoPath: state => state.currentRepoPath,
    selectedFile:    state => state.selectedFile,
    loadingRepos:    state => state.loadingRepos,
    loadingContents: state => state.loadingContents,
  },
}
