<template>
  <div class="trade-history" v-loading="loading">
    <bread-crumbs :data="breadData"></bread-crumbs>
    <div class="main-container">
      <div class="title">Trade History</div>
      <search-bar keyWordPlaceholder="Counterparty Address / Security Code" :nosort="true" @handleKeyWord="handleKeyWord">
        <el-select v-model="searchParams.bizStatus" placeholder="All Status" slot="append">
          <el-option label="All Status" :value="''"></el-option>
          <el-option v-for="(item, key) in statusList" :key="key" :label="item" :value="key + 1"></el-option>
        </el-select>
      </search-bar>
      <div class="table">
        <el-table :data="tableData" style="width: 100%">
          <template v-for="(v, k) in tableColumn">
            <el-table-column :prop="v.prop" :label="v.label" :width="v.width" :key="k" v-if="v.prop === 'tradePeriod'">
              <template slot-scope="scope">
                <span>{{formatTime(scope.row.orderStartTime)}} ~ {{formatTime(scope.row.orderEndTime)}}</span>
              </template>
            </el-table-column>
            <el-table-column :prop="v.prop" :label="v.label" :width="v.width" :key="k" v-else-if="v.prop === 'createTime'">
              <template slot-scope="scope">
                <span>{{formatTime(scope.row.createTime)}}</span>
              </template>
            </el-table-column>
            <el-table-column :prop="v.prop" :label="v.label" :width="v.width" :key="k" v-else-if="v.prop === 'tokenCode'">
              <template slot-scope="scope">
                <span>{{formatNumber(scope.row.quantity)}} {{scope.row.tokenCode}}</span>
              </template>
            </el-table-column>
            <el-table-column :prop="v.prop" :label="v.label" :width="v.width" :key="k" v-else-if="v.prop === 'payAmount'">
              <template slot-scope="scope">
                <span v-if="scope.row.paymentType === 2">{{formatNumber(scope.row.payAmount) | demicrometer}} {{scope.row.currency}}</span>
                <span v-if="scope.row.paymentType === 1">{{formatNumber(scope.row.payAmount) | demicrometer}} {{scope.row.tokenMark}}</span>
              </template>
            </el-table-column>
            <el-table-column :prop="v.prop" :label="v.label" :width="v.width" :key="k" v-else-if="v.prop === 'chainStatusDesc'">
              <template slot-scope="scope">
                <span :class="{'success': scope.row.chainStatus === 2, 'progress': scope.row.chainStatus === 1, 'failed': scope.row.chainStatus === 3}">
                  {{scope.row.chainStatusDesc}}
                </span>
              </template>
            </el-table-column>
            <el-table-column :prop="v.prop" :label="v.label" :width="v.width" :key="k" v-else-if="v.prop === 'operation'">
              <template slot-scope="scope">
                <span class="show-detail" @click="goDetail(scope.row)" v-if="scope.row.chainStatus !== 1">Detail</span>
              </template>
            </el-table-column>
            <el-table-column :prop="v.prop" :label="v.label" :width="v.width" :key="k" v-else :showOverflowTooltip="v.showOverflowTooltip">
            </el-table-column>
          </template>
        </el-table>
        <el-pagination background layout="prev, pager, next" :total="totalPage" v-if="totalPage > pageObj.limit"
          :page-size="pageObj.limit" :current-page="pageObj.page" @current-change="changPage">
        </el-pagination>
      </div>
    </div>
  </div>
</template>
<script>
import SearchBar from '@/components/SearchBar.vue';
import { tradeHistory } from '@/api';
import { notify, formatDate, LOCAL_STORAGE_SYSTEM } from '@/common/util';

export default {
  name: 'TradeHistory',
  data () {
    return {
      breadData: [
        {
          name: 'Trade Centre'
        }, {
          name: 'Bonds',
          to: '/bond-trading'
        }, {
          name: 'Trade History'
        }
      ],
      searchParams: {
        keyword: '',
        bizStatus: ''
      },
      statusList: ['PROCESSING', 'SUCCESS', 'FAILED'],
      tableColumn: [
        {
          label: 'Security Qty',
          prop: 'tokenCode',
          width: 160
        }, {
          label: 'Payment Type',
          prop: 'paymentTypeDesc'
        }, {
          label: 'Notional Amount',
          prop: 'payAmount',
          width: 120
        }, {
          label: 'Counter- Party Address',
          prop: 'bidAddress',
          width: 160,
          showOverflowTooltip: true
        }, {
          label: 'Trade Period',
          prop: 'tradePeriod',
          width: 280
        }, {
          label: 'Status',
          prop: 'chainStatusDesc'
        }, {
          label: 'Create Timestamp',
          prop: 'createTime',
          width: 140
        }, {
          label: 'Operation',
          prop: 'operation'
        }
      ],
      tableData: [],
      paramsObj: {
        chainStatus: '',
        keyword: ''
      },
      pageObj: {
        limit: 10,
        page: 1
      },
      loading: false,
      totalPage: 0
    };
  },
  created () {
    this.getList();
  },
  watch: {
    'searchParams.bizStatus': function (n, o) {
      this.paramsObj.chainStatus = n;
      this.getList();
    }
  },
  methods: {
    goDetail (item) {
      let url = localStorage.getItem(LOCAL_STORAGE_SYSTEM);
      if (url) {
        window.open(JSON.parse(url).blockBrowserUrl + `#/txidDetails?id=${item.txId}`, '_blank');
      }
    },
    formatNumber (num) {
      return parseFloat(num);
    },
    formatTime (time) {
      return formatDate(time);
    },
    changPage (page) {
      this.pageObj.page = page;
      this.getList();
    },
    async getList () {
      this.loading = true;
      const data = await tradeHistory({
        data: {
          ...this.paramsObj,
          ...this.pageObj
        },
        slient: true,
        notify: notify.error
      });
      this.loading = false;
      this.totalPage = data.data.count;
      if (data.data.data) {
        this.tableData = data.data.data;
      } else {
        this.tableData = [];
      }
    },
    handleKeyWord (str) {
      this.searchParams.keyword = str;
      this.getList();
    }
  },
  components: {
    'search-bar': SearchBar
  }
};
</script>
<style scoped lang="scss">
.trade-history {
  .main-container {
    padding: 40px 0;
    .title {
      font-size: 24px;
      color: #001F3B;
      margin-bottom: 40px;
      padding: 0 30px;
    }
    .search-bar {
      padding: 0 30px;
    }
    .table {
      margin-top: 30px;
      padding: 0 5px;
      .show-detail {
        cursor: pointer;
        color: #497eb9;
        &:hover {
          color: #4a87cb;
          text-decoration: underline;
        }
      }
      .progress {
        color: #FF9A00;
      }
      .success {
        color: #52B88F;
      }
      .failed {
        color: #E6471F;
      }
    }
  }
}
</style>
<style lang="scss">
.trade-history {
  .main-container {
    .el-table__header {
      th {
        padding: 11px 0;
        color: #8D93A1;
      }
    }
    .el-table__body {
      td {
        padding: 21px 0;
        color: #575E6E;
      }
    }
    .el-pagination {
      margin-right: 30px !important;
    }
  }
}
</style>
