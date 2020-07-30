<template>
  <div class="basic-Information" v-loading="loading">
    <el-row>
      <el-col :span="4"><div class="label">Security Code:</div></el-col>
      <el-col :span="8"><div class="value">{{isEmpty(infoObj.code)}}</div></el-col>
      <el-col :span="4"><div class="label">Security Name:</div></el-col>
      <el-col :span="8"><div class="value">{{isEmpty(infoObj.name)}}</div></el-col>
    </el-row>
    <el-row>
      <el-col :span="4"><div class="label">Issuer Name:</div></el-col>
      <el-col :span="8"><div class="value">{{isEmpty(infoObj.issuerName)}}</div></el-col>
      <el-col :span="4"><div class="label">Unique Identifier Code:</div></el-col>
      <el-col :span="8"><div class="value">{{isEmpty(infoObj.uniqueIdentifierCode)}}</div></el-col>
    </el-row>
    <el-row>
      <el-col :span="4"><div class="label">Issuance Quantity:</div></el-col>
      <el-col :span="8"><div class="value">{{formatNumber(infoObj.issuanceQuantity) | demicrometer}}</div></el-col>
      <el-col :span="4"><div class="label">Par Value per Unit:</div></el-col>
      <el-col :span="8"><div class="value">{{formatNumber(infoObj.parValuePerToken)}} {{infoObj.currency}}</div></el-col>
    </el-row>
    <el-row>
      <el-col :span="4"><div class="label">Settlement Type:</div></el-col>
      <el-col :span="8"><div class="value">Instant Settlement</div></el-col>
      <el-col :span="4"><div class="label">Day Count Convention:</div></el-col>
      <el-col :span="8"><div class="value">{{isEmpty(dayCountConventionList[infoObj.dayCountConvention])}}</div></el-col>
    </el-row>
    <el-row>
      <el-col :span="4"><div class="label">Issuance Address:</div></el-col>
      <el-col :span="8"><div class="value">{{isEmpty(infoObj.issuanceAddress)}}</div></el-col>
      <el-col :span="4"><div class="label">Contract Address:</div></el-col>
      <el-col :span="8"><div class="value">{{isEmpty(infoObj.contractAddress)}}</div></el-col>
    </el-row>
    <el-row>
      <el-col :span="4"><div class="label">Terms and Conditions:</div></el-col>
      <el-col :span="19"><div class="value">{{isEmpty(infoObj.acknowledgeTc)}}</div></el-col>
    </el-row>
  </div>
</template>
<script>
import { getAbsBasicInfo } from '@/api';
import { notify } from '@/common/util';

export default {
  name: 'basicInformation',
  data () {
    return {
      infoObj: {},
      loading: false,
      bondsType: ['Asset-backed Security', 'Corporate', 'High Yield Corporate', 'Sovereign', 'Quasi-Sovereign'],
      dayCountConventionList: ['30 / 360', '30 / 365', 'Actual / 360', 'Actual / 365', 'Actual / Actual'],
      debtSeniorityList: ['Senior Secured', 'Secured', 'Senior Unsecured', 'Senior Subordinated', 'Subordinated', 'Junior Subordinated']
    };
  },
  created () {
    this.getInfo();
  },
  methods: {
    isEmpty (str) {
      return str || '--';
    },
    formatNumber (num) {
      return parseFloat(num);
    },
    async getInfo () {
      this.loading = true;
      const data = await getAbsBasicInfo({
        data: {
          serialNo: this.$route.query.tokenNo
        },
        slient: true,
        notify: notify.error
      });
      this.loading = false;
      if (data.data) {
        this.infoObj = Object.assign({}, data.data);
      }
    }
  }
};
</script>
<style scoped lang="scss">
.basic-Information {
  padding-left: 34px;
  padding-top: 10px;
  .label {
    font-size: 16px;
    color: #8D93A1;
  }
  .value {
    font-size: 16px;
    color: #001F3B;
  }
  .el-row {
    margin-bottom: 20px;
  }
}
</style>
