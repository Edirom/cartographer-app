import { mount } from '@vue/test-utils'
import { createStore } from 'vuex'
import LoadGitModal from '@/components/LoadGitModal.vue'

describe('LoadGitModal.vue', () => {
  const createVuexStore = (dispatch = jest.fn()) => createStore({
    getters: {
      gitRepositories: () => ['edirom/cartographer-app'],
      gitBranches: () => ({
        'edirom/cartographer-app': ['main', 'develop']
      }),
      selectedGitRepository: () => null,
      selectedGitBranch: () => null,
      gitCommitFileName: () => 'meiFile.xml'
    },
    actions: {
      setSelectedRepository: dispatch,
      commitGithub: dispatch,
      toggleLoadGitModal: dispatch
    }
  })

  it('enables branch selection after repository input', async () => {
    const store = createVuexStore()
    const wrapper = mount(LoadGitModal, {
      global: {
        plugins: [store]
      }
    })

    const branchSelect = wrapper.find('#branch-input')
    expect(branchSelect.attributes('disabled')).toBeDefined()

    await wrapper.find('#repository-input').setValue('edirom/cartographer-app')
    expect(wrapper.find('#branch-input').attributes('disabled')).toBeUndefined()
  })

  it('shows new branch field when creating a branch', async () => {
    const store = createVuexStore()
    const wrapper = mount(LoadGitModal, {
      global: {
        plugins: [store]
      }
    })

    await wrapper.find('#repository-input').setValue('edirom/cartographer-app')
    await wrapper.find('#branch-input').setValue('__create_new__')

    expect(wrapper.find('#new-branch-input').exists()).toBe(true)
  })

  it('dispatches commit payload with edited file name and branch', async () => {
    const dispatch = jest.fn()
    const store = createVuexStore(dispatch)
    const wrapper = mount(LoadGitModal, {
      global: {
        plugins: [store]
      }
    })

    await wrapper.find('#repository-input').setValue('edirom/cartographer-app')
    await wrapper.find('#branch-input').setValue('develop')
    await wrapper.find('#file-name-input').setValue('renamed-file.mei')

    await wrapper.find('button.btn-primary').trigger('click')

    const commitCall = dispatch.mock.calls.find(call => call[1] && call[1].repository)
    expect(commitCall).toBeDefined()
    expect(commitCall[1]).toEqual({
      repository: 'edirom/cartographer-app',
      branch: 'develop',
      newBranchName: '',
      fileName: 'renamed-file.mei'
    })
  })
})
