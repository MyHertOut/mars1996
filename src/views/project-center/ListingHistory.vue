<template>
  <div class="issuance-history">
    <bread-crumbs :data="breadData"></bread-crumbs>
    <div class="main-container" v-loading="loading">
      <h3 class="page-subtitle">Listing History</h3>
      <search-bar :nosort="true" keyWordPlaceholder="Enter Asset Code / Name" @handleKeyWord="handleKeyWord">
        <template v-slot:append>
          <el-select
            v-model="searchParams.tokenType"
            placeholder="All Assets Type"
            @change="getList"
          >
            <el-option
              v-for="item in selectTokenType"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>
          <el-select clearable v-model="searchParams.chainStatus" @change="getList" placeholder="All Status">
            <el-option
              v-for="item in selectStatus"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>
        </template>
      </search-bar>
      <element-table
        pager
        :data="tableData"
        :pageTotal="tableCount"
        :columns="columns"
        @handleChangePage="handleChangePage"
      >
        <template v-slot:edit="{row, prop}">
          <a v-if="row['chainStatus'] != 1" :href="browserUrltxId(row['txId'])" target="_blank" class="link-txt">Details</a>
        </template>
        <template v-slot:chainStatusDesc="{row, prop}">
          <div class="status-text">
            <span :class="stateColor(row['chainStatus'])">{{row['chainStatusDesc']}}</span>
            <el-popover
              v-if="row[prop] === 2"
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
  </div>
</template>
<script>
// import {
//   assetIssuanceHistory
// } from '@api/distribution-center.js';
import {
  tradeOrderListOfferOrder
} from '@api/project-center.js';
import SearchBar from '@components/SearchBar.vue';
import mixins from '@/plugin/mixin.js';
import { formatDate, notify } from '@/common/util.js';
// import { ListOrderTableStatusEnum as statusEnum } from '@/common/enums.js';

const statusEnum = {
  PROCESSING: 1,
  SUCCESS: 2,
  FAILED: 3
};
const tokenTypeEnum = {
  bond: 0,
  asset: 2
};
export default {
  mixins: [mixins],
  data () {
    return {
      loading: false,
      tableData: [],
      tableCount: 0,
      pageIndex: 1,
      searchParams: {
        chainStatus: '',
        tokenType: tokenTypeEnum[this.$route.query.type] || 0,
        // assetType: headKey[this.$route.query.type] || 0,
        // status: '',
        keyword: ''
      },
      breadData: [{
        name: 'Listing Centre',
        to: '/listing/bonds'
      }, {
        name: 'Listing History'
      }],
      selectStatus: [{
        label: 'Processing',
        value: statusEnum.PROCESSING
      }, {
        label: 'Success',
        value: statusEnum.SUCCESS
      }, {
        label: 'Failed',
        value: statusEnum.FAILED
      }],
      columns: [{
        label: 'Security Code',
        prop: 'tokenCode'
      },
      {
        label: 'Project Name',
        prop: 'orderName'
      },
      {
        label: 'Security Name',
        prop: 'tokenName'
      }, {
        label: 'Security Type',
        prop: 'tokenTypeDesc'
      }, {
        label: 'Subscription Quantity',
        prop: 'quantity',
        formatter: (row, column, cellValue, index) => {
          return this.$options.filters.demicrometer(cellValue);
        }
      }, {
        label: 'Status',
        prop: 'chainStatusDesc',
        width: 100,
        isSlot: true
      }, {
        label: 'Create Timestamp',
        prop: 'createTime',
        formatter: (row, column, cellValue, index) => {
          return cellValue ? formatDate(cellValue) : '--';
        }
      }, {
        label: 'Operation',
        prop: 'edit',
        width: 100,
        isSlot: true
      }]
    };
  },
  computed: {
    selectTokenType () {
      return [{
        label: 'Bond',
        value: 0
      }, {
        label: 'ABS',
        value: 2
      }];
    }
  },
  components: {
    'search-bar': SearchBar
  },
  methods: {
    handleKeyWord (val) {
      this.searchParams.keyword = val;
      this.getList();
    },
    handleChangePage (page) {
      this.pageIndex = page;
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
    getList () {
      this.loading = true;

      tradeOrderListOfferOrder({
        data: {
          ...this.searchParams,
          page: this.pageIndex
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
    }
  },
  created () {
    this.getList();
  }
};
</script>
<style lang="scss" scoped>
.issuance-history {
  .search-bar {
    margin-bottom: 40px;
    .el-select {
      width: 170px;
    }
  }
  .page-subtitle {
    margin-bottom: 48px;
  }
}
</style>
