import requestObj from '@/server/index.js';

/**
 * get subscriptionOrders
 * @param {*} data
 */
export const subscriptionOrders = async config => {
  const { data } = await requestObj.request(Object.assign({ method: 'POST', url: '/web/v1/trade/order/subscriptionOrders' }, { ...config }));
  return data;
};

/**
 * get abs subscriptionOrders
 * @param {*} data
 */
export const absSubscriptionOrders = async config => {
  const { data } = await requestObj.request(Object.assign({ method: 'POST', url: '/web/v1/abs/order/subscriptionOrders' }, { ...config }));
  return data;
};

/**
 * get tradeOrders
 * @param {*} data
 */
export const tradeOrders = async config => {
  const { data } = await requestObj.request(Object.assign({ method: 'POST', url: '/web/v1/trade/order/tradeOrders' }, { ...config }));
  return data;
};

/**
 * get abs tradeOrders
 * @param {*} data
 */
export const absTradeOrders = async config => {
  const { data } = await requestObj.request(Object.assign({ method: 'POST', url: '/web/v1/abs/order/tradeOrders' }, { ...config }));
  return data;
};
