<template>
  <div class="simple-sub-header">
    <div class="content">
      <ul class="switch-menu">
        <li
          v-for="(item, index) in menus"
          :key="item.key"
          v-permissions="item.permissions"
          :class="activeKey === item.key ? 'active' : ''"
          @click="handleClick(item, index)"
        >{{ item.name }}</li>
      </ul>
      <div class="op-btn">
        <slot name="btns"></slot>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  name: 'SimpleSubHeader',
  props: {
    permissions: {
      type: String,
      default: ''
    },
    menus: {
      type: Array,
      default: () => []
    },
    active: {
      default: ''
    }
  },
  data () {
    return {
      activeKey: this.$props.active || (this.menus && this.menus[0].key)
    };
  },
  methods: {
    handleClick (item, index) {
      this.activeKey = item.key;
      this.$emit('handleClick', item);
      if (item.to && item.to.path) {
        this.$router.push(item.to);
      }
    }
  }
};
</script>
<style lang="scss" scoped>
@import '@/style/mixins.scss';

.simple-sub-header {
  height: 60px;
  background-image: linear-gradient(0deg, #0b2f71 1%, #023673 100%);
  color: #ffffff;
  .content {
    display: flex;
    align-items: center;
    justify-content: space-between;
    height: 100%;
    @include main-center;
  }
  .switch-menu {
    display: flex;
    li {
      font-size: 16px;
      padding: 0 32px;
      line-height: 60px;
      opacity: 0.7;
      cursor: pointer;
      &:hover {
        opacity: 1;
      }
    }
    .active {
      font-size: 18px;
      background: #497eb9;
      opacity: 1;
    }
  }
  .op-btn {
    /deep/ .el-button {
      height: 32px;
    }
    /deep/.btn-light {
      .el-icon-arrow-down {
        transform: rotateZ(0deg);
        transition: all .3s;
      }
      &:hover {
        .el-icon-arrow-down {
          transform: rotateZ(180deg);
          transition: all .3s;
        }
      }
    }
  }
  .dropdown-publish {
    margin-left: 30px;
    .el-button {
      height: 32px;
    }
  }
  .el-button + .el-button {
    margin-left: 30px;
  }
}
</style>
