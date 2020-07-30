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
      <el-form-item label="Project Name：" prop="orderName">
        <el-input v-model="ruleForm.orderName" autocomplete="off" maxlength="100"></el-input>
      </el-form-item>
      <el-form-item label="Security Code：" prop="tokenCode">
        <el-select @change="getTokenBalance" v-model="ruleForm.tokenCode" placeholder="- -">
          <el-option
            v-for="item in selTokenList"
            :key="item.tokenCode"
            :label="item.tokenCode"
            :value="item.tokenCode"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="Payment Address：" prop="userAddress">
        <el-select
          :disabled="!ruleForm.tokenCode"
          v-model="ruleForm.userAddress"
          @change="getTokenBalance"
          placeholder="- -"
        >
          <el-option
            v-for="item in selUserAddress"
            :key="item.id"
            :label="'[' + item.addressTag + ']' + item.address"
            :value="item.address"
          ></el-option>
        </el-select>
      </el-form-item>
      <!-- <el-form-item class="form-token-name" label="Token Name：" prop="tokenName">
        <el-input disabled v-model="ruleForm.tokenName" autocomplete="off" maxlength="16"></el-input>
      </el-form-item> -->
      <div class="balance-box">
        Available：
        <i v-if="balanceLoading" class="el-icon-loading"></i>
        <span v-else>
          <span class="balance">{{tokenBalance}}</span>
          <span>{{ruleForm.tokenCode}}</span>
        </span>
      </div>
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
      <el-form-item label="Subscription Quantity：" prop="quantity">
        <el-input
          v-model.trim="ruleForm.quantity"
          autocomplete="off"
          :disabled="tokenBalance === '--'"
        ></el-input>
      </el-form-item>
      <!-- <template v-if="judgeShowItem.oneToManyOffchain || judgeShowItem.oneToManyOnchain">
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
      </template> -->
      <!-- <el-form-item label="Unit Price：" prop="up" required>
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
      </el-form-item> -->
      <!-- <el-form-item
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
      </el-form-item> -->
      <!-- <template v-if="judgeShowItem.oneToManyOffchain || judgeShowItem.oneToManyOnchain">
        <el-form-item label="Lot：" prop="radio" required>
          <el-radio v-model="ruleForm.radio" label="1">On</el-radio>
          <el-radio v-model="ruleForm.radio" label="2">Off</el-radio>
        </el-form-item>
        <el-form-item prop="priceSize" v-if="ruleForm.radio == '1'" :rules="[...rules.priceSize]">
          <el-input v-model="ruleForm.priceSize" autocomplete="off"></el-input>
        </el-form-item>
      </template> -->
      <!-- <el-form-item label="Trade Period：" prop="temp" required>
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
      </el-form-item> -->
      <!-- <el-form-item
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
      </el-form-item> -->
      <el-form-item label="Subscription Info：" prop="paymentInfo">
        <el-input
          type="textarea"
          rows="4"
          placeholder="Please enter Payment Information"
          v-model="ruleForm.paymentInfo"
          maxlength="250"
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
    <div class="form-btns">
      <el-button class="btn-back" @click="$router.push({ name: 'TradeHub' })">Exit</el-button>
      <el-button type="primary" @click="handleSubmit">Next</el-button>
    </div>
  </div>
</template>

<script>
// import { preOfferOrder, tradeOrderGetSmttCode, queryDigitalCurrency } from '@api/project-center.js';
import { preOfferOrder } from '@api/project-center.js';
import { getBalance, multiAddresses } from '@api/common.js';
import { notify, removeComma } from '@/common/util.js';

const requiredRule = { required: true, trigger: ['blur', 'change'], message: 'This field is required.' };

export default {
  name: '',
  data () {
    const nowDate = new Date(); // 当前时间

    return {
      balanceLoading: false,
      tokenBalance: '--', // token balance
      selTokenList: [],
      selUserAddress: [],
      orderEndTimeDefault: nowDate,
      startLimit: {
        hours: nowDate.getHours(),
        minutes: nowDate.getMinutes(),
        seconds: '00'
      },
      startLimit2: {
        hours: '23',
        minutes: '59',
        seconds: '59'
      },
      endLimit: {},
      endLimit2: {
        hours: '23',
        minutes: '59',
        seconds: '59',
      },
      ruleForm: {
        orderName: '',
        tokenCode: ''
      },
      rules: {
        orderName: [requiredRule],
        tokenCode: [requiredRule],
        paymentInfo: [requiredRule],
        userAddress: [requiredRule],
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
            realTime = orderStartTime;
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
    }
  },
  methods: {
    // Token Code select change
    // handleTokenCodeChange (value) {
    //   const { tokenCode } = this.ruleForm;
    //   const data = this.selTokenList.find(item => item.tokenCode === tokenCode) || {};
    //   // this.ruleForm.tokenName = data.tokenName;
    //   this.getTokenBalance(value);
    // },
    // Gets the balance at token
    getTokenBalance () {
      const { userAddress, tokenCode } = this.ruleForm;
      if (!userAddress || !tokenCode) {
        return;
      }
      this.balanceLoading = true;

      getBalance({
        data: {
          currency: tokenCode,
          userAddress
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
    // submit the form
    handleSubmit () {
      this.$refs.ruleForm.validate((valid, msg, aa) => {
        if (valid) {
          const result = { ...this.ruleForm };
          // const selectTradeType = this.selectTradeType;
          result.quantity = removeComma(result.quantity);
          // result.price = removeComma(result.price);
          // if (this.judgeShowItem.oneToManyOffchain || this.judgeShowItem.oneToManyOnchain) {
          //   result.minQuantityOnce = removeComma(result.minQuantityOnce);
          //   result.maxQuantityPer = removeComma(result.maxQuantityPer);
          // }
          // if (this.ruleForm.radio != '1') {
          //   delete result.priceSize;
          // }
          // delete result.radio;
          this.$emit('handleSubscriptInfoSubmit', result);
          // this.loading = true;
          // createOfferOrder({ data: {
          //   ...result,
          //   secondaryPwd: md5(result.secondaryPwd).toUpperCase(),
          //   userAddress: (this.tradeSelectedAddress && this.tradeSelectedAddress.address)
          // },
          // notify: notify.error
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
    multiAddresses () {
      multiAddresses().then(res => {
        const { data, code } = res.data;
        this.loading = false;
        if (code === '1000') {
          this.selUserAddress = data || [];
        }
      });
    },
    getBeforeInfo () {
      preOfferOrder().then(res => {
        const { data, code } = res.data;
        if (code === '1000') {
          const resData = data || {};
          const paymentType = resData.paymentTypeList || [];
          this.selTokenList = resData.tokenList || [];
          // this.selTradeTypeList = resData.tradeTypeList || [];
          // this.selCurrencyTypeList = resData.currencyTypeList || [];
          // this.selPaymentTypeList = this.deleteArrayItem(paymentType, 'type', -1);
        }
      }).catch(() => {
        const emptyArr = [];
        this.selTokenList = emptyArr;
        // this.selTradeTypeList = emptyArr;
        // this.selPaymentTypeList = emptyArr;
      });
    }
  },
  created () {
    this.multiAddresses();
    this.getBeforeInfo();
  }
};
</script>
