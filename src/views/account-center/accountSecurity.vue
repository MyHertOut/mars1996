<template>
  <div class="account-content">
    <div class="account-baseInfo">
      <div class="baseInfo-title">Account</div>
      <div class="baseInfo-contetnt" v-loading="infoLoading">
        <div class="content-item">
          <div class="contentItem-label">Name:</div>
          <div class="contentItem-info">{{ userInfo.userName }}</div>
        </div>
        <div class="content-item">
          <div class="contentItem-label">Email:</div>
          <div class="contentItem-info">{{ userInfo.email }}</div>
        </div>
        <div class="content-item">
          <div class="contentItem-label">User ID:</div>
          <div class="contentItem-info">{{ userInfo.userId }}</div>
        </div>
        <div class="content-item">
          <div class="contentItem-label">Role:</div>
          <div class="contentItem-info">{{ roleName }}</div>
        </div>
        <div class="content-item">
          <div class="contentItem-label">Org ID:</div>
          <div class="contentItem-info">{{organisationInfo.merchantNo}}</div>
        </div>
        <div class="content-item" style="width: 75%;">
          <div class="contentItem-label">Organisation:</div>
          <div class="contentItem-info">{{organisationInfo.merchantName}}</div>
        </div>
      </div>
    </div>
    <div class="line"></div>
    <div class="safe-content">
      <div class="safe-title">Security</div>
      <div class="safe-item">
        <div class="safeItem-left">
          <div class="safeItem-img">
            <img v-if="userInfo.pwdStatus" src="@/assets/images/acc-success.png" alt="">
            <img v-else src="@/assets/images/acc-nonactivated.png" alt="">
          </div>
          <div class="safeItem-lable">Login Credentials</div>
          <div class="safeItem-desc safeItem-descAno">Login Password</div>
        </div>
        <div class="safeItem-right" v-permissions="'member.account.pwdSet'">
          <span class="link-txt" @click="passwordDialog = true;changrType = 1">Reset</span>
        </div>
      </div>
      <div class="safe-item">
        <div class="safeItem-left">
          <div class="safeItem-img">
            <img v-if="userInfo.secondaryStatus" src="@/assets/images/acc-success.png" alt="">
            <img v-else src="@/assets/images/acc-nonactivated.png" alt="">
          </div>
          <div class="safeItem-lable">Secondary Password</div>
          <div class="safeItem-desc">Enhance Asset Security</div>
        </div>
        <div class="safeItem-right" v-permissions="'member.account.secPwdSet'">
          <span class="link-txt" v-if="userInfo.secondaryStatus" @click="passwordDialog = true;changrType = 2">Reset</span>
          <el-button v-else @click="passwordDialog = true;changrType = 2" class="safeItemBtn" type="primary">Setup</el-button>
        </div>
      </div>
    </div>
    <setPassword :isShow="passwordDialog" :changeType="changrType" @closeDialog="passwordDialog = false" />
  </div>
</template>

<script>
import { organizeInfoQuery } from '@/api/account';
import setPassword from '@/components/setPassword';
import { mapGetters } from 'vuex';

export default {
  inject: ['reload'],
  data () {
    return {
      infoLoading: false,
      passwordDialog: false,
      changrType: 1,
      organisationInfo: {
        accountName: '',
        accountType: '',
        merchantName: '',
        merchantNo: ''
      }
    };
  },
  computed: {
    ...mapGetters(['userInfo']),
    roleName () {
      return this.userInfo.role[0] && this.userInfo.role[0].roleName;
    }
  },
  methods: {
    async getOrganizeInfo () {
      this.infoLoading = true;
      const data = await organizeInfoQuery({
        slient: true
      });
      this.infoLoading = false;
      if (data.code === '1000') {
        this.organisationInfo = Object.assign({}, data.data);
      }
    }
  },
  created () {
    this.getOrganizeInfo();
  },
  components: {
    setPassword
  }
};
</script>

<style lang="scss" scoped>
.account-content {
  .account-baseInfo {
    min-height: 204px;
    padding: 30px 30px 10px;
    .baseInfo-title {
      font-size: 24px;
      color: #001F3B;
      line-height: 28px;
    }
    .baseInfo-contetnt {
      display: flex;
      flex-wrap: wrap;
      padding-top: 30px;
      .content-item{
        width: 25%;
        .contentItem-label{
          font-size: 14px;
          color: #8D93A1;
          margin-bottom: 9px;
        }
        .contentItem-info{
          font-size: 14px;
          color: #001F3B;
          margin-bottom: 20px;
          > .operation {
            cursor: pointer;
            padding-left: 12px;
            position: relative;
            > img {
              width: 14px;
              position: absolute;
              top: 10%;
            }
          }
        }
      }
    }
  }
  .line {
    width: 1190px;
    border-top: 1px solid #ECEEF5;
    margin: 0 auto;
  }
  .safe-content {
    padding: 40px 30px;
    .safe-title {
      font-size: 24px;
      color: #001F3B;
      line-height: 28px;
      margin-bottom: 34px;
    }
    .safe-item{
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 31px;
      .safeItem-left{
        display: flex;
        justify-content: space-between;
        align-items: center;
        .safeItem-img{
          width: 18px;
          height: 18px;
          > img {
            width: 100%;
          }
        }
        .safeItem-lable{
          font-size: 14px;
          color: #192231;
          text-align: left;
          line-height: 12px;
          margin: 0 140px 0 12px;
        }
        .safeItem-desc{
          font-size: 14px;
          color: #616367;
          letter-spacing: 0;
          line-height: 12px;
          &.safeItem-descAno{
            padding-left: 18px;
          }
        }
      }
      .safeItem-right{
        > span {
          font-size: 14px;
          padding-right: 22px;
        }
        .safeItemBtn{
          width: 80px;
          height: 32px;
          padding: 0px 20px;
        }
      }
    }
  }
}
</style>
