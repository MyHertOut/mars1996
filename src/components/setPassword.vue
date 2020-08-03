<template>
  <div class="set-password-dialog">
    <el-dialog :title="changeType === 1 ? 'Change Password' : 'Set Secondary Password'"
      :visible.sync="passwordDialog" width="640px" @close="closeDialog" :close-on-click-modal="false">
      <el-form :model="ruleForm" :rules="rules" ref="ruleForm" class="password-ruleForm">
        <el-form-item prop="currentPassword" v-if="changeType === 1">
          <p class="form-title">Current Password:</p>
          <el-input type="password" v-model="ruleForm.currentPassword" autocomplete="off" :disabled="loading"></el-input>
        </el-form-item>
        <el-form-item prop="newPassword">
          <p class="form-title" v-if="changeType === 1">New Password:</p>
          <p class="form-title" v-else>Secondary Password:</p>
          <el-input type="password" v-model="ruleForm.newPassword" autocomplete="off" :disabled="loading"></el-input>
        </el-form-item>
        <el-form-item prop="confirmPassword">
          <p class="form-title" v-if="changeType === 1">Confirm Password:</p>
          <p class="form-title" v-else>Confirm Password:</p>
          <el-input type="password" v-model="ruleForm.confirmPassword" autocomplete="off" :disabled="loading"></el-input>
        </el-form-item>
        <el-form-item prop="emailCode" class="email-code" v-if="changeType === 2">
          <p class="form-title">Email Code:</p>
          <el-input v-model="ruleForm.emailCode" :disabled="loading" :maxlength="6"></el-input>
          <div class="email-code-text" @click="sendEmail" v-if="!isSendEmail">
            <span v-if="!isLoadingEmail">Request Code</span>
            <span v-else><i class="el-icon-loading"></i></span>
          </div>
          <div class="email-code-text timing" v-else><span>Retry in {{emailCountdown}}s</span></div>
        </el-form-item>
        <div class="rule-text">
          <p>Password needs to be minimum of 8 alphanumerics with 1 Uppercase, 1 Lowercase & 1 Special Character.</p>
          <p>Special Characters includes !@#$&*()_-+=[]:;?,.</p>
        </div>
        <el-form-item class="dialog-footer">
          <el-button type="primary" @click="submitForm" :loading="loading">{{changeType === 1 ? 'Change Password' :'Set Password'}}</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
  </div>
</template>
<script>
import { updatePwd, updateSecurityPwd, sendEmail } from '@/api/account';
import { notify, LOCAL_STORAGE_TOKEN, LOCAL_STORAGE_SYSTEM } from '@/common/util';
import md5 from 'md5';
import { logout } from '@/api/common';
import { mapGetters } from 'vuex';

export default {
  name: 'setSecondaryPwd',
  props: ['changeType', 'isShow', 'emailSecPwd'],
  created () {
    this.passwordDialog = this.isShow;
  },
  watch: {
    isShow (n, o) {
      this.passwordDialog = n;
      if (!n) {
        this.ruleForm.currentPassword = '';
        this.ruleForm.newPassword = '';
        this.ruleForm.confirmPassword = '';
        this.ruleForm.emailCode = '';
        this.$refs.ruleForm.clearValidate();
      }
    }
  },
  data () {
    const passwordValid = (rule, value, callback) => {
      // eslint-disable-next-line
      if (!/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$&*\(\)_\-+=\[\]:;\?,.])[A-Za-z\d!@#$&*\(\)_\-+=\[\]:;\?,.]{8,}/.test(value)) {
        callback(new Error('Password does not match the criteria'));
      } else {
        callback();
      }
    };
    const repeatValid = (rule, value, callback) => {
      if (this.ruleForm.newPassword !== this.ruleForm.confirmPassword) {
        callback(new Error('Password does not match'));
      } else {
        callback();
      }
    };
    return {
      passwordDialog: false,
      ruleForm: {
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
        emailCode: ''
      },
      rules: {
        currentPassword: [
          { required: true, message: 'This field is required.', trigger: 'blur' },
          { validator: passwordValid, trigger: 'blur' }
        ],
        newPassword: [
          { required: true, message: 'This field is required.', trigger: 'blur' },
          { validator: passwordValid, trigger: 'blur' }
        ],
        confirmPassword: [
          { required: true, message: 'This field is required.', trigger: 'blur' },
          { validator: passwordValid, trigger: 'blur' },
          { validator: repeatValid, trigger: 'blur' }
        ],
        emailCode: [
          { required: true, message: 'This field is required.', trigger: 'blur' }
        ]
      },
      loading: false,
      isSendEmail: false,
      isLoadingEmail: false,
      emailCountdown: 60,
      emailTimer: null
    };
  },
  computed: {
    ...mapGetters(['userInfo'])
  },
  inject: ['reload'],
  methods: {
    closeDialog () {
      this.$emit('closeDialog');
    },
    async sendEmail () {
      if (this.isLoadingEmail) return;
      this.isLoadingEmail = true;
      const data = await sendEmail({
        data: { email: this.emailSecPwd ? this.emailSecPwd : this.userInfo.email, emailAuthType: 'US' },
        needSign: true,
        slient: true,
        notify: notify.any
      });
      if (data.code === '1000') {
        this.isLoadingEmail = false;
        this.isSendEmail = true;
        this.emailTimer = setInterval(() => {
          if (!this.isSendEmail || this.emailCountdown === 0) {
            this.isSendEmail = false;
            clearInterval(this.emailTimer);
            this.emailCountdown = 60;
          } else {
            this.emailCountdown--;
          }
        }, 1000);
      } else {
        this.isLoadingEmail = false;
        this.isSendEmail = false;
      }
    },
    async updatePassword () {
      this.loading = true;
      const data = {
        newPwd: md5(this.ruleForm.newPassword).toUpperCase(),
        oldPwd: md5(this.ruleForm.currentPassword).toUpperCase()
      };
      const res = await updatePwd({ data, notify: notify.any, slient: true });
      if (res.code === '1000') {
        this.passwordDialog = false;
        await logout();
        this.$store.commit('resetUser');
        this.$store.commit('resetConfig');
        localStorage.setItem(LOCAL_STORAGE_TOKEN, '');
        localStorage.setItem(LOCAL_STORAGE_SYSTEM, '');
        this.$router.push('/login');
      }
      this.loading = false;
    },
    async updateSecurityPassword () {
      this.loading = true;
      const data = {
        newPwd: md5(this.ruleForm.newPassword).toUpperCase(),
        emailCode: this.ruleForm.emailCode
      };
      const res = await updateSecurityPwd({ data, notify: notify.any, slient: true });
      if (res.code === '1000') {
        this.passwordDialog = false;
        if (this.emailSecPwd) {
          this.$emit('setSecPwd');
        } else {
          this.reload();
        }
      }
      this.loading = false;
    },
    submitForm () {
      this.$refs.ruleForm.validate(valid => {
        if (valid) {
          if (this.changeType === 1) {
            this.updatePassword();
          } else {
            this.updateSecurityPassword();
          }
        }
      });
    }
  }
};
</script>
<style lang="scss">
.set-password-dialog {
  .password-ruleForm {
    .email-code {
      position: relative;
      .email-code-text {
        position: absolute;
        right: 15px;
        top: 40px;
        font-size: 16px;
        color: #214285;
        cursor: pointer;
      }
      .timing {
        color: #979799;
        cursor: no-drop;
      }
    }
    .rule-text {
      padding: 12px;
      font-size: 16px;
      color: #575E6E;
      background-color: #F4F9FE;
      margin-bottom: 60px;
      p {
        margin-bottom: 30px;
        word-wrap: break-word;
        word-break: keep-all;
        & + p {
          margin-bottom: 0px;
        }
      }
    }
    .dialog-footer {
      text-align: center;
      .el-button--primary {
        width: 210px;
        height: 40px;
      }
    }
  }
  .el-dialog__body {
      padding: 0 40px;
      padding-bottom: 25px;
    }
    .el-dialog__header {
      padding: 40px !important;
      .el-dialog__title {
        font-size: 26px;
        color: #001F3B;
      }
    }
    .el-dialog__footer {
      margin-bottom: 35px;
      padding-right: 40px;
      // padding-bottom: 30px;
    }
}
</style>
