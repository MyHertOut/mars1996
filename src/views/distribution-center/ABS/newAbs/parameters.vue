<template>
  <div class="disboinds-parameters" v-loading="loading">
    <el-form :model="ruleForm" :rules="rules" ref="ruleForm"
      label-width="210px" label-position="left" class="form-box">
      <!-- <el-form-item label="Security Type：" prop="type">
        <el-select v-model="ruleForm.type" placeholder="- -">
          <el-option
            v-for="item in securityTypeList"
            :key="item.value"
            :label="item.label"
            :value="item.value">
          </el-option>
        </el-select>
      </el-form-item> -->
      <!-- <el-form-item label="Bonds Type：" prop="bondsType">
        <el-select v-model="ruleForm.bondsType" placeholder="- -">
          <el-option
            v-for="item in bondsTypeList"
            :key="item.value"
            :label="item.label"
            :value="item.value">
          </el-option>
        </el-select>
      </el-form-item> -->
      <!-- <el-form-item label="SMT Code：" prop="smtCode" class="smt-code-label">
        <template v-if="ruleForm.type">
          <div>smti-00-001-0-1-v1</div>
          <div>{{this.smtCodeList}}</div>
        </template>
      </el-form-item> -->
      <el-form-item label="Issuer Name：" prop="issuerName">
        <el-input v-model="ruleForm.issuerName" placeholder="Please enter the name of the issuer" autocomplete="off" maxlength="32"></el-input>
      </el-form-item>
      <el-form-item label="Security Code：" prop="code">
        <el-input v-model.trim="ruleForm.code" placeholder="Please enter the security code" autocomplete="off" maxlength="32"></el-input>
      </el-form-item>
      <el-form-item label="Security Name：" prop="name">
        <el-input v-model.trim="ruleForm.name" placeholder="Please enter the security name" autocomplete="off" maxlength="64"></el-input>
      </el-form-item>
      <!-- <el-form-item label="Company LEI：" prop="companyLei">
        <el-input v-model.trim="ruleForm.companyLei" autocomplete="off" maxlength="20"></el-input>
      </el-form-item> -->
      <!-- <el-form-item label="Debt Seniority：" prop="debtSeniority">
        <el-select v-model="ruleForm.debtSeniority" placeholder="- -">
          <el-option
            v-for="item in debtSeniorityList"
            :key="item.value"
            :label="item.label"
            :value="item.value">
          </el-option>
        </el-select>
      </el-form-item> -->
      <!-- <el-form-item label="Class of Security：" prop="classOfSecurity">
        <el-input v-model="ruleForm.classOfSecurity" autocomplete="off" maxlength="256"></el-input>
      </el-form-item>
      <el-form-item label="Underyling Index：" prop="underlyingIndex">
        <el-input v-model="ruleForm.underlyingIndex" autocomplete="off" maxlength="256"></el-input>
      </el-form-item> -->
    </el-form>
    <!-- <el-form :model="ruleForm" :rules="listRules" ref="ratingForm"
      label-width="210px" label-position="left" class="form-box" @submit.native.prevent>
      <el-form-item
        label="Issue Rating："
        prop="issueRating"
        class="issue-rating-box"
      >
        <el-input v-model="ruleForm.issueRating" @blur="$refs.ratingForm.rules.issueRating[0].required = false;" autocomplete="off" maxlength="256" :disabled="ruleForm.ratingList.length >= 10"></el-input>
        <div class="add-rating" @click="addRating" v-if="ruleForm.ratingList.length < 10">
          <img src="../../../../assets/images/add.png" alt="">
        </div>
      </el-form-item>
      <el-form-item v-if="ruleForm.ratingList.length > 0" style="margin-top: -10px;" class="issue-rating-box">
        <div class="rating-list" v-for="(v, k) in ruleForm.ratingList" :key="k">
          <p class="rating-list-item">{{v.value}}</p>
          <p class="rating-list-btn" @click="subtractRating(k)">
            <img src="../../../../assets/images/reduce.png" alt="">
          </p>
        </div>
      </el-form-item>
    </el-form> -->
    <el-form :model="ruleForm" :rules="listRules" ref="uniqueForm"
      label-width="210px" label-position="left" class="form-box" @submit.native.prevent>
      <el-form-item
        label="Unique Identifier Code："
        prop="uniqueIdentifierCode"
        class="identifier-code-box"
      >
        <el-input
          v-model="ruleForm.uniqueIdentifierCode"
          @blur="$refs.uniqueForm.rules.uniqueIdentifierCode[0].required = false;"
          autocomplete="off"
          maxlength="16"
          :disabled="ruleForm.identifierCodeList.length >= 10"
        ></el-input>
        <div class="add-rating" @click="addUnique" v-if="ruleForm.identifierCodeList.length < 10">
          <img src="../../../../assets/images/add.png" alt="">
        </div>
      </el-form-item>
      <el-form-item v-if="ruleForm.identifierCodeList.length > 0" style="margin-top: -10px;" class="issue-rating-box">
        <div class="rating-list" v-for="(v, k) in ruleForm.identifierCodeList" :key="k">
          <p class="rating-list-item">{{v.value}}</p>
          <p class="rating-list-btn" @click="subtractUnique(k)">
            <img src="../../../../assets/images/dis-reduce.png" width="26" height="26" alt="reduce">
          </p>
        </div>
      </el-form-item>
    </el-form>
    <div class="form-btns">
      <el-button @click="$router.push({ path: '/issuance/asset' })">Cancel</el-button>
      <el-button type="primary" @click="handleNext">Next</el-button>
    </div>
  </div>
</template>
<script>
import { newAbsAdd, getAbsInfo } from '@/api/distribution-center';
import { notify, notChineseReg } from '@/common/util';

export default {
  name: 'Parameters',
  watch: {
    'ruleForm.code': function (n, o) {
      if (/^[0-9a-zA-Z]+$/.test(this.ruleForm.code) || n === '') {
        this.ruleForm.code = n.toUpperCase();
      } else {
        this.ruleForm.code = o;
      }
    },
    'ruleForm.name': function (n, o) {
      if (/^[0-9a-zA-Z]+$/.test(this.ruleForm.name) || n === '') {
        this.ruleForm.name = n;
      } else {
        this.ruleForm.name = o;
      }
      // if (notChineseReg.test(this.ruleForm.name) || n === '') {
      //   this.ruleForm.name = n;
      // } else {
      //   this.ruleForm.name = o;
      // }
    },
    'ruleForm.issuerName': function (n, o) {
      if (notChineseReg.test(this.ruleForm.issuerName) || n === '') {
        this.ruleForm.issuerName = n;
      } else {
        this.ruleForm.issuerName = o;
      }
    },
    // 'ruleForm.debtSeniority': function (n, o) {
    //   if (notChineseReg.test(this.ruleForm.debtSeniority) || n === '') {
    //     this.ruleForm.debtSeniority = n;
    //   } else {
    //     this.ruleForm.debtSeniority = o;
    //   }
    // },
    // 'ruleForm.classOfSecurity': function (n, o) {
    //   if (notChineseReg.test(this.ruleForm.classOfSecurity) || n === '') {
    //     this.ruleForm.classOfSecurity = n;
    //   } else {
    //     this.ruleForm.classOfSecurity = o;
    //   }
    // },
    // 'ruleForm.underlyingIndex': function (n, o) {
    //   if (notChineseReg.test(this.ruleForm.underlyingIndex) || n === '') {
    //     this.ruleForm.underlyingIndex = n;
    //   } else {
    //     this.ruleForm.underlyingIndex = o;
    //   }
    // },
    // 'ruleForm.issueRating': function (n, o) {
    //   if (notChineseReg.test(this.ruleForm.issueRating) || n === '') {
    //     this.ruleForm.issueRating = n;
    //   } else {
    //     this.ruleForm.issueRating = o;
    //   }
    // },
    'ruleForm.uniqueIdentifierCode': function (n, o) {
      if (notChineseReg.test(this.ruleForm.uniqueIdentifierCode) || n === '') {
        this.ruleForm.uniqueIdentifierCode = n;
      } else {
        this.ruleForm.uniqueIdentifierCode = o;
      }
    }
  },
  data () {
    return {
      loading: false,
      ruleForm: {
        // type: '',
        // bondsType: '',
        // smtCode: '',
        code: '',
        name: '',
        issuerName: '',
        // debtSeniority: '',
        // classOfSecurity: '',
        // underlyingIndex: '',
        // issueRating: '',
        // ratingList: [],
        // companyLei: '',
        uniqueIdentifierCode: '',
        identifierCodeList: []
      },
      bondsTypeList: [
        {
          label: 'Asset-backed Security',
          value: '0'
        }, {
          label: 'Corporate',
          value: '1'
        }, {
          label: 'High Yield Corporate',
          value: '2'
        }, {
          label: 'Sovereign',
          value: '3'
        }, {
          label: 'Quasi-Sovereign',
          value: '4'
        }
      ],
      securityTypeList: [
        {
          label: 'Bonds',
          value: '0'
        }
      ],
      debtSeniorityList: [{
        label: 'Senior Secured',
        value: 1
      }, {
        label: 'Secured',
        value: 2
      }, {
        label: 'Senior Unsecured',
        value: 3
      }, {
        label: 'Senior Subordinated',
        value: 4
      }, {
        label: 'Subordinated',
        value: 5
      }, {
        label: 'Junior Subordinated',
        value: 6
      }],
      rules: {
        issuerName: [{ required: true, trigger: 'blur', message: 'This field is required.' }],
        // companyLei: [{ required: true, trigger: 'blur', message: 'This field is required.' }],
        code: [{ required: true, trigger: 'blur', message: 'This field is required.' }],
        name: [{ required: true, trigger: 'blur', message: 'This field is required.' }]
        // type: [{ required: true, trigger: 'change', message: 'This field is required.' }],
        // bondsType: [{ required: true, trigger: 'change', message: 'This field is required.' }]
      },
      listRules: {
        // issueRating: [{ required: false, trigger: 'blur', message: 'This field is required.' }],
        uniqueIdentifierCode: [{ required: false, trigger: 'blur', message: 'This field is required.' }]
      }
      // smtCodeList: ''
    };
  },
  created () {
    // this.getSMTCode();
    this.getBeforeInfo();
  },
  methods: {
    async getBeforeInfo () {
      if (this.$route.query.serialNo) {
        this.loading = true;
        const resData = await getAbsInfo({ // getSecurityInfo({
          serialNo: this.$route.query.serialNo,
          slient: true
        });
        if (!resData) return;
        const { code, data } = resData.data;
        if (code === '1000') {
          for (const i in this.ruleForm) {
            this.ruleForm[i] = data[i];
          }
          //   this.ruleForm.issueRating = '';
          this.ruleForm.uniqueIdentifierCode = '';
          //   if (data.data.issueRating) {
          //     this.ruleForm.ratingList = data.data.issueRating.split(',').map(v => { return { value: v }; });
          //   } else {
          //     this.ruleForm.ratingList = [];
          //   }
          if (data.uniqueIdentifierCode) {
            this.ruleForm.identifierCodeList = data.uniqueIdentifierCode.split(',').map(v => { return { value: v }; });
          } else {
            this.ruleForm.identifierCodeList = [];
          }
        }
        this.loading = false;
      }
    },
    // async getSMTCode () {
    //   const data = await getSecuritySMTInfo();
    //   if (data.code === '1000') {
    //     this.smtCodeList = data.data;
    //   }
    // },
    handleNext () {
      this.$refs.ruleForm.validate(async valid => {
        const rating = true;
        const identifier = true;
        if (valid && rating && identifier) {
          const params = Object.assign({}, this.ruleForm);
          //   delete params.ratingList;
          delete params.identifierCodeList;
          //   params.issueRating = this.ruleForm.ratingList.map(v => v.value).join(',');
          params.uniqueIdentifierCode = this.ruleForm.identifierCodeList.map(v => v.value).join(',');
          // params.smtCode = this.smtCodeList[0].smtCode;
          // params.smtCode = this.smtCodeList;
          // params.investorType = 9;
          if (this.$route.query.serialNo) {
            params.serialNo = this.$route.query.serialNo;
          }
          // params.type = '0';
          this.loading = true;
          const data = await newAbsAdd({ data: params, slient: true, notify: notify.error });
          if (!data) return;

          const { code, data: resData } = data.data;
          if (code === '1000') {
            this.$router.push({
              name: 'DisIssueAbsInformation',
              query: {
                serialNo: resData
              }
            });
          }
          this.loading = false;
        }
      });
    },
    // addRating () {
    //   const refForm = this.$refs.ratingForm;
    //   refForm.rules.issueRating[0].required = true;

    //   refForm.validate(valid => {
    //     if (valid) {
    //       if (this.ruleForm.ratingList.length < 10) {
    //         this.ruleForm.ratingList.unshift({
    //           value: this.ruleForm.issueRating
    //         });
    //         refForm.rules.issueRating[0].required = false;
    //         this.ruleForm.issueRating = '';
    //       }
    //     }
    //   });
    // },
    addUnique () {
      const refForm = this.$refs.uniqueForm;
      refForm.rules.uniqueIdentifierCode[0].required = true;

      refForm.validate(valid => {
        if (valid) {
          if (this.ruleForm.identifierCodeList.length < 10) {
            this.ruleForm.identifierCodeList.unshift({
              value: this.ruleForm.uniqueIdentifierCode
            });
            refForm.rules.uniqueIdentifierCode[0].required = false;
            this.ruleForm.uniqueIdentifierCode = '';
          }
        }
      });
    },
    subtractUnique (k) {
      this.ruleForm.identifierCodeList.splice(k, 1);
    }
    // subtractRating (k) {
    //   this.ruleForm.ratingList.splice(k, 1);
    // }
  }
};
</script>
<style scoped lang="scss">
.disboinds-parameters {
  margin-top: 60px;
  // padding-left: 30px;
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
  .form-box {
    width: 724px;
    margin: 0 auto;
    color: #192231;
    .el-select {
      width: 100%;
    }
    .smt-code-label {
      overflow: hidden;
    }
    .smt-code {
      height: 40px;
      padding-right: 10px;
      display: flex;
      justify-content: space-between;
      cursor: pointer;
      i {
        transition: all .5s;
      }
      .el-icon-arrow-down-open {
        transform: rotate(180deg);
      }
    }
    .issue-rating-box, .identifier-code-box {
      position: relative;
      .add-rating, .add-code {
        position: absolute;
        right: -50px;
        top: 5px;
        width: 28px;
        height: 28px;
        border-radius: 50%;
        color: #fff;
        text-align: center;
        line-height: 23px;
        font-size: 32px;
        cursor: pointer;
        img {
          width: 100%;
          height: 100%;
        }
      }
      .rating-list {
        position: relative;
        width: 565px;
        &:hover .rating-list-btn {
          display: block;
        }
        .rating-list-item {
          margin-top: 10px;
          // height: 40px;
          background-color: #F3F6FC;
          padding-left: 15px;
          padding-right: 15px;
          width: 514px;
          word-wrap: break-word;
          word-break: keep-all;
        }
        .rating-list-btn {
          position: absolute;
          right: 0px;
          top: 50%;
          transform: translateY(-50%);
          width: 28px;
          height: 28px;
          border-radius: 50%;
          color: #fff;
          text-align: center;
          line-height: 23px;
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
    }
  }
}
</style>
<style lang="scss">
.disboinds-parameters {
  .form-box {
    .el-icon-arrow-up {
      color: #063C8C;
    }
    .el-select {
      .el-input__inner {
        color: #192231;
        font-size: 16px;
      }
    }
  }
  .issue-rating-box, .identifier-code-box {
    .el-form-item__label {
      // padding-left: 12px;
      &::before {
        // display: none;
      }
    }
  }
}
</style>
