<template>
  <element-dialog width="640px" v-bind="$attrs" v-on="$listeners" title="Freeze" @handleOK="handleSubmit">
    <el-form
      ref="form"
      :model="form"
      :rules="rules"
      class="redem-freeze-form"
      label-width="166px"
      v-loading="loading"
    >
      <el-form-item label="Secondary Password:" prop="secondaryPwd">
        <el-input v-model="form.secondaryPwd" :readonly="pwdReadonly" @focus="pwdReadonly=false" type="password"></el-input>
      </el-form-item>
      <el-form-item>
        <div class="tips-txt">
          <i class="el-icon-warning"></i>
          <span>Once the freeze is completed, the security on the chain cannot continue to be used</span>
        </div>
      </el-form-item>
    </el-form>
  </element-dialog>
</template>

<script>
import { redeemFreeze } from '@/api/asset-servicing.js';
import { secondaryPwdReg, notify, encryptSecondPwd } from '@/common/util.js';
export default {
  inheritAttrs: false,
  props: {
    currentRow: Object
  },
  data () {
    return {
      loading: false,
      pwdReadonly: true,
      form: {
        secondaryPwd: ''
      },
      rules: {
        secondaryPwd: [{ required: true, trigger: ['change', 'blur'], message: 'This field is required.' }, {
          trigger: ['change', 'blur'],
          validator: (rule, value, callback) => {
            if (!secondaryPwdReg.test(value)) {
              callback(new Error('Password does not match the criteria'));
              return;
            }
            callback();
          }
        }]
      }
    };
  },
  watch: {
    visible (val) {
      if (!val) {
        this.$refs.form.resetFields();
      }
    }
  },
  methods: {
    handleCancel () {
      this.$emit('update:visible', false);
    },
    handleSubmit () {
      this.$refs.form.validate(valid => {
        if (valid) {
          this.handelSubmitData(this.form);
        }
      });
    },
    handelSubmitData () {
      this.loading = true;
      redeemFreeze({
        data: {
          redeemNo: this.currentRow.redeemNo,
          secondaryPwd: encryptSecondPwd(this.form.secondaryPwd),
          securityType: this.currentRow.securityType
        },
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
    }
  }
};
</script>
