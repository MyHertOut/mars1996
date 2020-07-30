import { getUser } from '@/api/common.js';
import { LOCAL_STORAGE_TOKEN } from '@/common/util.js';

export default {
  state: {
    user: {}
  },
  mutations: {
    updataUser (state, data) {
      state.user = Object.assign(state.user, data);
    },
    resetUser (state) {
      state.user = Object.assign({}, {});
    }
  },
  getters: {
    userInfo: state => {
      return state.user;
    }
  },
  actions: {
    getUserInfo (context, params) {
      return new Promise((resolve, reject) => {
        getUser(params).then(data => {
          if (data.code === '1000') {
            context.commit('updataUser', data.data);
            localStorage.setItem(LOCAL_STORAGE_TOKEN, data.data.userNo);
            resolve(true);
          } else {
            context.commit('resetUser');
            localStorage.setItem(LOCAL_STORAGE_TOKEN, '');
            reject(data);
          }
        }).catch(error => {
          reject(error);
        });
      });
    }
  }
};
