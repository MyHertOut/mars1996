<template>
  <div class="detail-snapshot-records">
   <element-table
     pager
     :columns="columns"
     v-bind="$attrs"
     v-on="$listeners"
    >
      <template v-slot:edit="{row, prop}">
        <a :href="browserUrltxId(row['txId'])" target="_blank" class="link-txt">Details</a>
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
  </div>
</template>

<script>
import { calculateHistoryStatusEnum as statusEnum } from '@/common/enums.js';
import mixins from '@/plugin/mixin.js';

export default {
  name: 'DetailSnapshotRecords',
  mixins: [mixins],
  inheritAttrs: false,
  data () {
    return {
      columns: [{
        label: 'Timestamp',
        prop: 'snapshotTime',
        // width: 170,
        formatter: (row, column, cellValue, index) => {
          return this.$options.filters.dateFormat(cellValue, 'YYYY-MM-DD HH:mm');
        }
      }, {
        label: 'Type',
        prop: 'typeDesc'
      }, {
        label: 'Asset Code',
        prop: 'assetCode'
      }, {
        label: 'Snapshot Quantity',
        prop: 'holdQuantity',
        formatter: (row, column, cellValue, index) => {
          return this.$options.filters.demicrometer(cellValue);
        }
      }, {
        label: 'Status',
        prop: 'statusDesc',
        isSlot: true
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
  methods: {
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
    }
  }
};
</script>
