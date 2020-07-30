<template>
  <div class="detail-snapshot-records">
   <element-table
     pager
     :columns="columns"
     v-bind="$attrs"
     v-on="$listeners"
    >
      <template v-slot:edit="{row, prop}">
        <!-- processing no display -->
        <a v-if="row['status'] != 0" :href="browserUrltxId(row['txId'])" target="_blank" class="link-txt">Details</a>
      </template>
      <template v-slot:status="{row, prop}">
        <div class="status-text">
          <span :class="stateColor(row['status'])">{{row['statusDesc']}}</span>
          <!-- <el-popover
            v-if="row[prop] === 2"
            placement="top-start"
            trigger="hover"
            :content="row['remark']"
          >
            <span class="list-icon icon-question" slot="reference">?</span>
          </el-popover> -->
        </div>
      </template>
   </element-table>
  </div>
</template>

<script>
import {
  additionalIssueTypeEnum
} from '@/common/enums.js';
import mixins from '@/plugin/mixin.js';

export default {
  name: 'DetailIssuanceRecords',
  mixins: [mixins],
  inheritAttrs: false,
  props: {
    opType: {
      type: String,
      default: additionalIssueTypeEnum.SECURITY // 0:SECURITY, 1:TOKEN
    }
  },
  data () {
    return {
      columns: [{
        label: 'Security Code',
        prop: 'code'
      }, {
        label: 'Security Name',
        prop: 'name'
      }, {
        label: 'Issuance Qty',
        prop: 'issuanceQty',
        formatter: (row, column, cellValue, index) => {
          return this.$options.filters.demicrometer(cellValue);
        }
      }, {
        label: 'Issuance Type',
        prop: 'issuanceType'
      }, {
        label: 'Status',
        prop: 'status',
        isSlot: true
      }, {
        label: 'Timestamp',
        prop: 'timestamp',
        // width: 170,
        formatter: (row, column, cellValue, index) => {
          return this.$options.filters.dateFormat(cellValue, 'YYYY-MM-DD HH:mm');
        }
      }, {
        label: 'Operation',
        prop: 'edit',
        isSlot: true
      }]
    };
  },
  computed: {
    issueTypeEnum () {
      return additionalIssueTypeEnum;
    }
  },
  methods: {
    stateColor (state) {
      let color;
      switch (state) {
        case 0:
          color = 'padding';
          break;
        case 2:
          color = 'rejected';
          break;
        case 1:
          color = 'success';
          break;
      }
      return color;
    }
  },
  created () {
    if (this.opType === this.issueTypeEnum.TOKEN) {
      this.columns = [{
        label: 'Token Code',
        prop: 'code'
      }, {
        label: 'Token Name',
        prop: 'name'
      }, {
        label: 'Issuance Qty',
        prop: 'issuanceQty',
        formatter: (row, column, cellValue, index) => {
          return this.$options.filters.demicrometer(cellValue);
        }
      }, {
        label: 'Issuance Type',
        prop: 'issuanceType'
      }, {
        label: 'Status',
        prop: 'status',
        isSlot: true
      }, {
        label: 'Timestamp',
        prop: 'timestamp',
        // width: 170,
        formatter: (row, column, cellValue, index) => {
          return this.$options.filters.dateFormat(cellValue, 'YYYY-MM-DD HH:mm');
        }
      }, {
        label: 'Operation',
        prop: 'edit',
        isSlot: true
      }];
    }
  }
};
</script>
