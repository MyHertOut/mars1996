<template>
 <element-dialog
    v-bind="$attrs"
    width="54%"
    v-on="$listeners"
    :footer="false"
    :title="`Batch TX ID： ${row.batchTxId}`"
    @open="getDetail"
  >
    <element-table
      pager
      border
      :loading="loading"
      :data="tableData"
      :columns="tableColumn[type] || defaultTableColumn"
      :pageTotal="pageTotal"
      :pageIndex="params.page"
      :pageSize="params.limit"
      @handleChangePage="handleChangePage"
    >
    </element-table>
 </element-dialog>
  <!-- <el-dialog
    :title="`Batch TX ID： ${row.batchTxId}`"
    custom-class="calhistory-dialog"
    :close-on-click-modal="false"
    :visible="visible"
    :before-close="handleCancel"
    width="51%"
  >
    <common-table
      pager
      border
      :loading="loading"
      :data="tableData"
      :columns="tableColumn[type] || defaultTableColumn"
      :pageTotal="pageTotal"
      :pageIndex="params.page"
      :pageSize="params.limit"
      @handleChangePage="handleChangePage"
    >
    </common-table>
  </el-dialog> -->
</template>

<script>
import { distributeBatchDetailList } from '@/api/distribution-center.js';
import { redeemBatchDetailList } from '@/api/common.js';
import { notify } from '@/common/util.js';
// import CommonDialog from '@/components/CommonDialog.vue';
// import CommonTable from '@/components/CommonTable.vue';

export default {
  props: {
    // visible: Boolean,
    row: Object,
    type: String
  },
  data () {
    return {
      loading: false,
      pageTotal: 0,
      params: {
        page: 1,
        limit: 10
      },
      tableColumn: {
        redemption: [{
          label: 'SN',
          prop: 'rowNum',
          width: 60
        }, {
          label: 'Holders Address',
          prop: 'address'
        }, {
          label: 'Total Holdings',
          prop: 'holderQty',
          formatter: (row, column, cellValue, index) => {
            return cellValue ? this.$options.filters.demicrometer(cellValue) : '--';
          }
          // width: 160
        }, {
          label: 'Disbursement Amount',
          prop: 'disburseAmount',
          formatter: (row, column, cellValue, index) => {
            return cellValue ? this.$options.filters.demicrometer(cellValue) : '--';
          }
        }]
      },
      defaultTableColumn: [{
        label: 'SN',
        prop: 'rowNum',
        width: 60
      }, {
        label: 'Holders Address',
        prop: 'address'
      }, {
        label: 'Holders Qty',
        prop: 'holderQty',
        formatter: (row, column, cellValue, index) => {
          return cellValue ? this.$options.filters.demicrometer(cellValue) : '--';
        }
        // width: 160
      }, {
        label: 'Disbursement Amount',
        prop: 'disburseAmount',
        formatter: (row, column, cellValue, index) => {
          return cellValue ? this.$options.filters.demicrometer(cellValue) : '--';
        }
        // width: 180
      }],
      tableData: []
    };
  },
  components: {
    // 'common-table': CommonTable,
    // 'common-dialog': CommonDialog
  },
  watch: {
    'visible' (val) {
      if (!val) return;

      this.getDetail();
    }
  },
  methods: {
    handleChangePage (page) {
      this.params.page = page;
      this.getDetail();
    },
    // get batch detail list
    getDetail () {
      const { page, limit } = this.params;
      this.loading = true;
      let url = distributeBatchDetailList;
      if (this.type === 'redemption') {
        url = redeemBatchDetailList;
      }
      url({
        data: {
          page, limit, batchNo: this.row.batchNo
        },
        notify: notify.error
      }).then(res => {
        const { code, data } = res.data;
        this.loading = false;

        if (code === '1000') {
          this.tableData = data.data || [];
          this.pageTotal = data.count;
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
    .el-pagination {
      float: right;
      margin: 30px -8px;
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
      background-color: #F9FBFF
    }
    .el-table--border {
      td, th {
        border-right: none;
      }
    }
  }
</style>
