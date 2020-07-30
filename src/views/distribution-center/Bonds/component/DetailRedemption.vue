<template>
  <div class="detail-snapshot-records">
   <element-table
     pager
     :columns="columns"
     v-bind="$attrs"
     v-on="$listeners"
    >
      <template v-slot:edit="{row, prop}">
        <a class="link-txt" @click="handleView(row)">Details</a>
        <!-- <el-button class="view-btn" @click="handleView(row)">View</el-button> -->
        <!-- <a :href="browserUrltxId(row['txId'])" target="_blank" class="link-txt">Details</a> -->
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
    <detail-dialog :visible.sync="detailDialogVisible" :row="currentRow" type="redemption" />
  </div>
</template>

<script>
import { calculateHistoryStatusEnum as statusEnum } from '@/common/enums.js';
import mixins from '@/plugin/mixin.js';

export default {
  name: 'DetailRedemption',
  mixins: [mixins],
  inheritAttrs: false,
  data () {
    return {
      currentRow: {},
      detailDialogVisible: false,
      columns: [{
        label: 'Security Code',
        prop: 'code'
        // formatter: (row, column, cellValue, index) => {
        //   return this.$route.query.code;
        // }
      },
      {
        label: 'Quantity',
        prop: 'quantity',
        formatter: (row, column, cellValue, index) => {
          return this.$options.filters.demicrometer(cellValue);
        }
      }, {
        label: 'Disburse Code',
        width: 200,
        prop: 'disburseCode'
      }, {
        label: 'Disburse Amnt',
        prop: 'disburseAmount',
        formatter: (row, column, cellValue, index) => {
          return this.$options.filters.demicrometer(cellValue);
        }
      }, {
        label: 'Status',
        prop: 'statusDesc',
        isSlot: true
      }, {
        label: 'Timestamp',
        prop: 'timestamp',
        formatter: (row, column, cellValue, index) => {
          return this.$options.filters.dateFormat(cellValue);
        }
      }, {
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
      const { serialNo } = this.$route.query;
      this.$router.push({
        name: 'BondsRedemptionDetail',
        query: {
          serialNo,
          securityCode: row.code
        }
      });
      // this.currentRow = row || {};
      // this.detailDialogVisible = true;
    }
  }
};
</script>
