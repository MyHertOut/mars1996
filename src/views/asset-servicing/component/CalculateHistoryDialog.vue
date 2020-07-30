<template>
  <element-dialog
    v-bind="$attrs"
    v-on="$listeners"
    :title="`Coupon Periods： ${currentRow.period}`"
    :footer="false"
    @open="getList"
    width="747px"
  >
     <element-table
        pager
        border
        :loading="loading"
        :data="tableData"
        :columns="tableColumn"
        :pageTotal="pageTotal"
        :pageIndex="params.page"
        :pageSize="params.limit"
        @handleChangePage="handleChangePage"
      >
        <template v-slot:status="{ row, prop }">
          <div class="status-text">
            <span :class="stateColor(row[prop])">{{row['statusDesc']}}</span>
            <el-popover
              v-if="row[prop] === statusEnum.FAILED"
              placement="top-start"
              trigger="hover"
              :content="row['remark']"
            >
              <span class="list-icon icon-question" slot="reference">?</span>
            </el-popover>
          </div>
        </template>
     </element-table>
  </element-dialog>
  <!-- <el-dialog
    :title="`Coupon Periods： ${currentRow.period}`"
    custom-class="calhistory-dialog"
    :close-on-click-modal="false"
    :visible="historyVisible"
    :before-close="handleCancel"
    width="51%"
  >
     <common-table
        pager
        border
        :loading="loading"
        :data="tableData"
        :columns="tableColumn"
        :pageTotal="pageTotal"
        :pageIndex="params.page"
        :pageSize="params.limit"
        @handleChangePage="handleChangePage"
      >
        <template v-slot:status="{ row, prop }">
          <div class="status-text">
            <span :class="stateColor(row[prop])">{{row['statusDesc']}}</span>
            <el-popover
              v-if="row[prop] === statusEnum.Failed"
              placement="top-start"
              trigger="hover"
              :content="row['remark']"
            >
              <span class="list-icon icon-question" slot="reference">?</span>
            </el-popover>
          </div>
        </template>
     </common-table>
  </el-dialog> -->
</template>

<script>
import moment from 'moment';
import { notify } from '@/common/util';
import { calculateHistoryStatusEnum as statusEnum } from '@/common/enums.js';
import { couponCalculateHis } from '@/api/asset-servicing.js';
// import CommonTable from '@/components/CommonTable.vue';

export default {
  inheritAttrs: false,
  props: {
    // historyVisible: Boolean,
    currentRow: Object
  },
  data () {
    return {
      statusEnum,
      loading: false,
      pageTotal: 0,
      params: {
        page: 1,
        limit: 10
      },
      tableData: [],
      tableColumn: [{
        label: '#',
        prop: 'rowNum',
        width: 60
      }, {
        label: 'Type',
        prop: 'typeDesc',
        width: 100
      }, {
        label: 'Timestamp',
        prop: 'snapshotTime',
        formatter: (row, column, cellValue, index) => {
          return cellValue ? `${moment(cellValue).format('YYYY-MM-DD HH:mm:ss')}` : '--';
        }
      }, {
        label: 'Total Holdings',
        prop: 'holdQuantity',
        formatter: (row, column, cellValue, index) => {
          return cellValue ? this.$options.filters.demicrometer(cellValue) : '--';
        }
      }, {
        label: 'Status',
        prop: 'status',
        isSlot: true
      }]
    };
  },
  components: {
    // 'common-table': CommonTable
  },
  methods: {
    handleCancel () {
      this.$emit('update:historyVisible', false);
    },
    // page events
    handleChangePage (page) {
      this.params.page = page;
      this.getList();
    },
    stateColor (state) {
      let color;
      switch (state) {
        case statusEnum.INIT:
        case statusEnum.CALCULATING:
          color = 'padding';
          break;
        case statusEnum.FAILED:
          color = 'rejected';
          break;
        case statusEnum.SUCCESS:
          color = 'success';
          break;
      }
      return color;
    },
    getList () {
      this.loading = true;
      couponCalculateHis({
        data: {
          couponNo: this.currentRow.couponNo,
          page: this.params.page,
          limit: this.params.limit
        },
        notify: notify.error
      }).then(res => {
        this.loading = false;
        const { code, data } = res.data;
        if (code === '1000') {
          this.tableData = data.data || [];
          this.pageTotal = data.count || 0;
        }
      }).catch(() => {
        this.loading = false;
      });
    }
  }
};
</script>
<style lang="scss">
  .calhistory-dialog {
    &::after {
      content: '';
      display: block;
      clear: both;
      width: 0;
      height: 0;
    }
    .common-table {
      padding-bottom: 0;
    }
    .el-pagination {
      float: right;
      margin: 39px -8px 10px;
    }
    .el-dialog__header {
      padding: 60px 50px 0;
    }
    .el-dialog__body {
      padding: 20px 50px 30px;
    }
    .el-table td {
      border-bottom-color: #EBEEF5 !important;
    }
    .el-table th {
      background-color: #F9FBFF;
      font-weight: normal;
      color: #8D93A1;
    }
    .el-table--border {
      td, th {
        border-right: none;
      }
    }
  }
</style>
