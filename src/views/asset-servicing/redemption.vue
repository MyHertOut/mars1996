<template>
  <div class="redemption-box">
    <bread-crumbs :data="breadData"></bread-crumbs>
    <div class="main-container">
      <!-- <search-bar
      ></search-bar> -->
      <!-- <div class="search">
        <el-date-picker
          v-model="searchParam.time"
          @change="handleTimeChange"
          type="daterange"
          range-separator="-"
          start-placeholder="From"
          end-placeholder="To">
        </el-date-picker>
        <el-input placeholder="Security Code" v-model="searchParam.securityCode" style="width: 220px;">
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
          <template v-slot:statusDesc="{ row, prop }">
            <div class="status-text">
              <span :class="stateColor(row['status'])">{{ row.statusDesc }}</span>
              <el-popover
                v-if="row['status'] === statusEnum.failed
                || row['status'] === statusEnum.cancelled
                || row['status'] === statusEnum.disrupted"
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
            <el-dropdown v-if="dropdownList(row).length" trigger="hover" @command="handleOperate($event, row)">
                <i class="el-icon-more op-more"></i>
                <el-dropdown-menu slot="dropdown">
                  <!-- row['status'] -->
                  <el-dropdown-item
                    v-for="item in dropdownList(row)"
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
      <freeze-dialog
        :visible.sync="freezeVisible"
        :currentRow="currentRow"
        @handleSubmit="getList(1)"
      ></freeze-dialog>
      <redem-dialog
        :visible.sync="redeemVisible"
        :currentRow="currentRow"
        :title="currentRow.status === statusEnum.disrupted ? 'Continue Redemption' : 'Redemption'"
        :isContinue="currentRow.status === statusEnum.disrupted"
        @handleSubmit="getList(1)"
      ></redem-dialog>
    </div>
  </div>
</template>
<script>
import { formatDate } from '@/common/util.js';
import { redeemStatusList, redeemList ,absRedemption, redeemBySecurityCode } from '@/api/asset-servicing.js';
import RedemFreezeDialog from './component/RedemFreezeDialog.vue';
import RedemDialog from './component/RedemDialog.vue';
import { redemptionStatusEnum } from '@/common/enums.js';

export default {
  name: 'AssetServicingRedemption',
  data () {
    return {
      loading: false,
      freezeVisible: false,
      redeemVisible: false,
      statusList: [], // Status dropdown data
      currentRow: {},
      statusEnum: redemptionStatusEnum,
      pageTotal: 0,
      breadData: [{
        name: 'Asset Servicing Centre',
        to: '/asset-servicing/' + this.$route.query.t
      }, {
        name: this.$route.query.t === 'asset' ? 'Asset-Backed' : 'Bonds',
        to: '/asset-servicing/' + this.$route.query.t
      }, {
        name: 'Redemption'
      }],
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
            label: 'Callable Bond',
            prop: 'callable'
          }, {
            label: 'Total Holdings',
            prop: 'totalHoldings',
            formatter: (row, column, cellValue, index) => {
              return cellValue ? `${this.$options.filters.demicrometer(cellValue)}` : '--';
            }
          }, {
            label: 'Status',
            prop: 'statusDesc',
            isSlot: true
          }, {
            label: 'Timestamp',
            prop: 'updateAt', // couponTime
            formatter: (row, column, cellValue, index) => {
              return cellValue ? `${formatDate(cellValue)}` : '--';
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
        // securityCode: '',
        // status: -1,
        page: 1,
        limit: 10
      }
    };
  },
  components: {
    'freeze-dialog': RedemFreezeDialog,
    'redem-dialog': RedemDialog
  },
  computed: {
    pageType () {
      return this.$route.query.t;
    }
  },
  methods: {
    handleTimeChange (date) {
      const params = this.searchParam;
      if (date && date.length > 1) {
        params.startTime = date[0].getTime();
        params.endTime = date[1].getTime();
      } else {
        params.startTime = params.endTime = null;
      }
      this.getList(1);
    },
    // page events
    handleChangePage (page) {
      this.searchParam.page = page;
      this.getList(page);
    },
    // operate buttons
    handleOperate (value, row) {
      const { securityCode } = row;
      if (value === 'view') {
        this.$router.push({
          name: 'AssetServiceRedemptionDetail',
          query: {
            code: securityCode,
            t: this.$route.query.t
          }
        });
        return;
      }
      const handleObj = {
        redeem: this.handleRedeem,
        freeze: this.handleFreeze,
        continueRedeem: this.handleContinueRedeem
      };
      handleObj[value](row);
    },
    dropdownList (row) {
      const { canFreeze, totalHoldings, status } = row;
      const statusEnum = this.statusEnum;
      const obj = [{
        key: 'freeze',
        label: 'Freeze',
        isShow: canFreeze // 1: show the button (Freeze), 0: do not show the button (Freeze)
      }, {
        key: 'continueRedeem',
        label: 'Continue Redemption',
        isShow: [statusEnum.disrupted].includes(status)
      }, {
        key: 'redeem',
        label: 'Redeem',
        isShow: (statusEnum.notRedeem === status && totalHoldings !== '0') ||
        (statusEnum.cancelled === status && !canFreeze) ||
        statusEnum.failed === status
      }, {
        key: 'view',
        label: 'View',
        isShow: [statusEnum.inprogress, statusEnum.success, statusEnum.failed, statusEnum.disrupted].includes(status) ||
        (statusEnum.cancelled === status && !canFreeze)
      }];
      return obj.filter(item => item.isShow);
    },
    handleFreeze (row) {
      this.currentRow = row;
      this.freezeVisible = true;
    },
    // redeem
    handleRedeem (row) {
      this.currentRow = row;
      this.redeemVisible = true;
    },
    handleContinueRedeem (row) {
      this.currentRow = row;
      this.redeemVisible = true;
    },
    stateColor (state) {
      let color;
      switch (state) {
        case redemptionStatusEnum.inprogress:
        case redemptionStatusEnum.freezing:
          color = 'padding';
          break;
        case redemptionStatusEnum.failed:
        case redemptionStatusEnum.disrupted:
          color = 'rejected';
          break;
        case redemptionStatusEnum.cancelled:
        case redemptionStatusEnum.notStart:
        case redemptionStatusEnum.notRedeem:
          color = 'cancelled';
          break;
        case redemptionStatusEnum.success:
          color = 'success';
      }
      return color;
    },
    getStatusList () {
      redeemStatusList().then(res => {
        const { code, data } = res.data;
        if (code === '1000') {
          this.statusList = data || [];
        }
      });
    },
    getList (page) {
      this.tableProps.loading = true;
      // couponList
      if (page) {
        this.searchParam.page = page;
      }
      let url = redeemList;
      this.searchParam.securityCode = this.$route.query.code;
      if (this.$route.query.t === 'asset') {
        url = absRedemption;
        this.searchParam.tokenCode = this.$route.query.code;
      }
      url({
        ...this.searchParam
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
    }
  },
  created () {
    // this.getStatusList();
    this.getList();
  }
};
</script>
<style scoped lang="scss">
.redemption-box {
  .search {
    // padding: 40px 30px;
    // padding-bottom: 0px;
    margin-bottom: 30px;
    // .export-btn {
    //   width: 150px;
    //   height: 40px;
    //   font-size: 20px;
    // }
    /deep/ .el-input-group__append {
      padding: 0;
      p {
        padding: 0 20px;
        height: 38px;
        cursor: pointer;
        line-height: 38px;
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
  }
}
</style>
