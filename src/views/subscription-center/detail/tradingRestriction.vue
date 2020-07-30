<template>
  <div class="trading-restriction" v-loading="loading">
    <el-row>
      <el-col :span="10"><div class="label">Institutional（Permitted）</div></el-col>
      <el-col :span="23">
        <el-table :data="institutionalPermitted" style="width: 100%" class="tabel">
          <el-table-column :prop="val.prop" :label="val.label" v-for="(val, key) in institutional" :key="key"></el-table-column>
        </el-table>
      </el-col>
    </el-row>
    <el-row>
      <el-col :span="10"><div class="label">Institutional（Prohibited）</div></el-col>
      <el-col :span="23">
        <el-table :data="institutionalProhibited" style="width: 100%" class="tabel">
          <el-table-column :prop="val.prop" :label="val.label" v-for="(val, key) in institutional" :key="key"></el-table-column>
        </el-table>
      </el-col>
    </el-row>
    <el-row>
      <el-col :span="10"><div class="label">Individual（Permitted）</div></el-col>
      <el-col :span="23">
        <el-table :data="individualPermitted" style="width: 100%" class="tabel">
          <el-table-column :prop="val.prop" :label="val.label" v-for="(val, key) in individual" :key="key"></el-table-column>
        </el-table>
      </el-col>
    </el-row>
    <el-row>
      <el-col :span="10"><div class="label">Individual（Prohibited）</div></el-col>
      <el-col :span="23">
        <el-table :data="individualProhibited" style="width: 100%" class="tabel">
          <el-table-column :prop="val.prop" :label="val.label" v-for="(val, key) in individual" :key="key"></el-table-column>
        </el-table>
      </el-col>
    </el-row>
  </div>
</template>
<script>
import { securityDetailKyc } from '@/api';
import { notify } from '@/common/util';

export default {
  name: 'TradingRestriction',
  data () {
    return {
      institutional: [
        {
          label: 'Group',
          prop: 'group'
        }, {
          label: 'Country of Incorporation',
          prop: 'residencyName'
        }, {
          label: 'Country of Operation',
          prop: 'countryName'
        }
      ],
      individual: [
        {
          label: 'Group',
          prop: 'group'
        }, {
          label: 'Country',
          prop: 'countryName'
        }, {
          label: 'Investor Type',
          prop: 'investorType'
        }, {
          label: 'Residency',
          prop: 'residencyName'
        }, {
          label: 'Risk Tolerance',
          prop: 'riskLevel'
        }
      ],
      institutionalPermitted: [],
      institutionalProhibited: [],
      individualPermitted: [],
      individualProhibited: [],
      loading: false
    };
  },
  created () {
    this.getInfo();
  },
  methods: {
    async getInfo () {
      this.loading = true;
      const data = await securityDetailKyc({
        data: {
          serialNo: this.$route.query.tokenNo
        },
        slient: true,
        notify: notify.error
      });
      this.loading = false;
      if (data.data.data.individual) {
        this.individualPermitted = data.data.data.individual.filter(v => v.permitted === 1);
        this.individualProhibited = data.data.data.individual.filter(v => v.permitted === 2);
        this.individualPermitted.forEach((v, k) => {
          v.group = k + 1;
        });
        this.individualProhibited.forEach((v, k) => {
          v.group = k + 1;
        });
      }
      if (data.data.data.institutional) {
        this.institutionalPermitted = data.data.data.institutional.filter(v => v.permitted === 1);
        this.institutionalProhibited = data.data.data.institutional.filter(v => v.permitted === 2);
        this.institutionalPermitted.forEach((v, k) => {
          v.group = k + 1;
        });
        this.institutionalProhibited.forEach((v, k) => {
          v.group = k + 1;
        });
      }
    }
  }
};
</script>
<style scoped lang="scss">
.trading-restriction {
  padding-left: 34px;
  padding-top: 10px;
  .label {
    font-size: 22px;
    color: #192231;
    margin-bottom: 15px;
  }
  .value {
    font-size: 16px;
    color: #001F3B;
  }
  .el-row {
    margin-bottom: 20px;
  }
  .tabel {
    border: 1px solid #EEF1F7;
    border-bottom: 0;
    margin-bottom: 30px;
  }
}
</style>
