<template>
  <div class="issuance-history">
    <bread-crumbs :data="breadData"></bread-crumbs>
    <div class="main-container" v-loading="loading">
      <h3 class="page-subtitle">Issuance History</h3>
      <search-bar :nosort="true" @handleKeyWord="handleKeyWord">
        <template v-slot:append>
          <el-select
            v-model="searchParams.assetType"
            placeholder="All Assets Type"
            @change="getList"
          >
            <el-option
              v-for="item in selectAssetsType"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>
          <el-select clearable v-model="searchParams.issuanceType" @change="getList" placeholder="All Issuance Type">
            <el-option
              v-for="item in selectIssuanceType"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>
          <el-select clearable v-model="searchParams.status" @change="getList" placeholder="All Status">
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
          <a v-if="row['status'] !== 0" :href="browserUrltxId(row['txId'])" target="_blank" class="link-txt">Details</a>
        </template>
        <template v-slot:statusDesc="{row, prop}">
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
  </div>
</template>
<script>
import {
  assetIssuanceHistory
} from '@api/distribution-center.js';
import SearchBar from '@components/SearchBar.vue';
import mixins from '@/plugin/mixin.js';
import { formatDate, notify } from '@/common/util.js';

const headKey = {
  bonds: 0,
  asset: 1,
  currency: 2
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
        assetType: headKey[this.$route.query.type] || 0,
        status: '',
        issuanceType: '',
        keyword: ''
      },
      breadData: [{
        name: 'Issuance Centre',
        to: '/issuance/bonds'
      }, {
        name: 'Issuance History'
      }],
      selectAssetsType: [{
        label: 'Bond',
        value: 0
      }, {
        label: 'ABS',
        value: 1
      }, {
        label: 'Currency',
        value: 2
      }],
      selectIssuanceType: [{
        label: 'Additional',
        value: 1
      }, {
        label: 'Issuance',
        value: 0
      }],
      selectStatus: [{
        label: 'Processing',
        value: 0
      }, {
        label: 'Success',
        value: 1
      }, {
        label: 'Failed',
        value: 2
      }],
      columns: [{
        label: 'Asset Code',
        prop: 'code'
      },
      {
        label: 'Asset Name',
        prop: 'name'
      },
      {
        label: 'Asset Type',
        prop: 'assetType'
      },
      // {
      //   label: 'Subtype',
      //   prop: 'assetSubType'
      // },
      {
        label: 'Issuance Quantity',
        prop: 'issuanceSize',
        formatter: (row, column, cellValue, index) => {
          return this.$options.filters.demicrometer(cellValue);
        }
      }, {
        label: 'Issuance Type',
        prop: 'issuanceType'
      }, {
        label: 'Status',
        prop: 'statusDesc',
        width: 100,
        isSlot: true
      }, {
        label: 'Create Timestamp',
        prop: 'timestamp',
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
    },
    getList () {
      this.loading = true;

      assetIssuanceHistory({
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
    margin-bottom: 30px;
    .el-select {
      width: 170px;
    }
  }
  .page-subtitle {
    margin-bottom: 40px;
  }
}
</style>
