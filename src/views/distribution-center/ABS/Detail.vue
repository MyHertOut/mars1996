<template>
  <div class="disbonds-detail">
    <bread-crumbs :data="breadData"></bread-crumbs>
    <div class="main-container" v-loading="loading">
      <div class="top-bar">
        <h3 class="page-subtitle">Details</h3>
        <el-button
          v-if="basicInfoData.code && !isAssetServicing"
          class="btn-addIssue"
          @click="additionalVisible = true"
        >Additional Issuance</el-button>
      </div>
      <ul class="category-nav">
        <li :class="{'active': navActive === v.key}" v-for="(v) in navList" :key="v.key"
          @click="handleTabChange(v.key)">
          {{v.title}}
        </li>
      </ul>
      <div class="view-content">
        <component
          :is="currentView"
          :detailData="detailData"
          :data="tableData"
          :pageTotal="tableCount"
          :pageIndex="pageIndex"
          :pageType="pageTypeEnum.asset"
          @handleChangePage="handleChangePage"
        ></component>
      </div>
    </div>
    <additional-issue
      :visible.sync="additionalVisible"
      :issuesType="issueTypeEnum.ABS"
      :selectedRowData="{code: basicInfoData.code, issuanceAddress: basicInfoData.issuanceAddress}"
    ></additional-issue>
  </div>
</template>

<script>
import {
  absDetailBasic,
  absDetailCoupon,
  absDetailDocument,
  absDetailKyc,
  couponSnapshotList,
  absDetailRecord,
  detailAbsDisburseRecord,
  detailAbsRedeemRecord
} from '@api/distribution-center.js';
import { notify } from '@/common/util.js';
import { pageTypeEnum, additionalIssueTypeEnum } from '@/common/enums.js';
import DetailCouponPrincipal from './component/DetailCouponPrincipal.vue';
import DetailBasicParameters from './component/DetailBasicParameters.vue';
import DetailDocument from './component/DetailDocument.vue';
import DetailTradingRestriction from './component/DetailTradingRestriction.vue';
import DetailSnapshotRecords from './component/DetailSnapshotRecords.vue';
import DetailCouponPayment from './component/DetailCouponPayment.vue';
import DetailRedemption from './component/DetailRedemption.vue';
import DetailIssuanceRecords from './component/DetailIssuanceRecords.vue';

export default {
  name: 'DisBondsDetail',
  data () {
    return {
      loading: false,
      additionalVisible: false,
      navActive: 'basic',
      detailData: {},
      basicInfoData: {}, // 保存基本信息数据
      tableData: [],
      tableCount: 0,
      pageIndex: 1,
      currentView: 'DetailBasicParameters',
      navList: [{
        title: 'Basic Parameters',
        key: 'basic'
      }, {
        title: 'Coupon & Principal',
        key: 'coupon'
      }, {
        title: 'Documents',
        key: 'document'
      }, {
        title: 'Trading Restriction',
        key: 'kyc'
      }, {
        title: 'Snapshot Records',
        key: 'snap'
      }, {
        title: 'Coupon Payments',
        key: 'couponPayment'
      }, {
        title: 'Redemption',
        key: 'redemption'
      }, {
        title: 'Issuance Records',
        key: 'issuance'
      }]
      // breadData: [{
      //   name: 'Issuance',
      //   to: '/bonds'
      // }, {
      //   name: 'Details'
      // }]
    };
  },
  components: {
    DetailCouponPrincipal,
    DetailBasicParameters,
    DetailDocument,
    DetailTradingRestriction,
    DetailSnapshotRecords,
    DetailCouponPayment,
    DetailRedemption,
    DetailIssuanceRecords,
    'additional-issue': () => import('../component/AdditionalIssueDialog.vue')
  },
  computed: {
    navActiveQuery () {
      return this.$route.query.navActive;
    },
    bowserUrl () {
      return this.$store.state.common.systemConfig.blockBrowserUrl;
    },
    pageTypeEnum () {
      return pageTypeEnum;
    },
    // 是否是从资产服务中心跳转过来
    isAssetServicing () {
      return this.$route.query.t === 'ase';
    },
    issueTypeEnum () {
      return additionalIssueTypeEnum;
    },
    breadData () {
      let arr = [{
        name: 'Issuance Centre',
        to: '/issuance/bonds'
      }, {
        name: 'Asset-Backed',
        to: '/issuance/asset'
      }, {
        name: 'Details'
      }];
      if (this.isAssetServicing) {
        arr = [{
          name: 'Asset Servicing Centre',
          to: '/asset-servicing/asset'
        }, {
          name: ' Details'
        }];
      }
      return arr;
    }
  },
  methods: {
    browserUrlAddress (id) {
      const url = this.bowserUrl;
      return url ? `${url}/#/addressDetail?address=${id}` : 'javascript:void(0);';
    },
    handleTabChange (key) {
      this.navActive = key;
      this.tablePage = 1;
      this.getDetail();
    },
    handleChangePage (page) {
      this.pageIndex = page;
      this.getDetail();
    },
    getDetail () {
      const urlObj = {
        basic: {
          url: absDetailBasic,
          components: DetailBasicParameters
        },
        coupon: {
          url: absDetailCoupon,
          components: DetailCouponPrincipal
        },
        document: {
          url: absDetailDocument,
          components: DetailDocument
        },
        kyc: {
          url: absDetailKyc,
          components: DetailTradingRestriction
        },
        snap: {
          url: couponSnapshotList,
          components: DetailSnapshotRecords
        },
        couponPayment: {
          url: detailAbsDisburseRecord,
          components: DetailCouponPayment
        },
        redemption: {
          url: detailAbsRedeemRecord,
          components: DetailRedemption
        },
        issuance: {
          url: absDetailRecord,
          components: DetailIssuanceRecords
        }
      };
      this.tableData = [];
      this.tableCount = 0;
      this.detailData = {};
      this.currentView = urlObj[this.navActive]['components'];
      this.loading = true;
      urlObj[this.navActive]['url']({
        data: {
          serialNo: this.$route.query.serialNo,
          securityCode: this.$route.query.code,
          page: this.pageIndex,
          code: this.$route.query.code
        },
        notify: notify.error
      }).then(res => {
        this.loading = false;
        const { code, data } = res.data;
        if (code === '1000') {
          if (['snap', 'couponPayment', 'redemption', 'issuance'].includes(this.navActive)) {
            this.tableData = data.data || [];
            this.tableCount = data.count || 0;
          } else {
            this.detailData = data || {};
            this.navActive === 'basic' && (this.basicInfoData = this.detailData);
          }
        }
      }).catch(() => {
        this.loading = false;
      });
    }
  },
  created () {
    this.getDetail();
    if (this.navActiveQuery) {
      this.navActive = this.navActiveQuery;
      this.handleTabChange(this.navActive);
    }
  }
};
</script>
<style lang="scss" scoped>
  .disbonds-detail {
    .top-bar {
      display: flex;
      justify-content: space-between;
      margin-bottom: 40px;
    }
    .btn-addIssue {
      height: 32px;
      border: 1px solid #214285;
      font-size: 16px;
      color: #214285
    }
    .view-content {
      padding: 66px 30px 100px;
      background-color: #fff
    }
    .view-item {
      padding: 0 10px;
      /deep/.sub-title {
        color: #8D93A1;
      }
      /deep/.grid-content {
        overflow-wrap: break-word;
        word-break: keep-all;
        color: #001F3B;
      }
      /deep/.el-row {
        display: flex;
        margin-bottom: 24px;
        align-items: center;
      }
    }
  }
</style>
<style lang="scss">
.disbonds-detail {
  .payment-date-table {
      margin-bottom: 25px;
      .el-table {
        &::after {
          display: none;
        }
        .el-table__header {
          border-top: 1px solid #EBEEF5;
          border-left: 1px solid #EBEEF5;
          tr {
            th {
              border-right: 1px solid #EBEEF5;
              &:first-child {
                // background-color: #F9FBFF;
              }
              .cell {
                font-size: 14px;
                color: #8D93A1;
                font-weight: normal;
                padding-left: 17px;
                word-break: break-word;
              }
            }
          }
        }
        .el-table__body {
          border-left: 1px solid #EBEEF5;
          tr {
            td {
              border-right: 1px solid #EBEEF5;
              &:first-child {
                // background-color: #F9FBFF;
              }
              .cell {
                font-size: 14px;
                color: #192231;
                padding-left: 17px;
              }
            }
          }
        }
      }
    }
}
</style>
