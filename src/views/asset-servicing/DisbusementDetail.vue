<template>
  <div class="disbursement-detail">
    <!-- <el-breadcrumb separator-class="el-icon-arrow-right" class="view-breadcrumb">
      <el-breadcrumb-item>Issuance</el-breadcrumb-item>
      <el-breadcrumb-item :to="{ name: 'Disbursement' }">Coupon Payment</el-breadcrumb-item>
      <el-breadcrumb-item>Details</el-breadcrumb-item>
    </el-breadcrumb> -->
    <bread-crumbs :data="breadData"></bread-crumbs>
    <div class="view-content main-container" v-loading="loading">
      <p class="headlines">Details</p>
      <div class="view-item">
        <p class="head-title">Basic Parameters</p>
        <el-row :gutter="20">
          <el-col :span="6"><div class="sub-title">Disbursement Token：</div></el-col>
          <el-col :span="6"><div class="grid-content">{{ basicData.tokenCode }}</div></el-col>
          <el-col :span="6"><div class="sub-title">Snapshot Timestamp：</div></el-col>
          <el-col :span="6"><div class="grid-content">{{ basicData.snapshotTime | dateFormat }}</div></el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="6"><div class="sub-title">Total Holdings：</div></el-col>
          <el-col :span="6"><div class="grid-content">{{ !basicData.holderQty ? '--' : basicData.holderQty | demicrometer }}</div></el-col>
          <el-col :span="6"><div class="sub-title">Payout Value：</div></el-col>
          <el-col :span="6"><div class="grid-content">{{ !basicData.payAmount ? '--' : basicData.payAmount | demicrometer }}</div></el-col>
        </el-row>
        <el-row>
          <el-col :span="6"><div class="sub-title">Disbursement Address (Contract)：</div></el-col>
          <el-col :span="7">
            <div class="grid-content flex">
              <a class="link-txt" :href="contractAddress(basicData.disbursementAddr)" target="_blank">
                {{ basicData.disbursementAddr }}
              </a>
              <img
                v-show="basicData.disbursementAddr"
                width="16"
                height="16"
                src="../../assets/images/copy.png"
                alt="icon"
                class="copy"
                v-clipboard:copy="basicData.disbursementAddr"
                v-clipboard:success="copySuccess"
                v-clipboard:error="copyError"
              >
              <!-- <img src="../../assets/images/copy.png" alt="icon" class="copy" v-clipboard:copy="v.address" v-clipboard:success="copySuccess" v-if="v.address"> -->
            </div>
          </el-col>
        </el-row>
        <element-table
          pager
          border
          :data="tableData"
          :columns="tableColumn"
          :pageTotal="pageTotal"
          :pageIndex="params.page"
          :pageSize="params.limit"
          @handleChangePage="handleChangePage"
        >
          <template v-slot:edit="{ row }">
            <el-button class="review-btn" @click="handleView(row)">View</el-button>
          </template>
          <template v-slot:batchTxId="{ row }">
            <a class="link-txt" :href="blockBrowserTxId(row['batchTxId'])" target="_blank">
              {{ row['batchTxId'] }}
            </a>
          </template>
        </element-table>
        <div class="return-btn">
          <el-button
            type="primary"
            @click="$route.query.type === 'assets' ? $router.push({ name: 'AssetServicingAssetCoupon', query: {code: $route.query.code } }) : $router.push({ name: 'AssetServicingBondsCoupon', query: {code: $route.query.code } })"
          >Return</el-button>
        </div>
      </div>
    </div>
    <detail-dialog :visible.sync="detailDialogVisible" :row="currentRow" />
  </div>
</template>

<script>
import { distributeBatchDetail, distributeBatchList } from '@/api/asset-servicing.js';
import { notify } from '@/common/util';
import DetailDialog from '@/components/DisbursementDetailDialog.vue';

export default {
  data () {
    return {
      loading: false,
      detailDialogVisible: false,
      currentRow: {},
      pageTotal: 0,
      params: {
        limit: 10,
        page: 1
      },
      basicData: {},
      tableData: [],
      tableColumn: [
        {
          label: '#',
          prop: 'rowNum',
          width: 40
        },
        {
          label: 'Batch No',
          prop: 'batchNo'
        },
        {
          label: 'Holders Address',
          prop: 'addressSize',
          formatter: (row, column, cellValue, index) => {
            return cellValue ? `Total ${this.$options.filters.demicrometer(cellValue)}` : '--';
          }
        },
        {
          label: 'Holders Qty',
          prop: 'holderQty',
          formatter: (row, column, cellValue, index) => {
            return cellValue ? `Total ${this.$options.filters.demicrometer(cellValue)}` : '--';
          }
        }, {
          label: 'Disbursement Amount',
          width: 200,
          prop: 'disburseAmount',
          formatter: (row, column, cellValue, index) => {
            return cellValue ? `Total ${this.$options.filters.demicrometer(cellValue)}` : '--';
          }
        }, {
          label: 'Batch TX ID',
          prop: 'batchTxId',
          isSlot: true
        }, {
          label: 'Operation',
          prop: 'edit',
          isSlot: true
        }
      ],
      breadData: [{
        name: 'Asset Servicing Centre',
        to: '/asset-servicing'
      }, {
        name: 'Coupon Payments',
        to: {
          path: '/asset-servicing/asset/coupon',
          query: { code: this.$route.query.code, tokenType: 2 }
        }
      }, {
        name: 'Details'
      }]
    };
  },
  components: {
    'detail-dialog': DetailDialog
  },
  computed: {
    blockBrowserUrl () {
      return this.$store.state.common.systemConfig.blockBrowserUrl;
    }
  },
  methods: {
    contractAddress (id) {
      return `${this.blockBrowserUrl}/#/addressDetail?address=${id}`;
    },
    blockBrowserTxId (id) {
      return `${this.blockBrowserUrl}/#/txidDetails?id=${id}`;
    },
    copySuccess () {
      this.copyTipsObj && this.copyTipsObj.close();
      this.copyTipsObj = this.$message({
        message: 'Operation is successful',
        type: 'success'
      });
    },
    copyError () {
      this.copyTipsObj && this.copyTipsObj.close();
      this.copyTipsObj = this.$message({ message: 'Copy the failure', type: 'error' });
    },
    handleView (row) {
      this.currentRow = row || {};
      this.detailDialogVisible = true;
    },
    handleChangePage () {},
    // get detailed data
    async getDetailInfo () {
      const { code, period, snapshotNo } = this.$route.query;
      const { page, limit } = this.params;
      this.loading = true;

      const batchData = await distributeBatchDetail({
        data: {
          securityCode: code,
          period
        },
        notify: notify.error
      }).then(data => data)
        .catch(() => {
          this.loading = false;
        });
      const listData = await distributeBatchList({ snapshotNo, page, limit })
        .then(data => data)
        .catch(() => {
          this.loading = false;
        });

      this.loading = false;

      if (batchData) {
        const { code, data } = batchData.data;
        code === '1000' && (this.basicData = data || {});
      }
      if (!listData) return;
      const { code: listCode, data: tableData } = listData.data;
      if (listCode === '1000') {
        this.tableData = tableData.data || [];
        this.pageTotal = tableData.count;
      }
    }
  },
  mounted () {
    this.getDetailInfo();
  }
};
</script>

<style lang="scss">
  .disbursement-detail {
    .el-table td {
      border-bottom-color: #EBEEF5 !important;
    }
    .el-table--border {
      td, th {
        border-right: none;
      }
    }
  }
</style>
<style scoped lang="scss">
  .disbursement-detail {
    // width: 1200px;
    // margin: 0 auto;
    font-size: 14px;
    color: #192231;
    margin-bottom: 50px;
    .el-breadcrumb {
      height: 60px;
      display: flex;
      align-items: center;
    }
    .table-box {
      margin-top: 10px;
    }
    .view-content {
      // box-shadow: 0 2px 28px 0 rgba(166,193,255,0.38);
      // border-radius: 4px;
      // padding: 30px;
      // background-color: #fff;
      .headlines {
        font-size: 26px;
        color: #001F3B;
      }
      .view-item {
        padding: 0 40px;
        &::after {
            content: '';
            display: block;
            clear: both;
            width: 0;
            height: 0;
        }
        .el-pagination {
          float: right;
          margin-top: 30px;
          margin-right: 30px;
        }
        .head-title {
          font-size: 18px;
          margin-bottom: 20px;
          margin-top: 40px;
          font-weight: 600;
        }
        .grid-content {
          overflow-wrap: break-word;
          word-break: keep-all;
        }
        .flex {
          display: flex;
        }
        .copy {
          margin-left: 10px;
          cursor: pointer;
        }
        .sub-title {
          color: #8D93A1;
        }
        .el-row {
          margin-bottom: 24px;
        }
      }
    }
    .return-btn {
        width: 630px;
        margin: 0 auto;
        margin-top: 120px;
        margin-bottom: 30px;
        text-align: center;
        button {
            width: 300px;
            height: 40px;
            font-size: 18px;
        }
    }
    .view-btn {
      // border-radius: 2px;
      // width: 80px;
      height: 32px;
      // background-color: #fff;
      // font-size: 14px;
      // text-align: center;
      // line-height: 28px;
      // border: 1px solid #2F39E3;
      // color: #2F39E3;
      // cursor: pointer;
    }
  }
</style>
