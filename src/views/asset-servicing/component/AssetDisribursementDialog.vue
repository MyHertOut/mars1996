<template>
  <element-dialog
    v-bind="$attrs"
    v-on="$listeners"
    width="747px"
    :title="reDistribute ? 'Re-Disbursement' : 'Disbursement'"
    @handleOK="handleSubmit"
    @open="getDistributeDetail"
    @close="handleClose"
  >
    <el-form ref="form" class="disbursement-form" v-loading="loading" :model="form" :rules="rules"  label-width="246px">
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
      <template v-if="!reDistribute">
        <el-form-item label="Snapshot Timestamp:" prop="timeStamp">
          <el-select style="width: 100%;" @change="handleTimeChange" placeholder="" v-model="form.timeStamp">
            <el-option
              v-for="item in timeStampOptions"
              :key="item.snapshotNo"
              :label="item.snapshotTime"
              :value="item.snapshotNo">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="Total Holdings:" prop="holderQty">
          <el-input v-model="form.holderQty" disabled>
            <span slot="suffix">{{currentRow.securityCode}}</span>
          </el-input>
        </el-form-item>
        <el-form-item label="Redemption Value Per Token:" prop="valuePerToken" >
          <el-input v-model="form.valuePerToken" :disabled="noHolderQty">
            <span slot="suffix">{{form.tokenCode}}</span>
          </el-input>
        </el-form-item>
      </template>
      <el-form-item
        v-if="!reDistribute"
        label="Payout Value:"
        prop="payAmount"
      >
        <el-input v-model="form.payAmount" :disabled="!!reDistribute || noHolderQty">
          <span slot="suffix">{{form.tokenCode}}</span>
        </el-input>
      </el-form-item>
      <el-form-item
        v-else
        label="Remaining Payout Value:"
        prop="remainingAmount"
      >
        <el-input v-model="form.remainingAmount" disabled>
          <span slot="suffix">{{form.tokenCode}}</span>
        </el-input>
      </el-form-item>
        <el-form-item label="Source Address:">
          <el-input v-model="form.disbursementAddr" disabled></el-input>
        </el-form-item>
        <el-form-item label="Wallet Address Balance:" prop="balance">
          <el-input v-model="form.balance" disabled>
            <span slot="suffix">{{form.tokenCode}}</span>
          </el-input>
        </el-form-item>
      <el-form-item label="Secondary Password:" prop="secondaryPwd">
        <el-input v-model="form.secondaryPwd" :disabled="noHolderQty" :readonly="pwdReadonly" @focus="pwdReadonly=false" type="password"></el-input>
      </el-form-item>
      <el-form-item>
        <div class="tips-txt">
          <i class="el-icon-warning"></i>
          <span>Please make sure that the address balance does not change during signature period.</span>
        </div>
      </el-form-item>
    </el-form>
  </element-dialog>
</template>

<script>
import {
  assetAbsDistributeDetail, distributeSubmit,
  assetDistributeRetryDetail, distributeRetrySubmit
} from '@/api/asset-servicing.js';
import { getAssetBalance } from '@/api/common.js';
import { notify, numberExcludeZeroEight ,encryptSecondPwd, removeComma } from '@/common/util.js';
import { snapShotTypeEnum } from '@/common/enums.js';

export default {
  props: {
    // disVisible: Boolean,
    reDistribute: Boolean,
    currentRow: Object
  },
  inheritAttrs: false,
  data () {
    const requiredValidator = {
      required: true, trigger: ['blur'], message: 'This field is required.'
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
    const balanceValidator = {
      validator: (rule, value, callback) => {
        const formatVal = +removeComma(value);
        if ((this.reDistribute && removeComma(this.form.remainingAmount) > formatVal) ||
          (!this.reDistribute && removeComma(this.form.payAmount) > formatVal)) {
          callback(new Error('Insufficient Balance'));
        } else {
          callback();
        }
      }
    };
    return {
      pwdReadonly: true,
      loading: false,
      noHolderQty: false,
      form: {
        payAmount: '',
        disbursementAddr: '',
        timeStamp: '',
        holderQty: '',
        tokenType: '',
        valuePerToken: '',
        tokenCode: '',
        balance: '',
        secondaryPwd: ''
      },
      timeStampOptions: [],
      rules: {
        payAmount: [requiredValidator, payoutValidator],
        balance: [balanceValidator],
        valuePerToken: [requiredValidator],
        // remainingAmount: [balanceValidator],
        secondaryPwd: [requiredValidator],
        timeStamp: [requiredValidator]
      }
    };
  },
  watch: {
    'form.valuePerToken' (newVal, oldVal) {
      if (newVal && this.form.holderQty) {
        this.digitalFormat('valuePerToken', newVal, oldVal);
        const normalVal = this.form.holderQty;
        let payAmount = this.$options.filters['demicrometer'](removeComma(normalVal) * removeComma(newVal));
        this.$set(this.form, 'payAmount', payAmount);
      }
    },
    'form.payAmount' (newVal, oldVal) {
      if (newVal && this.form.holderQty) {
        this.digitalFormat('payAmount', newVal, oldVal);
      }
    },
    'form.balance' (newVal, oldVal) {
      /*eslint-disable*/
      if (!newVal || `${newVal}`.replace(/\,/gi, '') == +oldVal) return;
      this.form.balance = this.$options.filters.demicrometer(newVal);
    },
    'form.holderQty' (newVal, oldVal) {
      /*eslint-disable*/
      if (!newVal || `${newVal}`.replace(/\,/gi, '') == +oldVal) return;
      this.form.holderQty = this.$options.filters.demicrometer(newVal);
    },
    'disVisible' (val) {
      if (!val) return;
      this.getDistributeDetail();
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
      this.form[field] = this.$options.filters['demicrometer'](arr[0]) + str;
    },
    handleCancel () {
      this.$emit('update:disVisible', false);
    },
    handleTimeChange (val) {
      const result = this.timeStampOptions.find(item => item.snapshotNo === val) || {};
      const filters = this.$options.filters.demicrometer;
      this.form.holderQty = filters(result.holderQty);
      if (!Number(result.holderQty)) {
        this.noHolderQty = true;
      } else {
        this.noHolderQty = false;
      }
      this.$set(this.form, 'valuePerToken', '');
      this.$set(this.form, 'payAmount', '');
      this.$set(this.form, 'secondaryPwd', '');
    },
    handleClose () {
      this.noHolderQty = false;
      this.$refs.form.resetFields();
      this.$emit('handleDistributeClose');
    },
    handleSubmit () {
      this.$refs.form.validate(valid => {
        if (valid) {
          this.handelDisbursementSubmit();
        }
      });
    },
    handelDisbursementSubmit () {
      this.loading = true;

      const { payAmount, secondaryPwd, timeStamp, valuePerToken } = this.form;
      const { couponNo, securityCode, period } = this.currentRow;
      const encryPwd = encryptSecondPwd(secondaryPwd);
      let url = distributeSubmit;
      let params = {
        payAmount: removeComma(payAmount),
        secondaryPwd: encryPwd,
        securityCode,
        snapshotNo: timeStamp,
        valuePerToken: valuePerToken,
        securityType: this.$route.query.tokenType
      };
      if (this.reDistribute) {
        url = distributeRetrySubmit;
        params = {
          securityCode,
          secondaryPwd: encryPwd,
          period
        };
      }
      url({
        data: params,
        notify: notify.error
      }).then(res => {
        this.loading = false;
        const { code } = res.data;
        if (code === '1000') {
          this.noHolderQty = false;
          this.$notify.success({ message: 'Operation Success' });
          this.$emit('handleDistributeSubmit');
        }
      }).catch(() => {
        this.loading = false;
      });
    },
    // get distribute detail and balance
    async getDistributeDetail () {
      this.loading = true;
      const { securityCode, securityType ,period } = this.currentRow;
      let url = assetAbsDistributeDetail;
      let params = {};
      if (this.reDistribute) {
        url = assetDistributeRetryDetail;
        params.code = securityCode;
      }
      params.securityCode = securityCode;
      const result = await url({
          data: {
            ...params,
            securityType,
            period
          },
          notify: notify.error
        })
        .then(res => res)
        .catch(() => {
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
          holderQty: item.holderQty,
          payAmount: item.payAmount
        }));
        this.form = {
          ...data,
          remainingAmount: this.$options.filters.demicrometer(data.remainingAmount)
        };
        let balance = '';
        const balanceResult = await getAssetBalance({
          data: {
            assetId: data.tokenCode,
            addr: data.disbursementAddr
          },
          notify: notify.error
        }).catch(() => {});
        if (!balanceResult) return;

        const { code: bcode, data: bdata } = balanceResult.data;
        if (bcode === '1000') {
          balance = bdata;
        }
        this.$set(this.form, 'balance', balance)
      }
    }
  }
};
</script>
<style lang="scss" scoped>
.disbursement-form {
  .line {
    text-align: center;
  }
}
</style>
