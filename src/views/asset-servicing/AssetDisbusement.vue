<template>
  <div class="disbusement">
    <bread-crumbs :data="breadData"></bread-crumbs>
    <div class="main-container">
      <h3 class="page-subtitle">Coupon Payments</h3>
      <div class="search">
        <el-button class="addressCentreContent" @click="handleCalculate">Calculate</el-button>
        <el-button class="addressCentreContent-TopBtn" @click="handleCouponPayout">Coupon Payout</el-button>
      </div>
      <div class="table-box">
        <element-table
          pager
          :loading="tableProps.loading"
          :data="tableProps.data"
          :columns="tableProps.columns"
          :pageTotal="tableProps.pageTotal"
          :pageIndex="searchParam.page"
          @handleChangePage="handleChangePage"
        >
          <template v-slot:status="{ row, prop }">
            <div class="status-text">
              <span :class="stateColor(row[prop])">{{row['statusDesc']}}</span>
              <el-popover
                v-if="row[prop] === statusEnum.DistributeFailed
                || row[prop] === statusEnum.CalculateFailed
                || row[prop] === statusEnum.Cancelled
                || row[prop] === statusEnum.Disrupted"
                placement="top-start"
                trigger="hover"
                width="260"
                :content="row['remark']"
              >
                <span class="list-icon icon-question" slot="reference">?</span>
              </el-popover>
            </div>
          </template>
          <template v-slot:edit="{ row }">
            <el-dropdown trigger="hover" @command="handleOperate($event, row)">
              <i class="el-icon-more op-more"></i>
              <el-dropdown-menu slot="dropdown">
                <el-dropdown-item
                  v-for="item in dropdownList(row['status'], row['failed_type'])"
                  :key="item.key"
                  :command="item.key"
                >
                  {{ item.label }}
                </el-dropdown-item>
              </el-dropdown-menu>
            </el-dropdown>
          </template>
        </element-table>
      </div>
      <disbur-dialog
        :visible.sync="disVisible"
        :currentRow="currentRow"
        :reDistribute="reDistribute"
        @handleDistributeSubmit="handleDistributeSubmit"
        @handleDistributeClose="handleDistributeClose"
      />
      <calhistory-dialog :visible.sync="historyVisible" :currentRow="currentRow" />
      <element-dialog
        :visible.sync="confirmVisible"
        :submitText="'Confirm'"
        @handleOK="couponCalculate"
      >
        <div class="confirm-calculate" v-loading="confirmCalculateLoading">Please confirm to calculate</div>
      </element-dialog>
      <el-dialog
        :visible.sync="confirmVisibleAno"
        :close-on-press-escape="false"
        :width="'630px'"
        custom-class="Calculate-dialog"
      >
      <img class="Calculate-img" src="@/assets/images/Calculate-img.png" alt="">
      <div class="Calculate-title">Calculating…</div>
      <div class="Calculate-con" v-loading="confirmCalculateLoading">Expect to complete calculation within 2-10 minutes, calculation peak may be delayed</div>
      <el-button @click="CalculateClose">Close</el-button>
      <el-button type="primary" @click="toCalculateHistory">View Progress</el-button>
      </el-dialog>
    </div>
  </div>
</template>
<script>
import moment from 'moment';
import { notify } from '@/common/util';
import { disbursementStatusEnum } from '@/common/enums.js';
import DisburDialog from './component/AssetDisribursementDialog.vue';
import CalHistoryDialog from './component/CalculateHistoryDialog.vue';
import { couponStatusList, couponList, absCalculate } from '@/api/asset-servicing.js';

export default {
  name: 'Disbursement',
  data () {
    return {
      statusEnum: disbursementStatusEnum,
      disVisible: false,
      historyVisible: false,
      confirmLoading: false,
      confirmVisible: false,
      confirmVisibleAno: false,
      confirmCalculateLoading: false,
      reDistribute: false, // is re distribute
      currentRow: {},
      statusList: [], // Status dropdown data
      tableProps: {
        loading: false,
        pageTotal: 0,
        columns: [
          {
            label: '#',
            prop: 'rowNum', // couponNo
            width: 80
          },
          {
            label: 'Security Code',
            prop: 'securityCode' // securityCode
          }, {
            label: 'Disbursement Token',
            prop: 'securityTypeDesc' // securityTypeDesc
          }, {
            label: 'Periods',
            prop: 'period' // period
          }, {
            label: 'Timestamp',
            prop: 'couponTime', // couponTime
            formatter: (row, column, cellValue, index) => {
              return cellValue ? `${moment(cellValue).format('YYYY-MM-DD HH:mm:ss')}` : '--';
            }
          }, {
            label: 'Status',
            prop: 'status', // statusDesc
            isSlot: true
          }, {
            width: 80,
            label: 'Operation',
            prop: 'edit',
            isSlot: true
          }
        ],
        data: []
      },
      searchParam: {
        page: 1,
        limit: 10
      },
      breadData: [{
        name: 'Asset Servicing Centre',
        to: '/asset-servicing/asset'
      }, {
        name: 'Asset-Backed',
        to: '/asset-servicing/asset'
      }, {
        name: 'Coupon Payments'
      }]
    };
  },
  components: {
    'disbur-dialog': DisburDialog,
    'calhistory-dialog': CalHistoryDialog
  },
  methods: {
    dropdownList (status, failedType) {
      const statusEnum = this.statusEnum;
      const obj = [{
        key: 'redis',
        label: 'Continue Coupon Payout',
        isShow: [statusEnum.Disrupted, statusEnum.DistributeFailed].includes(status)
      }, {
        key: 'view',
        label: 'View',
        isShow: [statusEnum.InProgress, statusEnum.Success,
          statusEnum.Cancelled, statusEnum.Disrupted, statusEnum.DistributeFailed].includes(status)
      }];
      return obj.filter(item => item.isShow);
    },
    // operate buttons
    handleOperate (value, row) {
      const { securityCode, period, snapshotNo } = row;
      if (value === 'view') {
        this.$router.push({
          name: 'AssetServiceCouponViewDetail',
          query: {
            code: securityCode,
            period,
            snapshotNo,
            type: 'assets'
          }
        });
        return;
      }
      const handleObj = {
        redis: this.handleDistribute
      };
      handleObj[value](row);
    },
    // distribute
    handleDistribute (row) {
      this.currentRow = {
        securityCode: this.$route.query.code,
        securityType: this.$route.query.tokenType,
        period: row.period
      };
      this.reDistribute = (row.status === this.statusEnum.Disrupted || row.status === this.statusEnum.DistributeFailed);
      this.disVisible = true;
    },
    handleCouponPayout () {
      this.currentRow = {
        securityCode: this.$route.query.code,
        securityType: this.$route.query.tokenType,
        period: 0
      };
      this.disVisible = true;
    },
    // calculate
    handleCalculate () {
      this.confirmVisible = true;
    },
    // page events
    handleChangePage (page) {
      this.searchParam.page = page;
      this.getList(page);
    },
    couponCalculate () {
      // instance.confirmButtonLoading = true;
      this.confirmCalculateLoading = true;
      absCalculate({
        data: {
          tokenCode: this.$route.query.code
        },
        notify: notify.error
      }).then(res => {
        this.confirmCalculateLoading = false;
        // instance.confirmButtonLoading = false;
        if (res.data.code === '1000') {
          this.confirmVisible = false;
          this.confirmVisibleAno = true;
          // this.$notify.success({ message: 'Operation Success' });
        } else {
          this.$notify.error({ message: res.data.msg });
        }
      }).catch(() => {
        this.confirmCalculateLoading = false;
      });
    },
    CalculateClose () {
      this.confirmVisibleAno = false;
    },
    toCalculateHistory () {
      this.$router.push({
        path: '/issuance/asset/detail',
        query: {
          t: 'ase',
          serialNo: this.$route.query.serialNo,
          code: this.$route.query.code,
          type: 'asset',
          navActive: 'snap'
        }
      });
    },
    stateColor (state) {
      let color;
      switch (state) {
        case disbursementStatusEnum.InProgress:
          color = 'padding';
          break;
        case disbursementStatusEnum.DistributeFailed:
        case disbursementStatusEnum.CalculateFailed:
        case disbursementStatusEnum.Disrupted:
          color = 'rejected';
          break;
        case disbursementStatusEnum.Cancelled:
        case disbursementStatusEnum.NotStart:
        case disbursementStatusEnum.NotDistribute:
          color = 'cancelled';
          break;
        case disbursementStatusEnum.Success:
          color = 'success';
      }
      return color;
    },
    handleDistributeSubmit () {
      this.disVisible = false;
      this.reDistribute = false;
      this.getList(1);
    },
    handleDistributeClose () {
      this.reDistribute = false;
    },
    getList (page) {
      this.tableProps.loading = true;
      if (page) {
        this.searchParam.page = page;
      }
      couponList({
        ...this.searchParam,
        securityCode: this.$route.query.code,
        tokenType: this.$route.query.tokenType
      }).then(res => {
        this.tableProps.loading = false;

        const { data, code } = res.data;
        if (code === '1000') {
          this.tableProps.data = data.data || [];
          this.tableProps.pageTotal = data.count; // count;
        }
      }).catch(error => {
        this.$message({ message: (error.data && error.data.msg) || 'The system is busy, please try again later', type: 'error' });
        this.tableProps.loading = false;
      });
    },
    getStatusList () {
      couponStatusList().then(res => {
        const { code, data } = res.data;
        if (code === '1000') {
          this.statusList = data || [];
        }
      });
    }
  },
  mounted () {
    // this.getStatusList();
    this.getList();
  }
};
</script>
<style scoped lang="scss">
.disbusement {
  .search {
    margin-bottom: 30px;
    text-align: right;
    .addressCentreContent{
      width: 170px;
      height: 40px;
    }
    .addressCentreContent-TopBtn {
      width: 170px;
      height: 40px;
      line-height: 40px;
      padding: 0 20px;
      border-radius: 8px;
      font-size: 14px;
      background: #214285;
      color: #ffffff !important;
      border: none;
    }
  }
  .el-range-editor.el-input__inner {
    width: 260px;
    margin-right: 20px;
  }
  .el-input-group {
    width: 220px;
    margin-right: 20px;
  }
  .confirm-calculate {
    margin-bottom: 30px;
    font-size: 20px;
    color: #192231;
  }
}
</style>
<style lang="scss">
.disbusement {
  .search {
    .el-input-group__append {
      padding: 0;
      p {
        padding: 0 20px;
        height: 38px;
        cursor: pointer;
        line-height: 38px;
      }
    }
  }
}
.Calculate-dialog{
  .el-dialog__body{
    text-align: center;
    .Calculate-img{
      width: 58px;
    }
    .Calculate-title{
      font-family: Calibri;
      font-size: 18px;
      color: #FF9A00;
      text-align: center;
      margin: 14px;
    }
    .Calculate-con{
      font-family: Calibri;
      font-size: 14px;
      color: #192231;
      text-align: center;
      line-height: 21px;
      margin-bottom: 60px;
    }
  }
}
</style>
