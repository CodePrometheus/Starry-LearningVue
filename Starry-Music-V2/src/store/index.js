import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

const state = {
  isLogin: false,
}

const store = new Vuex.Store({
  state,
  mutations: {},
  actions: {
    updateLoginState(state, flag) {
      state.isLogin = flag
    },
  },
})

export default store
