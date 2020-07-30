import Vue from 'vue';
import { Loading } from 'element-ui';
import { LOCAL_STORAGE_TOKEN } from './util';
import store from '@/store';

export default ({ from, to }, next) => {
  const token = localStorage.getItem(LOCAL_STORAGE_TOKEN);
  if (token) {
    if (to.meta.isLogin) {
      const loadingInstance = Loading.service();
      store.dispatch('getUserInfo', { slient: true }).then(data => {
        if (data) {
          if (store.getters.userInfo.userNo) {
            next();
            loadingInstance.close();
          } else {
            next({ name: 'Login' });
            loadingInstance.close();
          }
        } else {
          next({ name: 'Login' });
          loadingInstance.close();
        }
      }, (error) => {
        const resData = error || {};
        if (resData.code !== '600006' && resData.code !== '600008') {
          Vue.prototype.$message({ message: resData.msg || 'The system is busy, please try again later', type: 'error' });
        }
        next({ name: 'Login' });
        loadingInstance.close();
      }).catch(error => {
        if (error) {
          next({ name: 'Login' });
          loadingInstance.close();
        }
      });
    } else {
      next();
    }
  } else {
    if (!to.meta.isLogin) {
      next();
    } else {
      next({ name: 'Login' });
    }
  }
};
