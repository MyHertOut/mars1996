<template>
  <div class="trande-transaction-dialog">
    <el-dialog :title="title" :visible.sync="transactionDialog" width="744px" class="transaction-dialog" @close="$emit('closeDialog');">
      <div class="transaction-content">
        <el-row>
          <el-col :span="5" :offset="1"><div class="label">Subscribed Size:</div></el-col>
          <el-col :span="7"><div class="value">{{ObjData.quantity ? parseFloat(ObjData.quantity) : '--'}} {{ObjData.tokenCode}}</div></el-col>
          <el-col :span="4"><div class="label">Notional Amount:</div></el-col>
          <el-col :span="7"><div class="value">{{ObjData.payAmount ? parseFloat(ObjData.payAmount) : '--'}} {{ObjData.currency}}</div></el-col>
        </el-row>
        <el-row>
          <el-col :span="5" :offset="1"><div class="label">Unit Price:</div></el-col>
          <el-col :span="7"><div class="value">{{ObjData.price ? parseFloat(ObjData.price) : '--'}} {{ObjData.currency}}</div></el-col>
          <el-col :span="4"><div class="label">Address:</div></el-col>
          <el-col :span="7"><div class="value valueAno">
            <a class="link-txt" :href="browserAddressUrl(ObjData.bidAddress)" target="_blank">{{ObjData.bidAddress ? ObjData.bidAddress : '--'}}</a>
          </div></el-col>
        </el-row>
        <el-row>
          <el-col :span="5" :offset="1"><div class="label">Payment Method:</div></el-col>
          <el-col :span="7"><div class="value">{{ObjData.paymentTypeDesc ? ObjData.paymentTypeDesc : '--'}}</div></el-col>
          <el-col :span="4"><div class="label">Timestamp:</div></el-col>
          <el-col :span="7"><div class="value">{{ObjData.createTime ? formatTime(ObjData.createTime) : '--'}}</div></el-col>
        </el-row>
        <el-row>
          <el-col :span="5" :offset="1"><div class="label">Status:</div></el-col>
          <el-col :span="7"><div class="value">{{ObjData.bizStatusDesc ? ObjData.bizStatusDesc : '--'}}</div></el-col>
          <el-col :span="4"><div class="label">Order ID:</div></el-col>
          <el-col :span="7"><div class="value">{{ObjData.orderCode ? ObjData.orderCode : '--'}}</div></el-col>
        </el-row>
        <el-row>
          <el-col :span="5" :offset="1"><div class="label">TX ID:</div></el-col>
          <el-col :span="7"><div class="value valueAno">
            <a class="link-txt" :href="browserTxIdUrl(ObjData.txId)" target="_blank">{{ObjData.txId ? ObjData.txId : '--'}}</a>
          </div></el-col>
        </el-row>
      </div>
      <span slot="footer" class="dialog-footer" v-if="showFooter">
        <el-button @click="rejectPassword" :loading="reLoading">Reject</el-button>
        <el-button type="primary" @click="acceptPassword" :loading="acLoading">Accept</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
import { formatDate } from '@/common/util';

export default {
  name: 'TransactionDialog',
  data () {
    return {
      transactionDialog: false,
      ObjData: {},
      reLoading: false,
      acLoading: false,
      showFooter: false
    };
  },
  props: ['isShow', 'data', 'rejectLoading', 'acceptLoading', 'isFooter', 'title'],
  watch: {
    isShow (n, o) {
      this.transactionDialog = n;
    },
    data (n, o) {
      this.ObjData = Object.assign({}, n);
    },
    rejectLoading (n, o) {
      this.reLoading = n;
    },
    acceptLoading (n, o) {
      this.acLoading = n;
    },
    isFooter (n, o) {
      this.showFooter = n;
    }
  },
  created () {
    this.transactionDialog = this.isShow;
    this.ObjData = Object.assign({}, this.data);
    this.reLoading = this.rejectLoading;
    this.acLoading = this.acceptLoading;
    this.showFooter = this.isFooter;
  },
  computed: {
    browserUrl () {
      return this.$store.state.common.systemConfig.blockBrowserUrl;
    }
  },
  methods: {
    browserTxIdUrl (id) {
      const url = this.browserUrl;
      return url ? `${url}/#/txidDetails?id=${id}` : '';
    },
    browserAddressUrl (id) {
      const url = this.browserUrl;
      return url ? `${url}/#/addressDetail?address=${id}` : '';
    },
    formatTime (time) {
      return formatDate(time);
    },
    acceptPassword () {
      this.$emit('acceptPassword');
    },
    rejectPassword () {
      this.$emit('rejectPassword');
    }
  }
};
</script>
<style lang="scss">
.trande-transaction-dialog {
  .transaction-dialog {
    .transaction-content {
      .el-row {
        margin-bottom: 15px;
      }
      .label {
        font-size: 14px;
        color: #8D93A1;
      }
      .value {
        font-size: 14px;
        color: #001F3B;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: normal;
        word-break: initial;
        &.valueAno{
          cursor: pointer;
        }
      }
    }
    .el-dialog__footer {
      text-align: center;
    }
    .el-dialog__body {
      padding: 0 40px;
      padding-bottom: 30px;
    }
    .el-dialog__header {
      padding: 40px;
      .el-dialog__title {
        font-size: 26px;
        color: #001F3B;
      }
    }
    .el-dialog__footer {
      padding-bottom: 35px;
      padding-right: 40px;
    }
    .dialog-footer {
      button {
        width: 100px;
        margin-right: 40px;
        height: 40px;
        & + button {
          margin-right: 0px;
        }
      }
    }
  }
}
</style>
