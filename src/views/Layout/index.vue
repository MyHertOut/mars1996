<template>
  <div class="layout-container">
      <Header />
      <transition>
        <router-view :key="$route.path" />
      </transition>
      <Footer />
  </div>
</template>

<script>
import Header from '@/components/Header.vue';
import Footer from '@/components/Footer.vue';

export default {
  name: 'layout-container',
  components: {
    Header,
    Footer
  }
};
</script>
<style lang="scss" scoped>
  .layout-container {
    position: relative;
    min-height: 100%;
    padding-bottom: 200px;
    min-width: 1400px;
    /deep/.main-container {
      width: 1200px;
      margin: 20px auto 60px;
      padding: 40px 30px;
      min-height: 640px;
      background: #ffffff;
      &::after {
        content: '';
        display: block;
        clear: both;
        width: 0;
        height: 0;
      }
      .el-pagination {
        float: right;
        margin: 60px -10px 0 0;
      }
      .page-subtitle {
        font-size: 24px;
        color: #001F3B;
      }
      .tips-txt {
        padding: 14px;
        line-height: normal;
        background: rgba(255,154,0,0.09);
        color: #FF9A00;
        i {
          margin-right: 6px;
        }
      }
      .op-more {
        color: #214285;
        font-size: 20px;
        transform: rotate(90deg);
        cursor: pointer;
      }
    }
  }
</style>
