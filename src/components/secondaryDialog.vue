<template>
  <div class="secondary-password-dialog">
    <el-dialog title="Payment" :visible.sync="secondaryDialog" width="744px" :close-on-click-modal="false"
      :show-close="!passwordLoading" :close-on-press-escape="false" class="payment-dialog" @close="closeDialog">
      <div class="payment-info">
        <p class="label">Amount Payable ({{dataObj.currency}})</p>
        <p class="amount">{{formatNumber(dataObj.payAmount)}}</p>
      </div>
      <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="190px" label-position="left" class="form-box">
        <el-form-item label="Payment Address:" prop="paymentAddress" class="address">
          <el-select v-model="ruleForm.paymentAddress" :disabled="passwordLoading" style="width: 100%;">
            <el-option v-for="item in addressList" :key="item.id" :label="`${item.address}`" :value="item.address"></el-option>
          </el-select>
          <div class="available">Available:
            <i class="el-icon-loading" v-if="addressBalanceLoading"></i>
            <span v-else>{{addressBalance}} {{dataObj.currency}}</span>
          </div>
        </el-form-item>
        <el-form-item label="Secondary Password:" prop="paymentPassword" class="password">
          <el-input type="password" v-model="ruleForm.paymentPassword" autocomplete="off" :disabled="passwordLoading"></el-input>
          <div class="forgot" @click="forgotPassword = true">Forgot Password?</div>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="closeDialog">Cancel</el-button>
        <el-button type="primary" @click="submitOrder" :loading="passwordLoading">Confirm</el-button>
      </span>
    </el-dialog>
    <setPassword :isShow="forgotPassword" :changeType="2" @closeDialog="forgotPassword = false" />
  </div>
</template>
<script>
import { getBalance } from '@/api';
import { notify } from '@/common/util';
import setPassword from '@/components/setPassword';

export default {
  name: 'secondaryPasswordDialog',
  data () {
    return {
      secondaryDialog: false,
      passwordLoading: false,
      dataObj: {},
      addressList: [],
      addressBalanceLoading: false,
      addressBalance: '',
      ruleForm: {
        paymentPassword: '',
        paymentAddress: ''
      },
      rules: {
        paymentPassword: [{ required: true, message: 'This field cannot be empty', trigger: 'blur' }],
        paymentAddress: [{ required: true, message: 'This field cannot be empty', trigger: 'change' }]
      },
      forgotPassword: false
    };
  },
  props: ['isShow', 'currentData', 'loading', 'addressListData'],
  components: {
    setPassword
  },
  methods: {
    formatNumber (num) {
      return parseFloat(num) || '-';
    },
    closeDialog () {
      this.$emit('closeDialog');
    },
    async getAddressBalance (currency, userAddress, currencyType) {
      this.addressBalanceLoading = true;
      const data = await getBalance({
        data: {
          currency,
          userAddress,
          currencyType
        },
        slient: true,
        notify: notify.error
      });
      this.addressBalanceLoading = false;
      this.addressBalance = data.data.data;
    },
    async submitOrder () {
      this.$refs.ruleForm.validate(valid => {
        if (valid) {
          this.$emit('submitPassword', { orderNo: this.dataObj.orderNo, secondaryPwd: this.ruleForm.paymentPassword, address: this.ruleForm.paymentAddress });
        }
      });
    }
  },
  watch: {
    isShow (n, o) {
      this.secondaryDialog = n;
      if (!n) {
        this.ruleForm.paymentPassword = '';
      } else {
        this.addressList = [{
          address: this.currentData.bidAddress,
          id: 1
        }];
        this.getAddressBalance(this.currentData.currency, this.currentData.bidAddress, this.currentData.currencyType);
      }
    },
    loading (n, o) {
      this.passwordLoading = n;
    },
    currentData (n, o) {
      this.dataObj = n;
    },
    addressListData: {
      deep: true,
      handler: function (n, o) {
        this.ruleForm.paymentAddress = n[0].address;
        this.addressList = n;
      }
    }
  },
  created () {
    this.secondaryDialog = this.isShow;
    this.passwordLoading = this.loading;
    this.dataObj = this.currentData || {};
    this.addressList = this.addressListData;
    if (this.dataObj.currency && this.dataObj.bidAddress && this.dataObj.currencyType) {
      this.getAddressBalance(this.dataObj.currency, this.dataObj.bidAddress, this.dataObj.currencyType);
    }
  }
};
</script>
<style lang="scss">
.secondary-password-dialog {
  .payment-dialog {
    color: #001F3B;
    .payment-info {
      width: 100%;
      height: 128px;
      background: url(../assets/images/pay-bg.png) no-repeat center center;
      background-size: 100% 100%;
      border-radius: 8px;
      padding: 30px 0;
      color: #fff;
      text-align: center;
      margin-bottom: 40px;
      .label {
        font-size: 16px;
        margin-bottom: 10px;
      }
      .amount {
        font-size: 38px;
      }
    }
    .form-box {
      .el-form-item__label {
        font-size: 16px;
        color: #8D93A1;
      }
      .address {
        position: relative;
        margin-bottom: 40px;
        .available {
          position: absolute;
          right: 0px;
          bottom: -35px;
          span {
            color: #214285;
          }
        }
      }
      .password {
        position: relative;
        margin-bottom: 40px;
        .forgot {
          position: absolute;
          right: 0px;
          bottom: -35px;
          color: #8D93A1;
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
