<template>
  <div class="disbonds-submit-result">
    <img src="../../../../assets/images/success.png" width="58" height="58" alt="success" />
    <div class="result-title">Submitted Successfully</div>
    <div class="result-info">
      <p>Please wait patiently while the security is in creation.</p>
      <p>Click on “View Progress” to view issuance status.</p>
    </div>
    <ul class="next-operate">
      <!-- <li><router-link :to="{ name: 'DistributBondsList'}">Issuance Centre</router-link></li>
      <li><router-link :to="{ name: 'DisIssueAbsParameters'}">Create ABS</router-link></li>
      <li><router-link :to="{ path: '/issuance/history', query: { type: 'asset' }}">View Progress</router-link></li> -->
      <li>
        <el-button class="btn-linkto" @click="$router.push({ name: 'IssuanceBondsList' })">Issuance Centre</el-button>
      </li>
      <li>
        <el-button class="btn-linkto" @click="$router.push({ name: 'DisIssueAbsParameters' })">Create ABS</el-button>
      </li>
      <li>
        <el-button class="btn-linkto" @click="$router.push({ path: '/issuance/history', query: { type: 'asset' } })">View Progress</el-button>
      </li>
    </ul>
  </div>
</template>

<script>
export default {
  name: 'DisNewAbsSubmitSuccess',
  data () {
    return {};
  }
};
</script>

<style lang="scss" scoped>
  .disbonds-submit-result {
    margin: 100px auto;
    // width: 380px;
    text-align: center;
    .result-title {
      margin: 10px 0;
      color: #52B88F;
      font-size: 18px;
    }
    .result-info {
      line-height: 1.5;
      color: #192231;
    }
    .next-operate {
      display: flex;
      justify-content: center;
      margin-top: 20px;
      li {
        margin-right: 60px;
        color: #497EB9;
        text-decoration: underline;
        &:last-child {
          margin-right: 0;
        }
      }
    }
  }
</style>
