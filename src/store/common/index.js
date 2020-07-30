import { getSystemConfig } from '@/api/common';
import {
  LOCAL_STORAGE_SYSTEM,
  LOCAL_STORAGE_TRADEADDRESS,
  LOCAL_STORAGE_BALANCEADDRESS,
  LOCAL_STORAGE_SECURITIESADDRESS,
  LOCAL_STORAGE_SETTLETOKENADDRESS
} from '@/common/util';

const getStorage = (key) => {
  const data = window.localStorage.getItem(key);
  return data ? JSON.parse(data) : {};
};
export default {
  state: {
    systemConfig: getStorage(LOCAL_STORAGE_SYSTEM),
    selectTradeAddress: getStorage(LOCAL_STORAGE_TRADEADDRESS),
    selectBalanceAddress: getStorage(LOCAL_STORAGE_BALANCEADDRESS),
    IssuanceAddress: {
      securities: getStorage(LOCAL_STORAGE_SECURITIESADDRESS),
      settlementToken: getStorage(LOCAL_STORAGE_SETTLETOKENADDRESS)
    }
  },
  mutations: {
    saveConfig (state, data) {
      state.systemConfig = Object.assign(state.systemConfig, data);
    },
    resetConfig (state) {
      state.systemConfig = {};
    },
    saveAddress (state, data) {
      state.selectTradeAddress = data;
    },
    resetAddress (state) {
      state.selectTradeAddress = {};
    },
    saveBalanceAddress (state, data) {
      state.selectBalanceAddress = data;
    },
    saveIssuanceAddress (state, data) {
      const obj = {
        [LOCAL_STORAGE_SECURITIESADDRESS]: 'securities',
        [LOCAL_STORAGE_SETTLETOKENADDRESS]: 'settlementToken'
      };
      state.IssuanceAddress[obj[data.type]] = data.data;
    },
    resetBalanceAddress (state) {
      state.selectBalanceAddress = {};
    },
    resetIssuanceAddress (state) {
      state.IssuanceAddress = {
        securities: {},
        settlementToken: {}
      };
    }
  },
  getters: {
    systemConfig: state => state.systemConfig,
    tradeSelectedAddress: state => state.selectTradeAddress,
    balanceSelectedAddress: state => state.selectBalanceAddress,
    securitiesAddress: state => state.IssuanceAddress.securities,
    settlementTokenAddress: state => state.IssuanceAddress.settlementToken
  },
  actions: {
    getSystemConfig (context, params) {
      return new Promise((resolve, reject) => {
        getSystemConfig(params).then(resData => {
          const { data, code } = resData.data;
          if (code === '1000') {
            context.commit('saveConfig', data);
            localStorage.setItem(LOCAL_STORAGE_SYSTEM, data ? JSON.stringify(data) : '{}');
            resolve(true);
          } else {
            context.commit('resetConfig');
            localStorage.removeItem(LOCAL_STORAGE_SYSTEM);
            resolve(false);
          }
        }).catch(error => {
          reject(error);
        });
      });
    },
    saveTradeAddress (context, params) {
      context.commit('saveAddress', params);
      localStorage.setItem(LOCAL_STORAGE_TRADEADDRESS, params ? JSON.stringify(params) : '{}');
    },
    saveBalanceAddress (context, params) {
      context.commit('saveBalanceAddress', params);
      localStorage.setItem(LOCAL_STORAGE_BALANCEADDRESS, params ? JSON.stringify(params) : '{}');
    },
    saveIssuanceAddress (context, params) {
      context.commit('saveIssuanceAddress', params);
      localStorage.setItem(params.type, params.data ? JSON.stringify(params.data) : '{}');
    }
  }
};
