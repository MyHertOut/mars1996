<template>
  <div class="view-item">
    <el-row :gutter="20">
        <el-col :span="4"><div class="sub-title">Token Code：</div></el-col>
        <el-col :span="8"><div class="grid-content">{{ detailData.code }}</div></el-col>
        <el-col :span="4"><div class="sub-title">Token Name：</div></el-col>
        <el-col :span="6"><div class="grid-content">{{ detailData.name }}</div></el-col>
    </el-row>
    <el-row :gutter="20">
        <el-col :span="4"><div class="sub-title">Token Type：</div></el-col>
        <el-col :span="8"><div class="grid-content">{{ detailData.typeDesc }}</div></el-col>
        <el-col :span="4"><div class="sub-title">Currency：</div></el-col>
        <el-col :span="6"><div class="grid-content">{{ detailData.currency }}</div></el-col>
    </el-row>
    <el-row :gutter="20">
        <el-col :span="4"><div class="sub-title">Issuer Name：</div></el-col>
        <el-col :span="8"><div class="grid-content">{{ detailData.issuerName }}</div></el-col>
        <el-col :span="4"><div class="sub-title">Issuance Quantity：</div></el-col>
        <el-col :span="6"><div class="grid-content">{{ detailData.issuanceQuantity | demicrometer }}</div></el-col>
    </el-row>
    <el-row :gutter="20">
        <el-col :span="4"><div class="sub-title">Issuance Address：</div></el-col>
        <el-col :span="8">
            <div class="grid-content">
            <a class="link-txt" :href="browserUrlAddress(detailData.issuanceAddress)" target="_blank">{{detailData.issuanceAddress}}</a>
            </div>
        </el-col>
        <el-col :span="4"><div class="sub-title">Contract Address：</div></el-col>
        <el-col :span="8">
            <div class="grid-content">
            <a class="link-txt" :href="browserUrlAddress(detailData.contractAddress)" target="_blank">{{detailData.contractAddress}}</a>
            </div>
        </el-col>
    </el-row>
</div>
</template>

<script>
import mixins from '@/plugin/mixin.js';

export default {
  name: 'DetailCurrencyBasicParameters',
  mixins: [mixins],
  props: {
    detailData: {
      type: Object,
      default: () => {}
    }
  },
  data () {
    return {
    };
  }
};
</script>
