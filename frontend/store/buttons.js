export const state = () => ({
  log: process.env.LOG,
  triggerBtnChange: 1,
  triggerBtnReset: true,
  triggerBtnResetAutocomplete: true,
  resetBtnsExceptions: [],

  triggerTabs: false,
  tabs: {}
  // tabs: {
  //   'tabs-buttons-kpiFamilies': ['transition-ecologique']
  // }
})

export const getters = {
  getTabsFromButtonsStore: (state) => (tabsId) => {
    return state.tabs[tabsId]
  }
  // getResetBtnsExceptionsFromButtonsStore: (state) => (tabsId) => {
  //   return state.resetBtnsExceptions
  // }
}

export const mutations = {
  toggleBtnTrigger (state) {
    // state.log && console.log('\nS-buttons-M-toggleBtnTrigger ...')
    state.triggerBtnChange = state.triggerBtnChange * -1
  },
  toggleBtnReset (state) {
    // state.log && console.log('\nS-buttons-M-toggleBtnReset ...')
    state.triggerBtnReset = !state.triggerBtnReset
  },
  toggleBtnResetAutocomplete (state) {
    // state.log && console.log('\nS-buttons-M-toggleBtnReset ...')
    state.triggerBtnResetAutocomplete = !state.triggerBtnResetAutocomplete
  },
  updateResetBtnsExceptions (state, btnId) {
    // state.log && console.log('\nS-buttons-M-updateResetBtnsExceptions : state.resetBtnsExceptions (start) :', state.resetBtnsExceptions)
    state.resetBtnsExceptions = [btnId]
    // state.log && console.log('S-buttons-M-updateResetBtnsExceptions / state.resetBtnsExceptions (end) : ', state.resetBtnsExceptions)
  },

  toggleTabsTrigger (state) {
    // state.log && console.log('S-buttons-M-toggleTabsTrigger / state.triggerTabs (start) :', state.triggerTabs)
    state.triggerTabs = !state.triggerTabs
    // state.log && console.log('S-buttons-M-toggleTabsTrigger / state.triggerTabs (end):', state.triggerTabs)
  },
  setTabs (state, tabsObject) {
    // state.log && console.log('\nS-buttons-M-setTabs / tabsObject :',  tabsObject)
    state.tabs[tabsObject.tabsId] = tabsObject
    // state.log && console.log('S-buttons-M-setTabs / state.tabs :',  state.tabs)
  }
}

export const actions = {
  changeTabs ({ state, commit }, tabsObject) {
    // state.log && console.log('\nS-buttons-A-changeTabs / tabsObject :',  tabsObject)
    commit('setTabs', tabsObject)
    commit('toggleTabsTrigger')
  },
  changeAutocomplete ({ state, commit }, btnId) {
    // state.log && console.log('\nS-buttons-A-changeAutocomplete / btnId :', btnId)
    commit('updateResetBtnsExceptions', btnId)
    commit('toggleBtnResetAutocomplete')
  }

}
