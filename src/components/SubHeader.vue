<template>
  <div class="sub-header">
    <div class="sub-header__content">
      <span class="nav">{{ navTitle }}</span>
      <h3 class="title">{{ title }}</h3>
    </div>
    <div class="sub-header__bar">
      <div class="content">
        <ul class="switch-menu">
          <!-- <li class="active">公开认购</li>
          <li>指定认购</li> -->
          <li v-for="(item, index) in menus" :key="item.key" :class="activeIndex === index ? 'active' : ''"
            @click="handleClick(item, index)" v-permissions="item.functionCode">
            {{ item.name }}
          </li>
        </ul>
        <div class="op-btn">
          <slot name="btns"></slot>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  name: 'SubHeader',
  props: {
    title: String,
    navTitle: String,
    menus: {
      type: Array,
      default: () => []
    },
    defaultIndex: {
      type: Number,
      default: 0
    }
  },
  data () {
    return {
      activeIndex: 0
    };
  },
  methods: {
    handleClick (item, index) {
      this.activeIndex = index;
      this.$emit('handleClick', item);
    }
  },
  watch: {
    defaultIndex (n, o) {
      this.activeIndex = n;
    }
  },
  created () {
    this.activeIndex = this.defaultIndex;
  }
};
</script>
<style lang="scss" scoped>

  $sub-header-height: 130px;
  $bar-height: 38px;
  @mixin main-center {
    width: 1200px;
    margin: 0 auto;
  }

  .sub-header {
    position: relative;
    height: $sub-header-height; // 190px;
    background: url('../assets/images/sub-header-bg.png') no-repeat center;
    background-size: 100% 100%;
    &__content {
      @include main-center;
      padding-top: 24px; // 40px;
      color: #ffffff;
      .title {
        opacity: 0.9;
        font-size: 22px; // 32px;
      }
      .nav {
        opacity: 0.6;
        font-size: 12px;
      }
    }
    &__bar {
      position: absolute;
      bottom: 0;
      left: 0;
      right: 0;
      height: $bar-height; // 60px;
      background: rgba(#05255D, 0.42);
      color: #ffffff;
      .content {
        display: flex;
        align-items: center;
        justify-content: space-between;
        @include main-center;
      }
      .switch-menu {
        display: flex;
        li {
          font-size: 16px;
          padding: 0 32px;
          line-height: $bar-height; // 60px;
          opacity: 0.7;
          cursor: pointer;
          &:hover {
            opacity: 1;
          }
        }
        .active {
          font-size: 18px;
          background: #497EB9;
          opacity: 1;
        }
      }
      .el-button+.el-button {
        margin-left: 30px;
      }
    }
  }
</style>
<style lang="scss">
.sub-header {
  .sub-header__bar {
    .op-btn {
      .el-button {
        height: 32px;
      }
    }
  }
}
</style>
