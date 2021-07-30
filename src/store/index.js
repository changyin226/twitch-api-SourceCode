import Vue from 'vue';
import Vuex from 'vuex';

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    isDarkMode: false,
    isLoading: false,
    lang: 'all',
    period: 'week',
    search: 'channels',
    navHeight: 0,
  },
  mutations: {
    DARKMODE(state, payload) {
      state.isDarkMode = payload;
    },
    LOADING(state) {
      state.isLoading = !state.isLoading;
    },
    LANG(state, payload) {
      state.lang = payload;
    },
    PERIOD(state, payload) {
      state.period = payload;
    },
    SEARCH(state, payload) {
      state.search = payload;
    },
    NAVHEIGHT(state, payload) {
      state.navHeight = payload;
    },
  },
  actions: {
  },
  modules: {
  },
});
