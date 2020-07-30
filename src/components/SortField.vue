<template>
  <div class="bar-right">
    <span>Sort：&nbsp;</span>
    <ul class="sort-field">
      <li class="active" v-for="item in sortFields" :key="item.field" @click="handleSortFieldClick">
        {{ item.name }}<i class="el-icon-bottom"></i>
      </li>
      <!-- <li>年化利率<i class="el-icon-bottom"></i></li>
      <li>风险级别<i class="el-icon-bottom"></i></li> -->
    </ul>
  </div>
</template>
<script>
export default {
  name: 'ComSortField',
  props: {
    sortFields: {
      type: Array,
      default: () => []
    }
  }
};
</script>
