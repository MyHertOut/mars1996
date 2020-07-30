import Vue from 'vue';
import Vuex from 'vuex';
import Common from './common';
import User from './user';

Vue.use(Vuex);

export default new Vuex.Store({
  state: {

  },
  mutations: {

  },
  actions: {

  },
  modules: {
    User,
    common: { ...Common }
  }
});
