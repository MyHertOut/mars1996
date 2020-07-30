<template>
  <div class="detail-snapshot-records">
   <element-table
     pager
     :columns="columns"
     v-bind="$attrs"
     v-on="$listeners"
    >
      <template v-slot:edit="{ row }">
        <a class="link-txt" @click="handleView(row)">Details</a>
        <!-- <el-button class="view-btn" @click="handleView(row)">Detail</el-button> -->
        <!-- <el-button class="view-btn" @click="handleView(row)">View</el-button> -->
      </template>
      <template v-slot:batchTxId="{ row }">
        <a class="link-txt" :href="browserUrltxId(row['batchTxId'])" target="_blank">
          {{ row['batchTxId'] }}
        </a>
      </template>
   </element-table>
  <detail-dialog :visible.sync="detailDialogVisible" :row="currentRow" />
  </div>
</template>

<script>
import { detailDisburseData } from '@/api/distribution-center.js';
import { calculateHistoryStatusEnum as statusEnum, pageTypeEnum } from '@/common/enums.js';
import mixins from '@/plugin/mixin.js';

export default {
  name: 'DetailCouponPayment',
  mixins: [mixins],
  inheritAttrs: false,
  props: {
    pageType: String
  },
  data () {
    return {
      detailDialogVisible: false,
      currentRow: {},
      totalPeriod: '',
      columns: [{
        label: 'Disbursement Code',
        prop: 'disburseCode',
        formatter: (row, column, cellValue, index) => {
          return cellValue ? `Total ${this.$options.filters.demicrometer(cellValue)}` : '--';
        }
      },
      {
        label: 'Quantity',
        prop: 'quantity',
        formatter: (row, column, cellValue, index) => {
          return cellValue ? `Total ${this.$options.filters.demicrometer(cellValue)}` : '--';
        }
      }, {
        label: 'Periods',
        width: 200,
        prop: 'period',
        formatter: (row, column, cellValue, index) => {
          return cellValue ? `${this.$options.filters.demicrometer(cellValue)}/${this.totalPeriod}` : '--';
        }
      }, {
        label: 'Status',
        prop: 'statusDesc'
      },
      {
        label: 'Timestamp',
        prop: 'timestamp',
        formatter: (row, column, cellValue, index) => {
          return this.$options.filters.dateFormat(cellValue);
        }
      },
      {
        label: 'Operation',
        prop: 'edit',
        isSlot: true
      }]
    };
  },
  watch: {
  },
  computed: {
    statusEnum () {
      return statusEnum;
    }
  },
  components: {
    'detail-dialog': () => import('@/components/DisbursementDetailDialog.vue')
  },
  methods: {
    handleView (row) {
      const { code, serialNo } = this.$route.query;
      this.$router.push({
        name: 'BondsPaymentDisbusementDetail',
        query: {
          code,
          serialNo,
          period: row.period,
          snapshotNo: row.snapshotNo
        }
      });
      // this.currentRow = row || {};
      // this.detailDialogVisible = true;
    },
    getDisburseDataCount () {
      detailDisburseData({
        data: {
          code: this.$route.query.code
        }
      }).then(res => {
        const { code, data } = res.data;
        if (code === '1000') {
          this.totalPeriod = data.totalPeriod === undefined ? '' : data.totalPeriod;
        }
      });
    }
    // stateColor (state) {
    //   let color;
    //   switch (state) {
    //     case statusEnum.INIT:
    //     case statusEnum.CALCULATING:
    //       color = 'padding';
    //       break;
    //     case statusEnum.FAILED:
    //       color = 'rejected';
    //       break;
    //     case statusEnum.SUCCESS:
    //       color = 'success';
    //       break;
    //   }
    //   return color;
    // }
  },
  created () {
    // abs详情Coupon Payments列表，没有期数
    if (this.pageType === pageTypeEnum.asset) {
      this.columns = this.columns.filter(x => x.prop !== 'period');
      return;
    };
    // 获取总期数
    this.getDisburseDataCount();
  }
};
</script>
