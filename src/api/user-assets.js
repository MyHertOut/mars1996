import request from '../server/index.js';
/**
 * Trade multiaddress query
 * @param {*} data
 */
export function tradeOrdeAddresses (data) {
  return request({
    url: '/web/v1/trade/order/addresses',
    method: 'post',
    data
  });
};
/**
 * userAssets- bounds list
 * @param {*} data
 */
export function tradeBalanceListSecurity (config) {
  return request({
    url: '/web/v1/trade/balance/listSecurity',
    method: 'post',
    ...config
  });
};

/**
 * balance-Settlement Currencies list
 * @param {*} data
 */
export function tradeBalanceListCurrency (config) {
  return request({
    url: '/web/v1/trade/balance/listCurrency',
    method: 'post',
    ...config
  });
};

/**
 * Transaction History Deposit list
 * @param {*} data
 */
export function balanceListInTransfer (config) {
  return request({
    url: '/web/v1/trade/balance/listInTransfer',
    method: 'post',
    ...config
  });
};

/**
 * Transaction History Withdrawal list
 * @param {*} data
 */
export function balanceListOutTransfer (config) {
  return request({
    url: '/web/v1/trade/balance/listOutTransfer',
    method: 'post',
    ...config
  });
};

/**
 * query balance
 * @param {*} data
 */
export function getBalance (config) {
  return request({
    url: '/web/v1/trade/balance/balance',
    method: 'post',
    ...config
  });
};

/**
 * balance transfer
 * @param {*} data
 */
export function balanceTransfer (data) {
  return request({
    url: '/web/v1/trade/balance/transfer',
    method: 'post',
    data
  });
};

/**
 * balance assets-back
 * @param {*} data
 */

export function balanceListAbs (config) {
  return request({
    url: '/web/v1/trade/balance/listAbs',
    method: 'post',
    ...config
  });
};