<template>
  <div class="bond-trade" v-loading="loading">
    <sub-header title="Bond Trading" :menus="subMenus" @handleClick="handleClick" navTitle="Trade Centre">
      <div slot="btns">
        <el-button @click="$router.push({ name: 'TradeHistory' })" plain v-permissions="'trade.centre.bond.history'">History</el-button>
        <el-button type="primary" @click="$router.push({ name: 'NewTrade' })" class="btn-light" v-permissions="'trade.centre.bond.new.trade'">New Trade</el-button>
      </div>
    </sub-header>
    <div class="main-container">
      <div class="tabel-container">
        <search-bar :keyWordPlaceholder="activesubMenu === 1 ? 'Security code / Security Name' : 'Asset Code / Asset Name'"
          :nosort="true" @handleKeyWord="handleKeyWord">
          <el-select v-model="searchParams.bizStatus" placeholder="All Status" slot="append">
            <el-option label="All Status" :value="''"></el-option>
            <el-option v-for="(item, key) in statusList" :key="key" :label="item.bizStatusDesc" :value="item.bizStatus"></el-option>
          </el-select>
        </search-bar>
        <custom-table :datas="tableDatas" :columns="tableColumns" rowKey="rowKey" headTitleProp="orderName" :pager="pager"
          :limit="pageObj.limit" :page="pageObj.page" :total="totalPage" @handleChangePage="handleChangePage">
          <div slot="opbar" class="see-detail" slot-scope="scope" :class="stateClass(scope)">{{scope.bizStatusDesc}}</div>
          <div slot="orderStartTime" slot-scope="scope">{{formatTime(scope.row.orderStartTime)}}</div>
          <div slot="orderEndTime" slot-scope="scope">{{formatTime(scope.row.orderEndTime)}}</div>
          <div slot="quantity" slot-scope="scope">{{formatNumber(scope.row.quantity) | demicrometer}}
            <span v-if="scope.row.paymentType === 1">{{scope.row.tokenMark}}</span>
            <span v-else>{{scope.row.currency}}</span>
          </div>
          <div slot="payAmount" slot-scope="scope">{{formatNumber(scope.row.payAmount) | demicrometer}}</div>
          <div slot="price" slot-scope="scope">{{formatNumber(scope.row.price) | demicrometer}}
            <span v-if="scope.row.paymentType === 1">{{scope.row.tokenMark}}</span>
            <span v-else>{{scope.row.currency}}</span>
          </div>
          <div slot="bidAddress" slot-scope="scope">
            <el-tooltip effect="dark" :content="scope.row.bidAddress" placement="top-start">
              <span>{{scope.row.bidAddress}}</span>
            </el-tooltip>
          </div>
          <div slot="column-bar" class="operation-box" v-if="activesubMenu === 2 && ((scope.row.bizStatus === 3 && scope.row.paymentType === 1) || (scope.row.bizStatus === 8 && scope.row.paymentType === 2) || scope.row.bizStatus === 8 && scope.row.paymentType === 1)"
            slot-scope="scope">
            <el-button type="primary" class="btn" @click="receivedPayMent(scope.row)" v-permissions="'trade.centre.bond.received.payment'"
              v-if="(scope.row.bizStatus === 3 && scope.row.paymentType === 1) || (scope.row.bizStatus === 8 && scope.row.paymentType === 2)"
              :disabled="isDisabledPay(scope.row.orderStartTime, scope.row.orderEndTime)">
              Payment
            </el-button>
            <el-button type="primary" class="btn" @click="receivedTransact(scope.row)" v-permissions="'trade.centre.bond.received.transact'"
              v-if="scope.row.bizStatus === 8 && scope.row.paymentType === 1" :disabled="btnDis(scope.row.orderEndTime)">Transact</el-button>
          </div>
          <div slot="column-bar" class="operation-box" v-else-if="scope.row.bizStatus === 4 && activesubMenu === 1 || scope.row.bizStatus === 3 && activesubMenu === 1" slot-scope="scope" v-permissions="'trade.centre.bond.created.confirm'">
            <el-button type="primary" class="btn" @click="createConfirm(scope.row)">Confirm</el-button>
          </div>
        </custom-table>
      </div>
    </div>
    <!-- payment弹窗 -->
    <payment-dialog :isShow="paymentDialog" :data="currentItem" @closeDialog="paymentDialog = false"
      @submitPayment="submitPayment" :paymentBtnLoading="paymentBtnLoading" />
    <!-- 二级密码弹窗 -->
    <secondary-dialog :isShow="secondaryDialog" :loading="passwordLoading" :currentData="currentItem"
      @submitPassword="submitPassword" @closeDialog="secondaryDialog = false" :addressListData="addressListData" />
    <!-- transaction弹窗 -->
    <transaction-dialog :isShow="transactionDialog" :data="currentItem" :rejectLoading="rejectLoading" @closeDialog="transactionDialog = false" :abs="false"
      :acceptLoading="acceptLoading" @acceptPassword="acceptPassword" @rejectPassword="rejectPassword" title="Confirm Transaction" :isFooter="true"/>
    <!-- Confirm Detail -->
    <trade-confirm-dialog :isShow="confirmDialog" :data="confirmRuleForm" :loading="confirmLoading"
      @submitConfirm="submitConfirm" @closeDialog="confirmDialog = false;confirmLoading = false;" />
  </div>
</template>
<script>
import SubHeader from '@/components/SubHeader.vue';
import SearchBar from '@/components/SearchBar.vue';
import CustomTable from '@/components/CustomTable.vue';
import paymentDialog from '@/components/paymentDialog.vue';
import tradeConfirmDialog from '@/components/tradeConfirmDialog.vue';
import transactionDialog from '@/components/transactionDialog.vue';
import secondaryDialog from '@/components/secondaryDialog.vue';
import { getTradeCreatedList, getTradeReceivedList, tradePayment, getBidBizStatus,
  acceptBidOrder, rejectBidOrder, queryPaymentInfo, tradeConfirm } from '@/api';
import { notify, formatDate } from '@/common/util';
import md5 from 'md5';

export default {
  name: 'BondTrade',
  data () {
    return {
      subMenus: [
        {
          name: 'Created',
          key: 'created',
          functionCode: 'trade.centre.bond.created'
        }, {
          name: 'Received',
          key: 'received',
          functionCode: 'trade.centre.bond.received'
        }
      ],
      statusList: [],
      tableDatas: [],
      tableColumns: [
        {
          label: 'Security Code',
          prop: 'tokenCode',
          labelWidth: 100,
          span: 6
        }, {
          label: 'Notional Amount',
          prop: 'payAmount',
          labelWidth: 145,
          span: 9,
          slot: 'payAmount'
        }, {
          label: 'Trade Period Start',
          prop: 'orderStartTime',
          labelWidth: 140,
          valueWidth: 140,
          span: 9,
          slot: 'orderStartTime'
        }, {
          label: 'Security Name',
          prop: 'tokenName',
          labelWidth: 100,
          span: 6
        }, {
          label: 'Trade Qty',
          prop: 'quantity',
          labelWidth: 145,
          span: 9,
          slot: 'quantity'
        }, {
          label: 'Trade Period End',
          prop: 'orderEndTime',
          labelWidth: 140,
          valueWidth: 140,
          span: 9,
          slot: 'orderEndTime'
        }, {
          label: 'Unit Price',
          prop: 'price',
          span: 6,
          labelWidth: 100,
          slot: 'price'
        }, {
          label: 'Counter-Party Address',
          prop: 'bidAddress',
          labelWidth: 145,
          valueWidth: 190,
          span: 9,
          slot: 'bidAddress'
        }, {
          label: 'Payment Method',
          labelWidth: 140,
          prop: 'paymentTypeDesc'
        }
      ],
      confirmRuleForm: {
        paymentInfo: '',
        documents: ''
      },
      loading: false,
      pageObj: {
        limit: 10,
        page: 1
      },
      searchParams: {
        keyword: '',
        bizStatus: ''
      },
      totalPage: 0,
      activesubMenu: 1,
      paymentDialog: false,
      passwordLoading: false,
      secondaryDialog: false,
      currentItem: {},
      rejectLoading: false,
      acceptLoading: false,
      confirmLoading: false,
      transactionDialog: false,
      paymentBtnLoading: false,
      confirmDialog: false,
      addressListData: [],
      pager: false
    };
  },
  watch: {
    'searchParams.bizStatus' (n, o) {
      if (this.activesubMenu === 1) {
        this.getCreateList();
      } else {
        this.getReceivedList();
      }
    }
  },
  components: {
    'sub-header': SubHeader,
    'search-bar': SearchBar,
    'custom-table': CustomTable,
    'payment-dialog': paymentDialog,
    'trade-confirm-dialog': tradeConfirmDialog,
    'transaction-dialog': transactionDialog,
    'secondary-dialog': secondaryDialog
  },
  created () {
    this.getCreateList();
    this.getStateList();
  },
  methods: {
    btnDis (end) {
      let time = Date.now();
      return time > end;
    },
    isDisabledPay (start, end) {
      let time = Date.now();
      return time > end || time < start;
    },
    async getStateList () {
      const data = await getBidBizStatus({
        slient: true,
        notify: notify.error
      });
      if (data.code === '1000') {
        this.statusList = data.data;
      } else {
        this.statusList = [];
      }
    },
    async getConfirmDetail () {
      this.loading = true;
      const data = await queryPaymentInfo({
        data: {
          orderNo: this.currentItem.orderNo
        },
        slient: true,
        notify: notify.error
      });
      this.loading = false;
      if (data.data) {
        this.confirmRuleForm = Object.assign({}, data.data);
        this.confirmDialog = true;
      }
    },
    async submitConfirm () {
      this.confirmLoading = true;
      const data = await tradeConfirm({
        data: {
          orderNo: this.currentItem.orderNo,
          userAddress: this.currentItem.bidAddress
        },
        slient: true,
        notify: notify.error
      });
      this.confirmLoading = false;
      if (data.code === '1000') {
        this.confirmDialog = false;
        this.getCreateList();
      }
    },
    async acceptPassword () {
      this.acceptLoading = true;
      const data = await acceptBidOrder({
        data: {
          orderNo: this.currentItem.orderNo
        },
        slient: true,
        notify: notify.error
      });
      this.acceptLoading = false;
      if (data.code === '1000') {
        this.transactionDialog = false;
        this.getReceivedList();
      }
    },
    async rejectPassword () {
      this.rejectLoading = true;
      const data = await rejectBidOrder({
        data: {
          orderNo: this.currentItem.orderNo
        },
        slient: true,
        notify: notify.error
      });
      this.rejectLoading = false;
      if (data.code === '1000') {
        this.transactionDialog = false;
        this.getReceivedList();
      }
    },
    async submitPassword (parmas) {
      this.passwordLoading = true;
      const data = await acceptBidOrder({
        data: {
          orderNo: parmas.orderNo,
          secondaryPwd: md5(parmas.secondaryPwd).toUpperCase()
        },
        slient: true,
        notify: notify.error
      });
      this.passwordLoading = false;
      if (data.code === '1000') {
        this.secondaryDialog = false;
        this.getReceivedList();
        // this.$router.push({
        //   name: 'TradeHistory'
        // });
      }
    },
    createConfirm (item) {
      this.currentItem = item;
      this.getConfirmDetail();
    },
    formatNumber (num) {
      return parseFloat(num) || '--';
    },
    receivedTransact (item) {
      this.currentItem = item;
      this.transactionDialog = true;
    },
    receivedPayMent (item) {
      this.currentItem = item;
      if (this.currentItem.paymentType === 1) {
        this.paymentDialog = true;
      } else {
        this.addressListData = [{
          address: item.bidAddress,
          id: 1
        }];
        this.secondaryDialog = true;
      }
    },
    async submitPayment (data) {
      this.paymentBtnLoading = true;
      const res = await tradePayment({
        data: {
          fileNo: data.fileList[0] ? data.fileList[0].id : '',
          paymentInfo: data.paymentInfo,
          userAddress: data.bidAddress,
          orderNo: data.orderNo
        },
        slient: true,
        notify: notify.error
      });
      this.paymentBtnLoading = false;
      if (res.code === '1000') {
        this.paymentDialog = false;
        this.getReceivedList();
      }
    },
    handleKeyWord (str) {
      this.searchParams.keyword = str;
      if (this.activesubMenu === 1) {
        this.getCreateList();
      } else {
        this.getReceivedList();
      }
    },
    handleChangePage (page) {
      this.pageObj.page = page;
      this.publicList();
    },
    formatTime (time) {
      return formatDate(time);
    },
    async getCreateList () {
      this.loading = true;
      this.tableDatas = [];
      const data = await getTradeCreatedList({
        data: {
          ...this.searchParams,
          ...this.pageObj
        },
        slient: true,
        notify: notify.error
      });
      this.loading = false;
      if (data.data.data) {
        this.totalPage = data.data.count;
        this.pager = data.data.count > this.pageObj.limit;
        this.tableDatas = data.data.data;
      } else {
        this.tableDatas = [];
        this.totalPage = 0;
      }
    },
    stateClass (row) {
      const arr = [
        {
          bizStatus: 0,
          class: 'error'
        }, {
          bizStatus: 1,
          class: 'error'
        }, {
          bizStatus: 2,
          class: 'padding'
        }, {
          bizStatus: 3,
          class: 'padding'
        }, {
          bizStatus: 4,
          class: 'padding'
        }, {
          bizStatus: 5,
          class: 'padding'
        }, {
          bizStatus: 6,
          class: 'allocation'
        }, {
          bizStatus: 7,
          class: 'green'
        }, {
          bizStatus: 8,
          class: 'padding'
        }, {
          bizStatus: 9,
          class: 'error'
        }, {
          bizStatus: 10,
          class: 'error'
        }
      ];
      let state = arr.filter(v => v.bizStatus === row.bizStatus);
      if (state[0]) {
        return state[0].class;
      } else {
        return '';
      }
    },
    async getReceivedList () {
      this.loading = true;
      this.tableDatas = [];
      const data = await getTradeReceivedList({
        data: {
          ...this.searchParams,
          ...this.pageObj
        },
        slient: true,
        notify: notify.error
      });
      this.loading = false;
      if (data.data.data) {
        this.totalPage = data.data.count;
        this.pager = data.data.count > this.pageObj.limit;
        this.tableDatas = data.data.data;
      } else {
        this.tableDatas = [];
        this.totalPage = 0;
      }
    },
    handleClick (item) {
      this.pageObj.limit = 10;
      this.pageObj.page = 1;
      this.searchParams.keyword = '';
      this.searchParams.bizStatus = '';
      if (item.key === 'created') {
        this.activesubMenu = 1;
        this.getCreateList();
      } else {
        this.activesubMenu = 2;
        this.getReceivedList();
      }
    }
  }
};
</script>
<style scoped lang="scss">
.bond-trade {
  .main-container {
    padding: 0;
    overflow: hidden;
    padding-bottom: 40px;
    .tabel-container {
      padding: 0px 30px;
      padding-top: 40px;
      .search-bar {
        margin-bottom: 30px;
      }
      .see-detail {
        font-size: 12px;
        color: #497EB9;
      }
      .error {
        color: #E6471F;
      }
      .padding {
        color: #FF9A00;
      }
      .allocation {
        color: #214285;
      }
      .green {
        color: #52B88F;
      }
      .el-tooltip {
        width: 100%;
        display: inline-block;
        overflow: hidden;
        white-space: nowrap;
        text-overflow: ellipsis;
        vertical-align: middle;
      }
      .operation-box {
        .el-button.is-disabled {
          color: #C0C4CC !important;
          cursor: not-allowed !important;
          background-image: none !important;
          background-color: #EBEEF5 !important;
          border-color: #EBEEF5 !important;
        }
      }
    }
  }
}
</style>
<style lang="scss">
.bond-trade {
  .custom-table .zs-table .zs-row {
    max-height: 200px;
  }
  .custom-table .zs-table .zs-row__body .status {
    width: 95px;
  }
  // .history {
  //   background-color: transparent !important;
  //   border-color: #fff !important;
  //   color: #fff !important;
  //   transition: all .2s;
  //   &:hover {
  //     opacity: .8;
  //   }
  // }
  // .new-trade {
  //   background-color: #497EB9 !important;
  //   &:hover {
  //     background-color: #4a87cb !important;
  //   }
  // }

}
</style>
