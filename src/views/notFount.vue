<template>
  <div class="not-fount-page">
    <div class="content">
      <img src="../assets/images/not-found.png" alt="404">
    </div>
  </div>
</template>
<script>
export default {
  name: 'NotFountPage',
  created () {
  }
};
</script>
<style lang="scss" scoped>
.not-fount-page {
  .content {
    width: 1200px;
    margin: 0 auto;
    text-align: center;
    padding-top: 80px;
    img {
      width: 626px;
      height: 500px;
    }
  }
}
</style>
