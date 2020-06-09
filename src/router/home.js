export default [
  {
    path: '',
    name: '',
    redirect: '/home',
    component: () => import('@/views/home/Home.vue')
  },
  {
    path: '/home',
    name: 'Home',
    component: () => import('@/views/home/Home.vue')
  }
];
