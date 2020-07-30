export default [
  {
    path: 'bond-trading',
    name: 'BondTrading',
    meta: { isLogin: true, functionCode: 'trade.centre.bonds' },
    component: () => import(/* webpackChunkName: "trading-center" */ '@/views/trading-center/BondTrade.vue')
  }, {
    path: 'new-trade',
    name: 'NewTrade',
    meta: { isLogin: true, functionCode: 'trade.centre.bond.new.trade' },
    component: () => import(/* webpackChunkName: "trading-center" */ '@/views/trading-center/newTrade.vue')
  }, {
    path: 'abs-new-trade',
    name: 'AbsNewTrade',
    meta: { isLogin: true, functionCode: 'trade.centre.bond.new.abs.trade' },
    component: () => import(/* webpackChunkName: "trading-center" */ '@/views/trading-center/absNewTrade.vue')
  }, {
    path: 'trade-history',
    name: 'TradeHistory',
    meta: { isLogin: true, functionCode: 'trade.centre.bond.history' },
    component: () => import(/* webpackChunkName: "trading-center" */ '@/views/trading-center/tradeHistory.vue')
  }, {
    path: 'abs-trade-history',
    name: 'AbsTradeHistory',
    meta: { isLogin: true, functionCode: 'trade.centre.bond.abs.history' },
    component: () => import(/* webpackChunkName: "trading-center" */ '@/views/trading-center/AbsTradeHistory.vue')
  }, {
    path: '/asset-backed-trade',
    name: 'AssetBackedTrade',
    meta: { isLogin: true, functionCode: 'trade.centre.abs' },
    component: () =>
      import(
        '@/views/trading-center/AssetBacked.vue'
      )
  }
];
