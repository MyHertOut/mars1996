// 交易中心 api
import requestObj from '@/server/index.js';
/**
 * 我发起的列表
 * @param {*} data
 */
export const getTradeCreatedList = async config => {
  const { data } = await requestObj.request(Object.assign({ method: 'POST', url: '/web/v1/trade/order/createdList' }, { ...config }));
  return data;
};

/**
 * abs我发起的列表
 * @param {*} data
 */
export const getAbsTradeCreatedList = async config => {
  const { data } = await requestObj.request(Object.assign({ method: 'POST', url: '/web/v1/abs/order/createdList' }, { ...config }));
  return data;
};

/**
 * 我接收的列表
 * @param {*} data
 */
export const getTradeReceivedList = async config => {
  const { data } = await requestObj.request(Object.assign({ method: 'POST', url: '/web/v1/trade/order/receivedList' }, { ...config }));
  return data;
};

/**
 * abs我接收的列表
 * @param {*} data
 */
export const getAbsTradeReceivedList = async config => {
  const { data } = await requestObj.request(Object.assign({ method: 'POST', url: '/web/v1/abs/order/receivedList' }, { ...config }));
  return data;
};

/**
 * 创建交易
 * @param {*} data
 */
export const newTrade = async config => {
  const { data } = await requestObj.request(Object.assign({ method: 'POST', url: '/web/v1/trade/order/newTrade' }, { ...config }));
  return data;
};

/**
 * abs 创建交易
 * @param {*} data
 */
export const absNewTrade = async config => {
  const { data } = await requestObj.request(Object.assign({ method: 'POST', url: '/web/v1/abs/order/newTrade' }, { ...config }));
  return data;
};

/**
 * 提交
 * @param {*} data
 */
export const tradePayment = async config => {
  const { data } = await requestObj.request(Object.assign({ method: 'POST', url: '/web/v1/trade/order/payBidOrder' }, { ...config }));
  return data;
};

/**
 * abs 提交
 * @param {*} data
 */
export const absTradePayment = async config => {
  const { data } = await requestObj.request(Object.assign({ method: 'POST', url: '/web/v1/abs/order/payBidOrder' }, { ...config }));
  return data;
};

/**
 * Transact Accept
 * @param {*} data
 */
export const acceptBidOrder = async config => {
  const { data } = await requestObj.request(Object.assign({ method: 'POST', url: '/web/v1/trade/order/acceptBidOrder' }, { ...config }));
  return data;
};

/**
 * Abs Transact Accept
 * @param {*} data
 */
export const absAcceptBidOrder = async config => {
  const { data } = await requestObj.request(Object.assign({ method: 'POST', url: '/web/v1/abs/order/acceptBidOrder' }, { ...config }));
  return data;
};

/**
 * Transact Reject
 * @param {*} data
 */
export const rejectBidOrder = async config => {
  const { data } = await requestObj.request(Object.assign({ method: 'POST', url: '/web/v1/trade/order/rejectBidOrder' }, { ...config }));
  return data;
};

/**
 * Abs Transact Reject
 * @param {*} data
 */
export const absRejectBidOrder = async config => {
  const { data } = await requestObj.request(Object.assign({ method: 'POST', url: '/web/v1/abs/order/rejectBidOrder' }, { ...config }));
  return data;
};

/**
 * Payment Detail
 * @param {*} data
 */
export const queryPaymentInfo = async config => {
  const { data } = await requestObj.request(Object.assign({ method: 'POST', url: '/web/v1/trade/order/queryPaymentInfo' }, { ...config }));
  return data;
};

/**
 * abs Payment Detail
 * @param {*} data
 */
export const absQueryPaymentInfo = async config => {
  const { data } = await requestObj.request(Object.assign({ method: 'POST', url: '/web/v1/abs/order/queryPaymentInfo' }, { ...config }));
  return data;
};

/**
 * Payment Detail
 * @param {*} data
 */
export const tradeConfirm = async config => {
  const { data } = await requestObj.request(Object.assign({ method: 'POST', url: '/web/v1/trade/order/confirm' }, { ...config }));
  return data;
};

/**
 * Payment Detail
 * @param {*} data
 */
export const absTradeConfirm = async config => {
  const { data } = await requestObj.request(Object.assign({ method: 'POST', url: '/web/v1/abs/order/confirm' }, { ...config }));
  return data;
};

/**
 * 发布记录列表
 * @param {*} data
 */
export const tradeHistory = async config => {
  const { data } = await requestObj.request(Object.assign({ method: 'POST', url: '/web/v1/trade/order/list' }, { ...config }));
  return data;
};

/**
 * abs 发布记录列表
 * @param {*} data
 */
export const absTradeHistory = async config => {
  const { data } = await requestObj.request(Object.assign({ method: 'POST', url: '/web/v1/abs/order/list' }, { ...config }));
  return data;
};

/**
 * 查询Bid单状态
 * @param {*} data
 */
export const getBidBizStatus = async config => {
  const { data } = await requestObj.request(Object.assign({ method: 'POST', url: '/web/v1/trade/order/getBidBizStatus' }, { ...config }));
  return data;
};

/**
 * abs发布预加载
 * @param {*} data
 */
export const absPreOfferOrder = async config => {
  const { data } = await requestObj.request(Object.assign({ method: 'POST', url: '/web/v1/abs/order/preOfferOrder' }, { ...config }));
  return data;
};
