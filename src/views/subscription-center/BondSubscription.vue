<template>
  <div class="bond-subscription" v-loading="loading">
    <sub-header title="Bond Subscription" :menus="subMenus" @handleClick="handleClick" navTitle="SubScription Centre"/>
    <div class="main-container">
      <div class="head-tabs">
        <div class="tabs-item" v-for="(v, k) in tabsList" :key="k" @click="tabsActive = (k + 1)"
          :class="{'tabs-border': k === 2, 'tabs-active': (k + 1) === tabsActive }">{{v.tabsName}}</div>
      </div>
      <div class="tabel-container">
        <search-bar keyWordPlaceholder="Asset Code / Asset Name / Project Name" :sortFields="sortFields"
          :selectedField="selectedField" @handleSortFieldClick="handleSortFieldClick" @handleKeyWord="handleKeyWord" />
        <custom-table :datas="tableDatas" :columns="tableColumns" rowKey="rowKey" headTitleProp="orderName" @handleRowClick="handleRowClick"
          :limit="pageObj.limit" :page="pageObj.page" :total="totalPage" @handleChangePage="handleChangePage" :pager="pager">
          <div :class="{'ongoing-state': scope.bizStatus === 1, 'upcoming-state': scope.bizStatus === 2, 'concluded-state': scope.bizStatus === 3}"
            slot-scope="scope" slot="opbar">
            {{tabsList.filter(val => val.id === scope.bizStatus)[0].tabsName}}
          </div>
          <div slot="orderStartTime" slot-scope="scope">{{formatTime(scope.row.orderStartTime)}}</div>
          <div slot="orderEndTime" slot-scope="scope">{{formatTime(scope.row.orderEndTime)}}</div>
          <div slot="maturityDate" slot-scope="scope">{{formatTime(scope.row.maturityDate)}}</div>
          <div slot="quantity" slot-scope="scope">{{formatNumber(scope.row.quantity) | demicrometer}}</div>
          <div slot="price" slot-scope="scope" v-if="scope.row.paymentType === 2">{{formatNumber(scope.row.price) | demicrometer}} {{scope.row.currency}}</div>
          <div slot="price" slot-scope="scope" v-else>{{formatNumber(scope.row.price) | demicrometer}} {{scope.row.tokenMark}}</div>
          <div slot="couponRate" slot-scope="scope" class="upcoming-state">{{formatCoupon(scope.row.couponRate) + '%'}}</div>
          <div slot="column-bar" class="operation-box" slot-scope="scope" v-if="scope.row.bizStatus === 1">
            <div class="progress"><el-progress :percentage="scope.row.percentage" color="#214285" :stroke-width="3"></el-progress></div>
            <el-button type="primary" class="btn" @click="handleRowClick(scope.row)">Subscribe</el-button>
          </div>
        </custom-table>
      </div>
    </div>
  </div>
</template>
<script>
import SubHeader from '@/components/SubHeader.vue';
import SearchBar from '@/components/SearchBar.vue';
import CustomTable from '@/components/CustomTable.vue';
import { getPublicList, getPrivateList } from '@/api';
import { notify, formatDate, toFixeds } from '@/common/util';

export default {
  name: 'BondSubscription',
  data () {
    return {
      subMenus: [{
        name: 'Public',
        key: 'public',
        functionCode: 'subscription.centre.public'
      }, {
        name: 'Private',
        key: 'private',
        functionCode: 'subscription.centre.private'
      }],
      activesubMenu: 1,
      tabsList: [
        {
          tabsName: 'Ongoing',
          id: 1
        }, {
          tabsName: 'Upcoming',
          id: 2
        }, {
          tabsName: 'Concluded',
          id: 3
        }
      ],
      tabsActive: 1,
      selectedField: 'launchDate',
      sortFields: [
        {
          field: 'launchDate',
          name: 'Launch Date'
        }, {
          field: 'annualCouponRate',
          name: 'Annual Coupon Rate'
        }, {
          field: 'maturityDate',
          name: 'Maturity Date'
        }
      ],
      tableDatas: [],
      tableColumns: [
        {
          label: 'Security Name',
          prop: 'tokenName',
          labelWidth: 120,
          span: 7
        }, {
          label: 'Annual Coupon Rate',
          prop: 'couponRate',
          span: 8,
          slot: 'couponRate'
        }, {
          label: 'Subscription Period Start',
          prop: 'orderStartTime',
          labelWidth: 160,
          valueWidth: 140,
          span: 9,
          slot: 'orderStartTime'
        }, {
          label: 'Security Code',
          prop: 'tokenCode',
          labelWidth: 120,
          span: 7
        }, {
          label: 'Subscription Total',
          prop: 'quantity',
          span: 8,
          slot: 'quantity'
        }, {
          label: 'Subscription Period End',
          prop: 'orderEndTime',
          labelWidth: 160,
          valueWidth: 140,
          span: 9,
          slot: 'orderEndTime'
        }, {
          label: 'Settlement Type',
          prop: 'paymentTypeDesc',
          labelWidth: 120,
          span: 7
        }, {
          label: 'Unit Price',
          prop: 'price',
          span: 8,
          slot: 'price'
        }, {
          label: 'Maturity Date',
          prop: 'maturityDate',
          labelWidth: 160,
          span: 9,
          slot: 'maturityDate'
        }
      ],
      loading: false,
      searchParams: {
        keyword: '',
        bizStatus: 1
      },
      pageObj: {
        limit: 10,
        page: 1
      },
      sortObj: {
        columnName: 1,
        direction: 'asc'
      },
      totalPage: 0,
      pager: false
    };
  },
  watch: {
    tabsActive (n, o) {
      this.searchParams.bizStatus = n;
      if (this.activesubMenu === 1) {
        this.publicList();
      } else {
        this.privateList();
      }
    }
  },
  components: {
    'sub-header': SubHeader,
    'search-bar': SearchBar,
    'custom-table': CustomTable
  },
  methods: {
    formatCoupon (num) {
      if (num) {
        return parseFloat(num);
      } else {
        return '--';
      }
    },
    handleRowClick (item) {
      this.$router.push({
        name: 'SubscriptionDetail',
        query: {
          orderNo: item.orderNo,
          tokenNo: item.tokenNo,
          tokenCode: item.tokenCode,
          bizStatus: item.bizStatus
        }
      });
    },
    formatNumber (num) {
      return parseFloat(num);
    },
    handleKeyWord (value) {
      this.searchParams.keyword = value;
      this.publicList();
    },
    handleChangePage (page) {
      this.pageObj.page = page;
      if (this.activesubMenu === 1) {
        this.publicList();
      } else {
        this.privateList();
      }
    },
    formatTime (time) {
      return formatDate(time);
    },
    async privateList () {
      this.loading = true;
      this.searchParams.bizStatus = this.tabsActive;
      const data = await getPrivateList({
        data: {
          ...this.searchParams,
          ...this.pageObj,
          ...this.sortObj
        },
        slient: true,
        notify: notify.error
      });
      this.loading = false;
      if (data.data.data) {
        this.tableDatas = data.data.data;
        this.totalPage = data.data.count;
        this.pager = data.data.count > this.pageObj.limit;
      } else {
        this.tableDatas = [];
        this.totalPage = 0;
      }
    },
    async publicList () {
      this.loading = true;
      this.searchParams.bizStatus = this.tabsActive;
      const data = await getPublicList({
        data: {
          ...this.searchParams,
          ...this.pageObj,
          ...this.sortObj
        },
        slient: true,
        notify: notify.error
      });
      this.loading = false;
      if (data.data.data) {
        this.tableDatas = data.data.data;
        this.totalPage = data.data.count;
        this.pager = data.data.count > this.pageObj.limit;
        this.tableDatas.forEach(v => {
          v.percentage = 100 - ((parseFloat(v.remainQuantity) / parseFloat(v.quantity)) * 100);
          v.percentage = parseFloat(toFixeds(v.percentage, 2));
        });
      } else {
        this.tableDatas = [];
        this.totalPage = 0;
      }
    },
    handleClick (menu) {
      this.searchParams.keyword = '';
      this.searchParams.bizStatus = 1;
      this.pageObj.limit = 10;
      this.pageObj.page = 1;
      this.sortObj.columnName = 1;
      this.sortObj.direction = 'asc';
      if (menu.key === 'private') {
        this.privateList();
        this.activesubMenu = 2;
      } else {
        this.publicList();
        this.activesubMenu = 1;
      }
    },
    handleSortFieldClick (item, direction, index) {
      this.sortObj.direction = direction;
      this.sortObj.columnName = index + 1;
      if (this.activesubMenu === 1) {
        this.publicList();
      } else {
        this.privateList();
      }
    }
  },
  created () {
    this.publicList();
  }
};
</script>

<style lang="scss" scoped>
.bond-subscription {
  .main-container {
    padding: 0;
    overflow: hidden;
    padding-bottom: 40px;
    .head-tabs {
      margin-top: 30px;
      display: flex;
      margin-bottom: 30px;
      .tabs-item {
        width: 120px;
        text-align: center;
        border-right: 1px solid #DCDFE6;
        font-size: 18px;
        color: #5A6171;
        cursor: pointer;
      }
      .tabs-active {
        color: #497EB9;
      }
      .tabs-border {
        border-right: 0;
      }
    }
    .tabel-container {
      padding: 0px 30px;
      .search-bar {
        margin-bottom: 30px;
      }
      .ongoing-state {
        font-size: 14px;
        color: #497EB9;
      }
      .upcoming-state {
        font-size: 14px;
        color: #E6471F;
      }
      .concluded-state {
        font-size: 14px;
        color: #E6471F;
      }
      .operation-box {
        display: flex;
        flex-direction: column;
        align-items: center;
        .progress {
          width: 90px;
        }
        .btn {
          width: 90px;
          height: 30px;
          font-size: 14px;
          padding: 0;
          font-weight: normal;
          margin-top: 10px;
        }
      }
    }
  }
}
</style>
<style lang="scss">
.bond-subscription {
  .el-progress__text {
    // margin-left: 30px;
    font-size: 12px;
    color: #214285;
    float: right;
  }
  .el-progress-bar {
    padding-right: 30px;
    width: 91%;
  }
  .custom-table .zs-table .zs-row {
    max-height: 200px;
  }
  .custom-table .zs-table .zs-row__body .status {
    width: 90px;
  }
}
</style>
