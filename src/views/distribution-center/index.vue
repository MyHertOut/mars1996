<template>
  <div class="distribute-bonds">
    <simplesub-header :active="currentView" :menus="subMenus">
      <template v-slot:btns>
        <el-button
          plain
          v-permissions="'issuanceCentre.history.list'"
          @click="$router.push({ name: 'DisIssueBondsIssuanceHistory', query: { type: currentView } })"
        >History</el-button>
        <el-dropdown class="dropdown-publish">
          <el-button v-permissions="'issuanceCentre.issuance.title'" type="primary" class="btn-light">
            Issuance
            <i class="el-icon-arrow-down el-icon--right"></i>
          </el-button>
          <el-dropdown-menu slot="dropdown">
            <el-dropdown-item>
              <router-link to="/issue/bonds/parameters" v-permissions="'issuanceCentre.bonds.create'">Create Bonds</router-link>
            </el-dropdown-item>
            <el-dropdown-item>
              <router-link to="/issue/abs/parameters" v-permissions="'issuanceCentre.bonds.create'">Create ABS</router-link>
            </el-dropdown-item>
            <el-dropdown-item>
              <router-link to="/issue/newToken" v-permissions="'issuanceCentre.currencies.create'">Create currencies</router-link>
            </el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>
      </template>
    </simplesub-header>
    <div class="main-container" v-loading="loading">
      <search-bar
        ref="searchBar"
        :selectedField="selectedField"
        :keyWordPlaceholder="currentView === 'currency' ? 'Enter Token Code / Name' : 'Enter Security Code / Name'"
        :sortFields="sortFields"
        @handleSortFieldClick="handleSortFieldClick"
        @handleKeyWord="handleKeyWord"
      ></search-bar>
      <custom-table
        headTitleProp="name"
        rowKey="serialNo"
        :columns="columns"
        :datas="tableData"
        :page="searchParams.page"
        :total="pageTotal"
        @handleRowClick="handleRowClick"
        @handleChangePage="handleChangePage"
      >
        <template v-slot:couponRate="{ prop, row }">
          <span style="color: #e6471f;" v-if="row[prop]">{{ parseFloat(row.couponRate) }} %</span>
        </template>
      </custom-table>
      <!-- <component v-loading="loading" :is="currentView" :data="tableData"></component> -->
    </div>
  </div>
</template>

<script>
import SearchBar from '@components/SearchBar.vue';
import CustomTable from '@components/CustomTable.vue';
import SimpleSubHeader from '@components/SimpleSubHeader.vue';
import { formatDate, notify } from '@/common/util.js';
import { assetSecurityList, assetTokenList, assetAbsList } from '@api/distribution-center.js';

// bonds列表：排序字段，0. 发行时间， 1. 到期时间， 2. 回购时间， 3. 发行数量， null. 发行时间
const sortFieldObj = {
  'time': 0,
  'maturity': 1,
  'redemption': 2,
  'quantity': 3
};
// abs列表/currency列表：排序字段，0. 发行时间， 1.发行数量
const currencySortFieldObj = {
  'time': 0,
  'quantity': 1
};
const subHeadMenuEnum = {
  bonds: 'bonds',
  asset: 'asset',
  currency: 'currency'
};
// 默认（bonds）排序字段
const defaultSortFields = [{
  field: 'time',
  name: 'Issuance Time'
}, {
  field: 'quantity',
  name: 'Issuance Quantity'
}, {
  field: 'maturity',
  name: 'Maturity Date'
}, {
  field: 'redemption',
  name: 'Redemption Date'
}];
export default {
  name: 'DistributeIndex',
  data () {
    return {
      loading: false,
      tableData: [],
      currentView: this.$route.meta.current || 'bonds',
      selectedField: 'time',
      pageTotal: 0,
      searchParams: {
        page: 1,
        keyword: '',
        // 排序字段，0. 发行时间， 1. 到期时间， 2. 回购时间， 3. 发行数量， null. 发行时间
        columnName: 0,
        direction: 'asc'
      },
      // 排序字段数组
      sortFields: [...defaultSortFields],
      // 二级头部菜单数组
      subMenus: [{
        name: 'Bonds',
        key: 'bonds',
        permissions: 'issuanceCentre.bonds.list',
        to: {
          path: '/issuance/bonds'
        }
      },
      {
        name: 'Asset-Backed',
        key: 'asset',
        permissions: 'issuanceCentre.bonds.list',
        to: {
          path: '/issuance/asset'
        }
      },
      {
        name: 'Currencies',
        key: 'currency',
        permissions: 'issuanceCentre.currencies.list',
        to: {
          path: '/issuance/currency'
        }
      }],
      defaultColumns: [{
        label: 'Security Code',
        prop: 'code'
      }, {
        label: 'Coupon Period', // 期数
        prop: 'couponPeriods'
      }, {
        label: 'Issuance Time', // '发行时间',
        prop: 'createAt',
        formatter: (row, cellValue) => {
          return cellValue ? formatDate(cellValue) : '--';
        }
      }, {
        label: 'Issuance Quantity', // 发行数量
        prop: 'totalIssuanceQuantity',
        formatter: (row, cellValue) => {
          return cellValue ? this.$options.filters.demicrometer(cellValue) : '--';
        }
      }, {
        label: 'Coupon Frequency', // 付息频率
        prop: 'couponFrequency'
      },
      {
        label: 'Maturity Date', // 到期时间
        prop: 'maturityDate',
        formatter: (row, cellValue) => {
          return cellValue ? formatDate(cellValue) : '--';
        }
      },
      {
        label: 'Annual Coupon Rate', // 年化利率
        prop: 'couponRate',
        slot: true
      }, {
        label: 'Disbursement Token', // 付息/回购币种
        prop: 'disbursementCode'
      }, {
        label: 'Redemption Date', // 回购时间
        prop: 'redemptionDate',
        formatter: (row, cellValue) => {
          return cellValue ? formatDate(cellValue) : '--';
        }
      }]
      // // 表格列
      // columns: [...this.defaultColumns]
    };
  },
  components: {
    'simplesub-header': SimpleSubHeader,
    'search-bar': SearchBar,
    'custom-table': CustomTable
  },
  computed: {
  },
  methods: {
    // 二级头部点击
    // handleSubHeaderClick (menu) {
    //   this.currentView = menu.key;
    //   this.searchParams.page = 1;
    //   this.setListOptions(); // 根据当前二级类别更改当前列名、排序字段
    //   this.selectedField = 'time';
    //   this.$refs.searchBar.resertData();
    //   this.getList();
    // },
    // 关键字搜索
    handleKeyWord (keyword) {
      this.searchParams.keyword = keyword;
      this.getList();
    },
    // 字段排序
    handleSortFieldClick (item, direction, index) {
      let sortVal = sortFieldObj[item.field];
      if (this.currentView !== 'bonds') {
        sortVal = currencySortFieldObj[item.field];
      }
      this.searchParams.columnName = sortVal;
      this.searchParams.direction = direction;
      this.getList();
    },
    // 分页-翻页
    handleChangePage (page) {
      this.searchParams.page = page;
      this.getList();
    },
    // 点击每行
    handleRowClick (row) {
      this.$router.push({
        path: `/issuance/${this.currentView}/detail`,
        query: {
          serialNo: row.serialNo,
          code: row.code
        }
      });
    },
    // 不同二级头部的不同表格列名
    setListOptions () {
      // List of Digital currencies columns
      const currencyColumns = [{
        label: 'Token Code',
        prop: 'code'
      }, {
        label: 'Token Type',
        prop: 'tokenType'
      }, {
        label: 'Issuance Quantity', // 发行数量
        prop: 'issuanceQuantity',
        formatter: (row, cellValue) => {
          return cellValue ? this.$options.filters.demicrometer(cellValue) : '--';
        }
      }, {
        label: 'Token Name',
        prop: 'name'
      }, {
        label: 'Currency',
        prop: 'currency'
      }, {
        label: 'Issuance Time', // '发行时间',
        prop: 'issuanceTime',
        formatter: (row, cellValue) => {
          return cellValue ? formatDate(cellValue) : '--';
        }
      }];
      const currencySortField = [{
        field: 'time',
        name: 'Issuance Time'
      }, {
        field: 'quantity',
        name: 'Issuance Quantity'
      }];
      // List of Asset-Backed columns
      const assetColumns = [{
        label: 'Security Code',
        prop: 'code'
      }, {
        label: 'Currency',
        prop: 'currency'
      }, {
        label: 'Issuance Time', // '发行时间',
        prop: 'createAt',
        formatter: (row, cellValue) => {
          return cellValue ? formatDate(cellValue) : '--';
        }
      }, {
        label: 'Issuance Quantity', // 发行数量
        prop: 'issuanceQuantity',
        formatter: (row, cellValue) => {
          return cellValue ? this.$options.filters.demicrometer(cellValue) : '--';
        }
      }, {
        label: 'Par value per token',
        prop: 'parValuePerToken',
        formatter: (row, cellValue) => {
          return cellValue ? this.$options.filters.demicrometer(cellValue) : '--';
        }
      },
      {
        label: 'First Settlement Date',
        prop: 'firstSettlementDate',
        formatter: (row, cellValue) => {
          return cellValue ? formatDate(cellValue) : '--';
        }
      },
      {
        label: 'Coupon Frequency',
        prop: 'couponFrequency'
      }, {
        label: 'Disbursement Token',
        prop: 'disbursementToken'
      }];
      const columnsObj = {
        [subHeadMenuEnum.bonds]: {
          column: [...this.defaultColumns],
          sortField: [...defaultSortFields]
        },
        [subHeadMenuEnum.asset]: {
          column: assetColumns,
          sortField: [...currencySortField]
        },
        [subHeadMenuEnum.currency]: {
          column: currencyColumns,
          sortField: currencySortField
        }
      };
      const currentCategory = columnsObj[this.currentView] || {};
      this.columns = currentCategory.column;
      this.sortFields = currentCategory.sortField;
    },
    // get list
    getList () {
      const urlObj = {
        [subHeadMenuEnum.bonds]: assetSecurityList,
        [subHeadMenuEnum.asset]: assetAbsList,
        [subHeadMenuEnum.currency]: assetTokenList
      };
      if (!urlObj[this.currentView]) return;

      this.loading = true;
      urlObj[this.currentView]({
        data: this.searchParams,
        notify: notify.error
      }).then(res => {
        this.loading = false;
        const { code, data } = res.data;
        if (code === '1000') {
          this.tableData = data.data || [];
          this.pageTotal = data.count || 0;
        }
      }).catch(() => {
        this.loading = false;
      });
    }
  },
  created () {
    // this.columns = [...this.defaultColumns];
    this.setListOptions();
    this.getList();
  }
};
</script>
