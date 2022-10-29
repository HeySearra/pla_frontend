// Pathify
import { make } from 'vuex-pathify'

// Data
const state = {
  drawer: null,
  drawerImage: true,
  mini: false,
}

const mutations = make.mutations(state)

const actions = {
  ...make.actions(state),
  init: async ({ dispatch }) => {
    dispatch
  },
}

const getters = {
  getNavItems: () => {
    return [
      {
        title: '国内疫情',
        icon: 'mdi-image-filter-hdr',
        to: '/China/'
      },
      {
        title: '世界疫情',
        icon: 'mdi-earth',
        to: '/world/',
      },
      {
        title: '新闻信息',
        icon: 'mdi-newspaper-variant',
        to: '/news/',
      },
      {
        title: '防控专栏',
        icon: 'mdi-head-lightbulb',
        to: '/knowledge/',
      },
      {
        title: '历史数据',
        icon: 'mdi-align-vertical-bottom',
        to: '/provinceData/',
      }]
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions,
  getters,
}
