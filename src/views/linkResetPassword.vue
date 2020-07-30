<template>
  <div class="link-rset-password">
    <p class="logo">
      <img src="@/assets/images/login-logo.png" alt="logo">
      <!-- <img src="../../assets/images/logo.png" alt="logo"> -->
    </p>
    <div class="set-form">
      <p class="title">Set Password</p>
      <el-form :model="ruleForm" :rules="rules" ref="ruleForm" class="rule-form">
        <el-form-item prop="email">
          <p class="label">Email</p>
          <el-input type="text" v-model="ruleForm.email" autocomplete="off" :disabled="loading"></el-input>
        </el-form-item>
        <el-form-item prop="password">
          <p class="label">Password</p>
          <el-input type="password" v-model="ruleForm.password" autocomplete="off" :disabled="loading"></el-input>
        </el-form-item>
        <el-form-item prop="confirmPassword">
          <p class="label">Confirm Password</p>
          <el-input type="password" v-model="ruleForm.confirmPassword" :disabled="loading"></el-input>
        </el-form-item>
        <div class="desc">
          <p>Password needs to be minimum of 8 alphanumerics with 1 Uppercase, 1 Lowercase & 1 Special Character.</p>
          <p>Special Characters includes !@#$&*()_-+=[]:;?,.</p>
        </div>
        <div class="submit">
          <el-button type="primary" @click="submit" :loading="loading">Set Password</el-button>
        </div>
      </el-form>
    </div>
  </div>
</template>
<script>
import { loginPwdByToken } from '@/api/account';
import { notify, LOCAL_STORAGE_TOKEN, LOCAL_STORAGE_SYSTEM } from '@/common/util';
import md5 from 'md5';

export default {
  name: 'LinkRsetPassword',
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
      } else if (this.ruleForm.password === this.ruleForm.confirmPassword) {
        callback();
      } else {
        callback(new Error('Password does not match'));
      }
    };
    return {
      ruleForm: {
        email: '',
        password: '',
        confirmPassword: ''
      },
      loading: false,
      rules: {
        email: [{ required: true, message: 'This field is required.', trigger: 'blur' }, { validator: emailValidate, trigger: 'blur' }],
        password: [{ required: true, message: 'This field is required.', trigger: 'blur' }, { validator: (rule, value, callback) => {
          if (!/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$&*\(\)_\-+=\[\]:;\?,.])[A-Za-z\d!@#$&*\(\)_\-+=\[\]:;\?,]{8,}/.test(value)) {
            callback(new Error('Password does not match the criteria'));
          } else {
            callback();
          }
        }, trigger: 'blur' }],
        confirmPassword: [{ required: true, message: 'This field is required.', trigger: 'blur' }, { validator: newPasswordValidate, trigger: 'blur' }]
      }
    };
  },
  methods: {
    submit () {
      this.$refs.ruleForm.validate(async valid => {
        if (valid) {
          let params = {
            data: {
              newPwd: md5(this.ruleForm.confirmPassword).toUpperCase(),
              email: this.ruleForm.email,
              token: this.$route.query.token
            },
            notify: notify.any,
            slient: true
          }
          this.loading = true;
          let res = await loginPwdByToken(params);
          if (res.code === '1000') {
            this.$store.commit('resetUser');
            this.$store.commit('resetConfig');
            localStorage.setItem(LOCAL_STORAGE_TOKEN, '');
            localStorage.setItem(LOCAL_STORAGE_SYSTEM, '');
            this.$router.push({
              name: 'Login'
            });
          }
          this.loading = false;
        }
      });
    }
  }
};
</script>
<style lang="scss" scoped>

.link-rset-password {
  // position: fixed;
  width: 100%;
  // height: 100%;
  min-height: 100%;
  height: 1080px;
  // background-color: #3039E4;
  background: url(../assets/images/login-bg.png) no-repeat center center;
  background-size: 100% 100%;
  overflow: auto;
  // padding-bottom: 50px;
  .logo {
    margin: 0 auto;
    text-align: center;
    margin-top: 111px; // 50px;
    img {
      width: 400px;
    }
  }
  .set-form {
    width: 640px;
    // height: 628px;
    background-color: #fff;
    margin: 0 auto;
    margin-top: 50px;
    box-shadow: 0 2px 28px 0 rgba(166,193,255,0.38);
    border-radius: 2px;
    padding: 44px 53px;
    .title {
      color: #001F3B;
      font-size:28px;
    }
    .rule-form {
      margin-top: 40px;
      .label {
        color: #979799;
        font-size: 14px;
      }
      .desc {
        margin: 0 auto;
        width: 535px;
        padding: 14px;
        background-color: #F4F9FE;
        margin-bottom: 60px;
        p {
          color: #575E6E;
          font-size: 16px;
          & + p {
            margin-top: 20px;
          }
        }
      }
      .submit {
        text-align: center;
        button {
          width: 100%; // 210px;
          height: 40px;
        }
      }
    }
  }
}
</style>
