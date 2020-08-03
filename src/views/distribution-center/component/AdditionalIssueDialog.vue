<template>
  <common-dialog
    v-bind="$attrs"
    v-on="$listeners"
    @handleOK="handleSubmit"
    title="Additional Issue"
    width="747px"
  >
    <el-form
      v-loading="additionalLoading"
      :model="addorm"
      :rules="addRules"
      ref="addForm"
      label-width="180px"
      label-position="left"
    >
      <el-form-item label="Issuance Quantity：" prop="issuanceQuantity">
        <el-input
          v-model.trim="addorm.issuanceQuantity"
          :readonly="pwdReadOnly"
          @focus="pwdReadOnly=false"
          maxlength="19"
        ></el-input>
      </el-form-item>
      <el-form-item label="Issuace Address：" prop="issuaceAddress">
        <el-select v-model="addorm.issuaceAddress" disabled style="width: 100%;">
        <el-option
            v-for="item in []"
            :key="item.value"
            :label="item.label"
            :value="item.value"
            :disabled="item.disabled">
        </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="Submitter Address：" prop="submitterAddress">
        <el-select placeholder="" v-model="addorm.submitterAddress" style="width: 100%;">
          <el-option
            v-for="item in addressData"
            :key="item.id"
            :label="'[' + item.addressTag + ']' + item.address"
            :value="item.address"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="Secondary Password：" prop="secondaryPassword">
        <el-input v-model="addorm.secondaryPassword" type="password"></el-input>
      </el-form-item>
    </el-form>
  </common-dialog>
</template>

<script>
import md5 from 'md5';
import CommonDialog from '@/components/ElementDialog.vue';
import { integersExcludeZero, secondaryPwdReg, notify } from '@/common/util.js';
import { additionalIssueAdd } from '@/api/distribution-center';
import { multiAddresses } from '@/api/common.js';

export default {
  inheritAttrs: false,
  props: {
    // visible: Boolean,
    // address: String,
    issuesType: String,
    selectedRowData: {
      type: Object,
      default: () => {}
    }
  },
  data () {
    const requireValidator = { required: true, trigger: 'blur', message: 'This field is required.' };
    const quantityValidate = {
      trigger: ['change', 'blur'],
      validator: (rule, value, callback) => {
        if (!integersExcludeZero.test(value)) {
          callback('Integers greater than 0');
          return;
        }
        callback();
      }
    };
    const secondPwdValidate = {
      trigger: 'blur',
      validator: (rule, value, callback) => {
        if (!secondaryPwdReg.test(value)) {
          callback('Password does not match the criteria');
          return;
        }
        callback();
      }
    };
    return {
      additionalLoading: false,
      pwdReadOnly: true,
      addIssVisible: false,
      addressData: [],
      addorm: {
        issuanceQuantity: '',
        issuaceAddress: '',
        secondaryPassword: '',
        submitterAddress: ''
      },
      addRules: {
        issuanceQuantity: [requireValidator, quantityValidate],
        issuaceAddress: [requireValidator],
        submitterAddress: [requireValidator],
        secondaryPassword: [requireValidator, secondPwdValidate]
      }
    };
  },
  watch: {
    visibleDialog (val) {
      if (val) {
        this.addorm = Object.assign(this.addorm, {
          tokenCode: this.selectedRowData.code,
          issuaceAddress: this.selectedRowData.issuanceAddress
        });
        this.multiAddresses();
      } else {
        this.$refs.addForm.resetFields();
      }
    }
  },
  computed: {
    visibleDialog () {
      return this.$attrs.visible;
    }
  },
  components: {
    'common-dialog': CommonDialog
  },
  methods: {
    handleSubmit () {
      this.$refs.addForm.validate(valid => {
        if (!valid) return;

        this.additionalLoading = true;
        const { code, issuanceAddress } = this.selectedRowData;
        const { issuanceQuantity, secondaryPassword } = this.addorm;
        additionalIssueAdd({
          data: {
            tokenCode: code,
            ownedAddress: issuanceAddress,
            quantity: issuanceQuantity,
            submitter: this.addorm.submitterAddress, // this.address,
            secondaryPwd: md5(secondaryPassword).toUpperCase(),
            type: this.issuesType
          },
          notify: notify.any
        }).then(res => {
          this.additionalLoading = false;
          if (res.code === '1000') {
            // this.additionalVisible = false;
            // this.getPage(1);
            this.$emit('update:visible', false);
            this.$emit('handelModalSubmit');
          }
        }).catch(() => {
          this.additionalLoading = false;
        });
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
    }
  }
};
</script>
