<template>
  <div class="disbusement">
    <bread-crumbs :data="breadData"></bread-crumbs>
    <div class="main-container">
      <h3 class="page-subtitle">Coupon Payments</h3>
      <!-- <div class="search">
        <el-date-picker
          v-model="searchParam.time"
          @change="searchTime"
          type="daterange"
          range-separator="-"
          start-placeholder="From"
          end-placeholder="To">
        </el-date-picker>
        <el-input placeholder="Security Code" maxlength="16" v-model="searchParam.securityCode" style="width: 220px;">
          <template slot="append">
            <p @click="getList(1)">Search</p>
          </template>
        </el-input>
        <el-select
          v-model="searchParam.status"
          placeholder="All Status"
          popper-class="settlement-token-select"
          style="width: 138px;margin-right:20px;"
          @change="getList(1)"
        >
          <el-option
            v-for="item in statusList"
            :key="item.status"
            :label="item.statusDesc"
            :value="item.status">
          </el-option>
        </el-select>
      </div> -->
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
                <!-- row['status'] -->
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
      />
      <calhistory-dialog :visible.sync="historyVisible" :currentRow="currentRow" />
      <element-dialog
        :visible.sync="confirmVisible"
        :submitText="'Confirm'"
        @handleOK="couponCalculate"
        :width="'630px'"
      >
        <div class="confirm-calculate" v-loading="confirmCalculateLoading">Please confirm to calculate</div>
      </element-dialog>
    </div>
  </div>
</template>
<script>
import moment from 'moment';
import { notify } from '@/common/util';
import { disbursementStatusEnum } from '@/common/enums.js';
import DisburDialog from './component/DisribursementDialog.vue';
import CalHistoryDialog from './component/CalculateHistoryDialog.vue';
// import { listOfferOrder } from '@/api/tradeCenter.js';
import { couponStatusList, couponList, couponCalculate } from '@/api/asset-servicing.js';

export default {
  name: 'Disbursement',
  data () {
    return {
      statusEnum: disbursementStatusEnum,
      disVisible: false,
      historyVisible: false,
      confirmLoading: false,
      confirmVisible: false,
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
            label: 'Security Type',
            prop: 'securityTypeDesc' // securityTypeDesc
          }, {
            label: 'Coupon Periods',
            prop: 'period' // period
          }, {
            label: 'Status',
            prop: 'status', // statusDesc
            isSlot: true
          }, {
            label: 'Timestamp',
            prop: 'couponTime', // couponTime
            formatter: (row, column, cellValue, index) => {
              return cellValue ? `${moment(cellValue).format('YYYY-MM-DD HH:mm:ss')}` : '--';
            }
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
        // time: [],
        // securityCode: this.$route.query.code,
        // status: -1,
        page: 1,
        limit: 10
      },
      breadData: [{
        name: 'Asset Servicing Centre',
        to: '/asset-servicing/bonds'
      }, {
        name: 'Bonds',
        to: {
          name: 'AssetServicingBondsList',
          params: {
            t: 'abs'
          }
        }
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
    searchTime (date) {
      const params = this.searchParam;
      if (date && date.length > 1) {
        params.startTime = date[0].getTime();
        params.endTime = date[1].getTime();
      } else {
        params.startTime = params.endTime = null;
      }
      this.getList(1);
    },
    dropdownList (status, failedType) {
      const statusEnum = this.statusEnum;
      const obj = [{
        key: 'dis',
        label: 'Distribute',
        isShow: [statusEnum.NotDistribute, statusEnum.Cancelled,
          statusEnum.DistributeFailed].includes(status)
      }, {
        key: 'redis',
        label: 'Continue Distribution',
        isShow: [statusEnum.Disrupted].includes(status)
      }, {
        key: 'cal',
        label: 'Calculate',
        isShow: [statusEnum.NotStart, statusEnum.NotDistribute,
          statusEnum.CalculateFailed].includes(status)
      }, {
        key: 'his',
        label: 'Calculate History',
        // Except for these two states
        isShow: ![statusEnum.InProgress, statusEnum.Disrupted].includes(status)
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
            type: 'bonds'
          }
        });
        return;
      }
      const handleObj = {
        cal: this.handleCalculate,
        dis: this.handleDistribute,
        redis: this.handleDistribute,
        his: this.openHistoryDialog
      };
      handleObj[value](row);
    },
    // calculate
    handleCalculate (row) {
      this.confirmVisible = true;
      this.currentRow = row;
    },
    // distribute
    handleDistribute (row) {
      this.currentRow = row;
      this.reDistribute = row.status === this.statusEnum.Disrupted;
      this.disVisible = true;
    },
    // open history dialog
    openHistoryDialog (row) {
      this.currentRow = row;
      this.historyVisible = true;
    },
    // page events
    handleChangePage (page) {
      this.searchParam.page = page;
      this.getList(page);
    },
    couponCalculate () {
      // instance.confirmButtonLoading = true;
      this.confirmCalculateLoading = true;
      couponCalculate({
        data: {
          couponNo: this.currentRow.couponNo
        },
        notify: notify.error
      }).then(res => {
        this.confirmCalculateLoading = false;
        // instance.confirmButtonLoading = false;
        if (res.data.code === '1000') {
          this.confirmVisible = false;
          // this.$notify.success({ message: 'Operation Success' });
          this.getList();
        }
      }).catch(() => {
        this.confirmCalculateLoading = false;
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
      this.getList(1);
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

</style>
