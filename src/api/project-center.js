// 项目中心 api
import requestObj from '@/server/index.js';

/**
 * The trade order list
 * @param {*} config
 */
export function tradeOrderProjects (config) {
  return requestObj({
    url: '/web/v1/trade/order/projects',
    method: 'post',
    ...config
  });
};
/**
 * The trade history list
 * @param {*} config
 */
export function tradeOrderListOfferOrder (config) {
  return requestObj({
    url: '/web/v1/trade/order/listOfferOrder',
    method: 'post',
    ...config
  });
};
/**
 * Project details - Subscription Info
 * @param {*} config
 */
export function tradeOrderDetail (config) {
  return requestObj({
    url: '/web/v1/trade/order/detail',
    method: 'post',
    ...config
  });
};
/**
 * Project details - Subscription Records
 * @param {*} config
 */
export function tradeOrderListBidOrder (config) {
  return requestObj({
    url: '/web/v1/trade/order/listBidOrder',
    method: 'post',
    ...config
  });
};
/**
 * 交易发布预加载
 * @param {*} data
 */
export function preOfferOrder (data) {
  return requestObj({
    url: '/web/v1/trade/order/preOfferOrder',
    method: 'post',
    data
  });
};
/**
 *  New Trade - Continuous query SMT Code interface
 * @param {*} data
 */
export function tradeOrderGetSmttCode (data) {
  return requestObj({
    url: '/web/v1/trade/order/getSmttCode',
    method: 'post',
    data
  });
};
/**
 * query DigitalCurrency
 * @param {*} data
 */
export function queryDigitalCurrency (data) {
  return requestObj({
    url: '/web/v1/trade/order/queryDigitalCurrency',
    method: 'post',
    data
  });
};
/**
 * 交易发布
 * @param {*} data
 */
export function createOfferOrder (config) {
  return requestObj({
    url: '/web/v1/trade/order/createOfferOrder',
    method: 'post',
    ...config
  });
};
/**
 * Generic - Query Bid list status
 * @param {*} config
 */
export function getTradeOrderBidBizStatus (config) {
  return requestObj({
    url: '/web/v1/trade/order/getBidBizStatus',
    method: 'post',
    ...config
  });
};
/**
 * The abs trade order list
 * @param {*} config
 */
export function absOrderProjects (config) {
  return requestObj({
    url: '/web/v1/abs/order/projects',
    method: 'post',
    ...config
  });
};
/**
 * abs-交易发布
 * @param {*} data
 */
export function absCreateOfferOrder (config) {
  return requestObj({
    url: '/web/v1/abs/order/createOfferOrder',
    method: 'post',
    ...config
  });
};
/**
 * abs-交易发布预加载
 * @param {*} data
 */
export function absPreOfferOrder (data) {
  return requestObj({
    url: '/web/v1/abs/order/preOfferOrder',
    method: 'post',
    data
  });
};
/**
 * ABS project details - Subscription Info
 * @param {*} config
 */
export function absOrderDetail (config) {
  return requestObj({
    url: '/web/v1/abs/order/detail',
    method: 'post',
    ...config
  });
};
/**
 * ABS project details - Subscription Records
 * @param {*} config
 */
export function absOrderListBidOrder (config) {
  return requestObj({
    url: '/web/v1/abs/order/listBidOrder',
    method: 'post',
    ...config
  });
};
/**
 * ABS project details - Subscription Records-status select data
 * 通用-查询Bid单Trade状态
 * @param {*} config
 */
export function getTradeOrderBidTradeStatus (config) {
  return requestObj({
    url: '/web/v1/trade/order/getBidTradeStatus',
    method: 'post',
    ...config
  });
};
