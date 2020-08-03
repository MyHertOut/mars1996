<template>
  <div class="subscription-detail" v-loading="loading">
    <bread-crumbs :data="breadData"></bread-crumbs>
    <div class="main-container">
      <div class="info-top">
        <div class="detail-left">
          <div class="head-title">
            <span>{{detailObj.tokenCode}} ({{detailObj.tokenName}})</span>
            <!-- <span>(Security Name)</span> -->
          </div>
          <div class="number-info">
            <div class="year-rate">
              <span>{{formatCoupon(detailObj.couponRate)}}%</span>
              <span>Annual Coupon Rate</span>
            </div>
            <div class="limit">
              <span>{{isEmpty(detailObj.paymentTypeDesc)}}</span>
              <span>Payment Method</span>
            </div>
            <div class="total">
              <span>{{formatNumber(detailObj.quantity) | demicrometer}} {{detailObj.tokenCode}}</span>
              <span>Subscription Total</span>
            </div>
          </div>
          <div class="specific-information">
            <el-row>
              <el-col :span="12">
                <span class="label">Subscription Period Start:</span>
                <span class="value">{{formatTime(detailObj.orderStartTime)}}</span>
              </el-col>
              <el-col :span="12">
                <span class="label">Subscription Period End:</span>
                <span class="value">{{formatTime(detailObj.orderEndTime)}}</span>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="12">
                <span class="label">Min Purchase:</span>
                <span class="value" v-if="detailObj.tradeType === 1">{{formatNumber(detailObj.quantity) | demicrometer}}</span>
                <span class="value" v-else>{{formatNumber(detailObj.minQuantityOnce) | demicrometer}}</span>
              </el-col>
              <el-col :span="12">
                <span class="label">Max Purchase:</span>
                <span class="value" v-if="detailObj.tradeType === 1">{{formatNumber(detailObj.quantity) | demicrometer}}</span>
                <span class="value" v-else>{{formatNumber(detailObj.maxQuantityPer) | demicrometer}}</span>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="12">
                <span class="label">Settlement Token:</span>
                <span class="value">{{isEmpty(detailObj.settlementCode)}}</span>
              </el-col>
              <!-- <el-col :span="12">
                <span class="label">Settlement Type:</span>
                <span class="value">Instant Settlement</span>
              </el-col> -->
              <el-col :span="12">
                <span class="label">Unit Price:</span>
                <span class="value" v-if="detailObj.paymentType === 2">{{formatNumber(detailObj.price) | demicrometer}} {{isEmpty(detailObj.currency)}}</span>
                <span class="value" v-else>{{formatNumber(detailObj.price)}} {{isEmpty(detailObj.tokenMark)}}</span>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="12">
                <span class="label">Coupon Frequency:</span>
                <span class="value">{{isEmpty(detailObj.couponFrequencyDesc)}}</span>
              </el-col>
              <el-col :span="12">
                <span class="label">Disbursement Token:</span>
                <span class="value">{{isEmpty(detailObj.disbursementToken)}}</span>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="12">
                <span class="label">Callable Bond:</span>
                <span class="value">{{isEmpty(detailObj.callableDesc)}}</span>
              </el-col>
              <el-col :span="12">
                <span class="label">Settlement Datetime:</span>
                <span class="value">Instant Settlement</span>
              </el-col>
            </el-row>
          </div>
        </div>
        <div class="detail-right">
          <div class="end-title">{{detailObj.endTimerDesc}}</div>
          <el-progress :percentage="detailObj.percentage" color="#214285" :stroke-width="4"></el-progress>
          <div class="parameter-box">
            <span class="label">Available:</span>
            <span class="value">{{formatNumber(detailObj.remainQuantity, 'remainQuantity') | demicrometer}} {{detailObj.tokenCode}}</span>
          </div>
          <div class="parameter-box">
            <span class="label">Unit Price:</span>
            <span class="value" v-if="detailObj.paymentType === 2">{{formatNumber(detailObj.price) | demicrometer}} {{detailObj.currency}}</span>
            <span class="value" v-else>{{formatNumber(detailObj.price) | demicrometer}} {{detailObj.tokenMark}}</span>
          </div>
          <div class="num">
            <el-form :model="quantityForm" :rules="quantityRules" ref="quantityForm" class="quantity-Form">
              <el-form-item prop="quantityNum">
                <el-input type="text" v-model="quantityForm.quantityNum" autocomplete="off" v-if="detailObj.bizStatus === 1" :placeholder="quantityPlaceholder"></el-input>
                <el-input type="text" v-model="quantityForm.quantityNum" autocomplete="off" v-else disabled></el-input>
                <div class="qu-label">Quantity: </div>
              </el-form-item>
            </el-form>
          </div>
          <div class="parameter-box">
            <span class="label">Annual earnings:</span>
            <span class="value" v-if="!detailObj.annualEarnings">-- {{detailObj.disbursementToken}}</span>
            <span class="value" v-else>{{detailObj.annualEarnings | demicrometer}} {{detailObj.disbursementToken}}</span>
          </div>
          <div class="parameter-box">
            <span class="label">Total Payable:</span>
            <span class="value" v-if="!detailObj.totalPayable">-- {{detailObj.currency}}</span>
            <span class="value" v-else-if="detailObj.paymentType === 2">{{detailObj.totalPayable | demicrometer}} {{detailObj.currency}}</span>
            <span class="value" v-else>{{detailObj.totalPayable | demicrometer}} {{detailObj.tokenMark}}</span>
          </div>
          <div v-permissions="'subscription.centre.create'">
            <el-button type="primary" class="submit-btn" @click="openPayDia" :disabled="!conditionsChecked" v-if="detailObj.bizStatus === 1">Submit</el-button>
            <el-button type="primary" class="submit-btn" disabled v-else>Submit</el-button>
          </div>
          <div class="conditions" v-permissions="'subscription.centre.content'" v-if="detailObj.tcStatus">
            <el-checkbox v-model="conditionsChecked" class="conditions-checkbox"></el-checkbox>
            <span @click="conditionsChecked = !conditionsChecked">I've read and agreed with</span>
            <span @click="conditionsDialog = true">《Terms And Conditions》</span>
          </div>
        </div>
      </div>
      <div class="info-bottom">
        <div class="info-bottom-nav">
          <div class="nav-item" v-for="(v, k) in infoTabs" :key="k" :class="{'nav-active': tabsName === k }"
            :style="k === infoTabs.length - 1 ? 'border: 0;text-align: left;padding-left: 30px;' : ''" @click="tabsName = v.key">
            <span>{{v.name}}</span>
          </div>
        </div>
        <div class="page-box">
          <!-- <div class="move-page" :style="`transform: translateX(-${tabsName * 1200}px);`"> -->
          <div class="move-page">
            <div class="instructions-page" v-if="tabsName === 0">
              <subscriptionInfo :data="detailObj" />
            </div>
            <div class="information-page" v-if="tabsName === 1">
              <basicInformation :data="detailObj" />
            </div>
            <div class="principals-page" v-if="tabsName === 2">
              <principals />
            </div>
            <div class="restriction-page" v-if="tabsName === 3">
              <tradingRestriction />
            </div>
            <div class="documents-page" v-if="tabsName === 4">
              <documents :type="detailObj.tradeType" />
            </div>
          </div>
        </div>
      </div>
    </div>
    <el-dialog title="Payment" :visible.sync="submitDialog" width="744px" :close-on-click-modal="false"
      :show-close="!confirmLoading" :close-on-press-escape="false" class="payment-dialog">
      <div class="payment-info">
        <p class="label" v-if="detailObj.paymentType === 2">Amount Payable ({{detailObj.currency}})</p>
        <p class="label" v-else>Amount Payable ({{detailObj.tokenMark}})</p>
        <p class="amount">{{detailObj.totalPayable}}</p>
      </div>
      <el-form :model="payForm" :rules="payRules" ref="payForm" label-width="190px" label-position="left" class="pay-form-box">
        <el-form-item label="Payment Address:" prop="paymentAddress" class="address">
          <el-select v-model="payForm.paymentAddress" :disabled="confirmLoading" style="width: 100%;" @change="changeAddress">
            <el-option v-for="item in addressList" :key="item.id" :label="`【${item.addressTag}】${item.address}`" :value="item.address"></el-option>
          </el-select>
          <div class="available">Available:
            <i class="el-icon-loading" v-if="addressBalanceLoading"></i>
            <span v-else>{{addressBalance}} {{detailObj.currency}}</span>
          </div>
        </el-form-item>
        <el-form-item label="Secondary Password:" prop="paymentPassword" class="password">
          <el-input type="password" v-model="payForm.paymentPassword" autocomplete="off" :disabled="confirmLoading"></el-input>
          <div class="forgot" @click="forgotPassword = true">Forgot Password?</div>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="submitDialog = false">Cancel</el-button>
        <el-button type="primary" @click="submitOrder" :loading="confirmLoading">Confirm</el-button>
      </span>
    </el-dialog>

    <el-dialog title="Submit Order" :visible.sync="offSubmitDialog" width="744px" :close-on-click-modal="false"
      :show-close="!offConfirmLoading" :close-on-press-escape="false" class="payment-dialog">
      <div class="payment-info">
        <p class="label" v-if="detailObj.paymentType === 2">Amount Payable ({{detailObj.currency}})</p>
        <p class="label" v-else>Amount Payable ({{detailObj.tokenMark}})</p>
        <p class="amount">{{detailObj.totalPayable}}</p>
      </div>
      <el-form :model="offPayForm" :rules="offPayRules" ref="offPayForm" label-width="190px" label-position="left" class="pay-form-box">
        <el-form-item label="Payment Address:" prop="paymentAddress" class="address">
          <el-select v-model="offPayForm.paymentAddress" :disabled="offConfirmLoading" style="width: 100%;">
            <el-option v-for="item in addressList" :key="item.id" :label="`【${item.addressTag}】${item.address}`" :value="item.address"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="Secondary Password:" prop="paymentPassword" class="password">
          <el-input type="password" v-model="offPayForm.paymentPassword" autocomplete="off" :disabled="offConfirmLoading"></el-input>
          <div class="forgot" @click="forgotPassword = true">Forgot Password?</div>
        </el-form-item>
      </el-form>
      <div class="off-tips">
        <div class="off-tips-icon">
          <img src="../../assets/images/tips.png" alt="logo">
        </div>
        After submitting, we will lock up the subscription shares for you. Please pay as soon as possible and register the payment information
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="offSubmitDialog = false">Cancel</el-button>
        <el-button type="primary" @click="offSubmitOrder" :loading="offConfirmLoading">Confirm</el-button>
      </span>
    </el-dialog>

    <el-dialog title="Terms And Conditions" :visible.sync="conditionsDialog"
      width="744px" top="20px" class="conditions-dialog">
      <div class="conditions-content">
        <pre>{{termsAndConditions}}</pre>
      </div>
      <div class="foot-btn">
        <el-button type="primary" @click="conditionsDialog = false;conditionsChecked = true">Agree</el-button>
      </div>
    </el-dialog>
    <setPassword :isShow="forgotPassword" :changeType="2" @closeDialog="forgotPassword = false" />
  </div>
</template>
<script>
import BreadCrumbs from '@/components/BreadCrumbs.vue';
import setPassword from '@/components/setPassword';
import subscriptionInfo from './detail/subscriptionInfo';
import basicInformation from './detail/basicInformation';
import principals from './detail/principals';
import tradingRestriction from './detail/tradingRestriction';
import documents from './detail/documents';
import { getBondsDetail, multiAddresses, createBidOrder, getTermsAndConditions, getBalance } from '@/api';
import { notify, formatDate, changeTimeStamp, numberExcludeZero, operationNumber, toFixeds } from '@/common/util';
import md5 from 'md5';

export default {
  name: 'SubscriptionDetail',
  data () {
    const validateQuantity = (rule, value, callback) => {
      if (numberExcludeZero.test(value)) {
        if (this.detailObj.tradeType === 1) {
          if (this.formatNumber(value) < this.formatNumber(this.detailObj.quantity)) {
            callback(new Error(`Above ${this.formatNumber(this.detailObj.quantity)} ${this.detailObj.tokenCode}`));
          } else {
            callback();
          }
        } else {
          if (this.formatNumber(value) < this.formatNumber(this.detailObj.minQuantityOnce)) {
            callback(new Error(`Above ${this.formatNumber(this.detailObj.minQuantityOnce)} ${this.detailObj.tokenCode}`));
          } else {
            callback();
          }
        }
      } else {
        if (this.detailObj.tradeType === 1) {
          callback(new Error(`Above ${this.formatNumber(this.detailObj.quantity)} ${this.detailObj.tokenCode}`));
        } else {
          callback(new Error(`Above ${this.formatNumber(this.detailObj.minQuantityOnce)} ${this.detailObj.tokenCode}`));
        }
      }
    };
    return {
      breadData: [
        {
          name: 'Subscription Centre'
        }, {
          name: 'Bond Subscription',
          to: '/subscription'
        }, {
          name: ''
        }
      ],
      infoTabs: [
        {
          name: 'Subscription Info',
          key: 0
        }, {
          name: 'Basic Information',
          key: 1
        }, {
          name: 'Coupon & Principal',
          key: 2
        }, {
          name: 'Trading Restriction',
          key: 3
        }, {
          name: 'Documents',
          key: 4
        }
      ],
      quantityForm: {
        quantityNum: ''
      },
      quantityRules: {
        quantityNum: [{ required: true, message: 'This field cannot be empty', trigger: 'blur' }, { validator: validateQuantity, trigger: ['change', 'blur'] }]
      },
      payForm: {
        paymentPassword: '',
        paymentAddress: ''
      },
      payRules: {
        paymentPassword: [{ required: true, message: 'This field cannot be empty', trigger: 'blur' }],
        paymentAddress: [{ required: true, message: 'This field cannot be empty', trigger: 'change' }]
      },
      offPayForm: {
        paymentPassword: '',
        paymentAddress: ''
      },
      offPayRules: {
        paymentPassword: [{ required: true, message: 'This field cannot be empty', trigger: 'blur' }],
        paymentAddress: [{ required: true, message: 'This field cannot be empty', trigger: 'blur' }]
      },
      tabsName: 0,
      conditionsChecked: false,
      submitDialog: false,
      offSubmitDialog: false,
      confirmLoading: false,
      offConfirmLoading: false,
      conditionsDialog: false,
      loading: false,
      detailObj: {},
      endTimer: null,
      addressList: [],
      termsAndConditions: '',
      addressBalance: '',
      addressBalanceLoading: false,
      forgotPassword: false,
      quantityPlaceholder: '',
      currentTime: ''
    };
  },
  watch: {
    submitDialog (n, o) {
      if (n) {
        this.confirmLoading = false;
      }
    },
    'quantityForm.quantityNum': function (n, o) {
      if (n !== '') {
        this.detailObj.totalPayable = operationNumber(parseFloat(n), parseFloat(this.detailObj.price), 'multiply');
        this.detailObj.annualEarnings = parseFloat(toFixeds(operationNumber(parseFloat(n), parseFloat(this.detailObj.couponRate) / 100, 'multiply'), 8, false));
        if (n.split('.').length < 1) {
          if (!numberExcludeZero.test(n)) {
            this.quantityForm.quantityNum = o;
          }
        } else if (n.split('.').length > 2) {
          this.quantityForm.quantityNum = o;
        } else if (n.split('.').length !== 2) {
          if (!numberExcludeZero.test(n)) {
            this.quantityForm.quantityNum = o;
          }
        }
      } else {
        this.detailObj.totalPayable = '';
        this.detailObj.annualEarnings = '';
      }
    }
  },
  created () {
    this.getDetailInfo();
    this.getTermsAndConditions();
  },
  methods: {
    offSubmitOrder () {
      this.$refs.offPayForm.validate(async valid => {
        if (valid) {
          this.offConfirmLoading = true;
          const data = await createBidOrder({
            data: {
              offerOrderNo: this.$route.query.orderNo,
              quantity: this.quantityForm.quantityNum,
              userAddress: this.offPayForm.paymentAddress,
              secondaryPwd: md5(this.offPayForm.paymentPassword).toUpperCase()
            },
            slient: true,
            notify: notify
          });
          this.offConfirmLoading = false;
          if (data.code === '1000') {
            this.offSubmitDialog = false;
            this.offPayForm.paymentPassword = '';
            this.$router.push({
              name: 'SubscriptionOrders',
              query: {
                navActive: 0
              }
            });
          }
        }
      });
    },
    isEmpty (str) {
      return str || '--';
    },
    changeAddress (address) {
      this.getAddressBalance(this.detailObj.currency, address, this.detailObj.currencyType);
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
    async getTermsAndConditions () {
      const data = await getTermsAndConditions({
        data: {
          tokenCode: this.$route.query.tokenCode
        },
        slient: true,
        notify: notify.error
      });
      if (data.data) {
        this.termsAndConditions = data.data;
      }
    },
    submitOrder () {
      this.$refs.payForm.validate(async valid => {
        if (valid) {
          this.confirmLoading = true;
          const data = await createBidOrder({
            data: {
              offerOrderNo: this.$route.query.orderNo,
              quantity: this.quantityForm.quantityNum,
              userAddress: this.payForm.paymentAddress,
              secondaryPwd: md5(this.payForm.paymentPassword).toUpperCase()
            },
            slient: true,
            notify: notify
          });
          this.confirmLoading = false;
          if (data.code === '1000') {
            this.submitDialog = false;
            this.payForm.paymentPassword = '';
            this.$router.push({
              name: 'SubscriptionOrders',
              query: {
                navActive: 0
              }
            });
            // this.getDetailInfo();
          }
        }
      });
    },
    async getAddress () {
      const data = await multiAddresses({
        slient: true,
        notify: notify.error
      });
      if (data.data.data) {
        this.addressList = data.data.data;
        this.payForm.paymentAddress = this.addressList[0].address;
        this.offPayForm.paymentAddress = this.addressList[0].address;
        if (this.detailObj.paymentType === 2) {
          this.getAddressBalance(this.detailObj.currency, this.payForm.paymentAddress, this.detailObj.currencyType);
        }
      }
    },
    openPayDia () {
      this.$refs.quantityForm.validate(valid => {
        if (valid) {
          if (this.detailObj.paymentType === 1) {
            this.offSubmitDialog = true;
          } else {
            this.submitDialog = true;
          }
        }
      });
    },
    formatCoupon (num) {
      if (num) {
        return parseFloat(num);
      } else {
        return '--';
      }
    },
    formatNumber (num, type) {
      if (type === 'remainQuantity') {
        if (parseInt(num) === 0) {
          return '0';
        } else {
          return parseFloat(num) || '--';
        }
      } else {
        return parseFloat(num) || '--';
      }
    },
    formatTime (time) {
      return formatDate(time) || '--';
    },
    async getDetailInfo () {
      this.loading = true;
      const data = await getBondsDetail({
        data: {
          orderNo: this.$route.query.orderNo
        },
        slient: true,
        notify: notify.error
      });
      this.loading = false;
      if (data.code === '1000') {
        this.detailObj = Object.assign({}, data.data);
        this.currentTime = this.detailObj.currentTime;
        if (this.detailObj.bizStatus === 1) {
          this.detailObj.endTimerDesc = 'Ends in ' + changeTimeStamp(this.detailObj.orderEndTime, this.currentTime);
        } else if (this.detailObj.bizStatus === 2) {
          this.detailObj.endTimerDesc = 'Starting in ' + changeTimeStamp(this.detailObj.orderStartTime, this.currentTime);
        } else {
          this.detailObj.endTimerDesc = 'Concluded';
        }
        this.detailObj.percentage = (parseFloat(this.detailObj.subscribed) / parseFloat(this.detailObj.quantity)) * 100;
        this.detailObj.percentage = parseFloat(toFixeds(this.detailObj.percentage, 2));
        if (this.detailObj.tradeType === 1) {
          this.quantityPlaceholder = `Above ${this.formatNumber(this.detailObj.quantity)} ${this.detailObj.tokenCode}`;
        } else {
          this.quantityPlaceholder = `Above ${this.formatNumber(this.detailObj.minQuantityOnce)} ${this.detailObj.tokenCode}`;
        }
        this.conditionsChecked = !this.detailObj.tcStatus;
        this.breadData[2].name = this.detailObj.orderName;
        clearInterval(this.endTimer);
        if (this.detailObj.bizStatus === 1) {
          this.endTimerFu();
        } else if (this.detailObj.bizStatus === 2) {
          this.startTimer();
        } else {
          this.detailObj.endTimerDesc = 'Concluded';
        }
        this.getAddress();
      }
    },
    endTimerFu () {
      this.endTimer = setInterval(() => {
        this.currentTime += 1000;
        this.detailObj.endTimerDesc = 'Ends in ' + changeTimeStamp(this.detailObj.orderEndTime, this.currentTime);
        this.$forceUpdate();
        if (this.currentTime >= this.detailObj.orderEndTime) {
          clearInterval(this.endTimer);
          this.quantityForm.quantityNum = '';
          this.$refs.quantityForm.clearValidate();
          this.detailObj.endTimerDesc = 'Concluded';
          this.detailObj.bizStatus = 3;
        }
      }, 1000);
    },
    startTimer () {
      this.endTimer = setInterval(() => {
        this.currentTime += 1000;
        this.detailObj.endTimerDesc = 'Starting in ' + changeTimeStamp(this.detailObj.orderStartTime, this.currentTime);
        this.$forceUpdate();
        if (this.currentTime >= this.detailObj.orderStartTime) {
          clearInterval(this.endTimer);
          this.detailObj.bizStatus = 1;
          this.detailObj.endTimerDesc = 'Ends in ' + changeTimeStamp(this.detailObj.orderEndTime, this.currentTime);
          this.endTimerFu();
        }
      }, 1000);
    }
  },
  beforeDestroy () {
    clearInterval(this.endTimer);
  },
  components: {
    'bread-crumbs': BreadCrumbs,
    subscriptionInfo,
    basicInformation,
    principals,
    tradingRestriction,
    documents,
    setPassword
  }
};
</script>
<style lang="scss" scoped>
.subscription-detail {
  color: #192231;
  .main-container {
    background-color: #f2f2f2;
    padding: 0;
    .info-top {
      display: flex;
      background-color: #fff;
      .detail-left {
        padding: 40px 0px 20px 30px;
        width: 728px;
        .head-title {
          font-size: 20px;
          color: #0D1000;
          font-weight: 600;
          margin-bottom: 30px;
          & > span:last-child {
            font-size: 24px;
            font-weight: normal;
          }
        }
        .number-info {
          display: flex;
          & > div {
            display: flex;
            flex-direction: column;
            justify-content: space-between;
          }
          .year-rate {
            margin-right: 70px;
            & > span:first-child {
              font-size: 36px;
              color: #E6471F;
              font-weight: 600;
            }
            & > span:last-child {
              font-size: 14px;
              color: #616367;
            }
          }
          .limit {
            margin-right: 70px;
            & > span:first-child {
              font-size: 36px;
              color: #192231;
            }
            & > span:last-child {
              font-size: 14px;
              color: #616367;
            }
          }
          .total {
            & > span:first-child {
              font-size: 36px;
              color: #192231;
            }
            & > span:last-child {
              font-size: 14px;
              color: #616367;
            }
          }
        }
        .specific-information {
          margin-top: 50px;
          .el-col {
            margin-bottom: 12px;
          }
          .label {
            width: 170px;
            text-align: left;
            display: inline-block;
            font-size: 14px;
            color: #8D93A1;
          }
          .value {
            font-size: 14px;
            color: #192231;
          }
        }
      }
      .detail-right {
        width: 472px;
        background-color: #FBFBFB;
        padding: 25px 36px 23px 36px;
        .end-title {
          font-size: 18px;
          color: #E6471F;
          margin-bottom: 20px;
        }
        .el-progress {
          margin-bottom: 20px;
        }
        .parameter-box {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 10px;
          .label {
            font-size: 14px;
            color: #616367;
          }
          .value {
            font-size: 14px;
            font-weight: 600;
          }
        }
        .submit-btn {
          width: 400px;
          height: 45px;
          border-radius: 8px;
          font-size: 14px;
          font-weight: normal;
          // &:hover {
          //   background-color: #214285 !important;
          // }
        }
        .conditions {
          margin-top: 15px;
          .conditions-checkbox {
            margin-right: 10px;
          }
          & > span {
            cursor: pointer;
          }
          & > span:last-child {
            color: #497eb9;
            &:hover {
              color: #214285;
            }
          }
        }
      }
    }
    .info-bottom {
      margin-top: 20px;
      padding: 30px 0px 40px 0px;
      background-color: #fff;
      .info-bottom-nav {
        display: flex;
        margin-bottom: 40px;
        .nav-item {
          width: 200px;
          height: 34px;
          text-align: center;
          line-height: 34px;
          font-size: 18px;
          color: #5A6171;
          border-right: 1px solid #DCDFE6;
          cursor: pointer;
        }
        .nav-active {
          color: #497EB9;
          font-weight: 600;
        }
      }
      .page-box {
        overflow: hidden;
        .move-page {
          width: 6000px;
          // transition: all .5s;
          & > div {
            width: 1170px;
            padding-left: 30px;
            float: left;
          }
        }
      }
    }
  }
}
</style>
<style lang="scss">
.subscription-detail {
  .main-container {
    .info-top {
      .el-progress__text {
        margin-left: 27px;
        font-size: 14px !important;
        color: #192231;
        font-weight: 600;
        float: right;
      }
      .detail-right {
        .conditions {
          .el-checkbox__input.is-checked .el-checkbox__inner {
            border-color: #214285 !important;
            background-color: #214285 !important;
          }
          .el-checkbox__inner {
            border-radius: 50%;
            &:focus {
              border-color: #214285 !important;
            }
            &:hover {
              border-color: #214285 !important;
            }
          }
        }
        .quantity-Form {
          position: relative;
          .el-form-item__content {
            .el-input__inner {
              font-size: 16px;
              padding-left: 90px;
              border-radius: 8px;
              color: #616367;
              &::-webkit-input-placeholder {
                color: #979799;
              }
              &::-moz-placeholder {/* Firefox 18- */
                color: #979799;
              }
              &::-ms-input-placeholder {
                color: #979799;
              }
            }
            .el-form-item__error {
              font-size: 14px;
            }
          }
          .qu-label {
            position: absolute;
            left: 15px;
            top: 50%;
            transform: translateY(-50%);
            font-size: 16px;
            color: #616367;
          }
        }
        .el-progress {
          .el-progress-bar {
            // margin-right: -68px;
            width: 95%;
          }
        }
        .el-button--primary.is-disabled {
          background-color: #e7e7e7 !important;
          border-color: #e7e7e7 !important;
          &:hover {
            background-color: #e7e7e7 !important;
            border-color: #e7e7e7 !important;
          }
        }
      }
    }
    .info-bottom {
      .page-box {
        .el-table .el-table__header thead tr th {
          padding: 11px 0;
        }
        .el-table .el-table__body .el-table__row td {
          padding: 10px 0;
        }
      }
    }
  }
  .payment-dialog {
    color: #001F3B;
    .payment-info {
      width: 100%;
      height: 128px;
      background: url(../../assets/images/pay-bg.png) no-repeat center center;
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
    .pay-form-box {
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
        margin-bottom: 60px;
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
    .off-tips {
      width: 100%;
      height: 72px;
      background-color: #FFF6E7;
      padding: 15px 20px;
      color: #FF9A00;
      margin-bottom: 23px;
      .off-tips-icon {
        float: left;
      }
      img {
        width: 18px;
        height: 18px;
        margin-right: 12px;
      }
    }
  }
  .conditions-dialog {
    .el-dialog__header {
      text-align: center;
      padding: 40px;
      .el-dialog__title {
        font-size: 26px;
        color: #001F3B;
      }
    }
    .conditions-content {
      max-height: 500px;
      overflow: auto;
    }
    .foot-btn {
      padding-top: 40px;
      text-align: center;
      padding-bottom: 10px;
      button {
        width: 245px;
        height: 40px;
      }
    }
  }
}
</style>
