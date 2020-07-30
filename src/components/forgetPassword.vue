<template>
  <div class="forget-password">
    <el-dialog :visible.sync="forgetVisible" width="550px" :close-on-click-modal="false" @close="closeSet">
      <el-form :model="forget" :rules="forgetRules" ref="forgetForm" class="forget-dialog" v-show="!isSetPassword">
        <p class="forget-title">Forget Password</p>
        <el-form-item prop="email">
          <p class="label">Email Address</p>
          <el-input v-model="forget.email" placeholder="Please enter"></el-input>
        </el-form-item>
        <el-form-item prop="emailCode">
          <div class="code">
            <p class="label">Email Verification Code</p>
            <p class="item"><el-input v-model="forget.emailCode" placeholder="Please enter" :maxlength="6"></el-input></p>
            <div class="email-btn" @click="sendEmail('UL')" v-if="!isSendEmail">
              <span v-if="!isLoadingEmail">Request Code</span>
              <span v-else><i class="el-icon-loading"></i></span>
            </div>
            <div class="email-btn timing" v-else><span>Retry in {{emailCountdown}}s</span></div>
          </div>
        </el-form-item>
        <vue-recaptcha sitekey="6LdYP-MUAAAAAFl-P5sm2q2HRhDOJDBE4OBoG1Gv" ref="forgetRecaptcha"
          secretkey="6LdYP-MUAAAAAGuxOcXYZnh_HHo4sVo0UXDHTpGr"
          @verify="forgetVerify" @expired="forgetExpired" @render="forgetRender"></vue-recaptcha>
      </el-form>
      <el-form :model="newPassword" :rules="newPasswordRules" ref="newPasswordForm" class="forget-dialog" v-show="isSetPassword">
        <p class="forget-title">Set new password</p>
        <el-form-item prop="password">
          <p class="label">Password</p>
          <el-input v-model="newPassword.password" placeholder="Please enter" type="password"></el-input>
        </el-form-item>
        <el-form-item prop="confirmPassword">
          <p class="label">Confirm Password</p>
          <el-input v-model="newPassword.confirmPassword" placeholder="Please enter" type="password"></el-input>
        </el-form-item>
        <div class="set-desc">
          <p>Password needs to be minimum of 8 alphanumerics with 1 Uppercase, 1 Lowercase & 1 Special Character.</p>
          <br>
          <p>Special Characters includes !@#$&*()_-+=[]:;?,.</p>
        </div>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <div class="forget-footer">
          <el-button type="primary" :loading="forgetLoading" @click="submitPwd" :disabled="!isForgetBtn && !isSetPassword">confirm</el-button>
        </div>
      </span>
    </el-dialog>
  </div>
</template>
<script>
import VueRecaptcha from 'vue-recaptcha';
import { sendEmail, loginPwd, validEmailCode } from '@/api/account';
import md5 from 'md5';
import { notify } from '@/common/util';

export default {
  name: 'ForgetPassword',
  data () {
    const emailValidate = (rule, value, callback) => {
      if (!/[\w!#$%&'*+/=?^_`{|}~-]+(?:\.[\w!#$%&'*+/=?^_`{|}~-]+)*\.*@(?:[\w](?:[\w-]*[\w])?\.)+[\w](?:[\w-]*[\w])?/.test(value)) {
        callback(new Error('Please enter the correct email address'));
      } else {
        callback();
      }
    };
    const newPasswordValidate = (rule, value, callback) => {
      /* eslint-disable */
      if (!/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$&*\(\)_\-+=\[\]:;\?,.])[A-Za-z\d!@#$&*\(\)_\-+=\[\]:;\?,.]{8,}/.test(value)) {
        callback(new Error('Password does not match the criteria'));
      } else if (this.newPassword.password === this.newPassword.confirmPassword) {
        callback();
      } else {
        callback(new Error('Password does not match'));
      }
    };
    return {
      forgetVisible: false,
      forget: {
        email: '',
        emailCode: ''
      },
      forgetRules: {
        email: [{ required: true, trigger: 'blur', message: 'This field is required.' }, { validator: emailValidate, trigger: 'blur' }],
        emailCode: [{ required: true, trigger: 'blur', message: 'This field is required.' }]
      },
      newPassword: {
        password: '',
        confirmPassword: ''
      },
      newPasswordRules: {
        password: [{ required: true, trigger: 'blur', message: 'This field is required.' }, { validator: (rule, value, callback) => {
          if (!/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$&*\(\)_\-+=\[\]:;\?,.])[A-Za-z\d!@#$&*\(\)_\-+=\[\]:;\?,]{8,}/.test(value)) {
            callback(new Error('Password does not match the criteria'));
          } else {
            callback();
          }
        }, trigger: 'blur' }],
        confirmPassword: [{ required: true, trigger: 'blur', message: 'This field is required.' }, { validator: newPasswordValidate, trigger: 'blur' }]
      },
      isSetPassword: false,
      isSendEmail: false,
      isLoadingEmail: false,
      emailCountdown: 60,
      forgetLoading: false,
      isForgetRecaptcha: false
    };
  },
  watch: {
    isShow (n, o) {
      this.forgetVisible = n;
    }
  },
  created () {
    this.forgetVisible = this.isShow;
  },
  props: ['isShow'],
  components: {
    VueRecaptcha
  },
  computed: {
    isForgetBtn () {
      if (this.forget.email && this.forget.emailCode && this.isForgetRecaptcha) {
        return true;
      } else {
        return false;
      }
    }
  },
  methods: {
    sendEmail (type) {
      if (type === 'LG') {
        if (this.isLoginLoadingEmail) return;
        this.$refs.loginForm.validateField('email', async err => {
          if (!err) {
            this.isLoginLoadingEmail = true;
            const data = await sendEmail({
              data: { email: this.login.email, emailAuthType: type },
              needSign: true,
              slient: true,
              notify: notify.any
            });
            this.isLoginLoadingEmail = false;
            if (data.code === '1000') {
              this.isLoginSendEmail = true;
              this.loginEmailTimer = setInterval(() => {
                if (!this.isLoginSendEmail || this.loginEmailCountdown === 0) {
                  this.isLoginSendEmail = false;
                  clearInterval(this.loginEmailTimer);
                  this.loginEmailCountdown = 60;
                } else {
                  this.loginEmailCountdown--;
                }
              }, 1000);
            } else {
              this.isLoginSendEmail = false;
            }
          }
        });
      } else {
        if (this.isLoadingEmail) return;
        this.$refs.forgetForm.validateField('email', async err => {
          if (!err) {
            this.isLoadingEmail = true;
            const data = await sendEmail({
              data: { email: this.forget.email, emailAuthType: type },
              needSign: true,
              slient: true,
              notify: notify.any
            });
            this.isLoadingEmail = false;
            if (data.code === '1000') {
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
              this.isSendEmail = false;
            }
          }
        });
      }
    },
    closeSet () {
      this.isSetPassword = false;
      this.forget = {
        email: '',
        emailCode: ''
      };
      this.$emit('close');
    },
    forgetVerify () {
      this.isForgetRecaptcha = true;
    },
    forgetExpired () {
      this.isForgetRecaptcha = false;
    },
    forgetRender () {
      this.isForgetRecaptcha = false;
    },
    submitPwd () {
      if (!this.isSetPassword) {
        this.$refs.forgetForm.validate(async valid => {
          if (!valid) return;

          this.forgetLoading = true;
          const { email, emailCode } = this.forget;
          const data = await validEmailCode({
            data: { emailAuthType: 'UL', email, emailCode },
            notify: notify.any
          }).catch(() => {
            this.forgetLoading = false;
          })
          this.forgetLoading = false;
          if (data && data.code === '1000') {
            this.isSetPassword = !this.isSetPassword;
          }
        });
      } else {
        this.$refs.newPasswordForm.validate(async valid => {
          if (valid) {
            this.forgetLoading = true;
            const params = {
              newPwd: md5(this.newPassword.confirmPassword).toUpperCase(),
              email: this.forget.email,
              emailCode: this.forget.emailCode
            };
            const data = await loginPwd({
              data: params,
              slient: true,
              notify: notify.any
            }).catch(() => {
              this.forgetLoading = false;
            });
            this.forgetLoading = false;
            if (data && data.code === '1000') {
              this.closeSet();
              this.isSetPassword = !this.isSetPassword;
            }
          }
        });
      }
    },
  }
};
</script>
<style scoped lang="scss">
.forget-password {
  .label {
    font-size: 14px;
    color: #979799;
    // margin-bottom: 10px;
  }
  .forget-dialog {
    padding: 0 40px;
    .forget-title {
      font-size: 26px;
      color: #001F3B;
      margin-bottom: 40px;
    }
    .forget-form {
      .email {
        margin-bottom: 30px;
      }
    }
    .code {
      position: relative;
      // margin-bottom: 40px;
      .email-btn {
        position: absolute;
        right: 10px;
        bottom: 0px;
        font-size: 14px;
        color: #214285;
        font-size: 14px;
        height: 40px;
        line-height: 40px;
        cursor: pointer;
        &:hover {
          color: #497EB9;
        }
      }
      .timing {
        color: #979799;
        cursor: no-drop;
      }
    }
  }
  .set-desc {
    padding: 12px;
    background-color: #F4F9FE;
    height: 100px;
    font-size: 14px;
    color: #575E6E;
  }
  .forget-footer {
    padding: 0 40px 22px;
    text-align: center;
    button {
      width: 100%;
      height: 40px;
      color: #fff;
      font-size: 18px;
    }
  }
}
</style>
