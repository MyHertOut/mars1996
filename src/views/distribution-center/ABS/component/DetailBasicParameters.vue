<template>
  <div class="view-item">
    <el-row :gutter="20">
        <el-col :span="4"><div class="sub-title">Security Code：</div></el-col>
        <el-col :span="8"><div class="grid-content">{{ detailData.code }}</div></el-col>
        <el-col :span="4"><div class="sub-title">Security Name：</div></el-col>
        <el-col :span="6"><div class="grid-content">{{ detailData.name }}</div></el-col>
    </el-row>
    <el-row :gutter="20">
        <!-- <el-col :span="4"><div class="sub-title">Bond Type：</div></el-col>
        <el-col :span="8"><div class="grid-content">{{ (bondsTypeList.find(v => v.value == detailData.bondsType) || {}).label }}</div></el-col> -->
        <el-col :span="4"><div class="sub-title">Issuer Name：</div></el-col>
        <el-col :span="8"><div class="grid-content">{{ detailData.issuerName }}</div></el-col>
        <el-col :span="4"><div class="sub-title">Unique Identifier Code：</div></el-col>
        <el-col :span="6"><div class="grid-content">{{ detailData.uniqueIdentifierCode || '--' }}</div></el-col>
    </el-row>
    <!-- <el-row :gutter="20">
        <el-col :span="4"><div class="sub-title">Unique Identifier Code：</div></el-col>
        <el-col :span="8"><div class="grid-content">{{ detailData.uniqueIdentifierCode }}</div></el-col>
        <el-col :span="4"><div class="sub-title">Debt Seniority：</div></el-col>
        <el-col :span="6"><div class="grid-content">{{ (debtSeniorityList.find(v => v.value == detailData.debtSeniority) || {}).label }}</div></el-col>
    </el-row> -->
    <!-- <el-row :gutter="20">
        <el-col :span="4"><div class="sub-title">Issuer Rating：</div></el-col>
        <el-col :span="8"><div class="grid-content">{{ detailData.issueRating }}</div></el-col>
        <el-col :span="4"><div class="sub-title">Company LEI：</div></el-col>
        <el-col :span="6"><div class="grid-content">{{ detailData.companyLei }}</div></el-col>
    </el-row> -->
    <el-row :gutter="20">
        <el-col :span="4"><div class="sub-title">Issuance Quantity：</div></el-col>
        <el-col :span="8"><div class="grid-content">{{ detailData.issuanceQuantity | demicrometer }}</div></el-col>
        <el-col :span="4"><div class="sub-title">Par Value per Token：</div></el-col>
        <el-col :span="6"><div class="grid-content">{{ detailData.parValuePerToken | demicrometer }} {{ detailData.currency }}</div></el-col>
    </el-row>
    <el-row :gutter="20">
        <el-col :span="4"><div class="sub-title">Settlement Token：</div></el-col>
        <el-col :span="8"><div class="grid-content">{{ detailData.settlementCode }}</div></el-col>
        <el-col :span="4"><div class="sub-title">Day Count Convention：</div></el-col>
        <el-col :span="6"><div class="grid-content">{{ dayCountConventionComputed }}</div></el-col>
    </el-row>
    <el-row :gutter="20">
        <el-col :span="4"><div class="sub-title">Issuance Address：</div></el-col>
        <el-col :span="8">
            <div class="grid-content">
              <a class="link-txt" :href="browserUrlAddress(detailData.issuanceAddress)" target="_blank">{{detailData.issuanceAddress}}</a>
            </div>
        </el-col>
        <el-col :span="4"><div class="sub-title">Contract Address：</div></el-col>
        <el-col :span="6">
            <div class="grid-content">
              <a class="link-txt" v-if="detailData.contractAddress" :href="browserUrlAddress(detailData.contractAddress)" target="_blank">{{detailData.contractAddress}}</a>
              <span v-else>--</span>
            </div>
        </el-col>
        <!-- <el-col :span="4"><div class="sub-title">Issuance Quantity：</div></el-col>
        <el-col :span="6"><div class="grid-content">{{ detailData.issuanceQuantity | demicrometer }}</div></el-col> -->
    </el-row>
    <!-- <el-row :gutter="20"> -->
        <!-- <el-col :span="4"><div class="sub-title">Par Value per Token：</div></el-col>
        <el-col :span="8"><div class="grid-content">{{ detailData.parValuePerToken | demicrometer }}</div></el-col> -->
        <!-- <el-col :span="4"><div class="sub-title">Currency：</div></el-col>
        <el-col :span="6"><div class="grid-content">{{ detailData.disbursementCode }}</div></el-col>
    </el-row> -->
    <el-row :gutter="20">
        <el-col :span="4"><div class="sub-title">Terms and Conditions：</div></el-col>
        <el-col :span="19">
            <div class="grid-content">
            {{ detailData.acknowledgeTc || '--' }}
            </div>
        </el-col>
    </el-row>
</div>
</template>

<script>
import { dayCountConventionList } from '@/common/enums.js';
import mixins from '@/plugin/mixin.js';

export default {
  name: 'DetailBasicParameters',
  mixins: [mixins],
  props: {
    detailData: {
      type: Object,
      default: () => {}
    }
  },
  data () {
    return {
      debtSeniorityList: [{
        label: 'Senior Secured',
        value: 1
      }, {
        label: 'Secured',
        value: 2
      }, {
        label: 'Senior Unsecured',
        value: 3
      }, {
        label: 'Senior Subordinated',
        value: 4
      }, {
        label: 'Subordinated',
        value: 5
      }, {
        label: 'Junior Subordinated',
        value: 6
      }],
      bondsTypeList: [
        {
          label: 'Asset-backed Security',
          value: '0'
        }, {
          label: 'Corporate',
          value: '1'
        }, {
          label: 'High Yield Corporate',
          value: '2'
        }, {
          label: 'Sovereign',
          value: '3'
        }, {
          label: 'Quasi-Sovereign',
          value: '4'
        }
      ]
    };
  },
  computed: {
    dayCountConventionComputed () {
      const obj = dayCountConventionList.filter(v => v.value === this.detailData.dayCountConvention)[0] || {};
      return obj.label;
    }
  }
};
</script>
