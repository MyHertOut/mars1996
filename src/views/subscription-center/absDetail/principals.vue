<template>
  <div class="principals" v-loading="loading">
    <el-row>
      <el-col :span="4"><div class="label">Coupon Frequency:</div></el-col>
      <el-col :span="8"><div class="value">{{isEmpty(infoObj.couponFrequency)}}</div></el-col>
      <el-col :span="4"><div class="label">First Settlement Date:</div></el-col>
      <el-col :span="8"><div class="value">{{formatTime(infoObj.firstSettlementDate)}}</div></el-col>
    </el-row>
    <el-row>
      <el-col :span="4"><div class="label">Disbursement Token:</div></el-col>
      <el-col :span="8"><div class="value">{{infoObj.disbursementCode}}</div></el-col>
    </el-row>
    <el-row>
      <el-col :span="4"><div class="label">Call Date(s):</div></el-col>
    </el-row>
    <el-row>
      <el-col :span="23" v-for="(v, k) in tabelList" :key="k">
        <el-table :data="v.tableData" stripe style="width: 100%" class="pay-ment-tabel">
          <el-table-column :prop="val.prop" :label="val.label" v-for="(val, key) in v.columnData" :key="key" :width="val.width"></el-table-column>
        </el-table>
      </el-col>
    </el-row>
  </div>
</template>
<script>
import { getAbsCoupon } from '@/api';
import { notify, formatDate } from '@/common/util';

export default {
  name: 'Principals',
  data () {
    return {
      tabelList: [],
      infoObj: {},
      couponFrequencyList: ['Quarterly', 'Semi-annually', 'Annually'],
      loading: false
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
      return parseFloat(num) || '--';
    },
    formatTime (time) {
      return formatDate(time) || '--';
    },
    async getInfo () {
      this.loading = true;
      const data = await getAbsCoupon({
        data: {
          serialNo: this.$route.query.tokenNo
        },
        slient: true,
        notify: notify.error
      });
      this.loading = false;
      if (data.data) {
        this.infoObj = data.data;
        for (var i = 0; i < this.infoObj.callDateList.length; i += 6) {
          let table = {
            tableData: [
              {
                couponPeriods: 'Timestamp'
              }
            ],
            columnData: [
              {
                prop: 'couponPeriods',
                label: 'Coupon Periods',
                width: 150
              }
            ]
          };
          this.infoObj.callDateList.slice(i, i + 6).forEach((v, k) => {
            table.columnData.push({
              prop: k + '',
              label: k + 1 + '',
              width: 150
            });
            table.tableData[0][k + ''] = this.formatTime(v);
          });
          this.tabelList.push(table);
        }
      }
    }
  }
};
</script>
<style scoped lang="scss">
.principals {
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
  .pay-ment-tabel {
    border-left: 1px solid #EEF1F7;
    border-bottom: 0;
    margin-bottom: 30px;
  }
}
</style>
<style lang="scss">
.subscription-detail {
  .principals {
    .pay-ment-tabel {
      .el-table__header {
        tr {
          th {
            background-color: #fff;
            border-right: 1px solid #EBEEF5;
            border-top: 1px solid #EBEEF5;
          }
          & > th:first-child {
            background-color: #FBFBFB;
          }
        }
      }
      .el-table__body {
        tr {
          td {
            background-color: #fff;
            border-right: 1px solid #EBEEF5;
          }
          & > td:first-child {
            background-color: #FBFBFB;
          }
        }
      }
    }
  }
}

</style>
