<template>
  <element-dialog
    v-bind="$attrs"
    v-on="$listeners"
    width="747px"
    :title="reDistribute ? 'Re-Disbursement' : 'Disbursement'"
    @handleOK="handleSubmit"
    @open="getDistributeDetail"
    @close="$refs.form.resetFields()"
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
      </template>
      <el-form-item
        v-if="!reDistribute"
        label="Payout Value:"
        prop="payAmount"
      >
        <el-input v-model="form.payAmount" :disabled="!!reDistribute">
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
          <span>Please make sure that the address balance does not change during signature period.</span>
        </div>
      </el-form-item>
    </el-form>
  </element-dialog>
  <!-- <el-dialog
    title="Disbursement"
    custom-class="customer-dialog"
    :close-on-click-modal="false"
    :visible="disVisible"
    :before-close="handleCancel"
    width="51%"
  >
    <el-form ref="form" v-loading="loading" :model="form" :rules="rules"  label-width="246px">
      <el-form-item label="Disbursement Token:">
        <el-col :span="11">
          <el-select v-model="form.tokenType" disabled>
            <el-option label="Digital Currency" value="0"></el-option>
            <el-option label="Certificate" value="1"></el-option>
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
      </template>
      <el-form-item
        :label="!reDistribute ? 'Payout Value:' : 'Remaining Payout Value:'"
        prop="payAmount"
      >
        <el-input v-model="form.payAmount" :disabled="!!reDistribute">
          <span slot="suffix">{{form.tokenCode}}</span>
        </el-input>
      </el-form-item>
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
    <span slot="footer" class="dialog-footer">
        <el-button @click="handleCancel">Cancel</el-button>
        <el-button type="primary" @click="handleSubmit">Submit</el-button>
    </span>
  </el-dialog> -->
</template>

<script>
import {
  assetDistributeDetail, distributeSubmit,
  assetDistributeRetryDetail, distributeRetrySubmit
  // distributeBalance
} from '@/api/asset-servicing.js';
import { getAssetBalance } from '@/api/common.js';
import { notify, encryptSecondPwd, removeComma } from '@/common/util.js';
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
      form: {
        payAmount: '',
        disbursementAddr: '',
        timeStamp: '',
        holderQty: '',
        tokenType: '',
        tokenCode: '',
        balance: '',
        secondaryPwd: ''
      },
      timeStampOptions: [],
      rules: {
        payAmount: [requiredValidator, payoutValidator],
        balance: [balanceValidator],
        // remainingAmount: [balanceValidator],
        secondaryPwd: [requiredValidator],
        timeStamp: [requiredValidator]
      }
    };
  },
  watch: {
    'form.payAmount' (newVal, oldVal) {
      /*eslint-disable*/
      // if (!newVal || `${newVal}`.replace(/\,/gi, '') == +oldVal) return;

      if (newVal) {
        let current = newVal.split(',').join('');
        if (/^(([1-9]\d*)|0)\.?(\d{1,8})?$/.test(current)) {
          if (newVal.split('.').length === 2) {
            let before = this.$options.filters['demicrometer'](newVal.split('.')[0].split(',').join(''));
            let after = newVal.split('.')[1];
            if (newVal.split('.')[1].length > 8) {
              after = newVal.split('.')[1].slice(0, 8)
            }
            let arr = [before, after];
            this.form.payAmount = arr.join('.');
          } else if (newVal.split('.').length > 2) {
            this.form.payAmount = oldVal;
          } else {
            let num = newVal.split(',').join('');
            this.form.payAmount = this.$options.filters['demicrometer'](num);
          }
        } else {
          this.form.payAmount = oldVal;
        }
      }
      // this.form.payAmount = this.$options.filters.demicrometer(newVal);
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
    handleCancel () {
      this.$emit('update:disVisible', false);
    },
    handleTimeChange (val) {
      const result = this.timeStampOptions.find(item => item.snapshotNo === val) || {};
      const filters = this.$options.filters.demicrometer;
      this.form.holderQty = filters(result.holderQty);
      this.$set(this.form, 'payAmount', result.payAmount);
    },
    handleSubmit () {
      this.$refs.form.validate(valid => {
        if (valid) {
          // this.$confirm('Please confirm to calculate', {
          //   confirmButtonText: 'Confirm',
          //   customClass: 'customer-dialog',
          //   confirmButtonClass: 'btn-confirm'
          // }).then(() => {
            this.handelDisbursementSubmit();
          // }).catch(() => {});
        }
      });
    },
    handelDisbursementSubmit () {
      this.loading = true;

      const { payAmount, secondaryPwd, timeStamp } = this.form;
      const { couponNo, securityCode, period } = this.currentRow;
      const encryPwd = encryptSecondPwd(secondaryPwd);
      let url = distributeSubmit;
      let params = {
        payAmount: removeComma(payAmount),
        secondaryPwd: encryPwd,
        securityCode,
        snapshotNo: timeStamp
      };
      if (this.reDistribute) {
        url = distributeRetrySubmit;
        params = {
          securityCode,
          secondaryPwd: encryPwd,
          snapshotNo: timeStamp,
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
      const { securityCode, period } = this.currentRow;
      let url = assetDistributeDetail;

      if (this.reDistribute) {
        url = assetDistributeRetryDetail;
      }
      const result = await url({
          data: {
            code: securityCode,
            securityType: 0,
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
