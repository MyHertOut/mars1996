<template>
  <div class="trande-transaction-dialog">
    <el-dialog :title="title" :visible.sync="transactionDialog" width="744px" class="transaction-dialog" @close="$emit('closeDialog');">
      <div class="transaction-content">
        <el-row>
          <el-col :span="5"><div class="label">Security Code:</div></el-col>
          <el-col :span="7"><div class="value">{{ObjData.tokenCode}}</div></el-col>
          <el-col :span="5"><div class="label">Security Name:</div></el-col>
          <el-col :span="7"><div class="value">{{ObjData.tokenName}}</div></el-col>
        </el-row>
        <el-row>
          <el-col :span="5"><div class="label">Unit Price:</div></el-col>
          <el-col :span="7"><div class="value">{{formatNumber(ObjData.price)}}</div></el-col>
          <el-col :span="5"><div class="label">Notional Amount:</div></el-col>
          <el-col :span="7"><div class="value">{{formatNumber(ObjData.quantity)}}</div></el-col>
        </el-row>
        <el-row>
          <el-col :span="5"><div class="label">Trade Qty:</div></el-col>
          <el-col :span="7"><div class="value">{{formatNumber(ObjData.payAmount)}} {{ObjData.currency}}</div></el-col>
          <el-col :span="5"><div class="label">Counter-Party Address:</div></el-col>
          <el-col :span="7"><div class="value">{{ObjData.bidAddress}}</div></el-col>
        </el-row>
        <el-row>
          <el-col :span="5"><div class="label">Payment Method:</div></el-col>
          <el-col :span="7"><div class="value">{{ObjData.paymentTypeDesc}}</div></el-col>
          <el-col :span="5"><div class="label">Trade Period Start:</div></el-col>
          <el-col :span="7"><div class="value">{{formatTime(ObjData.orderStartTime)}}</div></el-col>
        </el-row>
        <el-row>
          <el-col :span="5"><div class="label">Trade Period End:</div></el-col>
          <el-col :span="7"><div class="value">{{formatTime(ObjData.orderEndTime)}}</div></el-col>
        </el-row>
      </div>
      <span slot="footer" class="dialog-footer" v-if="showFooter">
        <template v-if="abs">
          <!-- <el-button @click="rejectPassword" :loading="reLoading" v-permissions="'trade.centre.bond.abs.received.reject'">Reject</el-button> -->
          <el-button type="primary" @click="acceptPassword" :loading="acLoading" v-permissions="'trade.centre.bond.abs.received.accept'">Accept</el-button>
        </template>
        <template v-else>
          <!-- <el-button @click="rejectPassword" :loading="reLoading" v-permissions="'trade.centre.bond.received.reject'">Reject</el-button> -->
          <el-button type="primary" @click="acceptPassword" :loading="acLoading" v-permissions="'trade.centre.bond.received.accept'">Accept</el-button>
        </template>
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
  props: ['isShow', 'data', 'rejectLoading', 'acceptLoading', 'isFooter', 'title', 'abs'],
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
  methods: {
    formatNumber (num) {
      return parseFloat(num) || '--';
    },
    acceptPassword () {
      this.$emit('acceptPassword');
    },
    rejectPassword () {
      this.$emit('rejectPassword');
    },
    formatTime (time) {
      return formatDate(time);
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
      // padding-right: 40px;
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
