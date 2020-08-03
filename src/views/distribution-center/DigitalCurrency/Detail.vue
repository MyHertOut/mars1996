<template>
  <div class="disbonds-detail">
    <bread-crumbs :data="breadData"></bread-crumbs>
    <div class="main-container" v-loading="loading">
      <div class="top-bar">
        <h3 class="page-subtitle">Details</h3>
        <el-button
          v-if="basicInfoData.code"
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
          :opType="issueTypeEnum.TOKEN"
          @handleChangePage="handleChangePage"
        ></component>
      </div>
    </div>
    <!-- <additional-issue
      :visible.sync="additionalVisible"
      :selectedRowData="{code: basicInfoData.code, issuanceAddress: basicInfoData.issuanceAddress}"
    ></additional-issue> -->
    <additional-issue
      :visible.sync="additionalVisible"
      :selectedRowData="{code: basicInfoData.code, issuanceAddress: basicInfoData.issuanceAddress}"
      :issuesType="issueTypeEnum.TOKEN"
    ></additional-issue>
  </div>
</template>

<script>
import {
  tokenDetailBasic,
  assetTokenDetailRecord
} from '@api/distribution-center.js';
import { notify } from '@/common/util.js';
import { additionalIssueTypeEnum } from '@/common/enums.js';
import DetailBasicParameters from './component/DetailBasicParameters.vue';
import DetailIssuanceRecords from '../component/DetailIssuanceRecords.vue';

export default {
  name: 'DisCurrencyDetail',
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
        title: 'Issuance Records',
        key: 'issuance'
      }],
      breadData: [{
        name: 'Issuance Centre',
        to: '/issuance/bonds'
      }, {
        name: 'Currencies',
        to: '/issuance/currency'
      }, {
        name: 'Details'
      }]
    };
  },
  components: {
    DetailBasicParameters,
    DetailIssuanceRecords,
    'additional-issue': () => import('../component/AdditionalIssueDialog.vue')
  },
  computed: {
    issueTypeEnum () {
      return additionalIssueTypeEnum;
    }
  },
  methods: {
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
          url: tokenDetailBasic,
          components: DetailBasicParameters
        },
        issuance: {
          url: assetTokenDetailRecord,
          components: DetailIssuanceRecords
        }
      };
      this.currentView = urlObj[this.navActive]['components'];
      this.loading = true;

      urlObj[this.navActive]['url']({
        data: {
          serialNo: this.$route.query.serialNo,
          securityCode: this.$route.query.code,
          page: this.pageIndex
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
      padding: 40px 30px 100px;
      background-color: #fff
    }
    .view-item {
      padding: 0 12px;
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
