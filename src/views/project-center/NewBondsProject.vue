<template>
  <div class="newTrade-container" v-loading="loading">
    <bread-crumbs :data="breadData"></bread-crumbs>
    <div class="main-container">
      <h3 class="title">{{ pageTypeEnum.pageTitle }}</h3>
      <!-- <steps class="steps" :active="stepActive" :data="stepData"></steps> -->
      <el-form
        :model="ruleForm"
        :rules="rules"
        ref="ruleForm"
        label-width="190px"
        label-position="left"
        class="form-box"
      >
        <el-form-item label="Project Name：" prop="orderName">
          <el-input v-model="ruleForm.orderName" autocomplete="off" maxlength="100" placeholder="Please enter a project name"></el-input>
        </el-form-item>
        <el-form-item label="Security Code：" prop="tokenCode">
          <el-select @change="getTokenBalance" v-model="ruleForm.tokenCode" placeholder="Please select the bond code">
            <el-option
              v-for="item in selTokenList"
              :key="item.tokenCode"
              :label="item.tokenCode"
              :value="item.tokenCode"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="Payment Address:：" prop="userAddress">
          <el-select @change="getTokenBalance" v-model="ruleForm.userAddress" placeholder="Please select the payment address">
            <el-option
              v-for="item in addressData"
              :key="item.id"
              :label="'[' + item.addressTag + ']' + item.address"
              :value="item.address"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item class="form-token-name" label="Token Name：" prop="tokenName">
          <el-input disabled v-model="ruleForm.tokenName" autocomplete="off" maxlength="16"></el-input>
        </el-form-item>
        <div class="balance-box">
          Balance：
          <i v-if="balanceLoading" class="el-icon-loading"></i>
          <span v-else>
            <span class="balance">{{tokenBalance}}</span>
            <span>{{ruleForm.tokenCode}}</span>
          </span>
        </div>
        <el-form-item label="Trade Type：" prop="tradeType">
          <el-select v-model="ruleForm.tradeType" placeholder="- -">
            <el-option
              v-for="item in selTradeTypeList"
              :label="item.typeDesc"
              :key="item.type"
              :value="item.type"
            ></el-option>
            <!-- 1-N Token-Certificate 1 ----1-Many offchain-->
            <!-- 1-1 Token-Certificate 2 ----1-1 offchain -->
            <!-- 1-N Token-Digital Currency 3 ----1-Many onchain -->
            <!-- 1-1 Token-Digital Currency 4 ----1-1 onchain-->
          </el-select>
        </el-form-item>
        <el-form-item label="Payment Method：" required>
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
          <!-- <el-radio v-model="ruleForm.radio" label="1">On</el-radio>
          <el-radio v-model="ruleForm.radio" label="2">Off</el-radio> -->
          <!-- <el-col :span="11">
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
          </el-col> -->
          <!-- <el-col class="line" :span="2">-</el-col>
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
          </el-col> -->
        </el-form-item>
        <!-- <el-form-item label="SMT Code：" prop="smttCode">
          <el-input v-model.trim="ruleForm.smttCode" autocomplete="off" disabled></el-input>
        </el-form-item> -->
        <el-form-item label="Quantity：" prop="quantity">
          <el-input
            v-model.trim="ruleForm.quantity"
            autocomplete="off"
            placeholder="Please enter the quantity available for subscription"
            :disabled="tokenBalance === '--'"
          ></el-input>
        </el-form-item>
        <template v-if="judgeShowItem.oneToManyOffchain || judgeShowItem.oneToManyOnchain">
          <el-form-item label="Max Size：" prop="maxQuantityPer" :rules="[...rules.maxQuantityPer]">
            <el-input
              v-model="ruleForm.maxQuantityPer"
              autocomplete="off"
              :disabled="!ruleForm.quantity"
            ></el-input>
          </el-form-item>
          <el-form-item
            label="Min Size："
            prop="minQuantityOnce"
            :rules="[...rules.minQuantityOnce]"
          >
            <el-input
              v-model="ruleForm.minQuantityOnce"
              autocomplete="off"
              :disabled="!ruleForm.maxQuantityPer"
            ></el-input>
          </el-form-item>
        </template>
        <el-form-item label="Unit Price：" prop="up" required>
          <el-col :span="11">
            <el-form-item prop="price">
              <el-input v-model="ruleForm.price" placeholder="Enter the subscription unit price"></el-input>
            </el-form-item>
          </el-col>
          <el-col class="line" :span="2">-</el-col>
          <el-col :span="11">
            <el-form-item prop="tokenMark">
              <el-select v-model="ruleForm.tokenMark" placeholder="Currency">
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
        <el-form-item
          v-if="judgeShowItem.oneToOneOnchain || judgeShowItem.oneToManyOnchain"
          label="Settlement Token："
          prop="up"
          required
        >
          <el-col :span="11">
            <el-form-item prop="currencyType">
              <!-- <el-input v-model="ruleForm.price"></el-input> -->
              <el-select v-model="ruleForm.currencyType" placeholder="Settlement token type">
                <el-option label="Digital Currency" :value="2"></el-option>
                <el-option label="Certificate" :value="1"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col class="line" :span="2">-</el-col>
          <el-col :span="11">
            <el-form-item prop="currency">
              <el-select :loading="settlementCodeLoading" placeholder="Settlement token" v-model="ruleForm.currency" style="width: 100%;">
                <el-option v-for="item in settlementCodeList" :key="item.value"
                  :label="item.label"
                  :value="item.value">
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-form-item>
        <el-form-item
          v-if="judgeShowItem.oneToOneOffchain || judgeShowItem.oneToOneOnchain"
          label="Counter-Party Address："
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
        <template v-if="judgeShowItem.oneToManyOffchain || judgeShowItem.oneToManyOnchain">
          <el-form-item label="Lot：" prop="radio" required>
            <el-radio v-model="ruleForm.radio" label="1">On</el-radio>
            <el-radio v-model="ruleForm.radio" label="2">Off</el-radio>
          </el-form-item>
          <el-form-item prop="priceSize" v-if="ruleForm.radio == '1'" :rules="[...rules.priceSize]">
            <el-input v-model="ruleForm.priceSize" autocomplete="off"></el-input>
          </el-form-item>
        </template>
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
        <el-form-item
          v-if="selectTradeType && (judgeShowItem.oneToManyOffchain || judgeShowItem.oneToOneOffchain)"
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
        <el-form-item label="Subscription Info：" prop="content">
          <el-input
            type="textarea"
            rows="4"
            placeholder="Please enter additional information, payment instruction etc."
            v-model="ruleForm.content"
            maxlength="128"
            show-word-limit
          ></el-input>
        </el-form-item>
        <el-form-item
          v-if="judgeShowItem.oneToManyOffchain || judgeShowItem.oneToOneOffchain"
          label="Payment Instruction："
          prop="paymentInfo"
        >
          <el-input
            type="textarea"
            rows="4"
            placeholder="Please enter the payment Instruction"
            v-model="ruleForm.paymentInfo"
            maxlength="128"
            show-word-limit
          ></el-input>
        </el-form-item>
        <!-- <el-form-item label="Secondary Password：" prop="secondaryPwd">
          <el-input
            placeholder="Please enter secondary password"
            autocomplete="off"
            type="password"
            v-model="ruleForm.secondaryPwd"
            :readonly="pwdReadOnly"
            @focus="pwdReadOnly=false"
          ></el-input>
        </el-form-item> -->
      </el-form>
      <div class="submit">
        <el-button class="btn-back" @click="$router.push({ name: pageTypeEnum.cancelName })">Cancel</el-button>
        <el-button type="primary" @click="handleSubmit">Submit</el-button>
      </div>
    </div>
    <element-dialog
      :visible.sync="secondPwdDialogVisible"
      v-loading="secondaryPwdloading"
      width="640px"
      @close="$refs.secondPwdForm.resetFields()"
    >
      <el-form ref="secondPwdForm" :model="secondPwdForm" :rules="secondPwdRules"
        label-width="176px" label-position="left" @submit.native.prevent>
        <el-form-item label="Secondary Password：" prop="secondaryPwd">
          <el-input v-model.trim="secondPwdForm.secondaryPwd" type="password"></el-input>
        </el-form-item>
      </el-form>
      <template v-slot:footers>
        <el-button type="primary" @click="handleSecondaryPwd" style="width: 100px;height:40px;">Submit</el-button>
      </template>
    </element-dialog>
  </div>
</template>
<script>
import {
  preOfferOrder,
  absPreOfferOrder,
  createOfferOrder,
  absCreateOfferOrder,
  queryDigitalCurrency
} from '@/api/project-center.js';
import { mapGetters } from 'vuex';
import BreadCrumbs from '@components/BreadCrumbs.vue';
import Steps from '@components/ElementSteps.vue';
import { getBalance, multiAddresses, getAssetToken } from '@/api/common.js';
import { notify, secondaryPwdReg, removeComma, encryptSecondPwd } from '@/common/util';
import { newTradeTypeEnum, paymentMethodEnum, pageTypeEnum } from '@/common/enums.js';

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

const fiveMinutes = 5 * 60 * 1000;

export default {
  name: 'TradeCenterNewTrade',
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
    const pwdValidator = (rule, value, callback) => {
      if (!secondaryPwdReg.test(value)) {
        callback('Password does not match the criteria');
        return;
      }
      callback();
    };
    return {
      newTradeTypeEnum,
      pwdReadOnly: true,
      balanceLoading: false,
      secondPwdDialogVisible: false,
      secondaryPwdloading: false,
      settlementCodeLoading: false,
      settlementCodeList: [],
      selTokenList: [], // token code下拉框数据
      selTradeTypeList: [], // TradeType下拉框数据
      selPaymentTypeList: [], // PaymentType下拉框数据
      selCurrencyTypeList: [], // Payment下的CurrencyType下拉框数据
      selectTradeType: '', // 当前选中的tradeType的key
      loading: false,
      addressData: [],
      tokenBalance: '--', // token balance
       // Unit Price币种下拉框数据
      selCurrencyList: initCurrency,
      // stepData: [
      //   'Subscription Info',
      //   'Review',
      //   'End'
      // ],
      // stepActive: 0,
      secondPwdForm: {
        secondaryPwd: ''
      },
      secondPwdRules: {
        secondaryPwd: [
          { required: true, trigger: 'change', message: 'This field is required.' },
          {
            trigger: 'blur',
            validator: (rule, value, callback) => {
              if (!secondaryPwdReg.test(value)) {
                callback('Password does not match the criteria');
                return;
              }
              callback();
            }
          }
        ]
      },
      ruleForm: {
        temp: 'a',
        up: '1',
        payDeadline: '',
        radio: '2',
        content: '',
        minQuantityOnce: '',
        maxQuantityPer: '',
        quantity: '',
        currencyType: '', // Settlement Token type
        currency: '', // Settlement Token Code
        paymentInfo: '',
        tokenMark: '' // Unit Price-Currency
      },
      orderEndTimeDefault: nowDate,
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
      paymentTimeLimit: {},
      rules: {
        tokenCode: [requiredRule],
        tradeType: [requiredRule],
        currencyType: [requiredRule],
        paymentType: [requiredRule],
        orderName: [requiredRule],
        paymentInfo: [requiredRule],
        // secondaryPwd: [requiredRule, { validator: pwdValidator, trigger: 'blur' }],
        quantity: [requiredRule, {
          validator: (rule, value, callback) => {
            if (parseFloat(value) === 0) {
              callback(new Error('Please enter a number greater than 0'));
            } else if (+(value.split(',').join('')) > +(this.tokenBalance.split(',').join(''))) {
              callback(new Error('Greater than balance'));
            } else {
              callback();
            }
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
        }],
        currency: [requiredRule],
        tokenMark: [requiredRule],
        payDeadline: [requiredRule],
        orderStartTime: [requiredRule],
        orderEndTime: [requiredRule],
        // paymentType: [requiredRule],
        content: [requiredRule],
        bidAddress: [requiredRule, {
          validator:  (rule, value, callback) => {
            if (value.length != 40) {
              callback('The length has to be 40');
              return;
            }
            callback();
          }
        }],
        tokenName: [requiredRule],
        userAddress: [requiredRule],
        priceSize: [requiredRule, numberRule], // Incremental Size
        maxQuantityPer: [requiredRule, {
          validator: maxPerValidator
        }],
        minQuantityOnce: [requiredRule, {
          validator: minPerValidator
        }]
      },
      endTimeMinute: nowDate.getMinutes(),
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
      },
      pickerOptions2: {
        // selectableRange: `${nowDate.getHours()}:59:59} - 23:59:59`,
        disabledDate: (time) => {
          const theTime = time.getTime();
          const { orderEndTime } = this.ruleForm;
          return orderEndTime ? theTime < (orderEndTime - 8.64e7)  : false;
        }
      }
    };
  },
  watch: {
    'ruleForm.tradeType' (val) {
      const value = +val;
      this.selectTradeType = value;
      // this.getSmtCodeByQuery();
    },
    'ruleForm.paymentType' (val) {
      if (val == paymentMethodEnum.OffChain) {
        this.ruleForm.currencyType = null; // 1;
      } else {
        this.ruleForm.currencyType = 2;
      }
      this.ruleForm.tokenMark = '';
      // this.judgeDigitalCurrency();
    },
    'ruleForm.tokenMark' (val) {
      this.ruleForm.currency = '';
      this.getToken();
    },
    'ruleForm.currencyType'(val) {
      this.getToken();
    },
    // 'ruleForm.currencyType' () {
      // this.getSmtCodeByQuery();
    // },
    // 小数点后最多输入8位
    'ruleForm.quantity' (value, o) {
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
            this.ruleForm.quantity = arr.join('.');
          } else if (value.split('.').length > 2) {
            this.ruleForm.quantity = o;
          } else {
            let num = value.split(',').join('');
            this.ruleForm.quantity = this.$options.filters['demicrometer'](num);
          }
        } else {
          this.ruleForm.quantity = o;
        }
      } else {
        this.ruleForm.maxQuantityPer = '';
      }
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
    ...mapGetters(['tradeSelectedAddress']),
    pageType () {
      return this.$route.meta.current || 'bonds';
    },
    pageTypeEnum () {
      const typeObj = {
        [pageTypeEnum.asset]: {
          createUrl: absCreateOfferOrder,
          preOfferUrl: absPreOfferOrder,
          pageTitle: 'Asset-Backed Listing',
          currencyType: 3,
          cancelName: 'ProjectBondsList' // Click the route name for the Cancel jump
        },
        [pageTypeEnum.bonds]: {
          createUrl: createOfferOrder,
          preOfferUrl: preOfferOrder,
          pageTitle: 'Bond Listing',
          cancelName: 'ProjectAssetList' // Click the route name for the Cancel jump
        }
      }
      return typeObj[this.pageType];
    },
    breadData() {
      const isAssetPage = this.$route.meta.current === 'asset';
      return [{
          name: 'Listing Centre',
          to: '/listing/bonds'
        }, {
          name: isAssetPage ? 'ABS Project' : 'Bond Project',
          to: isAssetPage ? '/listing/asset' : '/listing/bonds'
        }, {
          name: isAssetPage ? 'Asset-Backed Listing' : 'Bond Listing'
      }];
    },
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
  components: {
    BreadCrumbs,
    Steps
  },
  methods: {
    multiAddresses () {
      multiAddresses().then(res => {
        const { data, code } = res.data;
        this.loading = false;
        if (code === '1000') {
          this.addressData = data || [];
        }
      });
    },
    judgeDigitalCurrency () {
      const tradeType = this.ruleForm.currencyType; // this.ruleForm.tradeType;
      const paymentType = this.ruleForm.paymentType;

      if (paymentType == paymentMethodEnum['OffChain']) {
        this.selCurrencyList = initCurrency;
      } else {
        this.queryDigitalCurrency(tradeType); // Unit Price Currency
      }
    },
    // getSmtCodeByQuery () {
    //   const { tradeType, currencyType } = this.ruleForm;
    //   if (!tradeType || !currencyType) return;

    //   tradeOrderGetSmttCode({
    //     tradeType,
    //     currencyType
    //   }).then(res => {
    //     const { code, data } = res.data;
    //     if (code === '1000') {
    //       // this.ruleForm.smttCode = data || '';
    //       this.ruleForm = {...this.ruleForm, smttCode: data || '' }
    //     }
    //   });
    // },
    // query token code under onchain
    queryDigitalCurrency (currencyType) {
      this.selCurrencyList = [];

      queryDigitalCurrency({ currencyType }).then(res => {
        const { code, data } = res.data;
        if (code === '1000') {
          this.selCurrencyList = data || [];
        }
      })
    },
    // Only 8 digits can be entered after the decimal point
    handleSliceEight (field, value) {
      if (value.indexOf('.') === -1) {
        return;
      }
      const index = value.indexOf('.') + 1;
      this.ruleForm[field] = this.ruleForm[field].slice(0, index + 8);
    },
    handleSecondaryPwd () {
      this.$refs.secondPwdForm.validate(async valid => {
        if (!valid) return;
        const result = { ...this.ruleForm };
        const selectTradeType = this.selectTradeType;
        result.quantity = removeComma(result.quantity);
        result.price = removeComma(result.price);
        if (this.judgeShowItem.oneToManyOffchain || this.judgeShowItem.oneToManyOnchain) {
          result.minQuantityOnce = removeComma(result.minQuantityOnce);
          result.maxQuantityPer = removeComma(result.maxQuantityPer);
        }
        if (this.judgeShowItem.oneToManyOnchain || this.judgeShowItem.oneToOneOnchain) {
          result.paymentInfo = null;
        }
        if (this.ruleForm.radio != '1') {
          delete result.priceSize;
        }
        delete result.radio;
        this.secondaryPwdloading = true;

        const data = await this.pageTypeEnum.createUrl({
          data: {
            ...result,
            secondaryPwd: encryptSecondPwd(this.secondPwdForm.secondaryPwd),
          },
          notify: notify.any
        }).catch(() => {
          this.secondaryPwdloading = false;
          this.secondPwdDialogVisible = false;
        });
        this.secondaryPwdloading = false;
        this.secondPwdDialogVisible = false;
        if (data && data.data.code === '1000') {
          this.$router.push({
            name: 'ProjectIssuanceHistory',
            query: {
              type: this.$route.meta.current || 'bonds'
            }
          });
        }
      });
    },
    // // Token Code select change
    // handleTokenCodeChange (value) {
    //   const data = this.selTokenList.find(item => item.tokenCode === value) || {};
    //   this.ruleForm.tokenName = data.tokenName;
    //   this.getTokenBalance(value);
    // },
    // submit the form
    handleSubmit () {
      this.$refs.ruleForm.validate((valid, msg, aa) => {
        if (valid) {
          this.secondPwdDialogVisible = true;
          // const result = { ...this.ruleForm };
          // const selectTradeType = this.selectTradeType;
          // result.quantity = removeComma(result.quantity);
          // result.price = removeComma(result.price);
          // if (this.judgeShowItem.oneToManyOffchain || this.judgeShowItem.oneToManyOnchain) {
          //   result.minQuantityOnce = removeComma(result.minQuantityOnce);
          //   result.maxQuantityPer = removeComma(result.maxQuantityPer);
          // }
          // if (this.ruleForm.radio != '1') {
          //    delete result.priceSize;
          // }
          // delete result.radio;
          // this.loading = true;
          // createOfferOrder({ data: {
          //     ...result,
          //     secondaryPwd: md5(result.secondaryPwd).toUpperCase(),
          //     userAddress: (this.tradeSelectedAddress && this.tradeSelectedAddress.address)},
          //     notify: notify.error
          // }).then(res => {
          //   this.loading = false;
          //   const { code } = res.data;
          //   if (code === '1000') {
          //     this.$router.push({ name: 'TradeHub' });
          //   }
          // }).catch(() => {
          //   this.loading = false;
          // });
        }
      });
    },
    formatTimeLimit2 (date, compareDate, field) {
      let startLimit = {};
     // 如果是选择的今天，则时分只能选择现在时分及之前的
      if (date.getDate() === compareDate.getDate()) {
        startLimit = {
          hours: compareDate.getHours() < 10 ? '0' + compareDate.getHours() : compareDate.getHours() || '',
          minutes: compareDate.getMinutes() < 10 ? '0' + compareDate.getMinutes() : compareDate.getMinutes() || '',
          seconds: compareDate.getSeconds() < 10 ? '0' + compareDate.getSeconds() : compareDate.getSeconds() || '',
        }
      // 如果是选择的今天之后的日期，则时分可以从00:00开始选起
      } else {
        startLimit = {
          hours: '23',
          minutes: '59',
          seconds: '59'
        }
      }
      this[field] = startLimit;
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
    // Gets the balance at token
    getTokenBalance (code) {
      const { userAddress, tokenCode } = this.ruleForm;
      if (!userAddress || !tokenCode) {
        return;
      }
      const data = this.selTokenList.find(item => item.tokenCode === tokenCode) || {};
      this.ruleForm.tokenName = data.tokenName;
      this.balanceLoading = true;
      getBalance({
        data: {
          currency: tokenCode,
          currencyType: this.pageTypeEnum.currencyType,
          userAddress,
        },
        notify: notify.error
      }).then(res => {
        this.balanceLoading = false;
        if (res.data.code === '1000') {
          this.tokenBalance = this.$options.filters.demicrometer(res.data.data || 0); //res.data.data || '--';
        }
      }).catch(() => {
        this.balanceLoading = false;
        this.tokenBalance = '--';
      })
    },
    // 根据某字段和字段对应值查找该项，并删除该项
    deleteArrayItem (arr, field, value) {
      const index = arr.findIndex(item => item[field] === value);
      if (index > -1) {
        arr.splice(index, 1);
      }
      return arr;
    },
    getToken (){
      const { currencyType, tokenMark } = this.ruleForm;
      if (!currencyType || !tokenMark) return;
  
      this.settlementCodeLoading = true;
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
        this.settlementCodeLoading = false;
        const { code, data } = res.data;
        if (code === '1000') {
          this.settlementCodeList = (data || []).map(item => ({
            label: item.code,
            value: item.code
          }));
        }
      }).catch(() => {
        this.settlementCodeLoading = false;
      });
    }
  },
  mounted () {
    this.multiAddresses();
    this.pageTypeEnum.preOfferUrl().then(res => {
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
<style scoped lang="scss">
.newTrade-container {
  // padding-left: 30px;
  .title {
    margin-bottom: 40px;
    font-size: 24px;
    color: #001F3B;
  }
  // .el-breadcrumb {
  //   display: flex;
  //   align-items: center;
  //   margin-top: -30px;
  //   height: 60px;
  // }
  // .view-content {
  //   padding: 30px;
  //   border-radius: 4px;
  //   box-shadow: 0px 0px 16px 2px rgba(166, 193, 255, 0.38);
  // }
  .submit {
    text-align: center;
    margin-top: 100px;
    margin-bottom: 50px;
    button {
      width: 300px;
      height: 40px;
      font-size: 16px;
      font-weight: normal;
      span {
        opacity: 0.8;
      }
    }
    .el-button--primary {
      margin-left: 30px;
    }
  }
  .form-box {
    width: 724px;
    margin: 60px auto 0;
    color: #192231;
  }
  .el-select,
  .el-input-number,
  .el-date-editor--daterange.el-input__inner,
  .el-date-editor.el-input {
    width: 100%;
    .el-input__inner {
      padding-left: 40px;
    }
  }
  .el-date-editor--datetimerange.el-input__inner {
    width: 100%;
  }
  .line {
    text-align: center;
  }
  .form-token-name {
    margin-bottom: 10px;
    i {
      line-height: inherit;
    }
  }
  .balance-box {
    display: flex;
    justify-content: flex-end;
    font-size: 12px;
    color: #8d93a1;
    margin-bottom: 10px;
    .balance {
      margin-right: 8px;
      font-size: 14px;
      color: #001f3b;
    }
    i {
      line-height: inherit;
    }
  }
  /deep/.el-input__prefix {
    left: 15px;
  }
  /deep/.el-input--prefix .el-input__inner {
    padding-left: 40px;
  }
}
</style>
