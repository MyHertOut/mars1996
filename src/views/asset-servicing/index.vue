<template>
  <div class="asset-servicing-list">
    <simplesub-header :active="currentView" :menus="subMenus">
    </simplesub-header>
    <div class="main-container" v-loading="loading">
      <ul class="category-nav">
        <li :class="item.key === searchParams.state ? 'active' : ''"
          v-for="item in categoryNav"
          :key="item.key"
          @click="handleCategoryClick(item.key)"
        >
          <span v-html="item.label">{{ item.label }}</span>
        </li>
      </ul>
      <search-bar
        ref="searchBar"
        :selectedField="selectedField"
        :keyWordPlaceholder="currentView === 'currency' ? 'Enter Currency Code / Name' : 'Enter Security Code / Name'"
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
        <template v-slot:column-bar="{row}">
          <!-- v-permissions="'assetServicingCentre.bonds.redeem.list'" -->
          <el-button
            v-show="(searchParams.state === '' && row.redeemStatus !== 3) ||
            (searchParams.state !== '' && row.redeemStatus === 1)"
            class="btn-op"
            @click.stop="handleRedeem(row)"
          >{{ row.callable === 'Y' ? 'Early Redemption' : 'Redemption' }}</el-button>
          <el-button
            v-if="currentView==='bonds'"
            v-permissions="'assetServicingCentre.bonds.coupon.list'"
            v-show="(searchParams.state === '' && row.couponStatus !== 3) ||
            (searchParams.state !== '' && row.couponStatus === 1)"
            class="btn-op"
            type="primary"
            @click.stop="handleGoCoupon(row)"
          >Coupon Payout</el-button>
          <el-button
            v-else-if="currentView==='asset' && row.redeemStatus !== 3"
            v-permissions="'assetServicingCentre.bonds.coupon.list'"
            class="btn-op"
            type="primary"
            @click.stop="handleGoCoupon(row)"
          >Coupon Payout</el-button>
        </template>
        <template v-slot:couponRate="{ prop, row }">
          <span class="mark-red" v-if="row[prop]">{{ row[prop] | demicrometer }} %</span>
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
import { assetSecurityList, assetAbsList } from '@api/distribution-center.js';
import { securityDisburseCount, securityRedeemCount } from '@api/asset-servicing.js';

// 排序字段，0. 发行时间， 1. 到期时间， 2. 回购时间， 3. 发行数量， null. 发行时间
const sortFieldObj = {
  'time': 0,
  'maturity': 1,
  'redemption': 2,
  'quantity': 3
};
const subHeadMenuEnum = {
  bonds: 'bonds',
  asset: 'asset'
};
const listStateEnum = {
  // 0：待计息，1：待回购， 2：已回购
  CouponPayments: 0,
  Redemption: 1,
  RedemptionCompleted: 2
};
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
  name: 'DistributeBondsIndex',
  data () {
    return {
      loading: false,
      tableData: [],
      currentView: this.$route.meta.current || 'bonds',
      selectedField: 'time',
      pageTotal: 0,
      disburseCount: '',
      dedeemCount: '',
      searchParams: {
        page: 1,
        keyword: '',
        state: '',
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
        to: {
          path: '/asset-servicing/bonds'
        },
        permissions: 'member.account.title' // 'assetServicingCentre.bonds.title'
      }, {
        name: 'Asset-Backed',
        key: 'asset',
        to: {
          path: '/asset-servicing/asset'
        },
        permissions: 'member.account.title' // 'assetServicingCentre.bonds.title'
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
        prop: 'issuanceQuantity',
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
    listStateEnum () {
      return listStateEnum;
    },
    // 0：待计息，1：待回购， 2：已回购
    defaultCategoryNav () {
      return [{
        key: '',
        label: 'All Bonds'
      }, {
        key: 0,
        label: `Coupon Payments <span style="color:#E6471F;">${this.disburseCount || ''}</span>`
      }, {
        key: 1,
        label: `Redemption <span style="color:#E6471F;">${this.dedeemCount || ''}</span>`
      }, {
        key: 2,
        label: 'Redemption Completed'
      }];
    }
    // categoryNav () {
    //   return this.defaultCategoryNav;
    // }
  },
  methods: {
    handleRedeem (row) {
      let pathName = 'AssetServicingRedemption';
      if (this.currentView === 'asset') {
        pathName = 'AssetServicingRedemption';
      }
      this.$router.push({ name: pathName, query: { code: row.code, t: this.currentView } });
    },
    handleGoCoupon (row) {
      let pathName = 'AssetServicingBondsCoupon';
      if (this.currentView === 'asset') {
        pathName = 'AssetServicingAssetCoupon';
      }
      this.$router.push({ name: pathName, query: { code: row.code, tokenType: this.currentView === 'bonds' ? 0 : 2, serialNo: row.serialNo } });
    },
    handleCategoryClick (key) {
      this.$refs.searchBar.resertData();
      this.searchParams = {
        page: 1,
        keyword: '',
        state: key,
        // 排序字段，0. 发行时间， 1. 到期时间， 2. 回购时间， 3. 发行数量， null. 发行时间
        columnName: 0,
        direction: 'asc'
      };
      this.getList();
    },
    // 二级头部点击
    // handleSubHeaderClick (menu) {
    //   this.currentView = menu.key;
    //   this.setListOptions(); // 根据当前二级类别更改当前列名、排序字段
    //   this.selectedField = 'time';
    //   this.getList();
    // },
    // 关键字搜索
    handleKeyWord (keyword) {
      this.searchParams.keyword = keyword;
      this.getList();
    },
    // 字段排序
    handleSortFieldClick (item, direction, index) {
      this.searchParams.columnName = sortFieldObj[item.field];
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
          t: 'ase', // 发行债券列表详情目前跟资产中心列表详情共用
          serialNo: row.serialNo,
          code: row.code,
          type: this.currentView
        }
      });
    },
    // 不同二级头部的不同表格列名
    setListOptions () {
      // List of Digital currencies columns
      const currencyColumns = [{
        label: 'Security Code',
        prop: 'code'
      }, {
        label: 'Currency', // 期数
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
      }, {
        label: 'First Settlement Date', // 到期时间
        prop: this.currentView === 'bonds' ? 'maturityDate' : 'firstSettlementDate',
        formatter: (row, cellValue) => {
          return cellValue ? formatDate(cellValue) : '--';
        }
      }, {
        label: 'Coupon Frequency', // 付息频率
        prop: 'couponFrequency'
      }, {
        label: 'Disbursement Token', // 付息/回购币种
        prop: 'disbursementToken'
      }];
      const currencySortField = [{
        field: 'time',
        name: 'Issuance Time'
      }, {
        field: 'quantity',
        name: 'Issuance Quantity'
      }];
      const columnsObj = {
        [subHeadMenuEnum.bonds]: {
          column: [...this.defaultColumns],
          sortField: [...defaultSortFields],
          categoryNav: [...this.defaultCategoryNav]
        },
        [subHeadMenuEnum.asset]: {
          column: currencyColumns,
          sortField: currencySortField,
          categoryNav: [{
            key: '',
            label: 'All Asset-Backed'
          }, {
            key: 2,
            label: 'Redemption Completed'
          }]
        }
        // [subHeadMenuEnum.currency]: {
        //   column: currencyColumns,
        //   sortField: currencySortField
        // }
      };
      const currentCategory = columnsObj[this.currentView] || {};
      this.columns = currentCategory.column;
      this.sortFields = currentCategory.sortField;
      this.categoryNav = currentCategory.categoryNav;
    },
    // get list
    getList () {
      const urlObj = {
        [subHeadMenuEnum.bonds]: assetSecurityList, // securityCouponList
        [subHeadMenuEnum.asset]: assetAbsList
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
    },
    getDetailCount () {
      securityDisburseCount().then(res => {
        const { code, data } = res.data;
        if (code === '1000') {
          this.disburseCount = data;
        }
      });
      securityRedeemCount().then(res => {
        const { code, data } = res.data;
        if (code === '1000') {
          this.dedeemCount = data;
        }
      });
    }
  },
  created () {
    // this.columns = [...this.defaultColumns];
    // this.categoryNav = [...this.defaultCategoryNav];
    this.setListOptions(); // 根据当前二级类别更改当前列名、排序字段
    this.getList();
    this.getDetailCount();
  }
};
</script>
<style lang="scss" scoped>
  .asset-servicing-list {
    .category-nav {
      margin-bottom: 40px;
      font-size: 18px;
    }
    .mark-red {
      color: #E6471F;
    }
    .btn-op {
      height: 32px;
      width: 150px;
      margin-bottom: 10px;
      &:last-child {
        margin-bottom: 0;
      }
    }
  }
</style>
