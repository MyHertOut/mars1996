<template>
  <div class="login-container">
    <div v-if="$store.state.common.systemConfig.webLoginPageType === '2' || webLoginPageType === '2'" class="notPoc">
      <Header />
      <div class="login-content">
        <div style="margin-top: 139px;">
          <img src="../assets/images/loginLogo.png" width="420" alt="logo">
        </div>
        <div class="login-box">
          <el-form :model="login" :rules="loginRules" ref="loginForm" class="login-dialog">
            <el-form-item prop="email">
              <p class="label">Account</p>
              <el-input v-model="login.email" maxlength="30" placeholder="Please enter Email / UserId" :disabled="loading"></el-input>
            </el-form-item>
            <el-form-item prop="password">
              <p class="label">Password</p>
              <el-input v-model="login.password" :readonly="pwdReadOnly" @focus="pwdReadOnly=false" placeholder="Please enter the login password." type="password" :disabled="loading"></el-input>
            </el-form-item>
          </el-form>
          <el-button type="primary" :loading="loading" class="submit" @click="loginUser" :disabled="!isLoginBtn">Login</el-button>
          <div class="forget" @click="forgetVisible = true">Forget Password?</div>
        </div>
        <div class="login-footer">&copy; 2020 Settlity. All Rights Reserved.</div>
      </div>
    </div>
    <div v-else-if="$store.state.common.systemConfig.webLoginPageType === '1' || webLoginPageType === '1'" class="isPocContent">
      <div class="isPocContent-left">
        <div class="isPocContent-logo">
          <img src="../assets/images/POCloginLogo.png" alt="">
        </div>
        <div class="isPocContent-desc">Welcome to Settlity Studio. Please login below.</div>
        <div class="login-box">
          <el-form :model="login" :rules="loginRules" ref="loginForm" class="login-dialog">
            <el-form-item prop="email">
              <p class="label">Account</p>
              <el-input v-model="login.email" maxlength="30" placeholder="Please enter Email / UserId" :disabled="loading"></el-input>
            </el-form-item>
            <el-form-item prop="password">
              <p class="label">Password</p>
              <el-input v-model="login.password" :readonly="pwdReadOnly" @focus="pwdReadOnly=false" placeholder="Please enter the login password." type="password" :disabled="loading"></el-input>
            </el-form-item>
          </el-form>
          <el-button type="primary" :loading="loading" class="submit" @click="loginUser" :disabled="!isLoginBtn">Login</el-button>
          <div class="forget">Forget Password? Click <span @click="forgetVisible = true" class="forget-light">here</span> to reset.</div>
          <div class="forget">Or sign up <span>here</span> for a free account to start using!</div>
          <div class="loginFooter-Sub loginFooter-About">About Settlity</div>
          <div class="loginFooter-Sub">Contact Us</div>
          <div class="POClogin-footer">&copy; 2020 Settlity. All Rights Reserved.</div>
        </div>
      </div>
      <div class="isPocContent-right"></div>
    </div>
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
    <setPassword @setSecPwd="setSecPwd" :emailSecPwd="emailSecPwd" :isShow="passwordDialog" :changeType="changrType" @closeDialog="passwordDialog = false" />
  </div>
</template>
<script>
import VueRecaptcha from 'vue-recaptcha';
import Header from '@components/Header.vue';
import {
  LOCAL_STORAGE_TOKEN, notify, LOCAL_STORAGE_TRADEADDRESS,
  LOCAL_STORAGE_BALANCEADDRESS, LOCAL_STORAGE_SECURITIESADDRESS
} from '@/common/util';
import { loginUser } from '@/api/distribution-center';
import { sendEmail, loginPwd, validEmailCode } from '@/api/account';
import { getSystemConfig, getUser } from '@/api/common';
import md5 from 'md5';
import setPassword from '@/components/setPassword';

export default {
  name: 'Login',
  data () {
    const emailValidate = (rule, value, callback) => {
      if (!/[\w!#$%&'*+/=?^_`{|}~-]+(?:\.[\w!#$%&'*+/=?^_`{|}~-]+)*\.*@(?:[\w](?:[\w-]*[\w])?\.)+[\w](?:[\w-]*[\w])?/.test(value)) {
        callback(new Error('Please enter the correct account.'));
      } else {
        callback();
      }
    };
    // const userIdValidate = (rule, value, callback) => {
    //   if (!userIdLetterNumberReg.test(value)) {
    //     callback(new Error('Please enter the correct user id'));
    //   } else {
    //     callback();
    //   }
    // };
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
      emailSecPwd: '',
      userNo: '',
      passwordDialog: false,
      changrType: 2,
      webLoginPageType: '',
      pwdReadOnly: true,
      login: {
        email: '',
        password: '',
        emailCode: ''
      },
      loginRules: {
        email: [{ required: true, trigger: 'blur', message: 'This field is required.' }],
        // , { validator: emailValidate, trigger: 'change' }, { validator: userIdValidate, trigger: 'change' }
        // email: [
        //   { required: true, trigger: 'blur', message: 'This field is required.' },
        //   { validator: userIdValidate, trigger: 'blur' }
        // ],
        password: [{ required: true, trigger: 'blur', message: 'This field is required.' }],
        emailCode: [{ required: true, trigger: 'blur', message: 'This field is required.' }]
      },
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
      forgetVisible: false,
      loading: false,
      forgetLoading: false,
      isLoginRecaptcha: false,
      isForgetRecaptcha: false,
      isSendEmail: false,
      isLoadingEmail: false,
      emailCountdown: 60,
      emailTimer: null,
      isLoginSendEmail: false,
      isLoginLoadingEmail: false,
      loginEmailCountdown: 60,
      loginEmailTimer: null
    };
  },
  mounted () {
    this.getUserInfo();
    this.$store.dispatch('getSystemConfig');
    this.getSystemConfig();
  },
  components: {
    Header,
    VueRecaptcha
  },
  watch: {
    forgetVisible (n, o) {
      if (!n && this.$refs.forgetRecaptcha) {
        this.$refs.forgetRecaptcha.reset();
      }
    }
  },
  computed: {
    isLoginBtn () {
      if (this.login.email && this.login.password) {
        return true;
      } else {
        return false;
      }
    },
    isForgetBtn () {
      if (this.forget.email && this.forget.emailCode && this.isForgetRecaptcha) {
        return true;
      } else {
        return false;
      }
    }
  },
  methods: {
    getSystemConfig () {
      getSystemConfig().then(res => {
        if (res.data.code === '1000') {
          this.webLoginPageType = res.data.data.webLoginPageType;
        }
      })
    },
    closeSet () {
      this.isSetPassword = false;
      this.forget = {
        email: '',
        emailCode: ''
      }
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
              this.forgetVisible = false;
              this.isSetPassword = !this.isSetPassword;
            }
          }
        });
      }
    },
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
    forgetExpired () {
      this.isForgetRecaptcha = false;
    },
    loginExpired () {
      this.isLoginRecaptcha = false;
    },
    forgetVerify () {
      this.isForgetRecaptcha = true;
    },
    loginVerify () {
      this.isLoginRecaptcha = true;
    },
    forgetRender () {
      this.isForgetRecaptcha = false;
    },
    loginRender (id) {
      this.isLoginRecaptcha = false;
    },
    getUserInfo () {
      const token = localStorage.getItem('user_token');
      if (token) {
        this.$router.push({ name: 'accountCenter' });
      }
    },
    loginUser () {
      if (this.isLoginBtn) {
        this.$refs.loginForm.validate(async valid => {
          if (valid) {
            this.loading = true;
            const data = await loginUser({
              notify: notify.error,
              data: {
                email: this.login.email,
                emailCode: this.login.emailCode,
                loginPwd: md5(this.login.password).toUpperCase()
              },
              slient: true
            });
            if (data.code === '1000') {
              this.emailSecPwd = data.data.email;
              this.userNo = data.data.userNo;
              this.getUser();
            }
            this.loading = false;
          }
        });
      }
    },
    getUser (userNo) {
      getUser({ slient: true }).then(res => {
        if (res.code === '1000') {
          if (res.data.secondaryStatus) {
            localStorage.setItem(LOCAL_STORAGE_TOKEN, this.userNo);
            this.$store.dispatch('getSystemConfig');
            localStorage.removeItem(LOCAL_STORAGE_TRADEADDRESS);
            localStorage.removeItem(LOCAL_STORAGE_BALANCEADDRESS);
            localStorage.removeItem(LOCAL_STORAGE_SECURITIESADDRESS);
            this.$router.push({ name: 'LoginHome' });
          } else {
            this.passwordDialog = true;
          }
        }
      })
    },
    setSecPwd () {
      localStorage.setItem(LOCAL_STORAGE_TOKEN, this.userNo);
      this.$store.dispatch('getSystemConfig');
      localStorage.removeItem(LOCAL_STORAGE_TRADEADDRESS);
      localStorage.removeItem(LOCAL_STORAGE_BALANCEADDRESS);
      localStorage.removeItem(LOCAL_STORAGE_SECURITIESADDRESS);
      this.$router.push({ name: 'LoginHome' });
    }
  },
  components: {
    setPassword
  }
};
</script>
<style scoped lang="scss">
.login-container {
  position: relative;
  height: 100%;
  .notPoc{
    background: url(../assets/images/login-bg.png) no-repeat center center;
    background-size: cover;
    min-height: 100%;
  }
  .login-footer {
    margin-top: 85px;
    margin-bottom: 54px;
    opacity: 0.6;
    color: #ffffff;
    text-align: center;
  }
  .login-content {
    margin: 0 auto;
    overflow: hidden;
    text-align: center;
    color: #ffffff;
    .login-box {
      width: 580px;
      height: 412px;
      padding: 40px 55px 0;
      background: #ffffff;
      text-align: left;
      border-radius: 6px;
      margin: 60px auto 0;
    }
    .label {
      font-size: 14px;
      color: #979799;
    }
    .submit {
      margin-top: 48px;
      width: 100%;
      height: 40px;
      font-size: 18px;
      // font-family: 'calibri';
    }
    .forget {
      text-align: center;
      margin-top: 26px;
      color: #214285;
      font-size: 18px;
      cursor: pointer;
    }
  }
  .code {
    position: relative;
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
  .isPocContent{
    display: flex;
    width: 100%;
    .isPocContent-left{
      width: 640px;
      background: #FFFFFF;
      .isPocContent-logo{
        width: 400px;
        margin: 130px auto 40px;
        img{
          width: 400px;
          height: 100%;
        } 
      }
      .isPocContent-desc{
        font-family: Calibri;
        font-size: 26px;
        color: #707684;
        letter-spacing: 0;
        text-align: left;
        line-height: 12px;
        text-align: center;
      }
      .login-box{
        padding: 85px 85px 0;
        .submit{
          width: 470px;
          margin: 48px auto 30px;
        }
        .forget{
          font-family: Calibri;
          font-size: 18px;
          color: #192231;
          letter-spacing: 0;
          text-align: left;
          line-height: 27px;
          // > span {
          //   color: #214285;
          //   cursor: pointer;
          // }
        }
        .forget-light{
           color: #214285;
           cursor: pointer;
        }
        .loginFooter-Sub{
          font-family: Calibri;
          font-size: 18px;
          // color: #487EB9;
          letter-spacing: 0;
          text-align: left;
          line-height: 12px;
          // cursor: pointer;
          &.loginFooter-About{
            margin-top: 80px;
            margin-bottom: 14px;
          }
        }
        .POClogin-footer{
          margin-top: 28px;
          margin-bottom: 33px;
          font-family: Calibri;
          font-size: 18px;
          color: #192231;
          letter-spacing: 0;
          text-align: left;
          line-height: 12px;
        }
      }
    }
    .isPocContent-right{
      width: 100%;
      background: url(../assets/images/POCloginn-bg.png) no-repeat center center;
      background-size: cover;
    }
  }
}
</style>
<style lang="scss">
.login-container {
  .el-dialog__header {
    padding: 0;
  }
  .el-button.is-disabled {
    background-color: #E5E5E5;
    color: #8D93A1;
    border-color: #E5E5E5 !important;
  }
  .home-header {
    box-shadow: none;
  }
}
</style>
