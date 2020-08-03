export default [{
  path: 'issuance/bonds',
  name: 'IssuanceBondsList',
  meta: { isLogin: true, current: 'bonds', functionCode: 'issuanceCentre.bonds.list' },
  component: () => import(/* webpackChunkName: "distribution-center" */ '@/views/distribution-center/index.vue')
}, {
  path: 'issuance/asset',
  name: 'IssuanceAssetList',
  // functionCode: 'issuanceCentre.bonds.list'
  meta: { isLogin: true, current: 'asset', functionCode: 'issuanceCentre.bonds.list' },
  component: () => import(/* webpackChunkName: "distribution-center" */ '@/views/distribution-center/index.vue')
},
{
  path: 'issuance/currency',
  name: 'IssuanceCurrencyList',
  // functionCode: 'issuanceCentre.bonds.list'
  meta: { isLogin: true, current: 'currency', functionCode: 'issuanceCentre.bonds.list' },
  component: () => import(/* webpackChunkName: "distribution-center" */ '@/views/distribution-center/index.vue')
},
{
  path: 'issue',
  name: 'DistributIssueLayout',
  component: () => import(/* webpackChunkName: "distribution-center" */ '@/views/distribution-center/Bonds/IssueLayout/index.vue'),
  // redirect: '/issue/bonds/parameters',
  children: [{
    path: 'bonds/parameters',
    meta: { steps: 0, isLogin: true },
    name: 'DisIssueBondsParameters',
    component: () => import(/* webpackChunkName: "distribution-center" */ '@/views/distribution-center/Bonds/newSecurities/parameters.vue')
  }, {
    path: 'bonds/information',
    meta: { steps: 1, isLogin: true },
    name: 'DisIssueBondsInformation',
    component: () => import(/* webpackChunkName: "distribution-center" */ '@/views/distribution-center/Bonds/newSecurities/information.vue')
  }, {
    path: 'bonds/payment',
    meta: { steps: 2, isLogin: true },
    name: 'DisIssueBondsPayment',
    component: () => import(/* webpackChunkName: "distribution-center" */ '@/views/distribution-center/Bonds/newSecurities/payment.vue')
  }, {
    path: 'bonds/document',
    meta: { steps: 3, isLogin: true },
    name: 'DisIssueBondsDocument',
    component: () => import(/* webpackChunkName: "distribution-center" */ '@/views/distribution-center/Bonds/newSecurities/document.vue')
  }, {
    path: 'bonds/restrictions',
    meta: { steps: 4, isLogin: true },
    name: 'DisIssueBondsRestrictions',
    component: () => import(/* webpackChunkName: "distribution-center" */ '@/views/distribution-center/Bonds/newSecurities/restrictions.vue')
  }, {
    path: 'bonds/viewdetail',
    meta: { steps: 5, isLogin: true },
    name: 'DisIssueBondsViewdetail',
    component: () => import(/* webpackChunkName: "distribution-center" */ '@/views/distribution-center/Bonds/ViewDetail.vue')
  }, {
    path: 'bonds/result',
    meta: { steps: 6, isLogin: true },
    name: 'DisIssueBondsSubmitSuccess',
    component: () => import(/* webpackChunkName: "distribution-center" */ '@/views/distribution-center/Bonds/newSecurities/SubmitSuccess.vue')
  }, {
    path: 'newToken',
    name: 'DisBondsNewToken',
    // , isLogin: true, functionCode: 'issuance.issuance.settlementToken.addNewToken'
    meta: { steps: 0, isLogin: true, opType: 'SettlementToken' },
    component: () => import('@views/distribution-center/Bonds/newToken/index.vue')
  }, {
    path: 'tokenDetail',
    name: 'DisBondsTokenDetail',
    //  , isLogin: true, functionCode: 'issuance.issuance.settlementToken.review'
    meta: { steps: 1, isLogin: true, opType: 'SettlementToken' },
    component: () => import('@views/distribution-center/Bonds/tokenDetail.vue')
  }, {
    path: 'token/result',
    meta: { steps: 2, isLogin: true, opType: 'SettlementToken' },
    name: 'DisIssueTokenSubmitSuccess',
    component: () => import(/* webpackChunkName: "distribution-center" */ '@/views/distribution-center/Bonds/newToken/SubmitSuccess.vue')
  }, {
    path: 'abs/parameters',
    meta: { steps: 0, isLogin: true, opType: 'abs' },
    name: 'DisIssueAbsParameters',
    component: () => import(/* webpackChunkName: "distribution-center" */ '@/views/distribution-center/ABS/newAbs/parameters.vue')
  }, {
    path: 'abs/information',
    meta: { steps: 1, isLogin: true, opType: 'abs' },
    name: 'DisIssueAbsInformation',
    component: () => import(/* webpackChunkName: "distribution-center" */ '@/views/distribution-center/ABS/newAbs/information.vue')
  }, {
    path: 'abs/payment',
    meta: { steps: 2, isLogin: true, opType: 'abs' },
    name: 'DisIssueAbsPayment',
    component: () => import(/* webpackChunkName: "distribution-center" */ '@/views/distribution-center/ABS/newAbs/payment.vue')
  }, {
    path: 'abs/document',
    meta: { steps: 3, isLogin: true, opType: 'abs' },
    name: 'DisIssueAbsDocument',
    component: () => import(/* webpackChunkName: "distribution-center" */ '@/views/distribution-center/ABS/newAbs/document.vue')
  }, {
    path: 'abs/restrictions',
    meta: { steps: 4, isLogin: true, opType: 'abs' },
    name: 'DisIssueAbsRrestrictions',
    component: () => import(/* webpackChunkName: "distribution-center" */ '@/views/distribution-center/ABS/newAbs/restrictions.vue')
  }, {
    path: 'abs/viewdetail',
    meta: { steps: 5, isLogin: true, opType: 'abs' },
    name: 'DisIssueAbsViewdetail',
    component: () => import(/* webpackChunkName: "distribution-center" */ '@/views/distribution-center/ABS/ViewDetail.vue')
  }, {
    path: 'abs/result',
    meta: { steps: 6, isLogin: true, opType: 'abs' },
    name: 'DisIssueAbsSubmitSuccess',
    component: () => import(/* webpackChunkName: "distribution-center" */ '@/views/distribution-center/ABS/newAbs/SubmitSuccess.vue')
  }]
}, {
  path: 'issuance/payment/detail',
  meta: { opType: 'bondsDetail', isLogin: true },
  name: 'BondsPaymentDisbusementDetail',
  component: () => import(/* webpackChunkName: "distribution-center" */ '@/views/distribution-center/Bonds/DisbusementDetail.vue')
}, {
  path: 'issuance/redemption/detail',
  name: 'BondsRedemptionDetail',
  meta: { isLogin: true },
  component: () => import(/* webpackChunkName: "distribution-center" */ '@/views/distribution-center/Bonds/RedemptionDetail.vue')
}, {
  path: 'issuance/history',
  name: 'DisIssueBondsIssuanceHistory',
  meta: { isLogin: true },
  component: () => import(/* webpackChunkName: "distribution-center" */ '@/views/distribution-center/Bonds/IssuanceHistory.vue')
}, {
  path: 'issuance/bonds/detail',
  name: 'DisBondsDetail',
  meta: { opType: 'bondsDetail', isLogin: true },
  component: () => import(/* webpackChunkName: "distribution-center" */ '@/views/distribution-center/Bonds/BondsDetail.vue')
}, {
  path: 'issuance/asset/detail',
  name: 'DisAssetDetail',
  meta: { opType: 'abs', isLogin: true },
  component: () => import(/* webpackChunkName: "distribution-center" */ '@/views/distribution-center/ABS/Detail.vue')
}, {
  path: 'issuance/currency/detail',
  name: 'DisCurrencyDetail',
  meta: { opType: 'bondsDetail', isLogin: true },
  component: () => import(/* webpackChunkName: "distribution-center" */ '@/views/distribution-center/DigitalCurrency/Detail.vue')
}];
