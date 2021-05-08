import Vue from 'vue'
import Vuex from 'vuex'
import state from './state'
import mutations from './mutations'

Vue.use(Vuex)

export default new Vuex.Store({
  state,
  actions: {
    changeCity (ctx, city) {
      ctx.commit('toChangeCity', city)
    }
  },
  getters: {
    doubleCity (state) {
      return '中国' + ' ' + state.city
    }
  },
  mutations
})
