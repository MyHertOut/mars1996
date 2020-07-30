export default [{
  path: '/userCenter',
  name: 'UserCenter',
  meta: { isLogin: true, functionCode: 'organization.title' },
  component: () => import(/* webpackChunkName: "user-center" */ '@/views/user-center/UserCenter.vue')
},
{
  path: '/userCenter/createRecord',
  name: 'CreateRecord',
  meta: { isLogin: true, functionCode: 'organization.userRocord.list' },
  component: () => import(/* webpackChunkName: "user-center" */ '@/views/user-center/CreateRecord.vue')
},
{
  path: '/userCenter/userDetails',
  name: 'UserDetails',
  meta: { isLogin: true, functionCode: 'organization.account.details' },
  component: () => import(/* webpackChunkName: "user-center" */ '@/views/user-center/UserDetails.vue')
},
{
  path: '/userCenter/createUser',
  name: 'CreateUser',
  meta: { isLogin: true, functionCode: 'organization.account.add' },
  component: () => import(/* webpackChunkName: "user-center" */ '@/views/user-center/CreateUser.vue')
}];
