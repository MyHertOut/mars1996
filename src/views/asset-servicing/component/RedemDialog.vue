<template>
  <element-dialog
    v-bind="$attrs"
    width="747px"
    v-on="$listeners"
    @close="() => { $refs.form.resetFields(); }"
    @open="getDistributeDetail"
    @handleOK="handleSubmit"
  >
    <el-form ref="form" v-loading="loading" :model="form" :rules="rules"  label-width="246px">
      <el-form-item label="Disbursement Token:">
        <el-col :span="11">
          <el-select v-model="form.tokenType" disabled>
            <el-option label="Digital Currency" value="1"></el-option>
            <el-option label="Certificate" value="0"></el-option>
          </el-select>
        </el-col>
        <el-col class="line" :span="2">-</el-col>
        <el-col :span="11">
          <el-input v-model="form.tokenCode" disabled></el-input>
        </el-col>
      </el-form-item>
      <template v-if="!isContinue">
        <el-form-item label="Total Holdings:" prop="totalHolding">
          <el-input v-model="form.totalHolding" disabled>
            <span slot="suffix">{{currentRow.securityCode}}</span>
          </el-input>
        </el-form-item>
        <el-form-item v-if="isCallableBond" label="Redemption Value Per Token:" prop="redeemValue">
          <el-input v-model="form.redeemValue">
            <span slot="suffix">{{currentRow.tokenCode}}</span>
          </el-input>
        </el-form-item>
        <el-form-item label="Payout Value:" prop="payAmount">
          <el-input v-model="form.payAmount" :disabled="isCallableBond">
            <span slot="suffix">{{form.tokenCode}}</span>
          </el-input>
        </el-form-item>
      </template>
      <template v-else>
        <el-form-item  label="Remaining Payout Value:">
          <el-input v-model="form.remaining" disabled>
            <span slot="suffix">{{currentRow.tokenCode}}</span>
          </el-input>
        </el-form-item>
      </template>
      <el-form-item label="Disbursement Address(Contract):">
        <el-input v-model="form.disbursementAddr" disabled></el-input>
      </el-form-item>
      <el-form-item label="Wallet Address Balance:" prop="balance">
        <el-input v-model="form.balance" disabled>
          <span slot="suffix">{{form.tokenCode}}</span>
        </el-input>
      </el-form-item>
      <el-form-item label="Secondary Password:" prop="secondaryPwd">
        <el-input v-model="form.secondaryPwd" :readonly="pwdReadonly" @focus="pwdReadonly=false" type="password"></el-input>
      </el-form-item>
      <el-form-item>
        <div class="tips-txt">
          <i class="el-icon-warning"></i>
          <span>Please make sure that the address balance does not change during signature period..</span>
        </div>
      </el-form-item>
    </el-form>
  </element-dialog>
</template>

<script>
import {
  redeemBySecurityCode, redeemRetryBySecurityCode, redeemSubmit,
  redeemRetrySubmit
} from '@/api/asset-servicing.js';
import { getAssetBalance } from '@/api/common.js';
import { notify, numberExcludeZeroEight, removeComma, encryptSecondPwd } from '@/common/util.js';
import { snapShotTypeEnum } from '@/common/enums.js';

export default {
  inheritAttrs: false,
  props: {
    isContinue: {
      type: Boolean,
      default: true
    },
    // visible: Boolean,
    currentRow: Object
  },
  data () {
    const demicroFilter = this.$options.filters.demicrometer;
    const requiredValidator = {
      required: true, trigger: ['change', 'blur'], message: 'This field is required.'
    };
    const payoutValidator = {
      validator: (rule, value, callback) => {
        if (parseFloat(value) === 0) {
          callback(new Error('Please enter a number greater than 0'));
        } else {
          callback();
        }
      }
    };
    // const balanceValidator = {
    //   validator: (rule, value, callback) => {
    //     if (+removeComma(this.form.payAmount) > +removeComma(value)) {
    //       callback(new Error('Insufficient Balance'));
    //     } else {
    //       callback();
    //     }
    //   }
    // };
    return {
      demicroFilter,
      pwdReadonly: true,
      loading: false,
      form: {
        payAmount: ''
      },
      rules: {
        payAmount: [requiredValidator, payoutValidator],
        // balance: [balanceValidator],
        secondaryPwd: [requiredValidator],
        timeStamp: [requiredValidator],
        redeemValue: [requiredValidator, payoutValidator]
      }
    };
  },
  watch: {
    'form.redeemValue' (newVal, oldVal) {
      this.digitalFormat('redeemValue', newVal, oldVal);
      const normalVal = this.form.totalHolding;
      // const redeemValue = this.form.redeemValue;
      this.form.payAmount = this.demicroFilter(removeComma(normalVal) * removeComma(newVal));
    },
    'form.payAmount' (newVal, oldVal) {
      this.digitalFormat('payAmount', newVal, oldVal);
    },
    'form.totalHolding' (newVal, oldVal) {
      /*eslint-disable*/
      if (!newVal || `${newVal}`.replace(/\,/gi, '') == +oldVal) return;
      this.form.totalHolding = this.$options.filters.demicrometer(newVal);
    },
    'form.balance' (newVal, oldVal) {
      /*eslint-disable*/
      if (!newVal || removeComma(`${newVal}`) == +oldVal) return;
      this.form.balance = this.demicroFilter(newVal);
    }
  },
  computed: {
    // Callable Bond
    isCallableBond () {
      const { callable, freezeType } = this.currentRow;
      return callable === 'YES' && freezeType === 'MANUAL';
    }
  },
  methods: {
    digitalFormat (field, newVal, oldVal) {
      if (!newVal) return;

      const normalVal = removeComma(newVal);
      const normalOldVal = oldVal ? removeComma(oldVal) : '';
      if (normalVal === normalOldVal) return;

      if (!numberExcludeZeroEight.test(normalVal)) {
        this.form[field] = oldVal;
        return;
      };
      const arr = normalVal.split('.');
      let str = '';
      if (arr.length === 2) { // 有小数
        str = `.${arr[1]}`;
      }
      this.form[field] = this.demicroFilter(arr[0]) + str;
    },
    // form validate
    handleSubmit () {
      this.$refs.form.validate(valid => {
        if (!valid) return;
        this.handelDisbursementSubmit(this.form);
      });
    },
    // Redemption Value Per Token blur event
    handlePerTokenBlur () {
      const normalVal = this.form.totalHolding;
      const redeemValue = this.form.redeemValue;
      if (!normalVal || !redeemValue) {
        this.form.payAmount = '';
        return;
      }
      this.form = Object.assign(this.form, {
        payAmount: this.demicroFilter(removeComma(normalVal) * removeComma(redeemValue))
      })
      this.$refs.form.validateField('balance');
    },
    // submit datas
    handelDisbursementSubmit (data) {
      const { payAmount, redeemValue, secondaryPwd, redeemNo } = data;
      const { couponNo, securityCode, securityType } = this.currentRow;
      let url = redeemSubmit;
      let params = {
        redeemNo,
        redeemValue: removeComma(redeemValue),
        payAmount: removeComma(payAmount),
        secondaryPwd: encryptSecondPwd(secondaryPwd),
        securityCode,
        securityType
      };
      if (this.isContinue) {
         url = redeemRetrySubmit;
         params = {
          secondaryPwd: encryptSecondPwd(secondaryPwd),
          securityCode
        };
      }
      this.loading = true;
      url({
        data: params,
        notify: notify.error
      }).then(res => {
        this.loading = false;
        const { code } = res.data;
        if (code === '1000') {
          this.$notify.success({ message: 'Operation Success' });
          this.$emit('update:visible', false);
          this.$emit('handleSubmit');
        }
      }).catch(() => {
        this.loading = false;
      });
    },
    // Get the lead information
    async getDistributeDetail () {
      this.loading = true;
      const { securityCode, period, securityType } = this.currentRow;
      let url = redeemBySecurityCode;

      if (this.isContinue) {
        url = redeemRetryBySecurityCode;
      }
      const result = await url({
        data: {
          securityCode,
          securityType
        },
        notify: notify.error
      }).then(res => res).catch(() => {
        this.loading = false;
      });
      this.loading = false;
      if (!result) return;

      const { code, data } = result.data;
      if (code === '1000') {
        this.timeStampOptions = (data.snapshotList || []).map(item => ({
          snapshotNo: item.snapshotNo,
          snapshotTime: `${this.$options.filters.dateFormat(item.snapshotTime)}  ${snapShotTypeEnum[item.snapshotType] || ''}`,
          snapshotType: item.snapshotType,
          totalHolding: item.totalHolding,
          payAmount: item.payAmount
        }));
        let balance = '';
        const balanceResult = await getAssetBalance({
          data: {
            assetId: data.tokenCode,
            addr: data.disbursementAddr
          },
          notify: notify.error
        }).catch(err => {});

        if (balanceResult) {
          const { code: bcode, data: bdata } = balanceResult.data;
          if (bcode === '1000') {
            balance = bdata;
          }
        }
        this.form = {
          ...data,
          balance,
          payAmount: this.isCallableBond ? '' : data.payAmount
        };
        // this.form = {
        //   balance,
        //   remaining: data.remaining,
        //   totalHolding: data.totalHolding,
        //   tokenCode: data.tokenCode,
        //   tokenType: data.tokenType,
        //   redeemNo: data.redeemNo,
        //   disbursementAddr: data.disbursementAddr
        // };
      }
    }
  }
};
</script>
<style lang="scss" scoped>
  .line {
    text-align: center;
  }
</style>
