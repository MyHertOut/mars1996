export default [
  {
    path: 'subscription',
    name: 'BondSubscription',
    meta: { subscript: true, isLogin: true, functionCode: 'subscription.centre.bonds' },
    component: () =>
      import(
        /* webpackChunkName: "subscription-center" */ '@/views/subscription-center/BondSubscription.vue'
      )
  },
  {
    path: 'asset-backed-subscription',
    name: 'AssetBacked',
    meta: { subscript: true, isLogin: true, functionCode: 'subscription.centre.abs' },
    component: () =>
      import(
        /* webpackChunkName: "subscription-center" */ '@/views/subscription-center/AssetBacked.vue'
      )
  },
  {
    path: '/subscription/detail',
    name: 'SubscriptionDetail',
    meta: { isdetail: true, subscript: true, isLogin: true, functionCode: 'subscription.centre.detail' },
    component: () =>
      import(
        /* webpackChunkName: "subscription-center" */ '@/views/subscription-center/SubscriptionDetail.vue'
      )
  },
  {
    path: '/absSubscription/detail',
    name: 'AbsSubscriptionDetail',
    meta: { isdetail: true, subscript: true, isLogin: true, functionCode: 'subscription.centre.abs.detail' },
    component: () =>
      import(
        /* webpackChunkName: "subscription-center" */ '@/views/subscription-center/AssetBackedDetail.vue'
      )
  }
];
