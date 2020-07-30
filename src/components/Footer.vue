<template>
  <div class="footer">
    <div class="footer__content">
      <div class="left">
        <img src="../assets/images/footer-logo.png" alt="logo" />
        <p class="copyright">STACS &copy; All Rights Reserved.</p>
      </div>
      <div class="right">
         <div class="language-box">
            <img class="global-img" src="../assets/images/language.png" width="18" height="18" alt="logo" />
            <el-select class="sel-language" v-model="value" placeholder="">
              <el-option label="English" value="English">
              </el-option>
            </el-select>
         </div>
         <!-- 以下暂时注释 勿删 -->
        <!-- <el-dropdown trigger="click" class="language-switch">
          <el-button type="primary">
            <img src="../assets/images/language.png" width="18" height="18" alt="logo" />
            <span>English</span>
            <i class="el-icon-arrow-down el-icon--right"></i>
          </el-button>
          <el-dropdown-menu slot="dropdown">
            <el-dropdown-item>English</el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown> -->
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'footer-container',
  data () {
    return {
      value: 'English'
    };
  }
};
</script>

<style lang="scss" scoped>
.footer {
  display: flex;
  align-items: center;
  height: 200px;
  background: #112a60;
  color: #ffffff;
  width: 100%;
  position: absolute;
  width: 100%;
  bottom: 0;
  &__content {
    display: flex;
    justify-content: space-between;
    margin: 0 auto;
    width: 1200px;
  }
  .left {
    img {
      width: 200px;
    }
  }
  .right {
    .language-box {
      width: 168px;
      position: relative;
      .global-img {
        position: absolute;
        top: 50%;
        margin-top: -9px;
        left: 14px;
      }
      .sel-language {
        width: 168px;
        height: 44px;
        /deep/.el-input__inner {
          height: 44px;
          line-height: 44px;
          padding-left: 45px;
          background-color: transparent;
          color: #ffffff;
        }
      }
    }
    // .language-switch {
    //   img {
    //     vertical-align: middle;
    //     margin-right: 22px;
    //   }
    //   .el-button {
    //     width: 168px;
    //     height: 44px;
    //     line-height: 44px;
    //     padding: 0 14px;
    //     background-color: transparent !important;
    //     border: 1px solid rgba(255, 255, 255, 0.6) !important;
    //     font-size: 14px;
    //     text-align: initial;
    //   }
    //   .el-icon--right {
    //     margin-left: 37px;
    //   }
    // }
  }
  .copyright {
    margin-top: 10px;
    opacity: 0.6;
  }
}
.el-dropdown-menu.el-popper {
  width: 168px;
}
</style>
