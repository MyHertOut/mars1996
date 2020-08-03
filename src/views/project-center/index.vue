<template>
  <div class="project-bonds">
    <simplesub-header :active="currentView" :menus="subMenus">
      <template v-slot:btns>
        <el-button
          plain
          v-permissions="'listing.center.list'"
          @click="$router.push({ name: 'ProjectIssuanceHistory', query: { type: currentView } })"
        >History</el-button>
        <el-dropdown class="dropdown-publish">
          <el-button type="primary" class="btn-light">
            New Listing<i class="el-icon-arrow-down el-icon--right"></i>
          </el-button>
          <el-dropdown-menu slot="dropdown">
            <el-dropdown-item>
              <router-link to="/listing/bond-listing" v-permissions="'listing.center.create'">Bond Listing</router-link>
            </el-dropdown-item>
            <el-dropdown-item>
              <router-link :to="{ path: '/project/asset-listing' }" v-permissions="'listing.center.abs.create'">ABS Listing</router-link>
            </el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>
      </template>
    </simplesub-header>
    <div class="main-container" v-loading="loading">
      <ul class="category-nav">
        <li :class="item.key === searchParams.bizStatus ? 'active' : ''"
          v-for="item in categoryNavList"
          :key="item.key"
          @click="handleCategoryClick(item.key)"
        >{{item.label}}</li>
      </ul>
      <search-bar
        ref="searchBar"
        keyWordPlaceholder="Asset Code / Asset Name / Project Name"
        :sortFields="sortFields"
        @handleSortFieldClick="handleSortFieldClick"
        @handleKeyWord="handleKeyWord"
      ></search-bar>
      <custom-table
        headTitleProp="orderName"
        rowKey="serialNo"
        :columns="columns"
        :datas="tableData"
        :page="searchParams.page"
        :total="pageTotal"
        @handleRowClick="handleRowClick"
        @handleChangePage="handleChangePage"
      >
        <template v-slot:column-bar="{row}">
           <el-button class="btn-view" @click.stop="$router.push({ path: '/subscriptionOrders', query: { navActive: $route.meta.current === 'asset' ? 1 : 0 } })">View Order</el-button>
        </template>
        <template v-slot:opbar="dataItem">
          <div class="status-text">
            <span :class="stateColor(dataItem['bizStatus'])">{{dataItem['bizStatusDesc']}}</span>
          </div>
        </template>
        <template v-slot:couponRate="{ prop, row }">
          <span style="color: red;" v-if="row[prop]">{{ parseFloat(row[prop]) }} %</span>
        </template>
      </custom-table>
    </div>
  </div>
</template>

<script>
import { formatDate, notify } from '@/common/util.js';
import { pageTypeEnum } from '@/common/enums.js';
import { tradeOrderProjects, absOrderProjects } from '@api/project-center.js';
import SearchBar from '@components/SearchBar.vue';
import SimpleSubHeader from '@/components/SimpleSubHeader.vue';

// 排序字段，0. 发行时间， 1. 到期时间， 2. 回购时间， 3. 发行数量， null. 发行时间
const sortFieldObj = {
  'launch': 1,
  'rate': 2,
  'maturity': 3
};
const defaultSortFields = [{
  field: 'launch',
  name: 'Launch Date'
}, {
  field: 'rate',
  name: 'Annual Coupon Rate'
}
// , {
//   field: 'maturity',
//   name: 'Maturity Date'
// }
];
// const subHeadMenuEnum = {
//   bonds: 'bonds',
//   abs: 'abs',
//   currency: 'currency'
// };
export default {
  data () {
    return {
      loading: false,
      tableData: [],
      currentView: this.$route.meta.current || 'bonds',
      pageTotal: 0,
      searchParams: {
        page: 1,
        keyword: '',
        bizStatus: 1,
        // 排序字段，0. 发行时间， 1. 到期时间， 2. 回购时间， 3. 发行数量， null. 发行时间
        columnName: sortFieldObj.launch,
        direction: 'asc'
      },
      // 排序字段数组
      sortFields: [...defaultSortFields],
      subMenus: [{
        name: 'Bonds',
        key: 'bonds',
        permissions: 'listing.center.projects',
        to: {
          path: '/listing/bonds'
        }
      }, {
        name: 'Asset-Backed',
        key: 'asset',
        permissions: 'listing.center.abs.projects',
        to: {
          path: '/listing/asset'
        }
      }],
      defaultColumns: [{
        label: 'Security Name',
        prop: 'tokenName'
      }, {
        label: 'Annual Coupon Rate', // 期数
        prop: 'couponRate',
        slot: true
      }, {
        label: 'Subscription Period Start', // '发行时间',
        prop: 'orderStartTime',
        formatter: (row, cellValue) => {
          return cellValue ? formatDate(cellValue) : '--';
        }
      }, {
        label: 'Security Code', // 发行数量
        prop: 'tokenCode'
      }, {
        label: 'Subscription Quantity',
        prop: 'quantity',
        formatter: (row, cellValue) => {
          return cellValue ? this.$options.filters.demicrometer(cellValue) : '--';
        }
      },
      {
        label: 'Subscription Period End', // 到期时间
        prop: 'orderEndTime',
        formatter: (row, cellValue) => {
          return cellValue ? formatDate(cellValue) : '--';
        }
      },
      {
        label: 'Maturity Date', // 回购时间
        prop: 'maturityDate',
        formatter: (row, cellValue) => {
          return cellValue ? formatDate(cellValue) : '--';
        }
      },
      {
        label: 'Unit Price', // 年化利率
        prop: 'price',
        formatter: (row, cellValue) => {
          return cellValue ? this.$options.filters.demicrometer(cellValue) + ' ' + row['currency'] : '--';
        }
      }, {
        label: 'Settlement Type', // 付息/回购币种
        prop: 'paymentTypeDesc'
      }],
      categoryNavList: [{
        key: 1,
        label: 'Ongoing'
      }, {
        key: 2,
        label: 'Upcoming'
      }, {
        key: 3,
        label: 'Concluded'
      }]
    };
  },
  components: {
    'simplesub-header': SimpleSubHeader,
    'search-bar': SearchBar
  },
  methods: {
    // 字段排序
    handleSortFieldClick (item, direction, index) {
      this.searchParams.columnName = sortFieldObj[item.field];
      this.searchParams.direction = direction;
      this.getList();
    },
    // 关键字搜索
    handleKeyWord (keyword) {
      this.searchParams.keyword = keyword;
      this.getList();
    },
    // // 二级头部点击
    // handleSubHeaderClick (menu) {
    //   this.currentView = menu.key;
    //   this.setListOptions(); // 根据当前二级类别更改当前列名、排序字段
    //   this.getList();
    // },
    // 分页-翻页
    handleChangePage (page) {
      this.searchParams.page = page;
      this.getList();
    },
    // 点击每行
    handleRowClick (row) {
      const userFunction = this.$store.getters.userInfo.functions;
      if (
        userFunction &&
        !userFunction.filter(v => v.functionCode === 'listing.center.detail')[0]
      ) {
        return;
      }
      this.$router.push({
        path: `/listing/${this.$route.meta.current}/detail`,
        query: {
          serialNo: row.tokenNo,
          code: row.code,
          orderNo: row.orderNo
        }
      });
    },
    stateColor (state) {
      let color;
      // 1 Buy In Progress 2 Upcoming Not started 3 End End of Sale
      switch (state) {
        case 1: // Buy In Progress
          color = 'padding';
          break;
        // case statusEnum.FAILED:
        //   color = 'rejected';
        //   break;
        // case statusEnum.SUCCESS:
        //   color = 'success';
        //   break;
        default:
          color = 'cancelled';
          break;
      }
      return color;
    },
    handleCategoryClick (key) {
      this.$refs.searchBar.resertData();
      this.searchParams = {
        page: 1,
        keyword: '',
        bizStatus: key,
        // 排序字段，0. 发行时间， 1. 到期时间， 2. 回购时间， 3. 发行数量， null. 发行时间
        columnName: sortFieldObj.launch,
        direction: 'asc'
      };
      // this.searchParams.page = 1;
      // this.searchParams.bizStatus = key;
      this.getList();
    },
    // 不同二级头部的不同表格列名
    setListOptions () {
      // List of Asset-Backed columns
      const assetColumns = [{
        label: 'Security Name',
        prop: 'tokenName'
      }, {
        label: 'Subscription Quantity',
        prop: 'quantity',
        formatter: (row, cellValue) => {
          return cellValue ? this.$options.filters.demicrometer(cellValue) : '--';
        }
      }, {
        label: 'Subscription Period Start', // '发行时间',
        prop: 'orderStartTime',
        formatter: (row, cellValue) => {
          return cellValue ? formatDate(cellValue) : '--';
        }
      }, {
        label: 'Security Code', // 发行数量
        prop: 'tokenCode'
      }, {
        label: 'Unit Price', // 年化利率
        prop: 'price',
        formatter: (row, cellValue) => {
          return cellValue ? this.$options.filters.demicrometer(cellValue) + ' ' + row['tokenMark'] : '--';
        }
      },
      {
        label: 'Subscription Period End', // 到期时间
        prop: 'orderEndTime',
        formatter: (row, cellValue) => {
          return cellValue ? formatDate(cellValue) : '--';
        }
      }, {
        label: 'Settlement Type', // 付息/回购币种
        prop: 'paymentTypeDesc'
      }, {
        label: 'First Settlement Date', // 回购时间
        prop: 'firstSettlementDate',
        formatter: (row, cellValue) => {
          return cellValue ? formatDate(cellValue) : '--';
        }
      }];
      const assetSortField = [{
        field: 'launch',
        name: 'Launch Date'
      }, {
        field: 'setdate',
        name: 'First Settlement Date'
      }];
      const columnsObj = {
        [pageTypeEnum.bonds]: {
          column: [...this.defaultColumns],
          sortField: [...defaultSortFields]
        },
        [pageTypeEnum.asset]: {
          column: assetColumns,
          sortField: assetSortField
        }
      };
      const currentCategory = columnsObj[this.currentView] || {};
      this.columns = currentCategory.column;
      this.sortFields = currentCategory.sortField;
    },
    // get list
    getList () {
      const urlObj = {
        [pageTypeEnum.bonds]: tradeOrderProjects,
        [pageTypeEnum.asset]: absOrderProjects
        // [subHeadMenuEnum.currency]: assetTokenList
      };
      if (!urlObj[this.currentView]) return;

      this.loading = true;
      urlObj[this.currentView]({
        data: {
          ...this.searchParams
        },
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
    this.setListOptions(); // 根据当前二级类别更改当前列名、排序字段
    this.getList();
  }
};
</script>
<style lang="scss" scoped>
 .project-bonds {
   .btn-view {
     height: 32px;
   }
   .category-nav {
     margin-bottom: 40px;
     font-size: 18px;
     color: #5A6171;
   }
 }
</style>
