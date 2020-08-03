<template>
  <div class="payment" v-loading="loading">
    <el-form :model="ruleForm" ref="ruleForm" label-width="210px"
      class="payment-form" label-position="left" :rules="rules">
      <el-form-item label="Coupon Rate：" prop="couponRate" class="coupon-rate">
        <el-input v-model="ruleForm.couponRate" placeholder="Enter the annual coupon rate" autocomplete="off">
          <span slot="suffix">%</span>
        </el-input>
      </el-form-item>
      <el-form-item label="Coupon Frequency：" prop="couponFrequency">
        <el-select v-model="ruleForm.couponFrequency">
          <el-option label="Quarterly" value="0"></el-option>
          <el-option label="Semi-annually" value="1"></el-option>
          <el-option label="Annually" value="2"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="Coupon Periods：" prop="couponPeriods">
        <el-input v-model="ruleForm.couponPeriods" placeholder="Enter the coupon period" maxlength="4"></el-input>
      </el-form-item>
      <el-form-item label="First Settlement Date：" prop="firstSettlementDate">
        <el-date-picker v-model="ruleForm.firstSettlementDate" prefix-icon="el-icon-date" :picker-options="{
          selectableRange: `${firstPicker.hours}:${firstPicker.minutes}:${firstPicker.seconds} - 23:59:59`,
          disabledDate (time) {
            return time.getTime() < (Date.now() - 8.64e7);
          }
        }"
          type="datetime" format="yyyy-MM-dd  HH:mm:ss" @change="changeFirstDate"></el-date-picker>
      </el-form-item>
      <el-form-item label="Maturity Date：" prop="maturityDate">
        <el-input v-model="ruleForm.maturityDate" disabled></el-input>
      </el-form-item>
      <el-form-item label="Settlement Date：" prop="redemptionDate">
        <el-date-picker v-model="ruleForm.redemptionDate" prefix-icon="el-icon-date" :picker-options="{
          selectableRange: `${maturityDate.hours}:${maturityDate.minutes}:${maturityDate.seconds} - 23:59:59`,
          disabledDate (time) {
            const currentTime = new Date(ruleForm.firstSettlementDate);
            if (currentTime.getHours() === 0 && currentTime.getMinutes() === 0 && currentTime.getSeconds() === 0) {
              return time.getTime() < (new Date(ruleForm.maturityDate).getTime());
            } else {
              return time.getTime() < (new Date(ruleForm.maturityDate).getTime() - 8.64e7);
            }
          }
        }" type="datetime" format="yyyy-MM-dd  HH:mm:ss" @change="changeRedemption"></el-date-picker>
      </el-form-item>
      <el-form-item label="Coupon Payment Dates：" prop="couponPaymentDate" class="payment-date-table">
        <el-table :data="ruleForm.paymentDateTable" style="width: 100%" stripe>
          <el-table-column prop="periods" label="Coupon Periods"></el-table-column>
          <el-table-column prop="time" label="Timestamp"></el-table-column>
        </el-table>
      </el-form-item>
      <el-form-item label="Callable Bond：" prop="callable">
        <el-radio v-model="ruleForm.callable" :label="true">Callable</el-radio>
        <el-radio v-model="ruleForm.callable" :label="false">Non-Callable</el-radio>
      </el-form-item>

      <el-form :model="ruleForm" ref="callableDateForm"
        class="callable-dates" label-position="left" :rules="rules">
        <el-form-item  label="" prop="callableDate" class="callable-bond">
          <p class="time-label">Callable Dates：</p>
          <div class="bond-time-picker">
            <el-date-picker
              v-model="ruleForm.callableDate"
              prefix-icon="el-icon-date"
              ref="mydate"
              type="datetime"
              format="yyyy-MM-dd HH:mm:ss"
              :picker-options="{
                disabledDate (time) {
                  return time.getTime() < (Date.now() - 8.64e7);
                },
                selectableRange: `${callableDateLimit.hours}:${callableDateLimit.minutes}:${callableDateLimit.seconds} - 23:59:59`
              }"
              :disabled="!ruleForm.callable || ruleForm.callableDateList.length >= 10"
            ></el-date-picker>
            <div class="add-bond-btn" v-if="ruleForm.callable && ruleForm.callableDateList.length < 10" @click="addCallableDate">
              <img src="../../../../assets/images/add.png" alt="+">
            </div>
          </div>
        </el-form-item>
        <template v-if="ruleForm.callable">
          <div class="added-bond" v-for="(v, k) in ruleForm.callableDateList" :key="k">
            <el-input v-model="v.value" disabled></el-input>
            <div class="subtract-bond-btn" @click="ruleForm.callableDateList.splice(k, 1)">
              <img src="../../../../assets/images/dis-reduce.png" width="26" height="26" alt="reduce">
            </div>
          </div>
        </template>
      </el-form>
       <el-form-item label="Disbursement Token：">
        <el-radio v-model="ruleForm.disbursementMethod" label="1">Digital Currency</el-radio>
        <el-radio v-model="ruleForm.disbursementMethod" label="0">Certificate</el-radio>
      </el-form-item>
      <el-form-item label="" prop="disbursementCode">
        <el-select v-model="ruleForm.disbursementCode" placeholder="">
          <el-option v-for="item in chooseCurrencyList" :key="item"
            :label="item"
            :value="item">
          </el-option>
        </el-select>
        <!-- <template v-if="ruleForm.paymentMethod === '1'">
          <el-select v-model="ruleForm.chooseCurrency" style="width: 200px;">
            <el-option v-for="item in chooseCurrencyList" :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
          <el-input v-model="ruleForm.currencyToken" style="display: inline-block;width: 280px;margin-left: 4px;" maxlength="8"></el-input>
        </template>
        <el-input v-model="ruleForm.currencyToken" maxlength="16" v-else></el-input> -->
      </el-form-item>
      <!-- <el-form-item label="Disbursement Address:(Contract)" class="disbursement-address" prop="disbursementTokenAddress">
        <el-input v-model="ruleForm.disbursementTokenAddress" disabled></el-input>
      </el-form-item> -->
    </el-form>
    <div class="form-btns">
      <el-button @click="$router.push({ name: 'DisIssueBondsInformation', query: { serialNo: $route.query.serialNo } })">Previous</el-button>
      <el-button type="primary" @click="next">Next</el-button>
    </div>
  </div>
</template>
<script>
import moment from 'moment';
import { getDisbursementAddress, getSecurityInfo, newSecurity } from '@/api/distribution-center';
import { assetTokenCurrency } from '@/api/common';
import { notify, calculatePeriod } from '@/common/util';

export default {
  name: 'Payment',
  data () {
    const validatorRate = (rule, value, callback) => {
      // this.ruleForm.couponRate = value.toString().replace(/[^\d]/g, '');
      if (!this.ruleForm.couponRate) {
        // callback(new Error('This field is required.'));
      } else if (this.ruleForm.couponRate <= 0) {
        callback(new Error('Please enter a number greater than 0'));
      } else if (parseInt(this.ruleForm.couponRate) > 100) {
        callback(new Error('Please enter a number less than 100'));
      } else {
        callback();
      }
    };
    const validatorPeriods = (rule, value, callback) => {
      if (!value) {
        // callback(new Error('This field is required.'));
      } else {
        this.ruleForm.couponPeriods = value.toString().replace(/[^\d]/g, '');
        callback();
      }
    };
    // const then = this;
    const nowDate = new Date();
    return {
      ruleForm: {
        couponRate: '',
        couponFrequency: '0',
        couponPeriods: '',
        firstSettlementDate: '',
        maturityDate: '',
        redemptionDate: '',
        paymentDateTable: [],
        callable: false,
        callableDate: '',
        callableDateList: [],
        disbursementMethod: '1',
        // chooseCurrency: '',
        // currencyToken: '',
        disbursementTokenAddress: '',
        disbursementCode: ''
      },
      maturityDate: {
        hours: '00',
        minutes: '00',
        seconds: '00'
      },
      firstPicker: {
        hours: new Date().getHours() < 10 ? '0' + new Date().getHours() : new Date().getHours() || '',
        minutes: new Date().getMinutes() < 10 ? '0' + new Date().getMinutes() : new Date().getMinutes() || '',
        seconds: new Date().getSeconds() < 10 ? '0' + new Date().getSeconds() : new Date().getSeconds() || ''
      },
      copyDisbursementTokenAddress: '',
      loading: false,
      chooseCurrencyList: [],
      // chooseCurrencyList: [
      //   {
      //     label: 'USD',
      //     value: 'USD'
      //   }, {
      //     label: 'EUR',
      //     value: 'EUR'
      //   }, {
      //     label: 'SGD',
      //     value: 'SGD'
      //   }, {
      //     label: 'GBP',
      //     value: 'GBP'
      //   }
      // ],
      rules: {
        couponRate: [{ required: true, trigger: 'blur', message: 'This field is required.' }, { validator: validatorRate, trigger: ['change', 'blur'] }],
        couponFrequency: [{ required: true, trigger: 'blur', message: 'This field is required.' }],
        maturityDate: [{ required: true, trigger: 'change', message: 'This field is required.' }],
        callableDate: [{ required: true, trigger: 'blur', message: 'This field is required.' }],
        redemptionDate: [{ required: true, trigger: 'change', message: 'This field is required.' }, { required: true, trigger: 'blur', message: 'This field is required.' }],
        disbursementMethod: [{ required: true, trigger: 'change', message: 'This field is required.' }],
        disbursementTokenAddress: [{ required: true, trigger: 'blur', message: 'This field is required.' }],
        callable: [{ required: true, trigger: 'blur', message: 'This field is required.' }],
        // currencyToken: [{ required: true, trigger: 'blur', message: 'This field is required.' }],
        couponPeriods: [{ required: true, trigger: 'blur', message: 'This field is required.' }, { validator: validatorPeriods, trigger: 'change' }],
        firstSettlementDate: [{ required: true, trigger: 'blur', message: 'This field is required.' }]
      },
      callableDateList: [],
      callableDateLimit: {
        hours: nowDate.getHours(),
        minutes: nowDate.getMinutes(),
        seconds: nowDate.getSeconds()
      },
      currencyTokenTimer: null,
      disbursementAddressError: true
    };
  },
  watch: {
    'ruleForm.redemptionDate': function (n, o) {
      if (this.ruleForm.maturityDate) {
        if (new Date(n).getDate() === new Date(this.ruleForm.maturityDate).getDate()) {
          this.maturityDate = {
            hours: new Date(this.ruleForm.maturityDate).getHours() < 10 ? '0' + new Date(this.ruleForm.maturityDate).getHours() : new Date(this.ruleForm.maturityDate).getHours() || '',
            minutes: new Date(this.ruleForm.maturityDate).getMinutes() < 10 ? '0' + new Date(this.ruleForm.maturityDate).getMinutes() : new Date(this.ruleForm.maturityDate).getMinutes() || '',
            seconds: new Date(this.ruleForm.maturityDate).getSeconds() < 10 ? '0' + new Date(this.ruleForm.maturityDate).getSeconds() : new Date(this.ruleForm.maturityDate).getSeconds() || ''
          };
        } else {
          this.maturityDate = {
            hours: '00',
            minutes: '00',
            seconds: '00'
          };
        }
      }
    },
    'ruleForm.firstSettlementDate': function (n, o) {
      if (n.getTime() < Date.now()) {
        this.ruleForm.firstSettlementDate = new Date();
      }
      if (n.getDate() === new Date().getDate()) {
        this.firstPicker = {
          hours: new Date().getHours() < 10 ? '0' + new Date().getHours() : new Date().getHours() || '',
          minutes: new Date().getMinutes() < 10 ? '0' + new Date().getMinutes() : new Date().getMinutes() || '',
          seconds: new Date().getSeconds() < 10 ? '0' + new Date().getSeconds() : new Date().getSeconds() || ''
        };
      } else {
        this.firstPicker = {
          hours: '00',
          minutes: '00',
          seconds: '00'
        };
      }
    },
    'ruleForm.disbursementCode': function (n, o) {
      if (n) {
        this.getAddress();
      }
    },
    // 'ruleForm.chooseCurrency': function (n, o) {
    //   if (this.ruleForm.currencyToken) {
    //     this.getAddress();
    //   }
    // },
    'ruleForm.maturityDate': function (n, o) {
      this.maturityDate = {
        hours: new Date(this.ruleForm.maturityDate).getHours() < 10 ? '0' + new Date(this.ruleForm.maturityDate).getHours() : new Date(this.ruleForm.maturityDate).getHours() || '',
        minutes: new Date(this.ruleForm.maturityDate).getMinutes() < 10 ? '0' + new Date(this.ruleForm.maturityDate).getMinutes() : new Date(this.ruleForm.maturityDate).getMinutes() || '',
        seconds: new Date(this.ruleForm.maturityDate).getSeconds() < 10 ? '0' + new Date(this.ruleForm.maturityDate).getSeconds() : new Date(this.ruleForm.maturityDate).getSeconds() || ''
      };
    },
    'ruleForm.couponRate': function (n, o) {
      if (!/^(([1-9]\d*)|0)\.?(\d{1,4})?$/.test(n) && n) {
        this.ruleForm.couponRate = o;
      }
    },
    'ruleForm.disbursementMethod': function (n, o) {
      // if (n === '0') {
      //   this.ruleForm.currencyToken = '';
      // } else {
      //   this.ruleForm.currencyToken = '';
      //   this.ruleForm.chooseCurrency = 'USD';
      // }
      // this.ruleForm.currencyToken = '';
      // this.ruleForm.chooseCurrency = '';
      // this.$refs.ruleForm.clearValidate('currencyToken');
      this.ruleForm.disbursementCode = '';
      this.getTokenCurrency();
    },
    // 'ruleForm.currencyToken': function (n, o) {
    //   // if (this.ruleForm.paymentMethod === '1') {
    //   if (/^[0-9a-zA-Z]+$/.test(n) || n === '') {
    //     this.ruleForm.currencyToken = n.toUpperCase();
    //     clearTimeout(this.currencyTokenTimer);
    //     if (this.ruleForm.currencyToken) {
    //       this.currencyTokenTimer = setTimeout(() => {
    //         this.getAddress();
    //       }, 700);
    //     }
    //   } else {
    //     this.ruleForm.currencyToken = o;
    //   }
    //   // }
    // },
    'ruleForm.callable': function (n, o) {
      if (!n) {
        this.ruleForm.callableDate = '';
      }
    },
    'ruleForm.couponFrequency': function (n, o) {
      if (this.ruleForm.firstSettlementDate && n !== '') {
        this.ruleForm.paymentDateTable = calculatePeriod(this.ruleForm.firstSettlementDate, n, this.ruleForm.couponPeriods);
        this.ruleForm.maturityDate = this.ruleForm.paymentDateTable[this.ruleForm.paymentDateTable.length - 1].time;
        this.ruleForm.redemptionDate = this.ruleForm.maturityDate;
        const lastPeriods = this.ruleForm.paymentDateTable[this.ruleForm.paymentDateTable.length - 1].periods;
        this.ruleForm.paymentDateTable[this.ruleForm.paymentDateTable.length - 1].periods = lastPeriods + ' (Redemption)';
      }
    },
    'ruleForm.couponPeriods': function (n, o) {
      if (n === '0') {
        this.ruleForm.couponPeriods = '';
      } else if (/^[0-9]+$/.test(n) || n === '') {
        this.ruleForm.couponPeriods = n;
      } else {
        this.ruleForm.couponPeriods = o;
      }
      if (this.ruleForm.firstSettlementDate && this.ruleForm.couponPeriods !== '' && this.ruleForm.couponPeriods !== '0') {
        this.ruleForm.couponPeriods = this.ruleForm.couponPeriods.toString().replace(/[^\d]/g, '');
        this.ruleForm.paymentDateTable = calculatePeriod(this.ruleForm.firstSettlementDate, this.ruleForm.couponFrequency, this.ruleForm.couponPeriods);
        this.ruleForm.maturityDate = this.ruleForm.paymentDateTable[this.ruleForm.paymentDateTable.length - 1].time;
        this.ruleForm.redemptionDate = this.ruleForm.maturityDate;
        const lastPeriods = this.ruleForm.paymentDateTable[this.ruleForm.paymentDateTable.length - 1].periods;
        this.ruleForm.paymentDateTable[this.ruleForm.paymentDateTable.length - 1].periods = lastPeriods + ' (Redemption)';
      } else {
        this.ruleForm.paymentDateTable = [];
      }
    },
    'ruleForm.callableDate': function (val, oldVal) {
      const nowDate = new Date();
      const date = new Date(val);
      let startLimit = { };
      // 如果是选择的今天，则时分只能选择现在时分及之后的
      if (date.getDate() === nowDate.getDate()) {
        startLimit = {
          hours: nowDate.getHours() < 10 ? '0' + nowDate.getHours() : `${nowDate.getHours()}` || '',
          minutes: nowDate.getMinutes() < 10 ? '0' + nowDate.getMinutes() : `${nowDate.getMinutes()}` || '',
          seconds: nowDate.getSeconds() < 10 ? '0' + nowDate.getSeconds() : `${nowDate.getSeconds()}` || ''
        };
      // 如果是选择的今天之后的日期，则时分可以从00:00开始选起
      } else {
        startLimit = {
          hours: '00',
          minutes: '00',
          seconds: '00'
        };
      }
      this.callableDateLimit = startLimit;
    }
  },
  created () {
    this.getBeforeInfo();
    this.getTokenCurrency();
    // this.getAddress();
  },
  methods: {
    changeRedemption (time) {
      if (this.ruleForm.paymentDateTable.length > 0) {
        this.ruleForm.paymentDateTable[this.ruleForm.paymentDateTable.length - 1].time = moment(time).format('YYYY-MM-DD HH:mm:ss');
      }
    },
    async getBeforeInfo () {
      if (this.$route.query.serialNo) {
        this.loading = true;
        const data = await getSecurityInfo({
          serialNo: this.$route.query.serialNo,
          slient: true
        });
        this.loading = false;
        if (data.code === '1000') {
          for (const i in this.ruleForm) {
            this.ruleForm[i] = data.data[i];
          }
          for (const i in this.ruleForm) {
            if (!this.ruleForm[i]) {
              this.ruleForm[i] = '';
            }
          }
          this.ruleForm.disbursementMethod = data.data.disbursementToken ? data.data.disbursementToken.split(',')[0] : '1';
          this.ruleForm.chooseCurrency = data.data.disbursementToken ? data.data.disbursementToken.split(',')[1] : ''; // 'USD';
          // this.$nextTick(() => {
          //   this.ruleForm.currencyToken = data.data.disbursementToken ? data.data.disbursementToken.split(',')[2] : '';
          // });
          this.ruleForm.callable = data.data.callable === true;
          this.ruleForm.callableDateList = data.data.callableDate ? data.data.callableDate.split(',').map(v => { return { value: moment(parseInt(v)).format('YYYY-MM-DD HH:mm:ss') }; }) : [];
          this.ruleForm.firstSettlementDate = data.data.firstSettlementDate ? new Date(data.data.firstSettlementDate) : '';
          this.ruleForm.couponFrequency = data.data.couponFrequency ? data.data.couponFrequency : '0';
          if (!data.data.disbursementTokenAddress) {
            this.ruleForm.disbursementTokenAddress = this.copyDisbursementTokenAddress;
          }
          this.ruleForm.paymentDateTable = [];
        }
      }
    },
    async getAddress () {
      this.loading = true;
      // const { paymentMethod, chooseCurrency, currencyToken } = this.ruleForm;

      const data = await getDisbursementAddress({
        code: this.ruleForm.disbursementCode, // paymentMethod === '1' ? chooseCurrency + currencyToken : currencyToken,
        slient: true,
        notify: notify.error
      });
      this.loading = false;
      if (data.code === '1000') {
        this.ruleForm.disbursementTokenAddress = data.data;
        this.copyDisbursementTokenAddress = data.data;
        this.disbursementAddressError = false;
      } else {
        this.disbursementAddressError = true;
      }
    },
    changeFirstDate (data) {
      if (!data) return;
      if (this.ruleForm.couponPeriods) {
        this.ruleForm.paymentDateTable = calculatePeriod(data, this.ruleForm.couponFrequency, this.ruleForm.couponPeriods);
        this.ruleForm.maturityDate = this.ruleForm.paymentDateTable[this.ruleForm.paymentDateTable.length - 1].time;
        this.ruleForm.redemptionDate = this.ruleForm.maturityDate;
        const lastPeriods = this.ruleForm.paymentDateTable[this.ruleForm.paymentDateTable.length - 1].periods;
        this.ruleForm.paymentDateTable[this.ruleForm.paymentDateTable.length - 1].periods = lastPeriods + ' (Redemption)';
      }
    },
    addCallableDate () {
      this.$refs.callableDateForm.validate(valid => {
        if (valid) {
          const filterArr = this.ruleForm.callableDateList.filter(v => new Date(v.value).getTime() === this.ruleForm.callableDate.getTime());
          if (filterArr.length <= 0) {
            this.ruleForm.callableDateList.push({
              value: new Date(this.ruleForm.callableDate).getTime()
            });
            // this.callableDateList.push({
            //   value: new Date(this.ruleForm.callableDate).getTime()
            // });
            const arr = this.ruleForm.callableDateList.map(v => v.value); // this.callableDateList.map(v => v.value);
            arr.sort((a, b) => {
              return a - b;
            });
            this.ruleForm.callableDateList = arr.map(v => { return { value: moment(v).format('YYYY-MM-DD HH:mm:ss') }; });
          }
          this.ruleForm.callableDate = '';
        }
      });
    },
    getTokenCurrency () {
      this.loading = true;

      assetTokenCurrency({
        data: {
          type: this.ruleForm.disbursementMethod
        }
      }).then(res => {
        this.loading = false;
        const { code, data } = res.data;
        if (code === '1000') {
          if (!data || (data && !data.length)) {
            this.chooseCurrencyList = [];
            return;
          }
          this.chooseCurrencyList = data.map(item => item.code);
        }
      }).catch(() => {
        this.loading = false;
        this.chooseCurrencyList = [];
      });
    },
    next () {
      this.$refs.ruleForm.validate(async valid => {
        const totalValid = true;
        if (valid && totalValid) {
          const params = Object.assign({}, this.ruleForm);
          params.serialNo = this.$route.query.serialNo;
          params.firstSettlementDate = this.ruleForm.firstSettlementDate.getTime();
          params.maturityDate = new Date(this.ruleForm.maturityDate).getTime();
          params.redemptionDate = new Date(this.ruleForm.redemptionDate).getTime();
          params.callableDate = this.ruleForm.callableDateList.map(v => new Date(v.value).getTime()).join(',');
          // params.disbursementToken = this.ruleForm.paymentMethod === '0' ? `${this.ruleForm.paymentMethod},'',${this.ruleForm.currencyToken}` : `${this.ruleForm.paymentMethod},${this.ruleForm.chooseCurrency},${this.ruleForm.currencyToken}`;
          // params.disbursementCode = params.disbursementToken.slice(2).replace(/,/g, '').replace(/''/g, '');
          delete params.paymentDateTable;
          delete params.callableDateList;
          // delete params.paymentMethod;
          delete params.chooseCurrency;
          // delete params.currencyToken;
          if (this.disbursementAddressError) {
            this.$message.error('Disbursement Address abnormal');
            return;
          }
          this.loading = true;
          const data = await newSecurity({ data: params, slient: true, notify: notify.error });
          if (data.code === '1000') {
            this.$router.push({ name: 'DisIssueBondsDocument', query: { serialNo: params.serialNo } });
          }
          this.loading = false;
        }
      });
    }
  }
};
</script>
<style scoped lang="scss">
.payment {
  .payment-form {
    // padding-left: 30px;
    width: 724px;
    margin: 0 auto;
    font-size: 16px;
    color: #192231;
    .el-select {
      width: 100%;
    }
    .el-date-editor {
      width: 100%;
    }
    .callable-bond {
      width: 513px;
      margin-left: 379px;
      .bond-time-picker {
        position: relative;
        .add-bond-btn {
          position: absolute;
          right: -52px; // -70px;
          top: 50%;
          transform: translateY(-50%);
          width: 28px;
          height: 28px;
          border-radius: 50%;
          text-align: center;
          line-height: 23px;
          color: #fff;
          font-size: 32px;
          cursor: pointer;
          img {
            width: 100%;
            height: 100%;
          }
        }
      }
      .time-label {
        font-size: 16px;
        color: #8D93A1;
        margin-bottom: 5px;
        margin-top: 10px;
      }
    }
    .added-bond {
      // width: 580px;
      // margin-left: 379px;
      // padding-right: 67px;

      margin-bottom: 22px;
      position: relative;

      width: 580px;
      margin-left: 379px;
      padding-right: 67px;
      &:hover .subtract-bond-btn{
        display: block;
      }
      .el-input {
        // width: 484px;
      }
      .subtract-bond-btn {
        position: absolute;
        right: 15px; //0px;
        top: 50%;
        transform: translateY(-50%);
        width: 28px;
        height: 28px;
        border-radius: 50%;
        text-align: center;
        line-height: 23px;
        color: #fff;
        font-size: 32px;
        cursor: pointer;
        display: none;
        &:hover {
          display: block;
        }
        img {
          width: 100%;
          height: 100%;
        }
      }
    }
    .currency-box {
      .currency-title {
        color: #8D93A1;
        margin-bottom: 12px;
        padding-top: 5px;
        margin-left: 210px;
      }
    }
    .callable-dates {
      // padding: 0 30px 20px 30px;
      background-color: #FBFBFB;
      // margin-bottom: 20px;
      margin: 0 -170px 20px;
      padding: 0 0 20px 0;
    }
    .disbursement-token {
      // background-color: #FBFBFB;
      // width: 1080px;
      // padding-right: 385px;
    }
  }
  .form-btns {
    width: 724px;
    margin-left: auto;
    margin-right: auto;
  }
}
</style>
<style lang="scss">
.payment {
    .coupon-rate {
      .el-input__suffix {
        right: 10px;
      }
    }
    .payment-date-table {
      .el-table__header-wrapper {
        th {
          background-color: #FBFBFB;
          padding-left: 10px;
          font-size: 16px;
          color: #8D93A1;
          font-weight: normal;
        }
      }
      .el-table__body-wrapper {
        td {
          padding-left: 10px;
        }
      }
      .el-table {
        border: 1px solid #ebeff6;
      }
    }
    .disbursement-address {
      .el-form-item__label {
        line-height: 20px;
      }
    }
    .currency-box {
      .el-select {
        .el-input__inner {
          border-color: #DDDFE7;
        }
      }
      .el-form-item__error {
        left: 200px;
      }
    }
    .el-input__prefix {
      left: 15px;
    }
    // .el-date-editor {
      .el-input--prefix .el-input__inner {
        padding-left: 40px;
      }
    // }
}
</style>
