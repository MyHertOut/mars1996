<template>
  <div class="information" v-loading="loading">
    <el-form :model="ruleForm" ref="ruleForm" label-width="210px"
      class="information-form" label-position="left" :rules="rules">
       <!-- Issuer Name放在【Basic Parament-Security Name】后面 -->
      <!-- <el-form-item label="Issuer Name：" prop="issuerName">
        <el-input v-model="ruleForm.issuerName" autocomplete="off" maxlength="256"></el-input>
      </el-form-item> -->
      <el-form-item label="Issuance Address：" prop="issuanceAddress">
        <el-select v-model="ruleForm.issuanceAddress" placeholder="Please select the issuance address">
          <el-option
            v-for="item in addressData"
            :key="item.id"
            :label="'[' + item.addressTag + ']' + item.address"
            :value="item.address"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="Issuance Quantity：" prop="issuanceQuantity">
        <el-input v-model="ruleForm.issuanceQuantity" maxlength="42" placeholder="Please enter the issuance quantity"></el-input>
      </el-form-item>
      <el-form-item label="Par Value Per Token：" prop="parValuePerToken">
        <el-input v-model="ruleForm.parValuePerToken" style="width: 236px;margin-right: 12px;" maxlength="42" placeholder="Enter the par value per unit"></el-input>
        <el-select placeholder="Currency" v-model="ruleForm.currency" style="width: 236px;">
          <el-option v-for="item in currencyList" :key="item.value"
            :label="item.label"
            :value="item.value">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="Settlement Token：" prop="settlementMethod">
        <el-radio v-model="ruleForm.settlementMethod" label="1">Digital Currency</el-radio>
        <el-radio v-model="ruleForm.settlementMethod" label="0">Certificate</el-radio>
        <!-- <template v-if="ruleForm.paymentMethod === '1'">
          <el-select v-model="ruleForm.currency" style="width: 219px;">
            <el-option v-for="item in currencyList" :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
          <el-input v-model="ruleForm.settlementTokenInput" maxlength="16" style="width: 354px;" disabled></el-input>
        </template>
        <el-input v-model="ruleForm.settlementTokenInput" maxlength="16" v-else></el-input> -->
      </el-form-item>
      <el-form-item label="" prop="settlementCode">
        <el-select :loading="settlementCodeLoading" placeholder="Settlement Token" v-model="ruleForm.settlementCode" style="width: 100%;">
            <el-option v-for="item in settlementCodeList" :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
        <!-- <template v-if="ruleForm.paymentMethod === '1'">
          <el-select v-model="ruleForm.currency" style="width: 100%;">
            <el-option v-for="item in currencyList" :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
        </template>
        <el-form v-else ref="settlementTokenForm" :rules="settlementTokenRules" :model="ruleForm">
          <el-form-item label="" prop="settlementTokenInput">
            <el-input v-model="ruleForm.settlementTokenInput" maxlength="16"></el-input>
          </el-form-item>
        </el-form> -->
      </el-form-item>
      <el-form-item label="Day Count Convention：" prop="dayCountConvention">
        <el-select v-model="ruleForm.dayCountConvention">
          <el-option :label="v.label" :value="v.value"
            v-for="(v, k) in dayCountConventionList" :key="k">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="Terms & Conditions：" prop="tcStatus">
        <el-radio v-model="ruleForm.tcStatus" :label="true">On</el-radio>
        <el-radio v-model="ruleForm.tcStatus" :label="false">Off</el-radio>
      </el-form-item>
      <!-- :rules="[{ required: true, trigger: 'blur', message: 'This field is required.' }]" -->
      <el-form-item
        v-if="ruleForm.tcStatus"
        label="" prop="acknowledgeTc">
        <el-input v-model="ruleForm.acknowledgeTc" placeholder="Please enter terms and conditions" type="textarea"
          :autosize="{ minRows: 9, maxRows: 9 }" maxLength="1024"></el-input>
      </el-form-item>
    </el-form>
    <!-- <div class="submit">
      <el-button @click="$router.push({ name: 'Parameters', query: { serialNo: $route.query.serialNo } })">Previous</el-button>
      <el-button type="primary" @click="next">Next</el-button>
    </div> -->
    <div class="form-btns">
      <el-button @click="handlePrevious">Previous</el-button>
      <el-button type="primary" @click="handleNext">Next</el-button>
    </div>
  </div>
</template>
<script>
import { multiAddresses, getAssetToken } from '@/api/common.js';
import {
  newSecurity,
  getIssueAddress,
  getSecurityInfo
} from '@/api/distribution-center.js';
import { dayCountConventionList } from '@/common/enums.js';
import { notify } from '@/common/util';

export default {
  name: 'Information',
  watch: {
    'ruleForm.settlementMethod': function (n, o) {
      if (n === '0' && !this.ruleForm.settlementTokenInput) {
        this.ruleForm.settlementTokenInput = '';
      } else {
        // this.ruleForm.currency = 'USD';
        this.$refs.ruleForm.clearValidate('settlementTokenInput');
      }
      this.ruleForm.settlementCode = '';
      (n && n !== 'null') && this.getToken();
    },
    'ruleForm.currency': function (n, o) {
      this.ruleForm.settlementCode = '';
      (n && n !== 'null') && this.getToken();
    },
    'ruleForm.tcStatus': function (n, o) {
      if (!n) {
        this.$refs.ruleForm.clearValidate('acknowledgeTc');
        this.ruleForm.acknowledgeTc = '';
      }
    },
    // 'ruleForm.issuerName': function (n, o) {
    //   if (notChineseReg.test(this.ruleForm.issuerName) || n === '') {
    //     this.ruleForm.issuerName = n;
    //   } else {
    //     this.ruleForm.issuerName = o;
    //   }
    // },
    'ruleForm.settlementTokenInput': function (n, o) {
      if (new RegExp('^[0-9a-zA-Z]+$').test(this.ruleForm.settlementTokenInput) || n === '') {
        this.ruleForm.settlementTokenInput = n.toUpperCase();
      } else {
        this.ruleForm.settlementTokenInput = o;
      }
    },
    'ruleForm.parValuePerToken': function (value, o) {
      if (value) {
        const current = value.split(',').join('');
        if (/^([1-9]\d*)\.?(\d{1,8})?$/.test(current)) {
          if (value.split('.').length === 2) {
            const before = this.$options.filters.demicrometer(value.split('.')[0].split(',').join(''));
            let after = value.split('.')[1];
            if (value.split('.')[1].length > 8) {
              after = value.split('.')[1].slice(0, 8);
            }
            const arr = [before, after];
            this.ruleForm.parValuePerToken = arr.join('.');
          } else if (value.split('.').length > 2) {
            this.ruleForm.parValuePerToken = o;
          } else {
            const num = value.split(',').join('');
            this.ruleForm.parValuePerToken = this.$options.filters.demicrometer(num);
          }
        } else {
          this.ruleForm.parValuePerToken = o;
        }
      }
    }
  },
  data () {
    const validatorQuantity = (rule, value, callback) => {
      if (value === '0') {
        this.ruleForm.issuanceQuantity = '';
      } else if (value) {
        const num = value.toString().replace(/[^\d]/g, '');
        const reg = /\d{1,3}(?=(\d{3})+$)/g;
        this.ruleForm.issuanceQuantity = (num + '').replace(reg, '$&,');
        callback();
      }
    };
    // const validatorPerToken = (rule, value, callback) => {
    //   if (value === '0') {
    //     this.ruleForm.parValuePerToken = '';
    //   } else if (value) {
    //     // this.ruleForm.parValuePerToken = value.toString().replace(/[^\d]/g, '');
    //     const num = value.toString().replace(/[^\d]/g, '');
    //     const reg = /\d{1,3}(?=(\d{3})+$)/g;
    //     this.ruleForm.parValuePerToken = (num + '').replace(reg, '$&,');
    //     callback();
    //   }
    // };
    return {
      settlementCodeList: [],
      settlementCodeLoading: false,
      ruleForm: {
        // issuerName: '',
        issuanceAddress: '',
        issuanceQuantity: '',
        parValuePerToken: '',
        settlementMethod: '', // '1',
        currency: '', // 'USD',
        settlementTokenInput: '1102',
        dayCountConvention: '0',
        acknowledgeTc: '',
        tcStatus: false,
        settlementCode: ''
      },
      addressData: [],
      issuanceAddress: '',
      copyRuleForm: {},
      loading: false,
      currencyList: [
        {
          label: 'USD',
          value: 'USD'
        }, {
          label: 'EUR',
          value: 'EUR'
        }, {
          label: 'SGD',
          value: 'SGD'
        }, {
          label: 'GBP',
          value: 'GBP'
        }
      ],
      dayCountConventionList,
      rules: {
        // issuerName: [{ required: true, trigger: 'blur', message: 'This field is required.' }],
        settlementCode: [{ required: true, trigger: 'change', message: 'This field is required.' }],
        issuanceAddress: [{ required: true, trigger: 'blur', message: 'This field is required.' }],
        issuanceQuantity: [{ required: true, trigger: 'blur', message: 'This field is required.' }, { validator: validatorQuantity, trigger: 'change' }],
        parValuePerToken: [{ required: true, trigger: 'blur', message: 'This field is required.' }],
        // settlementTokenInput: [{ required: true, trigger: 'blur', message: 'This field is required.' }],
        dayCountConvention: [{ required: true, trigger: 'blur', message: 'This field is required.' }],
        settlementMethod: [{ required: true, trigger: 'blur', message: 'This field is required.' }],
        acknowledgeTc: [{ required: true, trigger: 'blur', message: 'This field is required.' }]
        // settlementTokenInput: [{ required: true, trigger: 'blur', message: 'This field is required.' }]
      },
      settlementTokenRules: {
        settlementTokenInput: [{ required: true, trigger: 'blur', message: 'This field is required.' }]
      }
    };
  },
  created () {
    this.multiAddresses();
    this.getIssueAddress();
    this.getBeforeInfo();
    // this.getToken();
  },
  methods: {
    async getBeforeInfo () {
      if (this.$route.query.serialNo) {
        this.loading = true;
        const data = await getSecurityInfo({
          serialNo: this.$route.query.serialNo,
          slient: true
        }).catch(() => {
          this.loading = false;
        });
        if (data.code === '1000') {
          const resData = data.data || {};
          for (const i in this.ruleForm) {
            if (i === 'settlementMethod') {
              this.ruleForm[i] = (resData[i] || resData[i] === 0) ? '' + resData[i] : '';
            } else {
              this.ruleForm[i] = resData[i];
            }
          }
          for (const i in this.ruleForm) {
            if (!this.ruleForm[i] && this.ruleForm[i] !== false) {
              this.ruleForm[i] = '';
            }
          }
          this.ruleForm.tcStatus = resData.tcStatus === null ? false : resData.tcStatus;
          // this.ruleForm.settlementMethod = resData.settlementToken ? resData.settlementToken.split(',')[0] : '1';
          // this.ruleForm.currency = resData.settlementToken ? resData.settlementToken.split(',')[1] : 'USD';
          /* eslint-disable */
          if (this.ruleForm.settlementMethod == 0) {
            this.ruleForm.settlementTokenInput = resData.settlementToken ? resData.settlementToken.split(',')[1] : '';
          } else {
            this.ruleForm.settlementTokenInput = resData.settlementToken ? resData.settlementToken.split(',')[2] : '';
          }
          if (!resData.issuanceAddress) {
            this.ruleForm.issuanceAddress = this.issuanceAddress;
          }
          if (!resData.dayCountConvention) {
            this.ruleForm.dayCountConvention = '0';
          }
        }
        this.loading = false;
      }
    },
    async getIssueAddress () {
      const data = await getIssueAddress();
      this.ruleForm.issuanceAddress = data.data;
      this.issuanceAddress = data.data;
    },
    handlePrevious () {
      this.$router.push({
        name: this.$route.meta.opType === 'abs' ?
        'DisIssueAbsParameters' :
        'DisIssueBondsParameters',
        query: {
          serialNo: this.$route.query.serialNo
        }
      });
    },
    handleNext () {
      this.$refs.ruleForm.validate(async valid => {
        let tempValid = true;
        // if (this.ruleForm.paymentMethod === '0') {
        //   this.$refs.settlementTokenForm.validate(async valids => {
        //     tempValid = valids;
        //   });
        // }
        if (valid && tempValid) {
          const params = Object.assign({}, this.ruleForm);
          // const settlementToken = params.paymentMethod === '1' ? `1,${params.currency},${params.settlementTokenInput}` : `0,${params.settlementTokenInput}`;
          // delete params.paymentMethod;
          // delete params.currency;
          delete params.settlementTokenInput;
          // params.settlementToken = settlementToken;
          params.serialNo = this.$route.query.serialNo;
          params.issuanceQuantity = this.ruleForm.issuanceQuantity.split(',').join('');
          params.parValuePerToken = this.ruleForm.parValuePerToken.split(',').join('');
          // params.settlementCode = params.settlementToken.slice(2).replace(/,/g, '');
          this.loading = true;
          const data = await newSecurity({ data: params, slient: true, notify: notify.error });
          if (data.code === '1000') {
            this.$router.push({ name: 'DisIssueBondsPayment', query: { serialNo: params.serialNo } });
          }
          this.loading = false;
        }
      });
    },
    multiAddresses () {
      multiAddresses().then(res => {
        const { data, code } = res.data;
        this.loading = false;
        if (code === '1000') {
          this.addressData = data || [];
        }
      });
    },
    getToken (){
      const { settlementMethod, currency } = this.ruleForm;
      if (!settlementMethod || settlementMethod === 'null' || !currency) return;

      this.settlementCodeLoading = true;
      getAssetToken({
        data: {
          currency,
          type: settlementMethod
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
  }
};
</script>
<style scoped lang="scss">
.information {
  .information-form {
    padding-left: 30px;
    width: 724px;
    margin: 0 auto;
    font-size: 16px;
    color: #192231;
    .el-select {
      width: 100%;
    }
  }
  .submit {
    width: 630px;
    margin: 0 auto;
    display: flex;
    justify-content: space-between;
    margin-top: 100px;
    margin-bottom: 30px;
    button {
      width: 300px;
      height: 40px;
      font-size: 20px;
      font-weight: normal;
      color: #2F39E3;
      &:focus {
        background-color: #fff;
      }
      & + button {
        color: #fff;
      }
    }
  }
}
</style>
