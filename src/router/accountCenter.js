export default [{
  path: 'account-center',
  name: 'accountCenter',
  meta: { isLogin: true },
  component: () => import(/* webpackChunkName: "account-center" */ '@/views/account-center/index.vue')
}, {
  path: '/address-center',
  name: 'addressCenter',
  meta: { isLogin: true },
  component: () => import(/* webpackChunkName: "account-center" */ '@/views/account-center/indexAddressCen.vue')
}, {
  path: '/account-center/address-kyc',
  name: 'addressKyc',
  meta: { isLogin: true },
  component: () => import(/* webpackChunkName: "account-center" */ '@/views/account-center/addressKyc.vue')
}, {
  path: 'notFount',
  name: 'NotFount',
  component: () => import('@/views/notFount.vue')
}];
