// 公共
import request from '@/server/index.js';
/**
 * system config
 * @param {*} data
 */
export function getSystemConfig (data) {
  return request({
    url: '/web/v1/system/config',
    method: 'post',
    data
  });
};
// logout
export const logout = async config => {
  const { data } = await request.request(Object.assign({ method: 'POST', url: '/web/v1/member/user/logout' }, { ...config }));
  return data;
};

/**
 * An interface for querying currency balances
 * @param {*} config
 */
export function getAssetBalance (config) {
  return request({
    url: `/web/v1/asset/balance/${config.data.assetId}/${config.data.addr}`,
    method: 'get',
    ...config
  });
};
// get user info
export const getUser = async config => {
  const { data } = await request.request(Object.assign({ method: 'GET', url: '/web/v1/member/query/user' }, { ...config }));
  return data;
};

/**
 * multiaddress query
 * @param {*} data
 */
export function multiAddresses (data) {
  return request({
    url: '/web/v1/trade/order/addresses',
    method: 'post',
    data
  });
};
/**
 * List of issued currencies (current Merchant)
 * @param {*} type 0 certificate, 1 digital currency
 */
export function assetTokenCurrency (config) {
  return request({
    url: `/v1/asset/token/currency/${config.data.type}`,
    method: 'get',
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
 * redemption retry
 * @param {*} data
 */
export function redeemBatchDetailList (config) {
  const { batchNo, page, limit } = config.data;
  return request({
    url: `/web/v1/asset/redeem/batch/detail/list/${batchNo}/${page}/${limit}`,
    method: 'get',
    ...config
  });
};
/**
 * redemption retry
 * @param {*} data
 */
export function redeemBatchDetail (config) {
  return request({
    url: `/web/v1/asset/redeem/batch/detail/${config.data.securityCode}`,
    method: 'get',
    ...config
  });
};
/**
 * redemption retry
 * @param {*} data
 */
export function redeemBatchList (config) {
  const { securityCode, page, limit = 10 } = config.data;
  return request({
    url: `/web/v1/asset/redeem/batch/list/${securityCode}/${page}/${limit}`,
    method: 'get',
    ...config
  });
};
/**
 * redemption retry
 * @param {*} data
 */
export function getAssetToken (config) {
  const { type, currency } = config.data;
  return request({
    url: `/v1/asset/token/currency/${type}/${currency}`,
    method: 'get',
    ...config
  });
};
