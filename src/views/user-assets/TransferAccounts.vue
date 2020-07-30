<template>
  <div>
    <bread-crumbs :data="breadData"></bread-crumbs>
    <div class="main-container">
      <div class="transfer-content">
        <div class="transfer-title">Transfer</div>
        <div class="modal-con" v-loading="loading">
          <el-form :model="ruleForm" :rules="rules" ref="ruleForm"
            label-width="178px" label-position="left">
            <el-form-item label="Target Address：" prop="targetAddress">
              <el-input v-model.trim="ruleForm.targetAddress" maxlength="40" autocomplete="off"></el-input>
            </el-form-item>
            <el-form-item style="margin-bottom:0" label="Amount：" prop="amount">
              <el-input v-model.trim="ruleForm.amount"></el-input>
            </el-form-item>
            <div class="total-price">Balance：
              <i v-if="balanceLoading" class="el-icon-loading"></i>
              <span v-else>{{ totalValue | demicrometer }}</span>
            </div>
            <el-form-item label="Secondary Password：" prop="secondaryPwd">
              <el-input v-focus type="password" v-model.trim="ruleForm.secondaryPwd"></el-input>
            </el-form-item>
          </el-form>
        </div>
        <div class="transferBtn">
          <el-button style="width:482px;" type="primary" @click="handelPurchaseSubmit">Submit</el-button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import BreadCrumbs from '@/components/BreadCrumbs.vue';
import md5 from 'md5';
import { secondaryPwdReg, notify } from '@/common/util';
import { getBalance, balanceTransfer } from '@/api/user-assets';

export default {
  name: 'Transfer',
  data () {
    const _this = this;
    const amountValidator = (rule, value, callback) => {
      /*eslint-disable*/
      let num = value.split(',').join('');
      if (num == 0 || (num.indexOf('.') !== -1 && !num.split('.')[1])) {
        callback('Please enter a number greater than 0');
      } else if (+num > +_this.totalValue) {
        callback('No more than the balance');
      } else {
        callback();
      }
    };
    return {
      breadData: [],
      totalValue: 0,
      decimalDigits: 0, // 小数位数
      loading: false,
      balanceLoading: false, // 获取余额接口loading
      ruleForm: {
        // secondaryPwd: '' // 密码
      },
      rules: {
        amount: [{ required: true, message: 'This field is required.' },
          {
            trigger: ['blur', 'change'],
            validator: amountValidator
          }],
        secondaryPwd: [
          { required: true, message: 'This field is required.' },
          {
            trigger: 'blur',
            validator: (rule, value, callback) => {
              if (!secondaryPwdReg.test(value)) {
                callback('Password does not match the criteria');
                return;
              }
              callback();
            }
          }],
        targetAddress: [{ required: true, message: 'This field is required.' },
        {
          validator:  (rule, value, callback) => {
            if (value.length != 40) {
              callback('Incorrect address format');
              return;
            }
            callback();
          }
        }]
      }
    }
  },
  watch: {
    'ruleForm.amount' (value, o) {
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
            this.ruleForm.amount = arr.join('.');
          } else if (value.split('.').length > 2) {
            this.ruleForm.amount = o;
          } else {
            let num = value.split(',').join('');
            this.ruleForm.amount = this.$options.filters['demicrometer'](num);
          }
        } else {
          this.ruleForm.amount = o;
        }
      }
    }
  },
  methods: {
    handelPurchaseSubmit () {
      this.$refs.ruleForm.validate(valid => {
        if (valid) {
          this.loading = true;
          const isSecurities = (this.menuKey === '0' || this.menuKey === '1');
          const currency = isSecurities ? this.currentData.securityCode : this.currentData.certCode;
          const params = { ...this.ruleForm };
          params.amount = params.amount.split(',').join('');
          balanceTransfer({
             ...params,
             secondaryPwd: md5(params.secondaryPwd).toUpperCase(),
             tokenType: this.currentData.tokenType,
             currency,
             userAddress: this.defaultAddress }).then(res => {
            this.loading = false;
            if (res.data.code === '1000') {
              this.$router.push({
                path: `/myAssets?menuKey=${this.menuKey}`
              })
            }
          }).catch((error) => {
            this.$message({ message: (error.data && error.data.msg) || 'The system is busy, please try again later', type: 'error' });
            this.loading = false;
          });
        }
      });
    },
    getBalance () {
      this.balanceLoading = true;
      getBalance({
        data: {
          currency: this.currentData.securityCode || this.currentData.certCode,
          userAddress: this.defaultAddress,
          currencyType: this.certType
        },
        notify: notify.error
      }).then(res => {
        this.balanceLoading = false;

        if (res.data.code === '1000') {
          this.totalValue = res.data.data || 0;
          const str = `${this.totalValue}`;
          const decimalLength = str.slice(str.indexOf('.') + 1, str.length).length;
          this.decimalDigits = decimalLength > 8 ? 8 : decimalLength;
        }
      }).catch(() => {
        this.balanceLoading = false;
        this.totalValue = 0;
      })
    }
  },
  directives: {
    focus: {
      // 指令的定义
      bind: function (el) {
        const dom = el.querySelector('input');
        dom.readOnly = true;
        dom.onfocus = function () {
          this.readOnly = false;
        };
      }
    }
  },
  computed: {
    menuKey () {
      return JSON.parse(this.$route.query.data).menuKey;
    },
    currentData () {
      return JSON.parse(this.$route.query.data).info;
    },
    defaultAddress () {
      return JSON.parse(this.$route.query.data).defaultAddress;
    },
    queryAddress () {
      return JSON.parse(this.$route.query.data).queryAddress;
    },
    certType () {
      if (this.currentData.certType) {
        return this.currentData.certType === 'Certificate' ? 1 : 2;
      } else {
        return 3;
      }
    }
  },
  components: {
    'bread-crumbs': BreadCrumbs
  },
  mounted () {
    this.$nextTick(() => {
      if (this.menuKey && this.queryAddress) {
        this.breadData = [{
          name: 'Assets Centre',
        }, {
          name: 'Asset Balance',
          to: `/myAssets?menuKey=${this.menuKey}&address=${this.queryAddress}`
        }, {
          name: 'Transfer'
        }]
      } else {
        this.breadData = [{
          name: 'Assets Centre',
        }, {
          name: 'Asset Balance',
          to: `/myAssets?menuKey=${this.menuKey}`
        }, {
          name: 'Transfer'
        }]
      };
      this.getBalance();
    });
  }
};
</script>

<style lang="scss" scoped>
.transfer-content{
  .transfer-title{
    font-size: 24px;
    color: #001F3B;
    line-height: 28px;
  }
  .modal-con{
    width: 660px;
    margin: 60px auto 0;
  }
  .transferBtn{
    text-align: right;
    width: 660px;
    margin: 100px auto 0;
  }
  .total-price {
    margin-bottom: 22px;
    text-align: right;
  }
}
</style>
