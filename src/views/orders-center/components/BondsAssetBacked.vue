<template>
  <div v-loading="tableLoading">
    <div class="topTabData">
      <div @click="topTabClick(v)" class="topTabData-item" v-for="(v, k) in topTabData" :key="k" :class="v.value === active ? 'active' : ''">{{v.label}}</div>
    </div>
    <search-bar
      class="searchBar"
      :topTabData="topTabData"
      :nosort="true"
      @handleKeyWord="handleKeyWord"
      :keyWordPlaceholder="'Enter OrderID / Address / Security Code / Project Number'"
    ></search-bar>
    <element-table
      :columns="columns"
      :data="data"
      pager
      :pageTotal="pageTotal"
      :pageIndex="searchParam.page"
      @handleChangePage="handleChangePage"
    >
      <template v-slot:bizStatusDesc="{row, prop}">
        <div class="status-text">
          <span :class="listOrderStateColor(row.bizStatus)">{{ row[prop] }}</span>
          <el-popover
            v-if="row.bizStatus == listStatusEnum.SIGNATURE_FAILED
              || row.bizStatus == listStatusEnum.TRADE_FAILED"
            placement="top-start"
            trigger="hover"
            width="260"
            :content="row['errorMsg']">
            <span class="list-icon icon-question" slot="reference">?</span>
          </el-popover>
        </div>
      </template>
      <template v-slot:quantity="{row}">
        {{parseFloat(row.quantity) | demicrometer}} {{row.tokenCode}}
      </template>
      <template v-slot:payAmount="{row}">
        <span v-if="row.paymentType === 2">{{parseFloat(row.payAmount) | demicrometer}} {{row.currency}}</span>
        <span v-else-if="row.paymentType === 1">{{parseFloat(row.payAmount) | demicrometer}} {{row.tokenMark}}</span>
      </template>
      <template v-slot:edit="{row}">
        <el-button
          v-if="row['bizStatus'] === 3 && row['direction'] === 1" type="primary" class="review-btn" @click="handlePayment(row)"
        >Payment</el-button>
        <el-button
          v-else-if="row['bizStatus'] === 4 && row['direction'] === 0 || row['bizStatus'] === 3 && row['direction'] === 0" type="primary" class="review-btn" @click="handlePaymentConfirm(row)"
        >Confirm</el-button>
        <el-button
          v-else class="review-btn" @click="handlePaymentDetails(row)"
        >Details</el-button>
      </template>
    </element-table>
    <!-- payment弹窗 -->
    <payment-dialog :isShow="paymentDialog" :data="currentItem" @closeDialog="paymentDialog = false"
      @submitPayment="submitPayment" :paymentBtnLoading="paymentBtnLoading" />
     <!-- Details弹窗 -->
    <details-dialog :isShow="detailsDialog" :data="currentItem" @closeDialog="detailsDialog = false"
      title="Order Detail" :isFooter="false" />
    <trade-confirm-dialog :isShow="confirmDialog" :data="confirmRuleForm" :loading="confirmLoading"
      @submitConfirm="submitConfirm" @closeDialog="confirmDialog = false;confirmLoading = false;" />
  </div>
</template>

<script>
import {
  ordersCenterTableStatusEnum as listStatusEnum
} from '@/common/enums.js';
import SearchBar from '@components/SearchBar.vue';
import ElementTable from '@components/ElementTable.vue';
import { absSubscriptionOrders } from '@/api/ordersCenter';
import { notify, formatDate } from '@/common/util.js';
import orderTransactionDialog from '@components/orderTransactionDialog.vue';
import paymentDialog from '@/components/paymentDialog.vue';
import tradeConfirmDialog from '@/components/tradeConfirmDialog.vue';
import { absTradePayment, absTradeConfirm, absQueryPaymentInfo } from '@/api';

export default {
  name: 'AssetBacked',
  data () {
    return {
      paymentDialog: false,
      confirmDialog: false,
      paymentBtnLoading: false,
      confirmLoading: false,
      detailsDialog: false,
      currentItem: {},
      confirmRuleForm: {
        paymentInfo: '',
        documents: ''
      },
      listStatusEnum,
      active: '1',
      topTabData: [
        {
          label: 'Processing',
          value: '1'
        }, {
          label: 'Completed',
          value: '2'
        }, {
          label: 'ALL',
          value: '-1'
        }
      ],
      searchParam: {
        keyword: '',
        tradeStatus: '1',
        page: 1
      },
      pageTotal: 0,
      tableLoading: false,
      data: [],
      columns: [
        {
          prop: 'orderNo',
          label: 'Order ID'
        }, {
          prop: 'quantity',
          label: 'Subscribed Size',
          isSlot: true
        }, {
          prop: 'payAmount',
          label: 'Notional Amount',
          isSlot: true
        }, {
          prop: 'bidAddress',
          label: 'Address',
          formatter: (row, column, cellValue, index) => {
            const url = this.browserAddressUrl(cellValue);
            return cellValue ? <a class="link-txt" href={url} target="_blank">{cellValue}</a> : '--';
          }
        }, {
          prop: 'bizStatusDesc',
          label: 'Status',
          isSlot: true
        }, {
          prop: 'createTime',
          label: 'Timestamp',
          formatter: (row, column, cellValue, index) => {
            return cellValue ? formatDate(cellValue, 'YYYY-MM-DD HH:mm:ss') : '--';
          }
        }, {
          prop: 'edit',
          label: 'Operation',
          align: 'center',
          isSlot: true
        }
      ]
    };
  },
  computed: {
    browserUrl () {
      return this.$store.state.common.systemConfig.blockBrowserUrl;
    }
  },
  methods: {
    async getConfirmDetail () {
      this.tableLoading = true;
      const data = await absQueryPaymentInfo({
        data: {
          orderNo: this.currentItem.orderNo
        },
        slient: true,
        notify: notify.error
      });
      this.tableLoading = false;
      if (data.data) {
        this.confirmRuleForm = Object.assign({}, data.data);
        this.confirmDialog = true;
      }
    },
    async submitConfirm () {
      this.confirmLoading = true;
      const data = await absTradeConfirm({
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
        this.getSubscriptionOrders();
      }
    },
    handlePaymentConfirm (row) {
      this.currentItem = row;
      this.getConfirmDetail();
    },
    // Payment
    handlePayment (row) {
      this.paymentDialog = true;
      this.currentItem = row;
    },
    async submitPayment (data) {
      this.paymentBtnLoading = true;
      const res = await absTradePayment({
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
        this.getSubscriptionOrders();
      }
    },
    handlePaymentDetails (row) {
      this.detailsDialog = true;
      this.currentItem = row;
    },
    // list order status className
    listOrderStateColor (state) {
      let color;
      switch (state) {
        case listStatusEnum.IN_PROGRESS:
        case listStatusEnum.PENDING_INITIATOR:
          color = 'statusBlue';
          break;
        case listStatusEnum.PENDING_SIGNATURE:
        case listStatusEnum.WAIT_ACCEPT:
        case listStatusEnum.PAID:
        case listStatusEnum.PENDING_PAYMENT:
          color = 'padding';
          break;
        case listStatusEnum.SIGNATURE_FAILED:
        case listStatusEnum.TRADE_FAILED:
        case listStatusEnum.REJECTED:
          color = 'rejected';
          break;
        case listStatusEnum.COMPLETED:
          color = 'success';
          break;
      }
      return color;
    },
    topTabClick (v) {
      this.active = v.value;
      this.searchParam.tradeStatus = this.active;
      this.getSubscriptionOrders();
    },
    browserAddressUrl (id) {
      const url = this.browserUrl;
      return url ? `${url}/#/addressDetail?address=${id}` : '';
    },
    handleKeyWord (keyword) {
      this.searchParam.keyword = keyword;
      this.getSubscriptionOrders();
    },
    handleChangePage (page) {
      this.searchParam.page = page;
      this.getSubscriptionOrders();
    },
    getSubscriptionOrders () {
      this.tableLoading = true;
      absSubscriptionOrders({
        data: {
          ...this.searchParam
        },
        notify: notify.error
      }).then(res => {
        this.tableLoading = false;
        const { data, code, count } = res;
        if (code === '1000') {
          this.data = data.data || [];
          this.pageTotal = count || 0;
        }
      }).catch(() => {
        this.tableLoading = false;
      });
    }
  },
  mounted () {
    this.getSubscriptionOrders();
  },
  components: {
    'search-bar': SearchBar,
    'element-table': ElementTable,
    'details-dialog': orderTransactionDialog,
    'payment-dialog': paymentDialog,
    'trade-confirm-dialog': tradeConfirmDialog
  }
};
</script>

<style lang="scss" scoped>
.topTabData{
  display: flex;
  padding: 0 0 50px;
  .topTabData-item{
    font-size: 18px;
    color: #5A6171;
    line-height: 18px;
    padding: 0 44px;
    cursor: pointer;
    border-right: 1px solid #DCDFE6;
    &:nth-child(1){
      padding-left: 0;
    }
    &:nth-child(3){
      border-right: none;
    }
    &.active{
      color: #497EB9;
    }
  }
}
.searchBar{
  margin-bottom: 31px;
}
.review-btn {
  width: 80px;
  height: 32px;
  padding: 8px 16px;
}
</style>
