<template>
  <div class="new-trade-basic" v-loading="loading">
    <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="180px" label-position="left">
      <el-form-item label="Token Code:" prop="tokenCode">
        <el-select v-model="ruleForm.tokenCode" placeholder="Please select" style="width: 100%;">
          <el-option
            v-for="item in tokenCodeList"
            :key="item.tokenCode"
            :label="item.tokenCode"
            :value="item.tokenCode">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="Payment Address:" prop="userAddress" class="payment-address">
        <el-select v-model="ruleForm.userAddress" placeholder="Please select" style="width: 100%;">
          <el-option
            v-for="item in paymentAddressList"
            :key="item.id"
            :label="`【${item.addressTag}】${item.address}`"
            :value="item.address">
          </el-option>
        </el-select>
        <p class="address-balance">
          Available:
          <i class="el-icon-loading" v-if="addressBalanceLoading"></i>
          <span v-else>{{addressBalance ? addressBalance : '--'}} {{ruleForm.tokenCode}}</span>
        </p>
      </el-form-item>
      <el-form-item label="Trade Quantity:" prop="quantity">
        <el-input v-model="ruleForm.quantity" autocomplete="off" placeholder="Please enter"></el-input>
      </el-form-item>
      <el-form-item label="Counterparty Address:" prop="bidAddress">
        <el-input v-model="ruleForm.bidAddress" autocomplete="off" placeholder="Please enter"></el-input>
      </el-form-item>
      <el-form-item label="Payment Method:" prop="paymentType">
        <template>
          <el-radio v-model="ruleForm.paymentType" :label="2">Onchain</el-radio>
          <el-radio v-model="ruleForm.paymentType" :label="1">Offchain</el-radio>
        </template>
      </el-form-item>
      <div class="unit-price-box">
        <el-form-item label="Unit Price:" prop="price" class="price">
          <el-input v-model="ruleForm.price" autocomplete="off" style="width: 227px;" placeholder="Please enter"></el-input>
        </el-form-item>
        <el-form-item prop="tokenMark" class="currency">
          <el-select v-model="ruleForm.tokenMark" placeholder="Please select" style="width: 227px;margin-left: 30px;">
            <el-option
              v-for="item in currencyList"
              :key="item.type"
              :label="item.currencyCode"
              :value="item.currencyCode">
            </el-option>
          </el-select>
        </el-form-item>
      </div>
      <div class="unit-price-box" v-if="ruleForm.paymentType === 2">
        <el-form-item label="Settlement Token:" prop="currencyType">
          <el-select v-model="ruleForm.currencyType" placeholder="Please select" style="width: 227px;">
            <el-option label="Digital Currency" :value="2"></el-option>
            <el-option label="Certificate" :value="1"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item prop="currency" class="currency">
          <el-select v-model="ruleForm.currency" placeholder="Please select" style="width: 227px;margin-left: 30px;">
            <el-option
              v-for="item in settlementTokenList"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
      </div>
      <div class="unit-price-box">
        <el-form-item label="Trade Period:" prop="orderStartTime">
          <el-date-picker v-model="ruleForm.orderStartTime" type="datetime" :default-time="defaultTime" @focus="startTimeFocus" @change="startTimeFocus"
            placeholder="Start date" style="width: 227px;" :default-value="new Date()" :picker-options="startDateOp"></el-date-picker>
        </el-form-item>
        <el-form-item prop="orderEndTime" class="currency">
          <el-date-picker v-model="ruleForm.orderEndTime" type="datetime" :picker-options="endDateOp"
            placeholder="End date" style="width: 227px;margin-left: 30px;" :default-value="endDefalutV" :disabled="isEndTimeDis"></el-date-picker>
        </el-form-item>
      </div>
      <!-- <el-form-item label="Payment Deadline:" prop="payDeadline" v-if="ruleForm.paymentType === 1">
        <el-date-picker v-model="ruleForm.payDeadline" type="datetime" placeholder="End date"
          style="width: 100%;" :default-time="defaultTime"></el-date-picker>
      </el-form-item> -->
      <el-form-item label="Payment Instruction:" prop="paymentInfo" v-if="ruleForm.paymentType === 1">
        <el-input type="textarea" :autosize="{ minRows: 6 }" placeholder="Please enter"
          v-model="ruleForm.paymentInfo"></el-input>
      </el-form-item>
      <div class="submit-box">
        <el-button @click="exit">Exit</el-button>
        <el-button type="primary" @click="nextStep">Next</el-button>
      </div>
    </el-form>
  </div>
</template>
<script>
import { multiAddresses, preOfferOrder, queryDigitalCurrency, getBalance, getAssetToken } from '@/api';
import { notify, numberExcludeZeroEight } from '@/common/util';
const initCurrency = [
  { currencyName: 'CertificateSGD', currencyCode: 'SGD' },
  { currencyName: 'CertificateUSD', currencyCode: 'USD' },
  { currencyName: 'CertificateEUR', currencyCode: 'EUR' },
  { currencyName: 'CertificateGBP', currencyCode: 'GBP' }];

export default {
  name: 'NewTradeBasic',
  data () {
    const validAddress = (rule, value, callback) => {
      if (value.length < 40 || value.length > 40) {
        callback(new Error('The length has to be 40'));
      } else {
        callback();
      }
    };
    return {
      ruleForm: {
        tokenCode: '',
        userAddress: '',
        quantity: '',
        bidAddress: '',
        paymentType: 2,
        price: '',
        tokenMark: '',
        currencyType: 2,
        currency: '',
        orderStartTime: '',
        orderEndTime: '',
        paymentInfo: ''
        // payDeadline: ''
      },
      tokenCodeList: [],
      paymentAddressList: [],
      currencyList: initCurrency,
      currencyTypeList: [],
      settlementTokenList: [],
      rules: {
        tokenCode: [{ required: true, message: 'This field cannot be empty', trigger: 'change' }],
        userAddress: [{ required: true, message: 'This field cannot be empty', trigger: 'change' }],
        quantity: [{ required: true, message: 'This field cannot be empty', trigger: 'blur' }],
        bidAddress: [{ required: true, message: 'This field cannot be empty', trigger: 'blur' }, { validator: validAddress, trigger: 'change' }],
        paymentType: [{ required: true, message: 'This field cannot be empty', trigger: 'blur' }],
        orderStartTime: [{ required: true, message: 'This field cannot be empty', trigger: 'blur' }],
        orderEndTime: [{ required: true, message: 'This field cannot be empty', trigger: 'blur' }],
        price: [{ required: true, message: 'This field cannot be empty', trigger: 'blur' }],
        tokenMark: [{ required: true, message: 'This field cannot be empty', trigger: 'change' }],
        currencyType: [{ required: true, message: 'This field cannot be empty', trigger: 'blur' }],
        currency: [{ required: true, message: 'This field cannot be empty', trigger: 'change' }],
        paymentInfo: [{ required: true, message: 'This field cannot be empty', trigger: 'blur' }]
        // payDeadline: [{ required: true, message: 'This field cannot be empty', trigger: 'change' }]
      },
      loading: false,
      addressBalanceLoading: false,
      addressBalance: '',
      defaultTime: '',
      startDateOp: {},
      endDateOp: {},
      endDefaultT: null,
      endDefalutV: null,
      isEndTimeDis: true
    };
  },
  created () {
    this.getAddress();
    this.getTokenCode();
  },
  watch: {
    'ruleForm.paymentType': function (n, o) {
      if (n === 2) {
        if (this.ruleForm.tokenMark && this.ruleForm.currencyType) {
          this.getToken();
        }
        this.ruleForm.paymentInfo = '';
      } else {
        this.currencyList = initCurrency;
      }
    },
    'ruleForm.userAddress': function (n, o) {
      if (this.ruleForm.tokenCode) {
        this.getAddressBalance(this.ruleForm.tokenCode, n);
      }
    },
    'ruleForm.tokenCode': function (n, o) {
      if (this.ruleForm.userAddress) {
        this.getAddressBalance(n, this.ruleForm.userAddress);
      }
    },
    'ruleForm.tokenMark': function (n, o) {
      if (this.ruleForm.paymentType === 2) {
        this.getToken();
      }
    },
    'ruleForm.price': function (n, o) {
      if (n && !numberExcludeZeroEight.test(n)) {
        this.ruleForm.price = o;
      }
    },
    'ruleForm.currencyType': function (n, o) {
      this.getToken();
    },
    'ruleForm.orderEndTime': function (n, o) {
      if (n) {
        let satrtTime = this.ruleForm.orderStartTime;
        let startLimit = {
          hours: satrtTime.getHours() < 10 ? '0' + satrtTime.getHours() : satrtTime.getHours() || '',
          minutes: satrtTime.getMinutes() < 10 ? '0' + satrtTime.getMinutes() : satrtTime.getMinutes() || '',
          seconds: satrtTime.getSeconds() < 10 ? '0' + satrtTime.getSeconds() : satrtTime.getSeconds() || ''
        };
        if (n.getFullYear() > satrtTime.getFullYear() || n.getMonth() + 1 > satrtTime.getMonth() + 1 || n.getDate() > satrtTime.getDate()) {
          this.endDateOp.selectableRange = '00:00:00 - 23:59:59';
        }
        if (n.getFullYear() === satrtTime.getFullYear() && n.getMonth() + 1 === satrtTime.getMonth() + 1 && n.getDate() === satrtTime.getDate()) {
          this.endDateOp.selectableRange = `${startLimit.hours}:${parseInt(startLimit.minutes) + 5}:${startLimit.seconds} - 23:59:59`;
        }
      }
    },
    'ruleForm.orderStartTime': function (n, o) {
      if (n) {
        this.isEndTimeDis = false;
        let currentDate = new Date();
        let timeLimit = {
          hours: n.getHours() < 10 ? '0' + n.getHours() : n.getHours() || '',
          minutes: n.getMinutes() < 10 ? '0' + n.getMinutes() : n.getMinutes() || '',
          seconds: n.getSeconds() < 10 ? '0' + n.getSeconds() : n.getSeconds() || ''
        };
        let currentTime = {
          hours: currentDate.getHours() < 10 ? '0' + currentDate.getHours() : currentDate.getHours() || '',
          minutes: currentDate.getMinutes() < 10 ? '0' + currentDate.getMinutes() : currentDate.getMinutes() || '',
          seconds: currentDate.getSeconds() < 10 ? '0' + currentDate.getSeconds() : currentDate.getSeconds() || ''
        };
        if (n.getFullYear() > currentDate.getFullYear() || n.getMonth() + 1 > currentDate.getMonth() + 1 || n.getDate() > currentDate.getDate()) {
          this.startDateOp.selectableRange = '00:00:00 - 23:59:59';
        }
        if (n.getFullYear() === currentDate.getFullYear() && n.getMonth() + 1 === currentDate.getMonth() + 1 && n.getDate() === currentDate.getDate()) {
          this.startDateOp.selectableRange = `${currentTime.hours}:${currentTime.minutes}:${currentTime.seconds} - 23:59:59`;
        }
        this.endDateOp = {
          selectableRange: `${timeLimit.hours}:${parseInt(timeLimit.minutes) + 5}:${timeLimit.seconds} - 23:59:59`,
          disabledDate: time => {
            return time.getTime() < n.getTime() - 8.64e7;
          }
        };
        this.endDefalutV = new Date(n.getTime() + 300000);
        this.ruleForm.orderEndTime = '';
      }
    },
    submitData (n, o) {
      if (n) {
        this.ruleForm = Object.assign({}, n);
        this.$refs.ruleForm.clearValidate();
      }
    }
  },
  props: ['submitData'],
  methods: {
    startTimeFocus () {
      let currentDate = new Date();
      this.defaultTime = `${currentDate.getHours()}:${currentDate.getMinutes()}:${currentDate.getSeconds()}`;
      let startTimeLimit = {
        hours: currentDate.getHours() < 10 ? '0' + currentDate.getHours() : currentDate.getHours() || '',
        minutes: currentDate.getMinutes() < 10 ? '0' + currentDate.getMinutes() : currentDate.getMinutes() || '',
        seconds: currentDate.getSeconds() < 10 ? '0' + currentDate.getSeconds() : currentDate.getSeconds() || ''
      };
      this.startDateOp = {
        selectableRange: `${startTimeLimit.hours}:${startTimeLimit.minutes}:${startTimeLimit.seconds} - 23:59:59`,
        disabledDate: time => {
          return time.getTime() < currentDate.getTime() - 8.64e7;
        }
      };
    },
    getToken () {
      this.ruleForm.currency = '';
      const { currencyType, tokenMark } = this.ruleForm;
      if (!currencyType || !tokenMark) return;
      this.loading = true;
      // 交易这边这俩certificate和digital currency定义跟发行那边不一样
      // 发行模块：0 certificate, 1 digital currency
      // 交易模块：1 certificate, 2 digital currency
      const currencyTypeObj = {
        1: 0,
        2: 1
      };
      getAssetToken({
        data: {
          currency: tokenMark,
          type: currencyTypeObj[currencyType]
        }
      }).then(res => {
        this.loading = false;
        const { code, data } = res.data;
        if (code === '1000') {
          this.settlementTokenList = (data || []).map(item => ({
            label: item.code,
            value: item.code
          }));
        }
      }).catch(() => {
        this.loading = false;
      });
    },
    async getAddressBalance (currency, userAddress) {
      this.addressBalanceLoading = true;
      const data = await getBalance({
        data: {
          currency,
          userAddress
        },
        slient: true,
        notify: notify.error
      });
      this.addressBalanceLoading = false;
      this.addressBalance = data.data.data;
    },
    async getDigitalCurrency (currencyType) {
      this.loading = true;
      const data = await queryDigitalCurrency({ currencyType });
      this.loading = false;
      if (data.data.data) {
        this.currencyList = data.data.data;
      }
    },
    async getTokenCode () {
      this.loading = true;
      const data = await preOfferOrder({
        slient: true,
        notify: notify.error
      });
      this.loading = false;
      this.tokenCodeList = data.data.data.tokenList;
      this.currencyTypeList = data.data.data.currencyTypeList;
    },
    async getAddress () {
      this.loading = true;
      const data = await multiAddresses({
        slient: true,
        notify: notify.error
      });
      this.loading = false;
      if (data.data.data) {
        this.paymentAddressList = data.data.data;
      }
    },
    exit () {
      this.$router.push({
        name: 'BondTrading'
      });
    },
    nextStep () {
      this.$refs.ruleForm.validate(valid => {
        if (valid) {
          this.ruleForm = Object.assign(this.ruleForm, this.tokenCodeList.filter(v => v.tokenCode === this.ruleForm.tokenCode)[0]);
          this.$emit('nextStep', { step: 1, data: this.ruleForm });
        }
      });
    }
  }
};
</script>
<style scoped lang="scss">

</style>
<style lang="scss">
.new-trade-basic {
  padding: 0 269px 0 206px;
  .el-form-item__label {
    font-size: 14px;
    color: #8D93A1;
  }
  .unit-price-box {
    &::after {
      content: '';
      width: 0px;
      height: 0px;
      clear: both;
      display: block;
    }
    .el-form-item {
      float: left;
    }
    .currency {
      .el-form-item__content {
        margin-left: 0px !important;
      }
      .el-form-item__error {
        padding-left: 30px;
      }
    }
  }
  .submit-box {
    margin-top: 80px;
    padding-left: 20px;
    button {
      width: 298px;
      margin-right: 30px;
      & + button {
        margin-right: 0;
      }
    }
  }
  .payment-address {
    position: relative;
    margin-bottom: 40px;
    .address-balance {
      position: absolute;
      right: 0px;
      bottom: -35px;
      color: #8D93A1;
      span {
        color: #214285;
      }
    }
  }
}
</style>
