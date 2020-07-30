export default [{
  path: '/myAssets',
  name: 'MyAssets',
  meta: { isLogin: true, functionCode: 'asseBalance.title' },
  component: () => import(/* webpackChunkName: "user-assets" */ '@/views/user-assets/MyAssets.vue')
},
{
  path: '/myAssets/transferAccounts',
  name: 'TransferAccounts',
  meta: { isLogin: true },
  component: () => import(/* webpackChunkName: "user-assets" */ '@/views/user-assets/TransferAccounts.vue')
},
{
  path: '/transactionHistory',
  name: 'MoneyRecord',
  meta: { isLogin: true, functionCode: 'assetHistory.title' },
  component: () => import(/* webpackChunkName: "user-assets" */ '@/views/user-assets/MoneyRecord.vue')
}];
