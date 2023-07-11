<template>
    <div>
      <code>{{ code }}</code>
      <!-- <pre><code>{{ JSON.stringify( user ) }}</code></pre> -->
    </div>
  </template>
  <script>
  // import { Octokit } from '@octokit/rest'

 // import { GH_ACCESS_TOKEN } from '@/store/octokit'
  const GH_ACCESS_TOKEN = 'tooken'
  export default {
    name: 'AuthGithub',
    data: () => ({
      code: '',
      user: {}
    }),
    mounted () {
      this.code = this.$route.query.code
      this.$store.dispatch('authenticate',  {
        code:this.code,
        store: (auth) => {
          this.$cookies.set(GH_ACCESS_TOKEN, auth, '1d', '/', '', false, 'lax')
          console.log('set cookie', this.$cookies.get(GH_ACCESS_TOKEN))
        },
        remove: () => {
          this.$cookies.remove(GH_ACCESS_TOKEN, '/')
        }
      })
      this.$router.push('/')
    }
  }
  </script>