export default [{
  path: '/asset-servicing/bonds',
  name: 'AssetServicingBondsList',
  meta: { isLogin: true, current: 'bonds', functionCode: 'assetServicingCentre.bonds.title' },
  component: () => import(/* webpackChunkName: "asset-servicing" */ '@/views/asset-servicing/index.vue')
}, {
  path: '/asset-servicing/asset',
  name: 'AssetServicingAssetList',
  meta: { isLogin: true, current: 'asset', functionCode: 'assetServicingCentre.bonds.title' },
  component: () => import(/* webpackChunkName: "asset-servicing" */ '@/views/asset-servicing/index.vue')
}, {
  path: '/asset-servicing/redemption',
  name: 'AssetServicingRedemption',
  meta: { isLogin: true }, // , functionCode: 'assetServicingCentre.bonds.redeem.list'
  component: () => import(/* webpackChunkName: "asset-servicing" */ '@/views/asset-servicing/redemption.vue')
}, {
  path: '/asset-servicing/redemption/detail',
  name: 'AssetServiceRedemptionDetail',
  meta: { isLogin: true },
  component: () => import(/* webpackChunkName: "asset-servicing" */ '@/views/asset-servicing/RedemptionDetail.vue')
}, {
  path: '/asset-servicing/bonds/coupon',
  name: 'AssetServicingBondsCoupon',
  meta: { isLogin: true, functionCode: 'assetServicingCentre.bonds.coupon.list' },
  component: () => import(/* webpackChunkName: "asset-servicing" */ '@/views/asset-servicing/disbusement.vue')
}, {
  path: '/asset-servicing/asset/coupon',
  name: 'AssetServicingAssetCoupon',
  meta: { isLogin: true, functionCode: 'assetServicingCentre.bonds.coupon.list' },
  component: () => import(/* webpackChunkName: "asset-servicing" */ '@/views/asset-servicing/AssetDisbusement.vue')
}, {
  path: '/asset-servicing/coupon/detail',
  name: 'AssetServiceCouponViewDetail',
  meta: { isLogin: true },
  component: () => import(/* webpackChunkName: "asset-servicing" */ '@/views/asset-servicing/DisbusementDetail.vue')
}, {
  path: '/asset-servicing/bonds/detail',
  name: 'AssetservicingBondsDetail',
  meta: { opType: 'bondsDetail', isLogin: true },
  component: () => import(/* webpackChunkName: "distribution-center" */ '@/views/distribution-center/Bonds/BondsDetail.vue')
}, {
  path: '/asset-servicing/asset/detail',
  name: 'AssetservicingAssetDetail',
  meta: { opType: 'abs', isLogin: true },
  component: () => import(/* webpackChunkName: "distribution-center" */ '@/views/distribution-center/ABS/Detail.vue')
}];
