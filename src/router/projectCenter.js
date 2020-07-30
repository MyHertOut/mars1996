export default [{
  path: 'listing/bonds',
  name: 'ProjectBondsList',
  meta: { isLogin: true, current: 'bonds', functionCode: 'listing.center' },
  component: () => import(/* webpackChunkName: "project-center" */ '@/views/project-center/index.vue')
}, {
  path: 'listing/asset',
  name: 'ProjectAssetList',
  meta: { isLogin: true, current: 'asset', functionCode: 'listing.center.abs.projects' },
  component: () => import(/* webpackChunkName: "project-center" */ '@/views/project-center/index.vue')
}, {
  path: 'listing/history',
  name: 'ProjectIssuanceHistory',
  meta: { isLogin: true, functionCode: 'listing.center.list' },
  component: () => import(/* webpackChunkName: "project-center" */ '@/views/project-center/ListingHistory.vue')
}, {
  path: 'listing/bonds/detail',
  name: 'ProjectBondsDetail',
  meta: { isLogin: true, functionCode: 'listing.center.detail' },
  component: () => import(/* webpackChunkName: "project-center" */ '@/views/project-center/BondProjectDetail.vue')
}, {
  path: 'listing/asset/detail',
  name: 'ProjectAbsDetail',
  meta: { isLogin: true, functionCode: 'listing.center.detail' },
  component: () => import(/* webpackChunkName: "project-center" */ '@/views/project-center/AbsProjectDetail.vue')
}, {
  path: 'listing/bond-listing',
  name: 'NewBondsProject',
  meta: { isLogin: true, current: 'bonds', functionCode: 'listing.center.create' },
  component: () => import(/* webpackChunkName: "project-center" */ '@/views/project-center/NewBondsProject.vue')
}, {
  path: 'project/asset-listing',
  name: 'NewAssetProject',
  meta: { isLogin: true, current: 'asset', functionCode: 'listing.center.create' },
  component: () => import(/* webpackChunkName: "project-center" */ '@/views/project-center/NewBondsProject.vue')
}];
