import axios from 'axios';
import {
  getLang, notify, LOCAL_STORAGE_TOKEN, LOCAL_STORAGE_SYSTEM,
  getEncryptPair, encrypt, LOCAL_STORAGE_TRADEADDRESS, LOCAL_STORAGE_BALANCEADDRESS,
  LOCAL_STORAGE_SECURITIESADDRESS
} from '@/common/util';
import router from '@/router/index.js';
import Vue from 'vue';
import store from '@/store';

const requestObj = axios.create({
  baseURL: process.env.VUE_APP_API_BASE,
  timeout: 0,
  headers: {
    lang: getLang()
  }
});

// Request interception
requestObj.interceptors.request.use(config => {
  const lang = getLang();
  if (config.needSign) {
    const time = +new Date() + '';
    const { accesskey } = getEncryptPair();
    const signData = Object.assign({ accesskey, time, lang }, config.data);
    config.data = Object.assign({ common: { time, lang, sign: encrypt(signData) } }, { data: config.data });
  } else {
    config.data = Object.assign({ lang, data: config.data });
  }
  return config;
}, error => {
  return Promise.reject(error);
});

// intercept notify: ANY(All hints) SUCCESS(Successful hints) ERROR(Failure prompt)
requestObj.interceptors.response.use(response => {
  const resCode = response.data.code;
  if (resCode === '600006' || resCode === '600008') {
    // Vue.prototype.$notify.error({ message: response.data.msg || 'The login timeout' });
    Vue.prototype.$message({ message: response.data.msg, type: 'error' });
    store.commit('resetUser');
    store.commit('resetConfig');
    store.commit('resetAddress');
    store.commit('resetBalanceAddress');
    store.commit('resetIssuanceAddress');
    localStorage.setItem(LOCAL_STORAGE_TOKEN, '');
    localStorage.setItem(LOCAL_STORAGE_SYSTEM, '');
    localStorage.removeItem(LOCAL_STORAGE_TRADEADDRESS);
    localStorage.removeItem(LOCAL_STORAGE_BALANCEADDRESS);
    localStorage.removeItem(LOCAL_STORAGE_SECURITIESADDRESS);
    router.push({ name: 'Login' });
    return response;
  }
  const resMsg = response.data.msg || 'The system is busy, please try again later';
  if (resCode === '1000' && (response.config.notify === notify.any || response.config.notify === notify.success)) {
    // Vue.prototype.$notify.success({ message: 'Operation Success' });
    Vue.prototype.$message({ message: 'Operation Success', type: 'success' });
  } else if ((resCode !== '1000') && (response.config.notify === notify.any || response.config.notify === notify.error)) {
    // Vue.prototype.$notify.error({ message: resMsg });
    Vue.prototype.$message({ message: resMsg, type: 'error' });
  } else if ((resCode !== '1000') && response.config.notify) {
    // Vue.prototype.$notify.error({ message: resMsg });
    Vue.prototype.$message({ message: resMsg, type: 'error' });
  }
  return response;
}, () => {
  // Vue.prototype.$notify.error({ message: error });
  // Vue.prototype.$message({ message: error, type: 'error' });
});

// intercept slient = true
requestObj.interceptors.response.use(response => {
  if (!response || (response.data.code !== '1000' && !response.config.slient)) {
    return Promise.reject(response || 'The system is busy, please try again later');
  } else {
    return response;
  }
});

export default requestObj;
