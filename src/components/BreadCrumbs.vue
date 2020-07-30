<template>
  <div class="bread-container">
    <el-breadcrumb class="bread-crumb" separator-class="el-icon-arrow-right">
      <!-- <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>活动管理</el-breadcrumb-item>
      <el-breadcrumb-item>活动列表</el-breadcrumb-item> -->
      <el-breadcrumb-item v-for="(item, index) in data" :key="index" v-bind="item">
        {{ item.name }}
      </el-breadcrumb-item>
    </el-breadcrumb>
  </div>
</template>

<script>
export default {
  name: 'BreadCrumbs',
  props: {
    data: {
      type: Array,
      default: () => []
    }
  }
  // computed: {
  //   breadData () {
  //     return this.$store.state.common.breadData;
  //   }
  // },
};
</script>
<style lang="scss" scoped>
  .bread-container {
    height: 40px;
    color: #ffffff;
    background: linear-gradient(#0b2f71, #023673);
  }
  .bread-crumb {
    margin: 0 auto;
    width: 1200px;
    line-height: 40px;
  }
</style>
