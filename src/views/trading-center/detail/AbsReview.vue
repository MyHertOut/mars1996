<template>
  <div class="trade-review">
    <el-row v-if="detail">
      <el-col :span="4"><div class="label">Token Code:</div></el-col>
      <el-col :span="8"><div class="value">{{isEmpty(detail.tokenCode)}}</div></el-col>
      <el-col :span="4"><div class="label">Trade Quantity:</div></el-col>
      <el-col :span="7"><div class="value">{{isEmpty(detail.quantity)}}</div></el-col>
    </el-row>
    <el-row v-if="detail">
      <el-col :span="4"><div class="label">Counterparty Address:</div></el-col>
      <el-col :span="8"><div class="value">{{isEmpty(detail.bidAddress)}}</div></el-col>
      <el-col :span="4"><div class="label">Payment Address:</div></el-col>
      <el-col :span="8"><div class="value">{{isEmpty(detail.userAddress)}}</div></el-col>
    </el-row>
    <el-row v-if="detail">
      <el-col :span="4"><div class="label">Unit Price:</div></el-col>
      <el-col :span="8"><div class="value">{{isEmpty(detail.price)}}{{isEmpty(detail.currencyType)}}</div></el-col>
      <!-- <el-col :span="4"><div class="label">Settlement Token:</div></el-col>
      <el-col :span="7"><div class="value">DCEP</div></el-col> -->
      <el-col :span="4"><div class="label">Payment Method:</div></el-col>
      <el-col :span="7"><div class="value">{{isEmpty(paymentType[formatNumber(detail.paymentType) - 1])}}</div></el-col>
    </el-row>
    <el-row v-if="detail">
      <el-col :span="4"><div class="label">Trade Period Start:</div></el-col>
      <el-col :span="8"><div class="value">{{formatTime(detail.orderStartTime)}}</div></el-col>
      <el-col :span="4"><div class="label">Trade Period End:</div></el-col>
      <el-col :span="7"><div class="value">{{formatTime(detail.orderEndTime)}}</div></el-col>
    </el-row>
    <el-row v-if="detail">
      <template v-if="formatNumber(detail.paymentType) === 2">
        <el-col :span="4"><div class="label">Settlement Token:</div></el-col>
        <el-col :span="8"><div class="value">{{isEmpty(detail.currency)}}</div></el-col>
      </template>
      <template v-if="formatNumber(detail.paymentType) === 1">
        <el-col :span="4"><div class="label">Payment Instruction:</div></el-col>
        <el-col :span="8"><div class="value">{{isEmpty(detail.paymentInfo)}}</div></el-col>
      </template>
    </el-row>
    <div class="submit-box">
      <el-button @click="previous">Previous</el-button>
      <el-button type="primary" @click="nextStep">Next</el-button>
    </div>
    <el-dialog title="Secondary Password" :visible.sync="secondaryDialog" width="744px" class="password-dialog">
      <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="150px" class="">
        <el-form-item label="Secondary Password:" prop="paymentPassword" class="password-form-item">
          <el-input v-model="ruleForm.paymentPassword" :disabled="confirmLoading" type="password"></el-input>
          <div class="forgot" @click="forgotPassword = true"><span>Forgot Password?</span></div>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="confirmLoading = false;secondaryDialog = false">Cancel</el-button>
        <el-button type="primary" @click="submitOrder" :loading="confirmLoading">Confirm</el-button>
      </span>
    </el-dialog>
    <setPassword :isShow="forgotPassword" :changeType="2" @closeDialog="forgotPassword = false" />
  </div>
</template>
<script>
import { formatDate, notify } from '@/common/util';
import { absNewTrade } from '@/api';
import setPassword from '@/components/setPassword';
import md5 from 'md5';

export default {
  name: 'TradeReview',
  data () {
    return {
      detail: {},
      secondaryDialog: false,
      confirmLoading: false,
      ruleForm: {
        paymentPassword: ''
      },
      rules: {
        paymentPassword: [{ required: true, message: 'This field cannot be empty', trigger: 'blur' }]
      },
      forgotPassword: false,
      paymentType: ['Offchain', 'Onchain']
    };
  },
  watch: {
    submitData (n, o) {
      this.detail = n;
    },
    secondaryDialog (n, o) {
      if (!n) {
        this.ruleForm.paymentPassword = '';
      }
    }
  },
  props: ['submitData'],
  components: {
    setPassword
  },
  methods: {
    isEmpty (str) {
      return str || '-';
    },
    submitOrder () {
      this.$refs.ruleForm.validate(async valid => {
        if (valid) {
          this.confirmLoading = true;
          let params = Object.assign({}, this.detail);
          // params.currencyType = params.paymentType;
          params.secondaryPwd = md5(this.ruleForm.paymentPassword).toUpperCase();
          const data = await absNewTrade({
            data: {
              ...params
            },
            slient: true,
            notify: notify.error
          });
          this.confirmLoading = false;
          if (data.code === '1000') {
            this.secondaryDialog = false;
            this.$emit('nextStep', { step: 2 });
          }
        }
      });
    },
    formatTime (time) {
      return formatDate(time);
    },
    formatNumber (num) {
      return parseFloat(num) || '-';
    },
    previous () {
      this.$emit('nextStep', { step: 0 });
    },
    nextStep () {
      this.secondaryDialog = true;
    }
  }
};
</script>
<style scoped lang="scss">
.trade-review {
  padding: 0 40px;
  .label {
    font-size: 14px;
    color: #8D93A1;
  }
  .value {
    font-size: 14px;
    color: #001F3B;
  }
  .el-row {
    margin-bottom: 20px;
  }
  .submit-box {
    margin-top: 80px;
    text-align: center;
    button {
      width: 298px;
      margin-right: 30px;
      & + button {
        margin-right: 0;
      }
    }
  }
}
</style>
<style lang="scss">
.trade-review {
  .password-dialog {
    color: #001F3B;
    .password-form-item {
      position: relative;
      .forgot {
        position: absolute;
        right: 0px;
        bottom: -35px;
        span {
          cursor: pointer;
        }
      }
    }
    .el-dialog__body {
      padding: 0 40px;
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
      padding-top: 30px;
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
