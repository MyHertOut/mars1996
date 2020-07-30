export default [{
  path: '/subscriptionOrders',
  name: 'SubscriptionOrders',
  meta: { isLogin: true },
  component: () => import(/* webpackChunkName: "orders-center" */ '@/views/orders-center/SubscriptionOrders.vue')
}, {
  path: '/tradeOrders',
  name: 'TradeOrders',
  meta: { isLogin: true },
  component: () => import(/* webpackChunkName: "orders-center" */ '@/views/orders-center/TradeOrders.vue')
}];
