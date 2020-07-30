<template>
  <div class="disdetail-trading-restriction view-item">
      <!-- v-if="filterCountryData('kycInstitutional', 1).length" -->
     <div class="select-country">
      <p class="country-title">Institutional（Permit）</p>
        <!-- instituPermitted -->
      <el-table border :data="filterCountryData('kycInstitutional', 1)" style="width: 100%">
        <el-table-column prop="countryName" label="Country of Incorporation"></el-table-column>
        <el-table-column prop="residencyName" label="Country of Operation"></el-table-column>
      </el-table>
    </div>
    <!-- v-if="filterCountryData('kycInstitutional', 2).length" -->
    <div class="select-country">
        <p class="country-title">Institutional（Prohibit）</p>
        <!-- instituProhibited -->
        <el-table border :data="filterCountryData('kycInstitutional', 2)" style="width: 100%">
          <el-table-column prop="countryName" label="Country of Incorporation"></el-table-column>
          <el-table-column prop="residencyName" label="Country of Operation"></el-table-column>
        </el-table>
    </div>
    <!-- v-if="kycIndividual.length" -->
    <!-- <p class="head-title">Individual</p> -->
    <!-- v-if="filterCountryData('kycIndividual', 1).length" -->
    <div class="select-country">
      <p class="country-title">Individual（Permit）</p>
        <!-- indiviPermitted -->
      <el-table border :data="filterCountryData('kycIndividual', 1)" style="width: 100%">
        <el-table-column prop="countryName" label="Country"></el-table-column>
        <el-table-column prop="investorType" label="Type"></el-table-column>
        <el-table-column prop="riskLevel" label="Risk Tolerance"></el-table-column>
        <el-table-column prop="residencyName" label="Residency"></el-table-column>
      </el-table>
    </div>
    <div class="select-country">
      <p class="country-title">Individual（Prohibit）</p>
      <!-- indiviProhibited -->
      <el-table border :data="filterCountryData('kycIndividual', 2)" style="width: 100%">
        <el-table-column prop="countryName" label="Country"></el-table-column>
        <el-table-column prop="investorType" label="Type"></el-table-column>
        <el-table-column prop="riskLevel" label="Risk Tolerance"></el-table-column>
        <el-table-column prop="residencyName" label="Residency"></el-table-column>
      </el-table>
    </div>
  </div>
</template>

<script>

export default {
  name: 'DetailTradingRestriction',
  props: {
    detailData: {
      type: Object,
      default: () => {}
    }
  },
  data () {
    return {
      kycInstitutional: [], // institutional kyc info
      kycIndividual: [] // individual kyc info
    };
  },
  watch: {
    detailData () {
      // const kycList = this.detailData.kycList || [];
      const institutionalData = this.detailData.institutional;
      const individualData = this.detailData.individual;
      const institutionalArr = institutionalData instanceof Array ? institutionalData : [];
      const individualArr = individualData instanceof Array ? individualData : [];

      this.kycInstitutional = institutionalArr; // kycList.filter(item => item.investorType === 0) || [];
      this.kycIndividual = individualArr; // kycList.filter(item => item.investorType === 1) || [];
    }
  },
  methods: {
    filterCountryData (kycType, permitType) {
      return (this[kycType] || []).filter(x => x.permitted === permitType) || [];
      // const data = [];
      // this[kycType].filter(x => x.permitted === permitType).forEach(item => {
      //   data.push(...item.countryList);
      // });
      // return data || [];
    }
  }
};
</script>
<style lang="scss" scoped>
  .disdetail-trading-restriction {
    .select-country {
      margin-top: 30px;
      &:first-child {
        margin-top: 0;
      }
    }
    .country-title {
      margin-bottom: 14px;
      font-size: 20px;
      color: #192231;
    }
    /deep/.el-table .el-table__header thead tr th {
      padding: 12px 0;
    }
  }
</style>
