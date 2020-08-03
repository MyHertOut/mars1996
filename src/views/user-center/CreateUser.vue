<template>
  <div class="userCenter-createUser-container">
    <bread-crumbs :data="breadData"></bread-crumbs>
    <div class="main-container">
      <div class="userCenter-createUser">
        <div class="createUser-title">Create User</div>
        <div class="createUser-conetnt">
          <element-steps :active="active" :data="stepData"></element-steps>
          <!-- <el-steps :active="active" align-center>
            <el-step title="User Information"></el-step>
            <el-step title="Review"></el-step>
            <el-step title="Completed"></el-step>
          </el-steps> -->
          <el-form
            v-if="active === 0"
            :model="ruleForm"
            :rules="rules"
            ref="ruleForm"
            label-width="100px"
            class="createUser-Form"
          >
            <el-form-item label="Name:" prop="accountName">
              <el-input placeholder="Enter the user name" v-model="ruleForm.accountName"></el-input>
            </el-form-item>
            <el-form-item label="User ID:" prop="userId">
              <el-input placeholder="Enter the user login ID" v-model="ruleForm.userId"></el-input>
            </el-form-item>
            <el-form-item label="Email:" prop="email">
              <el-input placeholder="Enter the user Email" v-model="ruleForm.email"></el-input>
            </el-form-item>
            <el-form-item label="Role:" prop="roles">
              <el-radio-group v-model="ruleForm.roles">
                <el-radio v-for="(v, k) in roles" :key="k" :label="v.roleNo">{{v.name}}</el-radio>
              </el-radio-group>
            </el-form-item>
            <el-form-item label="Status:" prop="userStatus">
              <el-radio-group v-model="ruleForm.userStatus">
                <el-radio label="1">Active</el-radio>
                <el-radio label="0">Disable</el-radio>
              </el-radio-group>
            </el-form-item>
            <el-form-item class="formBtn">
              <el-button class="formBtn-btn" @click="exitRelease('ruleForm')">Back</el-button>
              <el-button class="formBtn-btn" type="primary" @click="next('ruleForm')">Next</el-button>
            </el-form-item>
          </el-form>
          <div v-else-if="active === 1" class="create-preview">
            <div class="createPreview-title">Review</div>
            <div class="createPreview-content">
              <div class="createPreview-item">
                <div class="createPreview-label">Name:</div>
                <div class="createPreview-info">{{ruleForm.accountName}}</div>
              </div>
              <div class="createPreview-item">
                <div class="createPreview-label">User ID:</div>
                <div class="createPreview-info">{{ruleForm.userId}}</div>
              </div>
              <div class="createPreview-item">
                <div class="createPreview-label">Email:</div>
                <div class="createPreview-info">{{ruleForm.email}}</div>
              </div>
              <div class="createPreview-item">
                <div class="createPreview-label">Role:</div>
                <div class="createPreview-info">{{PreviewRole(ruleForm.roles)}}</div>
              </div>
              <div class="createPreview-item">
                <div class="createPreview-label">Status:</div>
                <div class="createPreview-info">{{ruleForm.userStatus === '1' ? 'Active':'Disable'}}</div>
              </div>
            </div>
            <div class="formBtnSec">
              <el-button class="formBtn-btn" @click="last()">Back</el-button>
              <el-button class="formBtn-btn" type="primary" @click="submitForm()">Next</el-button>
            </div>
          </div>
          <div v-else-if="active === 2" class="create-success">
            <div class="createSuccess-img"><img src="@/assets/images/success.png" alt=""></div>
            <div class="msgOne">User Account Submitted.</div>
            <div class="msgTwo">Please wait patiently while the account is in creation.</div>
            <div class="msgThrid">
              <el-button class="btn-linkto" @click="$router.push({path: '/userCenter'})">Org Centre</el-button>
              <el-button class="btn-linkto" @click="reCreate">Create User</el-button>
              <el-button class="btn-linkto" @click="$router.push({path: '/userCenter/createRecord'})">View Progress</el-button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import BreadCrumbs from '@/components/BreadCrumbs.vue';
import ElementSteps from '@/components/ElementSteps.vue';
import { roleQuery, addAccountUser } from '@/api/account';
import { notify, userIdLetterNumberReg } from '@/common/util';

export default {
  name: 'CreateUser',
  inject: ['reload'],
  data () {
    const emailValidate = (rule, value, callback) => {
      if (!/^([a-zA-Z]|[0-9])(\.|\w|-)+@[a-zA-Z0-9]+\.([a-zA-Z]{2,4})$/.test(value)) {
        callback(new Error('Please enter the correct email address'));
      } else {
        callback();
      }
    };
    const userIdValidate = (rule, value, callback) => {
      if (!userIdLetterNumberReg.test(value)) {
        callback(new Error('Please enter the correct user id'));
      } else {
        callback();
      }
    };
    const nameValidate = (rule, value, callback) => {
      if (value.length < 2) {
        callback(new Error('Minimum 2 characters'));
      } else {
        callback();
      }
    };
    return {
      stepData: [
        'User Information',
        'Review',
        'Completed'
      ],
      active: 0,
      breadData: [{
        name: 'Org Centre',
        to: '/userCenter'
      }, {
        name: 'Create User'
      }],
      ruleForm: {
        accountName: '',
        userId: '',
        email: '',
        roles: '',
        userStatus: ''
      },
      roles: [],
      rules: {
        accountName: [{ required: true, message: 'This field is required.', trigger: 'blur' }, { validator: nameValidate, trigger: 'blur' }],
        userId: [{ required: true, message: 'This field is required.', trigger: 'blur' }, { validator: userIdValidate, trigger: 'blur' }],
        email: [{ required: true, message: 'This field is required.', trigger: 'blur' }, { validator: emailValidate, trigger: 'blur' }],
        roles: [{ required: true, message: 'This field is required.', trigger: 'change' }],
        userStatus: [{ required: true, message: 'This field is required.', trigger: 'change' }]
      }
    };
  },
  methods: {
    next (formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.active = 1;
        } else {
          return false;
        }
      });
    },
    exitRelease (formName) {
      this.$refs[formName].resetFields();
      this.$router.push({
        path: '/userCenter'
      });
    },
    last () {
      this.active = 0;
    },
    submitForm () {
      this.addAccount();
    },
    async addAccount () {
      const params = {
        slient: true,
        data: {
          email: this.ruleForm.email,
          accountName: this.ruleForm.accountName,
          userId: this.ruleForm.userId,
          roles: [this.ruleForm.roles],
          userStatus: this.ruleForm.userStatus
        },
        notify: notify.any
      };
      this.loading = true;
      const data = await addAccountUser(params);
      this.loading = false;
      if (data.code === '1000') {
        this.active = 2;
      }
    },
    async getRoleQuery () {
      const data = await roleQuery();
      if (data.code === '1000') {
        this.roles = data.data;
      } else {
        this.$message.error(data.msg);
      }
    },
    PreviewRole (val) {
      let arr = this.roles.filter(el => {
        return el.roleNo === val;
      });
      return arr[0].name;
    },
    reCreate () {
      this.reload();
    }
  },
  components: {
    'bread-crumbs': BreadCrumbs,
    'element-steps': ElementSteps
  },
  mounted () {
    this.getRoleQuery();
  }
};

</script>

<style lang="scss">
.userCenter-createUser {
  padding-bottom: 20px;
  .createUser-title {
    font-family: PingFangSC-Semibold;
    font-size: 24px;
    color: #001f3b;
    line-height: 28px;
  }
  .createUser-conetnt {
    width: 980px;
    margin: 0 auto;
    padding-top: 40px;
    .createUser-Form {
      width: 670px;
      margin: 0 auto;
      padding-top: 60px;
      .el-form-item.is-required:not(.is-no-asterisk)
        > .el-form-item__label:before {
        display: none;
      }
      .el-form-item__label {
        text-align: left;
      }
      .formBtn {
        margin-top: 100px;
        text-align: center;
        .el-form-item__content{
          margin-left: 0 !important;
        }
        .formBtn-btn{
          width: 320px;
        }
      }
    }
    .create-preview{
      width: 860px;
      margin: 0 auto;
      padding-top: 60px;
      .createPreview-title{
        font-size: 20px;
        color: #192231;
        line-height: 30px;
        margin-bottom: 40px;
      }
      .createPreview-content{
        display: flex;
        flex-wrap: wrap;
        justify-content: space-between;
        .createPreview-item{
          display: flex;
          justify-content: space-between;
          width: 400px;
          margin-bottom: 14px;
          .createPreview-label{
            width: 200px;
            font-size: 14px;
            color: #8D93A1;
            letter-spacing: 0;
            line-height: 21px;
          }
          .createPreview-info{
            width: 200px;
            font-size: 14px;
            color: #001F3B;
            letter-spacing: 0;
            text-align: left;
            line-height: 21px;
          }
        }
      }
      .formBtnSec{
        text-align: center;
        margin-top: 210px;
        .el-form-item__content{
          margin-left: 0 !important;
        }
        .formBtn-btn{
          width: 320px;
        }
      }
    }
    .create-success{
      padding-top: 60px;
      display: flex;
      flex-direction: column;
      align-items: center;
      .createSuccess-img{
        width: 58px;
        height: 58px;
        border-radius: 50%;;
        img{
          width: 100%;
        }
      }
      .msgOne{
        font-size: 18px;
        color: #52B88F;
        line-height: 30px;
        margin-top: 10px;
      }
      .msgTwo{
        font-size: 14px;
        color: #192231;
        line-height: 30px;
        margin: 6px 0 20px;
      }
      .msgThrid{
        cursor: pointer;
        font-size: 14px;
        color: #497EB9;
        line-height: 20px;
        display: flex;
        .btn-linkto{
          &:nth-child(2){
            margin: 0 60px;
          }
        }
      }
    }
  }
}
</style>
