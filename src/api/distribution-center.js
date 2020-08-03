// 发行中心
import requestObj from '@/server/index.js';

/**
 * The bond list
 * @param {*} config
 */
export function assetSecurityList (config) {
  return requestObj({
    url: '/v1/asset/security/list',
    method: 'post',
    ...config
  });
};
/**
 * List of Digital currencies
 * @param {*} config
 */
export function assetTokenList (config) {
  return requestObj({
    url: '/v1/asset/token/list',
    method: 'post',
    ...config
  });
};
/**
 * security detail basic
 * @param {*} config
 */
export function securityDetailBasic (config) {
  return requestObj({
    url: `/v1/asset/security/${config.data.serialNo}/detail/basic`,
    method: 'get',
    ...config
  });
};
/**
 * token detail basic
 * @param {*} config
 */
export function tokenDetailBasic (config) {
  return requestObj({
    url: `/v1/asset/token/${config.data.serialNo}/detail/basic`,
    method: 'get',
    ...config
  });
};
/**
 * security coupon basic
 * @param {*} config
 */
export function securityDetailCoupon (config) {
  return requestObj({
    url: `/v1/asset/security/${config.data.serialNo}/detail/coupon`,
    method: 'get',
    ...config
  });
};
/**
 * abs security coupon basic
 * @param {*} config
 */
export function absDetailCoupon (config) {
  return requestObj({
    url: `/web/v1/asset/abs/${config.data.serialNo}/detail/coupon`,
    method: 'get',
    ...config
  });
};
/**
 * abs security document basic
 * @param {*} config
 */
export function absDetailDocument (config) {
  return requestObj({
    url: `/web/v1/asset/abs/${config.data.serialNo}/detail/document`,
    method: 'get',
    ...config
  });
};
/**
 * security document basic
 * @param {*} config
 */
export function securityDetailDocument (config) {
  return requestObj({
    url: `/v1/asset/security/${config.data.serialNo}/detail/document`,
    method: 'get',
    ...config
  });
};
/**
 * security kyc basic
 * @param {*} config
 */
export function securityDetailKyc (config) {
  return requestObj({
    url: `/v1/asset/security/${config.data.serialNo}/detail/kyc`,
    method: 'get',
    ...config
  });
};
/**
 * abs kyc basic
 * @param {*} config
 */
export function absDetailKyc (config) {
  return requestObj({
    url: `/web/v1/asset/abs/${config.data.serialNo}/detail/kyc`,
    method: 'get',
    ...config
  });
};
/**
 * security Issuance Records basic
 * @param {*} config
 */
export function securityDetailRecord (config) {
  const { serialNo, page, limit = 10 } = config.data;
  return requestObj({
    url: `/v1/asset/security/${serialNo}/detail/record/${page}/${limit}`,
    method: 'get',
    ...config
  });
};
/**
 * abs Issuance Records basic
 * @param {*} config
 */
export function absDetailRecord (config) {
  const { serialNo, page, limit = 10 } = config.data;
  return requestObj({
    url: `/web/v1/asset/abs/${serialNo}/detail/record/${page}/${limit}`,
    method: 'get',
    ...config
  });
};
/**
 * token Issuance Records basic
 * @param {*} config
 */
export function assetTokenDetailRecord (config) {
  const { serialNo, page, limit = 10 } = config.data;
  return requestObj({
    url: `/v1/asset/token/${serialNo}/detail/record/${page}/${limit}`,
    method: 'get',
    ...config
  });
};
/**
 * asset issuance history
 * @param {*} config
 */
export function assetIssuanceHistory (config) {
  return requestObj({
    url: '/web/v1/asset/issuance/history',
    method: 'post',
    ...config
  });
};
/**
 * bonds detail-The snapshot record
 * @param {*} data
 */
export function couponSnapshotList (config) {
  return requestObj({
    url: '/web/v1/asset/coupon/snapshot/list',
    method: 'post',
    ...config
  });
};
/**
 * Distribute Details table list
 * @param {*} data
 */
export function distributeBatchList (config) {
  const { securityCode, page, limit = 10 } = config.data;
  return requestObj({
    // url: `/web/v1/asset/distribute/batch/list/snapshot/${securityCode}/${page}/${limit}`,
    url: `/web/v1/asset/distribute/batch/list/${securityCode}/${page}/${limit}`,
    method: 'get',
    notify: config.notify
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
 * The abs list
 * @param {*} config
 */
export function assetAbsList (config) {
  return requestObj({
    url: '/web/v1/asset/abs/list',
    method: 'post',
    ...config
  });
};
/**
 * add ABS
 * @param {*} data
 */
export function newAbsAdd (config) {
  return requestObj({
    url: '/web/v1/asset/abs/add',
    method: 'post',
    ...config
  });
};
// Get the information for ABS each step
export function getAbsInfo (config) {
  return requestObj({
    method: 'GET',
    url: '/web/v1/asset/abs/get/' + config.serialNo,
    ...config
  });
};
// abs Submit
export const absSubmit = async config => {
  const { data } = await requestObj.request(Object.assign({ method: 'POST', url: '/web/v1/asset/abs/submit' }, { ...config }));
  return data;
};

/**
 * abs detail basic
 * @param {*} config
 */
export function absDetailBasic (config) {
  return requestObj({
    url: `/web/v1/asset/abs/${config.data.serialNo}/detail/basic`,
    method: 'get',
    ...config
  });
};
/**
 * bonds detail basic--coupon payments
 * @param {*} config
 */
export function detailDisburseRecord (config) {
  return requestObj({
    url: '/v1/asset/security/detail/disburse/record',
    method: 'post',
    ...config
  });
};

/**
 * abs assets detail basic--coupon payments
 * @param {*} config
 */
export function detailAbsDisburseRecord (config) {
  return requestObj({
    url: 'web/v1/asset/abs/detail/disburse/record',
    method: 'post',
    ...config
  });
};

/**
 * abs assets detail basic--Redemption
 * @param {*} config
 */
export function detailAbsRedeemRecord (config) {
  return requestObj({
    url: 'web/v1/asset/abs/detail/redeem/record',
    method: 'post',
    ...config
  });
};


/**
 * bonds detail basic--redemption
 * @param {*} config
 */
export function detailRedeemRecord (config) {
  return requestObj({
    url: '/v1/asset/security/detail/redeem/record',
    method: 'post',
    ...config
  });
};
/**
 * abs detail basic--coupon payments
 * @param {*} config
 */
export function absDetailDisburseRecord (config) {
  return requestObj({
    url: '/web/v1/asset/abs/detail/disburse/record',
    method: 'post',
    ...config
  });
};
/**
 * abs detail basic--redemption
 * @param {*} config
 */
export function absDetailRedeemRecord (config) {
  return requestObj({
    url: '/web/v1/asset/abs/detail/redeem/record',
    method: 'post',
    ...config
  });
};
/**
 * Interest payments - Statistics
 * @param {*} config
 */
export function detailDisburseData (config) {
  return requestObj({
    url: `/v1/asset/security/${config.data.code}/detail/disburse/data`,
    method: 'get',
    ...config
  });
};

// get Token SMT Code
export const getTokenSMTInfo = async config => {
  const { data } = await requestObj.request(Object.assign({ method: 'GET', url: '/v1/product/smt/token' }, { ...config }));
  return data;
};

// get Security SMT Code
export const getSecuritySMTInfo = async config => {
  const { data } = await requestObj.request(Object.assign({ method: 'GET', url: '/v1/product/smt/bonds' }, { ...config }));
  return data;
};

// get issue address
export const getIssueAddress = async config => {
  const { data } = await requestObj.request(Object.assign({ method: 'GET', url: '/v1/asset/security/address/issue' }, { ...config }));
  return data;
};

// get Disbursement address
export const getDisbursementAddress = async config => {
  const { data } = await requestObj.request(Object.assign({ method: 'GET', url: '/v1/asset/token/address/' + config.code }, { ...config }));
  return data;
};

// issue Securities
export const newSecurity = async config => {
  const { data } = await requestObj.request(Object.assign({ method: 'POST', url: '/v1/asset/security/add' }, { ...config }));
  return data;
};

// Get the information for each step
export const getSecurityInfo = async config => {
  const { data } = await requestObj.request(Object.assign({ method: 'GET', url: '/v1/asset/security/get/' + config.serialNo }, { ...config }));
  return data;
};

// Get the Token for each step
export const getStepTokenInfo = async config => {
  const { data } = await requestObj.request(Object.assign({ method: 'GET', url: '/v1/asset/token/get/' + config.serialNo }, { ...config }));
  return data;
};

// issue Securities
export const addToken = async config => {
  const { data } = await requestObj.request(Object.assign({ method: 'POST', url: '/v1/asset/token/add' }, { ...config }));
  return data;
};

// For more details
export const getReviewDetails = async config => {
  const { data } = await requestObj.request(Object.assign({ method: 'GET', url: '/v1/asset/security/review/' + config.serialNo }, { ...config }));
  return data;
};

// For more token detail
export const getTokenReviewDetails = async config => {
  const { data } = await requestObj.request(Object.assign({ method: 'GET', url: '/v1/asset/token/review/' + config.serialNo }, { ...config }));
  return data;
};

// issue Token
export const tokenSubmit = async config => {
  const { data } = await requestObj.request(Object.assign({ method: 'POST', url: '/v1/asset/token/submit' }, { ...config }));
  return data;
};
// issue Submit
export const issueSubmit = async config => {
  const { data } = await requestObj.request(Object.assign({ method: 'POST', url: '/v1/asset/security/submit' }, { ...config }));
  return data;
};
// upload file
export const uploadFile = async config => {
  const { data } = await requestObj.request(Object.assign({ method: 'POST', url: '/v1/asset/file/upload' }, { ...config }));
  return data;
};

// login
export const loginUser = async config => {
  const { data } = await requestObj.request(Object.assign({ method: 'POST', url: '/web/v1/member/user/login' }, { ...config }));
  return data;
};

// Search Security list
export const queryIssueList = async config => {
  const { data } = await requestObj.request(Object.assign({ method: 'POST', url: '/v1/asset/security/search' }, { ...config }));
  return data;
};

// Get Security Page
export const getSecurityPage = async config => {
  const { data } = await requestObj.request(Object.assign({ method: 'POST', url: '/v1/asset/security/page' }, { ...config }));
  return data;
};

// Search Token List
export const queryTokenList = async config => {
  const { data } = await requestObj.request(Object.assign({ method: 'POST', url: '/v1/asset/token/search' }, { ...config }));
  return data;
};

// Get Token Page
export const getTokenPage = async config => {
  const { data } = await requestObj.request(Object.assign({ method: 'POST', url: '/v1/asset/token/page' }, { ...config }));
  return data;
};

// Get SMTDetail
export const getSMTDetail = async config => {
  const { data } = await requestObj.request(Object.assign({ method: 'GET', url: '/v1/product/smt/' + config.smtCode }, { ...config }));
  return data;
};
// Get SMT Digital
export const getSMTDigital = async config => {
  const { data } = await requestObj.request(Object.assign({ method: 'GET', url: '/v1/product/smt/digital' }, { ...config }));
  return data;
};
// query member country
export const getMemberCountry = async config => {
  const { data } = await requestObj.request(Object.assign({ method: 'GET', url: '/web/v1/member/country/query' }, { ...config }));
  return data;
};

// Additional Issue
export const additionalIssueAdd = async config => {
  const { data } = await requestObj.request(Object.assign({ method: 'POST', url: '/web/v1/asset/additionalIssue/add' }, { ...config }));
  return data;
};
