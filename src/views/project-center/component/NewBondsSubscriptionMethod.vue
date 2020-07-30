<template>
  <div>
    <el-form
      :model="ruleForm"
      :rules="rules"
      ref="ruleForm"
      label-width="190px"
      label-position="left"
      class="form-box"
    >
      <el-form-item label="Subscription Type：" prop="tradeType">
         <el-radio v-model="ruleForm.tradeType" label="2">Public</el-radio>
         <el-radio v-model="ruleForm.tradeType" label="1">Private</el-radio>
      </el-form-item>
      <el-form-item label="Payment Method：" prop="paymentType">
         <el-radio v-model="ruleForm.paymentType" label="2">Onchain</el-radio>
         <el-radio v-model="ruleForm.paymentType" label="1">Offchain</el-radio>
      </el-form-item>
      <!-- v-if="judgeShowItem.oneToOneOffchain || judgeShowItem.oneToOneOnchain" -->
      <el-form-item
        label="Counterparty Address："
        prop="bidAddress"
        :rules="[...rules.bidAddress]"
      >
        <el-input
          v-model.trim="ruleForm.bidAddress"
          placeholder="Please Enter Counter-Party Address"
          autocomplete="off"
          maxlength="40"
        ></el-input>
      </el-form-item>
      <el-form-item label="Unit Price：" prop="up" required>
        <el-col :span="11">
          <el-form-item prop="price">
            <el-input v-model="ruleForm.price"></el-input>
          </el-form-item>
        </el-col>
        <el-col class="line" :span="2">-</el-col>
        <el-col :span="11">
          <el-form-item prop="currency">
            <el-select v-model="ruleForm.currency" placeholder="Select Currency">
              <el-option
                v-for="(item, index) in selCurrencyList"
                :label="item.currencyCode"
                :key="index"
                :value="item.currencyCode"
              ></el-option>
            </el-select>
          </el-form-item>
        </el-col>
      </el-form-item>
      <!-- v-if="judgeShowItem.oneToManyOffchain || judgeShowItem.oneToManyOnchain" -->
      <template>
        <el-form-item label="Max Size：" prop="maxQuantityPer" :rules="[...rules.maxQuantityPer]">
          <el-input
            v-model="ruleForm.maxQuantityPer"
            autocomplete="off"
            :disabled="!ruleForm.quantity"
          ></el-input>
        </el-form-item>
        <el-form-item label="Min Size：" prop="minQuantityOnce" :rules="[...rules.minQuantityOnce]">
          <el-input
            v-model="ruleForm.minQuantityOnce"
            autocomplete="off"
            :disabled="!ruleForm.maxQuantityPer"
          ></el-input>
        </el-form-item>
      </template>
      <!-- v-if="judgeShowItem.oneToManyOffchain || judgeShowItem.oneToManyOnchain" -->
      <template>
        <el-form-item label="Lot：" prop="radio" required>
          <el-radio v-model="ruleForm.radio" label="1">On</el-radio>
          <el-radio v-model="ruleForm.radio" label="2">Off</el-radio>
        </el-form-item>
        <el-form-item prop="priceSize" v-if="ruleForm.radio == '1'" :rules="[...rules.priceSize]">
          <el-input v-model="ruleForm.priceSize" autocomplete="off"></el-input>
        </el-form-item>
      </template>
      <!-- <el-form-item label="Trade Type：" prop="tradeType">
        <el-select v-model="ruleForm.tradeType" placeholder="- -">
          <el-option
            v-for="item in selTradeTypeList"
            :label="item.typeDesc"
            :key="item.type"
            :value="item.type"
          ></el-option>
          1-N Token-Certificate 1 ----1-Many offchain-->
          <!-- 1-1 Token-Certificate 2 ----1-1 offchain -->
          <!-- 1-N Token-Digital Currency 3 ----1-Many onchain -->
          <!-- 1-1 Token-Digital Currency 4 ----1-1 onchain
        </el-select>
      </el-form-item> -->
      <!-- <el-form-item label="Payment：" required>
        <el-col :span="11">
          <el-form-item prop="paymentType">
            <el-select
              v-model="ruleForm.paymentType"
              placeholder="Select Method"
              :disabled="!ruleForm.tradeType"
            >
              <el-option
                v-for="item in selPaymentTypeList"
                :key="item.type"
                :label="item.typeDesc"
                :value="item.type"
              ></el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col class="line" :span="2">-</el-col>
        <el-col :span="11">
          <el-form-item prop="currencyType">
            <el-select v-model="ruleForm.currencyType" disabled placeholder="Token Type">
              <el-option
                v-for="item in selCurrencyTypeList"
                :key="item.type"
                :label="item.typeDesc"
                :value="item.type"
              ></el-option>
            </el-select>
          </el-form-item>
        </el-col>
      </el-form-item> -->
      <!-- <el-form-item label="SMT Code：" prop="smttCode">
        <el-input v-model.trim="ruleForm.smttCode" autocomplete="off" disabled></el-input>
      </el-form-item> -->
      <!-- <el-form-item label="Quantity：" prop="quantity">
        <el-input
          v-model.trim="ruleForm.quantity"
          autocomplete="off"
          :disabled="tokenBalance === '--'"
        ></el-input>
      </el-form-item> -->
      <el-form-item label="Trade Period：" prop="temp" required>
        <el-col :span="11">
          <el-form-item prop="orderStartTime">
            <el-date-picker
              v-model="ruleForm.orderStartTime"
              type="datetime"
              autocomplete="off"
              value-format="timestamp"
              format="yyyy-MM-dd HH:mm"
              :picker-options="{
                    selectableRange: `${startLimit.hours}:${startLimit.minutes}:${startLimit.seconds} - ${startLimit2.hours}:${startLimit2.minutes}:${startLimit2.seconds}`,
                    ...startTimeOption
                }"
            ></el-date-picker>
          </el-form-item>
        </el-col>
        <el-col class="line" :span="2">-</el-col>
        <el-col :span="11">
          <el-form-item prop="orderEndTime">
            <el-date-picker
              v-model="ruleForm.orderEndTime"
              type="datetime"
              autocomplete="off"
              value-format="timestamp"
              format="yyyy-MM-dd HH:mm"
              :disabled="!ruleForm.orderStartTime"
              :default-value="orderEndTimeDefault"
              :picker-options="{
                    selectableRange: `${endLimit.hours}:${endLimit.minutes}:${endLimit.seconds} - ${endLimit2.hours}:${endLimit2.minutes}:${endLimit2.seconds}`,
                    ...endTimeOption
                  }"
            ></el-date-picker>
          </el-form-item>
        </el-col>
      </el-form-item>
      <!-- v-if="selectTradeType && (judgeShowItem.oneToManyOffchain || judgeShowItem.oneToOneOffchain)" -->
      <el-form-item
        label="Payment end time："
        prop="payDeadline"
      >
        <el-date-picker
          v-model="ruleForm.payDeadline"
          prefix-icon="el-icon-date"
          type="datetime"
          placeholder="Select Datetime"
          format="yyyy-MM-dd HH:mm"
          autocomplete="off"
          :disabled="!ruleForm.orderEndTime"
          value-format="timestamp"
          :picker-options="{
                selectableRange: `${paymentTimeLimit.hours}:${paymentTimeLimit.minutes}:${paymentTimeLimit.seconds} - 23:59:59`,
                disabledDate(time) {
                const theTime = time.getTime();
                const orderEndTime = new Date(ruleForm.orderEndTime);
                if (orderEndTime.getHours() === 0 && orderEndTime.getMinutes() === 0 && orderEndTime.getSeconds() === 0) {
                    return theTime < ruleForm.orderEndTime;
                } else {
                    return theTime < ruleForm.orderEndTime - 8.64e7;
                }
                }
              }"
        ></el-date-picker>
      </el-form-item>
    </el-form>
    <div class="form-btns">
      <el-button class="btn-back" @click="$router.push({ name: 'TradeHub' })">Cancel</el-button>
      <el-button type="primary" @click="handleSubmit">Submit</el-button>
    </div>
  </div>
</template>

<script>
import { preOfferOrder, tradeOrderGetSmttCode, queryDigitalCurrency } from '@api/project-center.js';
import { newTradeTypeEnum, paymentMethodEnum } from '@/common/enums.js';
import { notify, secondaryPwdReg, removeComma } from '@/common/util';

const fiveMinutes = 5 * 60 * 1000;
const requiredRule = { required: true, trigger: ['blur', 'change'], message: 'This field is required.' };
// 正整数
const numberRule = {
  validator: (rule, value, callback) => {
    if (value && !/^[1-9]\d*$/.test(value.split(',').join(''))) {
      callback(new Error('Please enter a positive integer'));
      return;
    }
    callback();
  }
};
const initCurrency = [
  { currencyName: 'CertificateSGD', currencyCode: 'SGD' },
  { currencyName: 'CertificateUSD', currencyCode: 'USD' },
  { currencyName: 'CertificateEUR', currencyCode: 'EUR' },
  { currencyName: 'CertificateGBP', currencyCode: 'GBP' }];

export default {
  data () {
    const nowDate = new Date(); // 当前时间
    const maxPerValidator = (rule, value, callback) => {
      /*eslint-disable*/
      let num = value.split(',').join('');
      if (parseFloat(value) === 0) {
        callback(new Error('Please enter a number greater than 0'));
      } else if (+num < +this.ruleForm.minQuantityOnce) {
        callback('Is greater than the min size');
      } else if (+num > +(this.ruleForm.quantity.split(',').join(''))) {
        callback(new Error('Greater than quantity'));
      } else {
        callback();
      }
    };
    const minPerValidator = (rule, value, callback) => {
      let num = value.split(',').join('');
      if (parseFloat(value) === 0) {
        callback(new Error('Please enter a number greater than 0'));
      } else if (+num > +(this.ruleForm.maxQuantityPer.split(',').join(''))) {
        callback('Less than the largest max size');
        return;
      }
      callback();
    };
    return {
      selTradeTypeList: [], // TradeType下拉框数据
      selPaymentTypeList: [], // PaymentType下拉框数据
      selCurrencyTypeList: [], // Payment下的CurrencyType下拉框数据
      // Unit Price币种下拉框数据
      selCurrencyList: initCurrency,
      orderEndTimeDefault: nowDate,
      selectTradeType: '', // 当前选中的tradeType的key
      paymentTimeLimit: {},
      startLimit: {
        hours: nowDate.getHours(),
        minutes: nowDate.getMinutes(),
        seconds: '00'
      },
      endLimit: {},
      endLimit2: {
        hours: '23',
        minutes: '59',
        seconds: '59',
      },
      startLimit2: {
        hours: '23',
        minutes: '59',
        seconds: '59',
      },
      ruleForm: {
        tradeType: ''
      },
      rules: {
        tradeType: [requiredRule],
        paymentType: [requiredRule],
        currencyType: [requiredRule],
        currency: [requiredRule],
        payDeadline: [requiredRule],
        orderStartTime: [requiredRule],
        orderEndTime: [requiredRule],
        priceSize: [requiredRule, numberRule], // Incremental Size
        maxQuantityPer: [requiredRule, {
          validator: maxPerValidator
        }],
        minQuantityOnce: [requiredRule, {
          validator: minPerValidator
        }],
        bidAddress: [requiredRule, {
          validator:  (rule, value, callback) => {
            if (value.length != 40) {
              callback('The length has to be 40');
              return;
            }
            callback();
          }
        }],
        price: [requiredRule, {
          validator: (rule, value, callback) => {
            if (parseFloat(value) === 0) {
              callback(new Error('Please enter a number greater than 0'));
            } else {
              callback();
            }
          }
        }]
      },
       startTimeOption: {
        // selectableRange: `${nowDate.getHours()}:${nowDate.getMinutes()}:59} - 23:59:59`,
        disabledDate: (time) => {
          const theTime = time.getTime();
          const { payDeadline, orderEndTime } = this.ruleForm;
          
          const endTime = new Date(orderEndTime);
          let realTime = orderEndTime;
          if (endTime.getHours() === 0 && endTime.getMinutes() === 0 && endTime.getSeconds() === 0) {
            realTime = orderEndTime - 8.64e7
          }
          return (theTime < Date.now() - 8.64e7) || (payDeadline ? theTime > payDeadline : false)
          || (orderEndTime ? theTime > realTime : false); //
        }
      },
      endTimeOption: {
        // selectableRange: `${nowDate.getHours()}:${this.endTimeMinute}:59} - 23:59:59`,
        disabledDate: (time) => {
          const theTime = time.getTime();
          const { payDeadline, orderStartTime } = this.ruleForm;
          const startTime = new Date(orderStartTime);
          const payTime = new Date(payDeadline);
          let realTime = orderStartTime - 8.64e7;
          let payRealTime = payDeadline;

          if (startTime.getHours() === 0 && startTime.getMinutes() === 0 && startTime.getSeconds() === 0) {
            realTime = orderStartTime
          }
          if (payTime.getHours() === 0 && payTime.getMinutes() === 0 && payTime.getSeconds() === 0) {
            payRealTime = payDeadline - 8.64e7;
          }
          return (orderStartTime ? theTime < realTime  : false)
          || (payDeadline ? theTime > payRealTime : false);
        }
      }
    };
  },
   watch: {
    'ruleForm.tradeType' (val) {
      const value = +val;
      this.selectTradeType = value;
      this.getSmtCodeByQuery();
    },
    'ruleForm.paymentType' (val) {
      if (val == paymentMethodEnum.OffChain) {
        this.ruleForm.currencyType = 1;
      } else {
        this.ruleForm.currencyType = 2;
      }
      this.ruleForm.currency = '';
      this.judgeDigitalCurrency();
    },
    // 小数点后最多输入8位
    'ruleForm.price'(value, o) {
      // if (numberExcludeZero.test(value)) {
        // this.handleSliceEight('price', value);
      // }
      if (value) {
        let current = value.split(',').join('');
        if (/^(([1-9]\d*)|0)\.?(\d{1,8})?$/.test(current)) {
          if (value.split('.').length === 2) {
            let before = this.$options.filters['demicrometer'](value.split('.')[0].split(',').join(''));
            let after = value.split('.')[1];
            if (value.split('.')[1].length > 8) {
              after = value.split('.')[1].slice(0, 8)
            }
            let arr = [before, after];
            this.ruleForm.price = arr.join('.');
          } else if (value.split('.').length > 2) {
            this.ruleForm.price = o;
          } else {
            let num = value.split(',').join('');
            this.ruleForm.price = this.$options.filters['demicrometer'](num);
          }
        } else {
          this.ruleForm.price = o;
        }
      }
    },
    // 小数点后最多输入8位
    'ruleForm.minQuantityOnce'(value, o) {
      // if (numberExcludeZero.test(value)) {
        // this.handleSliceEight('minQuantityOnce', value);
      // }
      if (value) {
        let current = value.split(',').join('');
        if (/^(([1-9]\d*)|0)\.?(\d{1,8})?$/.test(current)) {
          if (value.split('.').length === 2) {
            let before = this.$options.filters['demicrometer'](value.split('.')[0].split(',').join(''));
            let after = value.split('.')[1];
            if (value.split('.')[1].length > 8) {
              after = value.split('.')[1].slice(0, 8)
            }
            let arr = [before, after];
            this.ruleForm.minQuantityOnce = arr.join('.');
          } else if (value.split('.').length > 2) {
            this.ruleForm.minQuantityOnce = o;
          } else {
            let num = value.split(',').join('');
            this.ruleForm.minQuantityOnce = this.$options.filters['demicrometer'](num);
          }
        } else {
          this.ruleForm.minQuantityOnce = o;
        }
      }
    },
     // 小数点后最多输入8位
    'ruleForm.maxQuantityPer'(value, o) {
      // if (numberExcludeZero.test(value)) {
        // this.handleSliceEight('maxQuantityPer', value);
      // }
      if (value) {
        let current = value.split(',').join('');
        if (/^(([1-9]\d*)|0)\.?(\d{1,8})?$/.test(current)) {
          if (value.split('.').length === 2) {
            let before = this.$options.filters['demicrometer'](value.split('.')[0].split(',').join(''));
            let after = value.split('.')[1];
            if (value.split('.')[1].length > 8) {
              after = value.split('.')[1].slice(0, 8)
            }
            let arr = [before, after];
            this.ruleForm.maxQuantityPer = arr.join('.');
          } else if (value.split('.').length > 2) {
            this.ruleForm.maxQuantityPer = o;
          } else {
            let num = value.split(',').join('');
            this.ruleForm.maxQuantityPer = this.$options.filters['demicrometer'](num);
          }
        } else {
          this.ruleForm.maxQuantityPer = o;
        }
      } else {
        this.ruleForm.minQuantityOnce = '';
      }
    },
    'ruleForm.payDeadline' (value) {
      const date = new Date(value);
      const orderEnd = new Date(this.ruleForm.orderEndTime);
      if (value && value < this.ruleForm.orderEndTime) {
        this.ruleForm.payDeadline = this.ruleForm.orderEndTime;
        return;
      }
      this.formatTimeLimit(date, orderEnd, 'paymentTimeLimit');
    },
    'ruleForm.orderEndTime' (value) {
      const date = new Date(value);
      const orderStart = new Date(this.ruleForm.orderStartTime);
      if (value && value < this.ruleForm.orderStartTime) {
        this.ruleForm.orderEndTime = this.ruleForm.orderStartTime;
        return;
      }
      this.formatTimeLimit(date, orderStart, 'endLimit');
      this.paymentTimeLimit = {
        hours: date.getHours() < 10 ? '0' + date.getHours() : date.getHours() || '',
        minutes: date.getMinutes() < 10 ? '0' + date.getMinutes() : date.getMinutes() || '',
        seconds: date.getSeconds() < 10 ? '0' + date.getSeconds() : date.getSeconds() || '',
      };
      const comDate = this.ruleForm.payDeadline;
      if (comDate) {
        this.formatTimeLimit2(date, new Date(comDate), 'endLimit2');
      }
    },
    'ruleForm.orderStartTime' (value) {
      const nowDate = new Date();
      const date = new Date(value);
      this.formatTimeLimit(date, nowDate, 'startLimit');
      // The end time is 5 minutes longer than the start time
      const addTime = new Date(value + fiveMinutes);
      this.orderEndTimeDefault = addTime;
      this.endLimit = {
        hours: addTime.getHours() < 10 ? '0' + addTime.getHours() : addTime.getHours() || '',
        minutes: addTime.getMinutes() < 10 ? '0' + addTime.getMinutes() : addTime.getMinutes() || '',
        seconds: addTime.getSeconds() < 10 ? '0' + addTime.getSeconds() : addTime.getSeconds() || '',
      }
      const comDate = this.ruleForm.orderEndTime;
      if (comDate) {
        this.formatTimeLimit2(date, new Date(comDate), 'startLimit2');
      }
    },
    'ruleForm.priceSize': function (value, o) {
      const num = value.toString().replace(/[^\d]/g, '');
      const reg = /\d{1,3}(?=(\d{3})+$)/g;
      this.ruleForm.priceSize = (num + '').replace(reg, '$&,');
    }
   },
  computed: {
    judgeShowItem () {
      const tradeType = this.ruleForm.tradeType;
      const paymentType = this.ruleForm.paymentType;
      const typeEnum = newTradeTypeEnum;
      const methodEnum = paymentMethodEnum;

      const obj = {
        oneToManyOffchain: tradeType == typeEnum['1vM'] && paymentType == methodEnum['OffChain'],
        oneToOneOffchain: tradeType == typeEnum['1v1'] && paymentType == methodEnum['OffChain'],
        oneToManyOnchain: tradeType == typeEnum['1vM'] && paymentType == methodEnum['OnChain'],
        oneToOneOnchain: tradeType == typeEnum['1v1'] && paymentType == methodEnum['OnChain'],
      };
      return obj;
    }
  },
  methods: {
    judgeDigitalCurrency () {
      const tradeType = this.ruleForm.currencyType; // this.ruleForm.tradeType;
      const paymentType = this.ruleForm.paymentType;

      if (paymentType == paymentMethodEnum['OffChain']) {
        this.selCurrencyList = initCurrency;
      } else {
        this.queryDigitalCurrency(tradeType); // Unit Price Currency
      }
    },
    formatTimeLimit (date, compareDate, field) {
      let startLimit = {};
     // 如果是选择的今天，则时分只能选择现在时分及之后的
      if (date.getDate() === compareDate.getDate()) {
        let finDate = compareDate;
        if (field === 'endLimit') {
          // The end time is 5 minutes longer than the start time
          finDate = new Date(compareDate.valueOf() + fiveMinutes);
        }
        startLimit = {
          hours: finDate.getHours() < 10 ? '0' + finDate.getHours() : `${finDate.getHours()}` || '',
          minutes: finDate.getMinutes() < 10 ? '0' + finDate.getMinutes() : `${finDate.getMinutes()}` || '',
          seconds: finDate.getSeconds() < 10 ? '0' + finDate.getSeconds() : `${finDate.getSeconds()}` || '',
        }
      // 如果是选择的今天之后的日期，则时分可以从00:00开始选起
      } else {
        startLimit = {
          hours: '00',
          minutes: '00',
          seconds: '00'
        }
      }
      this[field] = startLimit;
    },
    // submit the form
    handleSubmit () {
      this.$refs.ruleForm.validate((valid, msg, aa) => {
        if (valid) {
          const result = { ...this.ruleForm };
          const selectTradeType = this.selectTradeType;
          result.quantity = removeComma(result.quantity);
          result.price = removeComma(result.price);
          if (this.judgeShowItem.oneToManyOffchain || this.judgeShowItem.oneToManyOnchain) {
            result.minQuantityOnce = removeComma(result.minQuantityOnce);
            result.maxQuantityPer = removeComma(result.maxQuantityPer);
          }
          if (this.ruleForm.radio != '1') {
             delete result.priceSize;
          }
          delete result.radio;
          this.loading = true;
          createOfferOrder({ data: {
              ...result,
              secondaryPwd: md5(result.secondaryPwd).toUpperCase(),
              userAddress: (this.tradeSelectedAddress && this.tradeSelectedAddress.address)},
              notify: notify.error
          }).then(res => {
            this.loading = false;
            const { code } = res.data;
            if (code === '1000') {
              this.$router.push({ name: 'TradeHub' });
            }
          }).catch(() => {
            this.loading = false;
          });
        }
      });
    },
  },
  mounted () {
    preOfferOrder().then(res => {
      const { data, code } = res.data;
      if (code === '1000') {
        const resData = data || {};
        const paymentType = resData.paymentTypeList || [];
        this.selTokenList = resData.tokenList || [];
        this.selTradeTypeList = resData.tradeTypeList || [];
        this.selCurrencyTypeList = resData.currencyTypeList || [];
        this.selPaymentTypeList = this.deleteArrayItem(paymentType, 'type', -1);
      }
    }).catch(() => {
      const emptyArr = [];
      this.selTokenList = emptyArr;
      this.selTradeTypeList = emptyArr;
      this.selPaymentTypeList = emptyArr;
    });
  }
};
</script>
