import Vue from 'vue';
import Router from 'vue-router';
import Hander from '@/common/handler';
import loginRouter from '@/common/loginRouter';
import permissionsRouter from '@/common/permissionsRouter';
import subscriptionCenter from './subscriptionCenter';
import distributionCenter from './distributionCenter';
import assetServicing from './assetServicing';
import projectCenter from './projectCenter';
import tradingCenter from './tradingCenter';
import userCenter from './userCenter';
import accountCenter from './accountCenter';
import assets from './userAssets';
import ordersCenter from './ordersCenter';

Vue.use(Router);

const routes = [{
  path: '',
  name: 'Layout',
  component: () => import('@views/Layout/index.vue'),
  redirect: '/account-center',
  children: [
    // 认购中心
    ...subscriptionCenter,
    // 交易中心
    ...tradingCenter,
    // 发行中心
    ...distributionCenter,
    // 项目中心
    ...projectCenter,
    // 资产服务中心
    ...assetServicing,
    // 用户中心
    ...userCenter,
    // 资产
    ...assets,
    // 账户中心
    ...accountCenter,
    // 订单中心
    ...ordersCenter,
    {
      path: 'home',
      name: 'LoginHome',
      // meta: { isLogin: true },
      component: () => import('@/views/Home.vue')
    }
  ]
}, {
  path: '/login',
  name: 'Login',
  meta: { noLogin: true },
  component: () => import('@/views/Login.vue')
}, {
  path: '/linkReset',
  name: 'LinkReset',
  meta: { linkRset: true },
  component: () => import('@/views/linkResetPassword.vue')
}, {
  path: '*',
  redirect: '/notFount',
  name: 'NotFount',
  hidden: true
}];

const router = new Router({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
});

const handler = new Hander();

handler.use(loginRouter);
handler.use(permissionsRouter);

router.beforeEach((to, from, next) => {
  handler.handle(to, from, next);
});
const originalPush = Router.prototype.push;
Router.prototype.push = function push (location) {
  return originalPush.call(this, location).catch(err => err);
};
export default router;
