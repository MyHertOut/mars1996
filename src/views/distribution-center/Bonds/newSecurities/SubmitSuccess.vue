<template>
  <div class="disbonds-submit-result">
    <img src="../../../../assets/images/success.png" width="58" height="58" alt="success" />
    <div class="result-title">Submitted Successfully</div>
    <div class="result-info">
      <p>Please wait patiently while the security is in creation.</p>
      <p>Click on “View Progress” to view issuance status.</p>
    </div>
    <ul class="next-operate">
      <li>
        <el-button class="btn-linkto" @click="$router.push({ name: 'IssuanceBondsList' })">Issuance Centre</el-button>
        <!-- <router-link :to="{ name: 'DistributBondsList'}">Issuance Centre</router-link> -->
      </li>
      <li>
        <el-button class="btn-linkto" @click="$router.push({ name: 'DisIssueBondsParameters' })">Create Bond</el-button>
        <!-- <router-link :to="{ name: 'DisIssueBondsParameters'}">Create Bond</router-link> -->
      </li>
      <li>
        <el-button class="btn-linkto" @click="$router.push({ name: 'DisIssueBondsIssuanceHistory' })">View Progress</el-button>
        <!-- <router-link :to="{ name: 'DisIssueBondsIssuanceHistory'}">View Progress</router-link> -->
      </li>
    </ul>
  </div>
</template>

<script>
export default {
  name: 'disBondsSubmitSuccess',
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
      margin-top: 30px;
      li {
        margin-right: 60px;
        color: #497EB9;
        text-decoration: underline;
        &:last-child {
          margin-right: 0;
        }
      }
      .btn-linkto {
        height: 32px;
        width: 120px;
        padding: 0;
        border-color: #214285 !important;
        color: #214285 !important;
      }
    }
  }
</style>
