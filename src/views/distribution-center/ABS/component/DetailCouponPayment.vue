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
      </template>
      <template v-slot:batchTxId="{ row }">
        <a class="link-txt" :href="browserUrltxId(row['batchTxId'])" target="_blank">
          {{ row['batchTxId'] }}
        </a>
      </template>
      <template v-slot:statusDesc="{row, prop}">
        <div class="status-text">
          <span :class="stateColor(row['status'])">{{row['statusDesc']}}</span>
          <!-- <el-popover
            v-if="row[prop] === statusEnum.FAILED"
            placement="top-start"
            trigger="hover"
            :content="row['remark']"
          >
            <span class="list-icon icon-question" slot="reference">?</span>
          </el-popover> -->
        </div>
      </template>
   </element-table>
  <detail-dialog :visible.sync="detailDialogVisible" :row="currentRow" />
  </div>
</template>

<script>
import { calculateHistoryStatusEnum as statusEnum } from '@/common/enums.js';
import mixins from '@/plugin/mixin.js';

export default {
  name: 'DetailCouponPayment',
  mixins: [mixins],
  inheritAttrs: false,
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
        prop: 'period'
      }, {
        label: 'Status',
        prop: 'statusDesc',
        isSlot: true
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
    stateColor (state) {
      let color;
      switch (state) {
        // case statusEnum.INIT:
        // case statusEnum.CALCULATING:
        //   color = 'padding';
        //   break;
        // case statusEnum.FAILED:
        //   color = 'rejected';
        //   break;
        case 2:
          color = 'success';
          break;
      }
      return color;
    },
    handleView (row) {
      const { code, serialNo } = this.$route.query;
      this.$router.push({
        name: 'BondsPaymentDisbusementDetail',
        query: {
          code,
          serialNo,
          period: row.period,
          snapshotNo: row.snapshotNo,
          t: 'asset'
        }
      });
    }
  }
};
</script>
