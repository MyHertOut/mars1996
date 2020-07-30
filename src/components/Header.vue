<template>
  <div class="header">
    <div class="header__content">
      <div style="cursor: pointer;" @click="$router.push({ name: 'LoginHome' })">
        <img src="../assets/images/logo.png" alt="pic" width="130" height="37" />
      </div>
      <template v-if="!$route.meta.noLogin">
        <el-menu
          router
          :default-active="selectPath"
          class="el-menu-left assets-centre"
          mode="horizontal"
          @select="handleSelect"
        >
        <template v-if="roleName.includes(roleObj.issuer)">
          <el-menu-item
            v-for="item in issuerMenus"
            :key="item.index"
            :index="item.index"
            v-permissions="item.permissions"
          >{{ item.name }}</el-menu-item>
          <!-- <el-menu-item v-permissions="'issuanceCentre.title'" index="/bonds">Issuance Centre</el-menu-item>
          <el-menu-item v-permissions="'listing.center'" index="/listing/bonds">Listing Centre</el-menu-item>
          <el-menu-item v-permissions="'assetServicingCentre.title'" index="/asset-servicing/bonds">Asset Servicing Centre</el-menu-item> -->
        </template>
        <template v-else-if="roleName.includes(roleObj.master)">
          <el-menu-item
            v-for="item in masterMenus"
            :key="item.index"
            :index="item.index"
            v-permissions="item.permissions"
          >{{ item.name }}</el-menu-item>
           <!-- <el-menu-item v-permissions="'organization.title'" index="/userCenter">Organisation Centre</el-menu-item> -->
        </template>
        <template v-else-if="roleName.includes(roleObj.investor)">
          <el-submenu v-for="(item, index) in investorMenus" :key="index" :index="`${index}`">
            <template slot="title">{{ item.name }}</template>
            <template v-for="childItem in item.children" >
                <el-menu-item :key="childItem.index" :index="childItem.index">
                  <router-link :to="childItem.index">{{ childItem.name }}</router-link>
                </el-menu-item>
            </template>
          </el-submenu>
          <!-- <el-submenu index="2">
            <template slot="title">Subscription Centre</template>
            <el-menu-item index="/subscription" v-permissions="'subscription.centre.bonds'">
              <router-link to="/subscription">Bonds</router-link>
            </el-menu-item>
            <el-menu-item index="/asset-backed-subscription" v-permissions="'subscription.centre.abs'">
              <router-link to="/asset-backed-subscription">Asset-Backed</router-link>
            </el-menu-item>
          </el-submenu>
          <el-submenu index="3" v-permissions="'trade.centre'">
            <template slot="title">Trade Centre</template>
            <el-menu-item index="/bond-trading" v-permissions="'trade.centre.bonds'">
              <router-link to="/bond-trading">Bonds</router-link>
            </el-menu-item>
            <el-menu-item index="/asset-backed-trade" v-permissions="'trade.centre.abs'">
              <router-link to="/asset-backed-trade">Asset-Backed</router-link>
            </el-menu-item>
          </el-submenu> -->
        </template>
        </el-menu>
        <el-menu
          :default-active="activeIndex"
          mode="horizontal"
          @select="handleSelect"
          class="assets-centre"
        >
          <el-submenu index="4" v-permissions="'assetsCentre.title'">
            <template slot="title">Assets Centre</template>
            <el-menu-item index="4-1" v-permissions="'asseBalance.title'">
              <router-link :to="'/myAssets'">Asset Balance</router-link>
            </el-menu-item>
            <el-menu-item index="4-1" v-permissions="'assetHistory.title'">
              <router-link :to="'/transactionHistory'">Transaction History</router-link>
            </el-menu-item>
          </el-submenu>
          <el-submenu index="5" v-permissions="'order.centre'">
            <template slot="title">Orders</template>
            <el-menu-item index="5-1" v-permissions="'order.centre.subscription'">
              <router-link :to="'/subscriptionOrders'">Subscription Orders</router-link>
            </el-menu-item>
            <el-menu-item index="5-1" v-permissions="'order.centre.trade'">
              <router-link :to="'/tradeOrders'">Trade Orders</router-link>
            </el-menu-item>
          </el-submenu>
        </el-menu>
        <div class="account" v-if="$route.meta.noLogin">
          <!-- <div class="login">Login</div>
          <div class="register">Sign Up</div> -->
        </div>
        <div class="user" v-else v-permissions="'member.manage.title'">
          <el-popover
            placement="top-start"
            popper-class="user-info-box"
            trigger="hover">
            <div class="user-infoBase">
              <p class="infoBase-email">{{userInfo.userName}}</p>
              <p class="infoBase-uid">UID: {{userInfo.userId}}</p>
            </div>
            <div class="user-info">
              <p v-permissions="'member.account.title'" @click="goAccountSec">
                <img src="../assets/images/accSafte-icon.png" alt="">
                <span>Account & Security</span>
              </p>
              <p v-permissions="'member.address.title'" @click="goAddressCentre">
                <img src="../assets/images/address-icon.png" alt="">
                <span>Address Centre</span>
              </p>
              <p @click="userLogout">
                <img src="../assets/images/logOut-icon.png" alt="">
                <span>Log Out</span>
              </p>
            </div>
            <div slot="reference" class="user">
              <div class="head" @mouseenter="showActHead" @mouseleave="hideHead">
                <img v-if="!headShow" src="../assets/images/user-manage.png" alt="pic" />
                <img v-else src="../assets/images/user-manageAno.png" alt="pic" />
              </div>
              <!-- <div class="name">{{this.userInfo.email}}</div> -->
            </div>
          </el-popover>
        </div>
        <!-- <el-dropdown class="language-switch">
          <span class="el-dropdown-link">
            English
            <i class="el-icon-arrow-down el-icon--right"></i>
          </span>
          <el-dropdown-menu slot="dropdown">
            <el-dropdown-item>English</el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown> -->
      </template>
    </div>
  </div>
</template>

<script>
import { logout } from '@/api/common.js';
import {
  LOCAL_STORAGE_TOKEN, LOCAL_STORAGE_SYSTEM,
  LOCAL_STORAGE_TRADEADDRESS, notify, LOCAL_STORAGE_BALANCEADDRESS,
  LOCAL_STORAGE_SECURITIESADDRESS
} from '@/common/util';
import { mapGetters } from 'vuex';

export default {
  name: 'Header',
  data () {
    return {
      headShow: false,
      activeIndex: '2',
      selectPath: this.$route.path,
      currentPath: this.$route.path,
      roleObj: {
        master: 'master',
        investor: 'investor',
        issuer: 'issuer'
      },
      // 发行者菜单
      issuerMenus: [{
        permissions: 'issuanceCentre.title',
        index: '/issuance/bonds',
        name: 'Issuance Centre'
      }, {
        permissions: 'listing.center',
        index: '/listing/bonds',
        name: 'Listing Centre'
      }, {
        permissions: 'assetServicingCentre.title',
        index: '/asset-servicing/bonds',
        name: 'Asset Servicing Centre'
      }],
      // master menus
      masterMenus: [{
        permissions: 'organization.title',
        index: '/userCenter',
        name: 'Organisation Centre'
      }],
      // investor menus
      investorMenus: [{
        name: 'Subscription Centre',
        permissions: 'subscription.centre',
        children: [{
          permissions: 'subscription.centre.bonds',
          index: '/subscription',
          name: 'Bonds'
        }, {
          permissions: 'subscription.centre.abs',
          index: '/asset-backed-subscription',
          name: 'Asset-Backed'
        }]
      }, {
        permissions: 'trade.centre',
        name: 'Trade Centre',
        children: [{
          permissions: 'trade.centre.bonds',
          index: '/bond-trading',
          name: 'Bonds'
        }, {
          permissions: 'trade.centre.abs',
          index: '/asset-backed-trade',
          name: 'Asset-Backed'
        }]
      }]
    };
  },
  computed: {
    ...mapGetters(['userInfo']),
    roleName () {
      return (this.userInfo.role && this.userInfo.role.map(x => x.roleName)) || [];
    }
  },
  watch: {
    $route: {
      handler (to, from) {
        // 根据当前path选中该path所属模块菜单
        // 前提条件是path开头需以所属模块url前缀开头，如：资产服务模块/asset-list，则子页面/asset-list/xxx
        this.selectPath = to.path;
        const nowPath = '/' + (to.path.split('/').filter(x => x) || [])[0];

        let menuObj = [];
        if (this.roleName.includes(this.roleObj.issuer)) {
          menuObj = this.issuerMenus;
        } else if (this.roleName.includes(this.roleObj.master)) {
          menuObj = this.masterMenus;
        } else if (this.roleName.includes(this.roleObj.investor)) {
          const arr = [];
          this.investorMenus.forEach(item => item.children.forEach(child => {
            arr.push({
              index: child.index
            });
          }));
          menuObj = arr;
        }
        const indexArr = menuObj.map(item => item.index);
        for (const item of indexArr) {
          if (nowPath === '/' + (item.split('/').filter(x => x) || [])[0]) {
            this.selectPath = item;
            break;
          }
        }
      },
      immediate: true
    }
  },
  methods: {
    showActHead () {
      this.headShow = true;
    },
    hideHead () {
      this.headShow = false;
    },
    goAccountSec () {
      this.$router.push({ name: 'accountCenter', query: { menuKey: 0 } });
    },
    goAddressCentre () {
      this.$router.push({ name: 'addressCenter', query: { menuKey: 0 } });
    },
    handleSelect (val, item) {
      this.currentPath = val;
      this.selectPath = '/' + (val.split('/').filter(x => x) || [])[0];
    },
    async userLogout () {
      await logout({ notify: notify.any });
      this.$store.commit('resetUser');
      this.$store.commit('resetConfig');
      this.$store.commit('resetAddress');
      this.$store.commit('resetBalanceAddress');
      this.$store.commit('resetIssuanceAddress');
      localStorage.setItem(LOCAL_STORAGE_TOKEN, '');
      localStorage.setItem(LOCAL_STORAGE_SYSTEM, '');
      localStorage.removeItem(LOCAL_STORAGE_TRADEADDRESS);
      localStorage.removeItem(LOCAL_STORAGE_BALANCEADDRESS);
      localStorage.removeItem(LOCAL_STORAGE_SECURITIESADDRESS);
      this.$router.push('/login');
    }
  }
};
</script>

<style lang="scss" scoped>
.header {
  height: 60px; // 80px;
  background: #ffffff;
  &__content {
    display: flex;
    margin: 0 auto;
    height: 100%;
    width: 1200px;
    align-items: center;
    .user {
      float: right;
      display: flex;
      height: 100%;
      justify-content: space-between;
      align-items: center;
      cursor: pointer;
      .head {
        width: 22px;
        height: 22px;
        // margin-right: 20px;
        img {
          width: 100%;
          height: 100%;
        }
      }
      .name {
        font-size: 18px;
        color: #001F3B;
        width: 150px;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }
    }
    .account {
      float: right;
      height: 100%;
      display: flex;
      justify-content: space-between;
      align-items: center;
      &::after {
        content: '';
        clear: both;
        width: 0px;
        height: 0px;
        display: block;
      }
      & > div {
        width: 100px;
        height: 40px;
        float: left;
        font-size: 18px;
        cursor: pointer;
        line-height: 40px;
        text-align: center;
      }
      .login {
        color: #fff;
      }
      .register {
        background-color: #fff;
        color: #2F39E3;
        border-radius:2px;
      }
    }
  }
  .language-switch {
    // margin-left: 16px;
  }
  .el-menu-left {
    flex: 1;
    margin-left: 60px;
  }
}
</style>
<style lang="scss">
.user-info-box {
  padding: 0 !important;
  .user-infoBase{
    padding: 20px 20px 5px;
    .infoBase-email{
      font-family: Calibri;
      font-size: 14px;
      color: #192231;
      letter-spacing: 0;
      line-height: 14px;
      margin-bottom: 6px;
    }
    .infoBase-uid{
      font-family: Calibri;
      font-size: 12px;
      color: #67696C;
      letter-spacing: 0;
      line-height: 12px;
    }
  }
  .user-info {
    display: flex;
    flex-direction: column;
    p {
      padding: 13px 20px;
      border-bottom: 1px solid #F9FBFF;
      cursor: pointer;
      transition: all .2s;
      color: #192231;
      font-size: 14px;
      display: flex;
      align-items: center;
      &:hover {
        background-color: #F9FBFF;
        color: #214285;
      }
      & + p {
        border: 0;
      }
      & > img {
        margin-right: 16px;
        width: 22px;
        height: 22px;
      }
    }
  }
}
.el-menu--horizontal>.el-submenu.is-active .el-submenu__title {
  border-bottom-color: #214285;
}
</style>
