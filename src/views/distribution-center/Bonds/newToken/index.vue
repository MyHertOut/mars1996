<template>
  <div class="add-new-token" v-loading="loading">
    <el-form :model="ruleForm" ref="ruleForm" label-width="180px"
      class="new-token-form" label-position="left" :rules="rules">
      <el-form-item label="Issuer Name：" prop="issuerName">
        <el-input v-model="ruleForm.issuerName" autocomplete="off" maxlength="256" placeholder="Please enter the issuer name"></el-input>
      </el-form-item>
      <el-form-item label="Token Type：" prop="type">
        <el-select v-model="ruleForm.type" placeholder="Please select the token type" prop="type" @change="changeType">
          <el-option :label="v.label" :value="v.value" v-for="(v, k) in tokenTypeList" :key="k"></el-option>
        </el-select>
      </el-form-item>
      <!-- <el-form-item label="SMT Code：">
        <div class="smtCode">{{this.smtList}}</div>
        <i class="el-icon-loading" v-if="!this.smtList && ruleForm.type !== ''"></i>
      </el-form-item> -->
      <!-- <template v-if="ruleForm.type!=1">
        <el-form-item label="Currency：" prop="benchmark">
          <el-select v-model="ruleForm.benchmark" placeholder="- -" @change="changeBenchmark">
            <el-option label="USD" value="USD"></el-option>
            <el-option label="EUR" value="EUR"></el-option>
            <el-option label="SGD" value="SGD"></el-option>
            <el-option label="GBP" value="GBP"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="Token Code：" prop="organization" class="token-organization">
          <el-input v-model="ruleForm.tokenCurrency" disabled style="width: 283px;margin-right: 4px;"></el-input>
          <el-input v-model="ruleForm.organization" style="width: 283px;" maxlength="8"></el-input>
        </el-form-item>
        <el-form-item label="Token Name：" prop="tokenName">
          <el-input v-model="ruleForm.debtCurrency" disabled style="width: 283px;margin-right: 4px;"></el-input>
          <el-input v-model="ruleForm.debtType" disabled style="width: 283px;"></el-input>
        </el-form-item>
      </template> -->
      <!-- <template v-else> -->
        <el-form-item label="Currency：" prop="benchmark">
          <el-select v-model="ruleForm.benchmark" placeholder="Please select the currency code" @change="changeBenchmark">
            <el-option label="USD" value="USD"></el-option>
            <el-option label="EUR" value="EUR"></el-option>
            <el-option label="SGD" value="SGD"></el-option>
            <el-option label="GBP" value="GBP"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="Token Code：" prop="code">
          <el-input v-model="ruleForm.code" maxlength="32" placeholder="Please enter the token code"></el-input>
        </el-form-item>
        <el-form-item label="Token Name：" prop="name">
          <el-input v-model="ruleForm.name" maxlength="64" placeholder="Please enter the token name"></el-input>
        </el-form-item>
      <!-- </template> -->
      <el-form-item label="Issuance Address：" prop="issuanceAddress">
        <!-- <el-input v-model="ruleForm.issuanceAddress" disabled></el-input> -->
        <el-select v-model="ruleForm.issuanceAddress" placeholder="Please select the issuance address">
          <el-option
            v-for="item in addressData"
            :key="item.id"
            :label="'[' + item.addressTag + ']' + item.address"
            :value="item.address"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="Issuance Quantity：" prop="quantity">
        <el-input v-model="ruleForm.quantity" maxlength="25" placeholder="Please enter the issuance quantity"></el-input>
      </el-form-item>
    </el-form>
    <div class="form-btns">
      <el-button @click="$router.push({ path: '/issuance/currency' })">Cancel</el-button>
      <el-button type="primary" @click="next">Next</el-button>
    </div>
  </div>
</template>
<script>
// import { formatNumber } from 'accounting-js';
import {
  getTokenSMTInfo, getIssueAddress, addToken, getStepTokenInfo,
  getSMTDigital
} from '@/api/distribution-center';
import { multiAddresses } from '@/api/common.js';
import { notify, notChineseReg } from '@/common/util';

export default {
  name: 'NewToken',
  watch: {
    'ruleForm.organization': function (n, o) {
      // if (n) {
      //   this.tokenOrganization = false;
      // } else {
      //   this.tokenOrganization = true;
      // }
      if (/^[0-9a-zA-Z]+$/.test(this.ruleForm.organization) || n === '') {
        this.ruleForm.organization = n.toUpperCase();
      } else {
        this.ruleForm.organization = o;
      }
    },
    'ruleForm.code': function (n, o) {
      if (/^[0-9a-zA-Z]+$/.test(this.ruleForm.code) || n === '') {
        this.ruleForm.code = n.toUpperCase();
      } else {
        this.ruleForm.code = o;
      }
    },
    'ruleForm.name': function (n, o) {
      if (notChineseReg.test(this.ruleForm.name) || n === '') {
        this.ruleForm.name = n;
      } else {
        this.ruleForm.name = o;
      }
    },
    'ruleForm.issuerName': function (n, o) {
      if (notChineseReg.test(this.ruleForm.issuerName) || n === '') {
        this.ruleForm.issuerName = n;
      } else {
        this.ruleForm.issuerName = o;
      }
    }
  },
  data () {
    const validatorQuantity = (rule, value, callback) => {
      if (value === '0') {
        this.ruleForm.quantity = '';
      } else {
        // this.ruleForm.quantity = value.toString().replace(/[^\d]/g, '');
        if (this.ruleForm.quantity !== '') {
        // this.ruleForm.quantity = formatNumber(this.ruleForm.quantity, { precision: 0 });
          // const num = value.toString().replace(/[^\d]/g, '');
          // const arr = num.split('');
          // const rut = [];
          // for (let i = 0; i < arr.length; i += 3) {
          //   rut.push(arr.slice(i, i + 3));
          // }
          // this.ruleForm.quantity = rut.map(v => v.join('')).join(',');
          const num = value.toString().replace(/[^\d]/g, '');
          const reg = /\d{1,3}(?=(\d{3})+$)/g;
          this.ruleForm.quantity = (num + '').replace(reg, '$&,');
        }
        callback();
      }
    };
    return {
      addressData: [],
      ruleForm: {
        type: '',
        smtCode: '',
        benchmark: '',
        tokenCurrency: '',
        organization: '',
        debtType: '',
        debtCurrency: '',
        issuanceAddress: '',
        quantity: '',
        tokenName: '1',
        tokenCode: '1',
        code: '',
        name: '',
        issuerName: ''
      },
      loading: false,
      smtList: '',
      // tokenOrganization: false,
      copySmtList: [],
      tokenTypeList: [
        {
          value: 0,
          label: 'Certificate'
        },
        {
          value: 1,
          label: 'Digital Currency'
        }
      ],
      rules: {
        issuerName: [{ required: true, trigger: 'blur', message: 'This field is required.' }],
        type: [{ required: true, trigger: 'change', message: 'This field is required.' }],
        benchmark: [{ required: true, trigger: 'change', message: 'This field is required.' }],
        organization: [{ required: true, trigger: 'blur', message: 'This field is required.' }],
        tokenName: [{ required: true, trigger: 'change', message: 'This field is required.' }],
        issuanceAddress: [{ required: true, trigger: 'change', message: 'This field is required.' }],
        code: [{ required: true, trigger: 'blur', message: 'This field is required.' }],
        name: [{ required: true, trigger: 'blur', message: 'This field is required.' }],
        quantity: [{ required: true, trigger: 'blur', message: 'This field is required.' }, { validator: validatorQuantity, trigger: 'change' }]
      }
    };
  },
  created () {
    this.getAddress();
    // this.getSMT();
    this.multiAddresses();
    if (this.$route.query.serialNo) {
      this.getStepInfo();
    }
  },
  methods: {
    async getStepInfo () {
      const data = await getStepTokenInfo({
        serialNo: this.$route.query.serialNo
      });
      if (!data) return;
      const { code, data: resData = {} } = data;
      if (code === '1000') {
        this.ruleForm = Object.assign(this.ruleForm, resData);
        this.ruleForm.organization = resData.org;
        this.ruleForm.tokenCurrency = resData.benchmark;
        this.ruleForm.debtType = resData.name;
        this.ruleForm.debtCurrency = resData.benchmark;
        this.ruleForm.quantity = resData.issuanceQuantity;
        this.ruleForm.issuerName = resData.issuerName;
        this.ruleForm.issuanceAddress = resData.issuanceAddress;
        this.smtList = resData.smtCode;
      }
    },
    async getAddress () {
      const data = await getIssueAddress();
      this.ruleForm.issuanceAddress = data.data;
    },
    async getSMT () {
      const data = await getTokenSMTInfo();
      this.copySmtList = data.data;
    },
    async getSMTDigital () {
      const data = await getSMTDigital();
      return data.data || '';
    },
    changeBenchmark (value) {
      this.ruleForm.tokenCurrency = value;
      this.ruleForm.organization = '';
      this.ruleForm.debtCurrency = value;
    },
    async changeType (value) {
      this.smtList = '';
      this.ruleForm.quantity = '';
      this.ruleForm.debtType = this.tokenTypeList.filter(v => v.value === value)[0].label;
      if (parseInt(value) === 0) {
        const data = await getTokenSMTInfo();
        this.smtList = data.data;
      } else {
        if (value === 1) {
          this.getSMTDigital().then(res => {
            this.smtList = res;
          });
        }
      }
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
    next () {
      this.$refs.ruleForm.validate(async valid => {
        // let organization = false;
        // if (this.ruleForm.organization) {
        //   organization = true;
        // } else {
        //   this.tokenOrganization = true;
        // }
        if (valid) {
          const params = Object.assign({}, this.ruleForm);
          // type为1为Digital Currency
          /* eslint-disable */
          // if (params.type != 1) {
          //   params.code = this.ruleForm.tokenCurrency + this.ruleForm.organization;
          //   params.name = this.ruleForm.debtCurrency + this.ruleForm.debtType;
          // }
          params.issuanceQuantity = this.ruleForm.quantity.split(',').join('');
          // params.smtCode = this.smtList[0].smtCode;
          params.smtCode = this.smtList;
          params.org = this.ruleForm.organization;
          delete params.tokenCurrency;
          delete params.organization;
          delete params.debtType;
          delete params.debtCurrency;
          delete params.quantity;
          if (this.$route.query.serialNo) {
            params.serialNo = this.$route.query.serialNo;
          }
          this.loading = true;
          const data = await addToken({ data: params, notify: notify.error, slient: true });
          if (data.code === '1000') {
            this.$router.push({
              name: 'DisBondsTokenDetail',
              query: { serialNo: data.data, href: 'SettlementToken', name: 'Settlement Tokens' }
            });
          }
          this.loading = false;
        }
      });
    }
  }
};
</script>
<style scoped lang="scss">
.add-new-token {
  .new-token-form {
    padding-left: 30px;
    width: 780px;
    margin: 0 auto;
    font-size: 16px;
    color: #192231;
    .el-select {
      width: 100%;
    }
    .SMTName {
      height: 40px;
      background-color: #F3F6FC;
      padding-left: 15px;
    }
    // .token-organization {
    //   position: relative;
    //   .token-organization-error {
    //     position: absolute;
    //     right: 165px;
    //     top: 30px;
    //     font-size: 12px;
    //     color: #F56C6C;
    //   }
    // }
  }
  .submit {
    text-align: center;
    margin-top: 100px;
    margin-bottom: 50px;
    button {
      width: 300px;
      height: 40px;
      font-size: 20px;
      font-weight: normal;
      span {
        opacity: .8;
      }
    }
  }
}
</style>
<style lang="scss">
.add-new-token {
  .new-token-form {
    .token-organization {
      .el-form-item__error {
        left: 288px;
      }
    }
  }
}
</style>
