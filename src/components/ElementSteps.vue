<template>
  <el-steps class="common-steps" :active="currentActive" align-center>
    <el-step v-for="(item, index) in data" :key="index" :title="item">
      <template v-slot:icon>
        <div class="outerRing">
          <div class="inRing"></div>
        </div>
      </template>
    </el-step>
  </el-steps>
</template>

<script>
export default {
  name: 'ComElementSteps',
  props: {
    data: {
      type: Array,
      default: () => []
    },
    active: {
      type: Number
    }
  },
  computed: {
    currentActive () {
      return this.active !== undefined ? this.active : this.$route.meta.steps;
    }
  }
};
</script>
