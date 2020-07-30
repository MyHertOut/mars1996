// 认购中心 api
import requestObj from '@/server/index.js';

/**
 * 获取公开认购列表
 * @param {*} data
 */
export const getPublicList = async config => {
  const { data } = await requestObj.request(Object.assign({ method: 'POST', url: '/web/v1/trade/order/public/projects' }, { ...config }));
  return data;
};

/**
 * 获取ABS公开认购列表
 * @param {*} data
 */
export const getAbsPublicList = async config => {
  const { data } = await requestObj.request(Object.assign({ method: 'POST', url: '/web/v1/abs/order/public/projects' }, { ...config }));
  return data;
};

/**
 * 获取指定认购列表
 * @param {*} data
 */
export const getPrivateList = async config => {
  const { data } = await requestObj.request(Object.assign({ method: 'POST', url: '/web/v1/trade/order/private/projects' }, { ...config }));
  return data;
};

/**
 * 获取ABS指定认购列表
 * @param {*} data
 */
export const getAbsPrivateList = async config => {
  const { data } = await requestObj.request(Object.assign({ method: 'POST', url: '/web/v1/abs/order/private/projects' }, { ...config }));
  return data;
};

/**
 * 获取认购信息详情
 * @param {*} data
 */
export const getBondsDetail = async config => {
  const { data } = await requestObj.request(Object.assign({ method: 'POST', url: '/web/v1/trade/order/offerDetail' }, { ...config }));
  return data;
};

/**
 * 获取abs认购信息详情
 * @param {*} data
 */
export const getAbsDetailInfo = async config => {
  const { data } = await requestObj.request(Object.assign({ method: 'POST', url: '/web/v1/abs/order/offerDetail' }, { ...config }));
  return data;
};

/**
 * 立即认购
 * @param {*} data
 */
export const createBidOrder = async config => {
  const { data } = await requestObj.request(Object.assign({ method: 'POST', url: '/web/v1/trade/order/createBidOrder' }, { ...config }));
  return data;
};

/**
 * abs立即认购
 * @param {*} data
 */
export const createAbsBidOrder = async config => {
  const { data } = await requestObj.request(Object.assign({ method: 'POST', url: '/web/v1/abs/order/createBidOrder' }, { ...config }));
  return data;
};

/**
 * 查询Terms and Conditions
 * @param {*} data
 */
export const getTermsAndConditions = async config => {
  const { data } = await requestObj.request(Object.assign({ method: 'POST', url: '/web/v1/trade/order/content' }, { ...config }));
  return data;
};

/**
 * 查询abs基本信息
 * @param {*} data
 */
export const getAbsBasicInfo = async config => {
  const { data } = await requestObj.request(Object.assign({ method: 'GET', url: `/web/v1/asset/abs/${config.data.serialNo}/detail/basic` }, { ...config }));
  return data;
};

/**
 * 查询abs文件资料
 * @param {*} data
 */
export const getAbsDocument = async config => {
  const { data } = await requestObj.request(Object.assign({ method: 'GET', url: `/web/v1/asset/abs/${config.data.serialNo}/detail/document` }, { ...config }));
  return data;
};

/**
 * 查询abs文件资料
 * @param {*} data
 */
export const getAbsKyc = async config => {
  const { data } = await requestObj.request(Object.assign({ method: 'GET', url: `/web/v1/asset/abs/${config.data.serialNo}/detail/kyc` }, { ...config }));
  return data;
};

/**
 * 查询abs付息&回购
 * @param {*} data
 */
export const getAbsCoupon = async config => {
  const { data } = await requestObj.request(Object.assign({ method: 'GET', url: `/web/v1/asset/abs/${config.data.serialNo}/detail/coupon` }, { ...config }));
  return data;
};
