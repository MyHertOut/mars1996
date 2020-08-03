// 资产服务中心 api
import requestObj from '@/server/index.js';

/**
 * The number of securities paying interest
 * @param {*} config
 */
export function securityDisburseCount (config) {
  return requestObj({
    url: '/v1/asset/security/detail/disburse/count',
    method: 'get',
    ...config
  });
};
/**
 * The amount of securities being repurchased
 * @param {*} config
 */
export function securityRedeemCount (config) {
  return requestObj({
    url: '/v1/asset/security/detail/redeem/count',
    method: 'get',
    ...config
  });
};
/**
 * Query list state
 * @param {*} data
 */
export function redeemStatusList (data) {
  return requestObj({
    url: '/web/v1/asset/redeem/statusList',
    method: 'post',
    data
  });
};
/**
   * Query redemption List
   * @param {*} data
   */
export function redeemList (data) {
  return requestObj({
    url: '/web/v1/asset/redeem/list',
    method: 'post',
    data
  });
};

/**
 * Query redemption absRedemption List
 * @param {*} data
 */
export function absRedemption (data) {
  return requestObj({
    url: '/web/v1/asset/redeem/absRedemption',
    method: 'post',
    data
  });
};

/**
 * redemption
 * @param {*} data
 */
export function redeemBySecurityCode (config) {
  return requestObj({
    url: `/web/v1/asset/redeem/${config.data.securityCode}/${config.data.securityType}`,
    method: 'get',
    ...config
  });
};
/**
 * redemption retry
 * @param {*} data
 */
export function redeemRetryBySecurityCode (config) {
  return requestObj({
    url: `/web/v1/asset/redeem/retry/${config.data.securityCode}`,
    method: 'get',
    ...config
  });
};
/**
 * redemption freeze
 * @param {*} data
 */
export function redeemFreeze (config) {
  return requestObj({
    url: '/web/v1/asset/redeem/freeze',
    method: 'post',
    ...config
  });
};
/**
 * redemption submit
 * @param {*} data
 */
export function redeemSubmit (config) {
  return requestObj({
    url: '/web/v1/asset/redeem/submit',
    method: 'post',
    ...config
  });
};
/**
 * redemption retry submit
 * @param {*} data
 */
export function redeemRetrySubmit (config) {
  return requestObj({
    url: '/web/v1/asset/redeem/retry/submit',
    method: 'post',
    ...config
  });
};
/**
 * Asset Servicing Centre list
 * @param {*} data
 */
export function securityCouponList (config) {
  return requestObj({
    url: '/v1/asset/security/coupon/list',
    method: 'post',
    ...config
  });
};
/**
 * batch detail list
 * @param {*} data
 */
export function distributeBatchDetailList (config) {
  const { batchNo, page, limit } = config.data;
  return requestObj({
    url: `/web/v1/asset/distribute/batch/detail/list/${batchNo}/${page}/${limit}`,
    method: 'get',
    ...config
  });
};
/**
 * Revenue release details
 * @param {*} data
 */
export function assetDistributeDetail (config) {
  return requestObj({
    url: `/web/v1/asset/distribute/${config.data.code}/${config.data.securityType}/${config.data.period}`,
    method: 'get',
    ...config
  });
};

/**
 * ABS Revenue release details
 * @param {*} data
 */
export function assetAbsDistributeDetail (config) {
  return requestObj({
    url: `/web/v1/asset/distribute/${config.data.securityCode}/${config.data.securityType}/${config.data.period}`,
    method: 'get',
    ...config
  });
};
/**
 * Submit details of revenue release
 * @param {*} data
 */
export function distributeSubmit (config) {
  return requestObj({
    url: '/web/v1/asset/distribute/submit',
    method: 'post',
    ...config
  });
};
/**
 * distribute retry detail
 * @param {*} data
 */
export function assetDistributeRetryDetail (config) {
  return requestObj({
    url: `/web/v1/asset/distribute/retry/${config.data.code}/${config.data.period}`,
    method: 'get',
    ...config
  });
};
/**
 * Submit details of revenue release
 * @param {*} data
 */
export function distributeRetrySubmit (config) {
  return requestObj({
    url: '/web/v1/asset/distribute/retry/submit',
    method: 'post',
    ...config
  });
};
/**
 * coupon calculate history
 * @param {*} data
 */
export function couponCalculateHis (config) {
  return requestObj({
    url: '/web/v1/asset/coupon/calculateHis',
    method: 'post',
    ...config
  });
};
/**
 * coupon calculate
 * @param {*} data
 */
export function couponCalculate (config) {
  return requestObj({
    url: '/web/v1/asset/coupon/calculate',
    method: 'post',
    ...config
  });
};
/**
 * Query list state
 * @param {*} data
 */
export function couponStatusList (data) {
  return requestObj({
    url: '/web/v1/asset/coupon/statusList',
    method: 'post',
    data
  });
};
/**
 * Query coupon List
 * @param {*} data
 */
export function couponList (data) {
  return requestObj({
    url: '/web/v1/asset/coupon/list',
    method: 'post',
    data
  });
};
/**
 * Distribute Details Header fields
 * @param {*} data
 */
export function distributeBatchDetail (config) {
  return requestObj({
    url: `/web/v1/asset/distribute/batch/detail/${config.data.securityCode}/${config.data.period}`,
    method: 'get',
    ...config
  });
};
/**
 * Distribute Details table list
 * @param {*} data
 */
export function distributeBatchList (config) {
  return requestObj({
    url: `/web/v1/asset/distribute/batch/list/snapshot/${config.snapshotNo}/${config.page}/${config.limit}`,
    // url: `/web/v1/asset/distribute/batch/list/${config.snapshotNo}/${config.page}/${config.limit}`,
    method: 'get',
    notify: config.notify
  });
};

/**
 * abs打快照
 * @param {*} data
 */
export function absCalculate (config) {
  return requestObj({
    url: '/web/v1/asset/coupon/absCalculate',
    method: 'post',
    ...config
  });
};
