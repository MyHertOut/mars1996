<template>
  <div class="detail-subscription-records" v-loading="loading">
    <search-bar
      keyWordPlaceholder="Address / Order Number"
      :nosort="true"
      @handleKeyWord="handleKeyWord"
    >
      <template v-slot:append>
        <el-select
          v-model="searchParams.tradeStatus"
          placeholder="All Status"
          @change="getList"
        >
          <el-option
            v-for="item in selectAssetsType"
            :key="item.tradeStatus"
            :label="item.tradeStatusDesc"
            :value="item.tradeStatus"
          ></el-option>
        </el-select>
      </template>
    </search-bar>
    <element-table
      pager
      :columns="columns"
      :data="tableData"
      :pageTotal="tableCount"
      :pageIndex="searchParams.page"
      @handleChangePage="handleChangePage"
    >
      <template v-slot:edit="{row, prop}">
        <a :href="browserUrltxId(row['txId'])" target="_blank" class="link-txt">Details</a>
      </template>
      <template v-slot:statusDesc="{row, prop}">
        <div class="status-text">
          <span :class="stateColor(row['bizStatus'])">{{row['statusDesc']}}</span>
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
  </div>
</template>
<script>
import SearchBar from '@components/SearchBar.vue';
import { getTradeOrderBidTradeStatus } from '@/api/project-center.js';
// import { calculateHistoryStatusEnum as statusEnum } from '@/common/enums.js';
import mixins from '@/plugin/mixin.js';
import { pageTypeEnum } from '@/common/enums.js';
import { notify } from '@/common/util.js';
import {
  tradeOrderListBidOrder,
  absOrderListBidOrder
} from '@api/project-center.js';

const statusEnum = {
  PROCESSING: 1,
  SUCCESS: 7,
  FAILED: 3
};
export default {
  name: 'DetailSubscriptionRecords',
  mixins: [mixins],
  inheritAttrs: false,
  props: {
    pageType: String
  },
  data () {
    return {
      loading: false,
      tableCount: 0,
      tableData: [],
      searchParams: {
        keyword: '',
        page: 0,
        tradeStatus: ''
      },
      selectAssetsType: [],
      // [{
      //   label: 'In Progress',
      //   value: statusEnum.PROCESSING
      // }, {
      //   label: 'Success',
      //   value: statusEnum.SUCCESS
      // }, {
      //   label: 'Failed',
      //   value: statusEnum.FAILED
      // }],
      columns: [ {
        label: 'Order Number',
        prop: 'orderCode',
        width: 150
      }, {
        label: 'Quantity',
        prop: 'quantity',
        width: 100,
        formatter: (row, column, cellValue, index) => {
          return cellValue ? `${this.$options.filters.demicrometer(cellValue)} ${row.tokenCode || ''}` : '';
        }
      }, {
        label: 'Payment Amount',
        prop: 'payAmount',
        formatter: (row, column, cellValue, index) => {
          return cellValue ? `${this.$options.filters.demicrometer(cellValue)} ${row.currency}` : '';
        }
      }, {
        label: 'Source Address',
        prop: 'userAddress'
      }, {
        label: 'Status',
        prop: 'statusDesc',
        isSlot: true
      }, {
        label: 'Creation Timestamp',
        prop: 'createTime',
        formatter: (row, column, cellValue, index) => {
          return this.$options.filters.dateFormat(cellValue, 'YYYY-MM-DD HH:mm');
        }
      }, {
        label: 'Updated Timestamp',
        prop: 'updateTime',
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
  components: {
    'search-bar': SearchBar
  },
  computed: {
    statusEnum () {
      return statusEnum;
    }
  },
  methods: {
    // 关键字搜索
    handleKeyWord (keyword) {
      this.searchParams.keyword = keyword;
      this.getList();
    },
    stateColor (state) {
      let color;
      switch (state) {
        case statusEnum.PROCESSING:
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
    handleChangePage (page) {
      this.searchParams.page = page;
      this.getList();
    },
    getList () {
      this.loading = true;

      const urlObj = {
        [pageTypeEnum.bonds]: tradeOrderListBidOrder,
        [pageTypeEnum.asset]: absOrderListBidOrder
      };
      urlObj[this.pageType]({
        data: {
          offerOrderNo: this.$route.query.orderNo,
          ...this.searchParams
        },
        notify: notify.error
      }).then(res => {
        this.loading = false;
        const { code, data } = res.data;
        if (code === '1000') {
          this.tableData = data.data || [];
          this.tableCount = data.count || 0;
        }
      }).catch(() => {
        this.loading = false;
      });
    },
    getStatusList () {
      getTradeOrderBidTradeStatus().then(res => {
        const { code, data } = res.data;
        if (code === '1000') {
          this.selectAssetsType = data || [];
        }
      });
    }
  },
  created () {
    this.getList();
    this.getStatusList();
  }
};
</script>
<style lang="scss" scoped>
  .detail-subscription-records {
    .search-bar {
      margin-bottom: 20px;
    }
  }
</style>
