<template>
  <div class="view-item">
    <el-row :gutter="20">
      <el-col :span="4"><div class="sub-title">Coupon Frequency：</div></el-col>
      <el-col :span="8"><div class="grid-content">{{ detailData.couponFrequency }}</div></el-col>
      <el-col :span="4"><div class="sub-title">First Settlement Date：</div></el-col>
      <el-col :span="6"><div class="grid-content">{{ detailData.firstSettlementDate | dateFormat }}</div></el-col>
    </el-row>
    <el-row :gutter="20">
      <el-col :span="4"><div class="sub-title">Disbursement Token：</div></el-col>
      <el-col :span="8"><div class="grid-content">{{ detailData.disbursementCode }}</div></el-col>
    </el-row>
    <template v-if="detailData.callDateList && detailData.callDateList !== '--'">
      <el-row :gutter="20">
        <el-col :span="4"><div class="sub-title">Callable Dates：</div></el-col>
        <el-col :span="5" v-if="!callableTableList.length"><div class="grid-content">--</div></el-col>
      </el-row>
      <div class="payment-date-table">
        <template v-for="(val, key) in callableTableList">
          <el-table :data="val.tableData" stripe style="margin-bottom: 23px;" :key="key">
            <template v-for="(v, k) in val.tableColumn">
              <el-table-column
                v-if="k > 0"
                :key="k"
                :prop="v.prop"
                :width="v.width"
                :label="v.label">
                <template slot-scope="scope" v-if="k > 0">
                  <span>{{ (+scope.row[v.prop]) | dateFormat }}</span>
                </template>
              </el-table-column>
              <el-table-column
                v-else
                :key="k"
                :prop="v.prop"
                :width="v.width"
                :label="v.label">
              </el-table-column>
            </template>
          </el-table>
        </template>
      </div>
    </template>
</div>
</template>

<script>
import moment from 'moment';

export default {
  name: 'DetailCouponPrincipal',
  props: {
    detailData: {
      type: Object,
      default: () => {}
    }
  },
  data () {
    return {
      callableTableList: [],
      callableTableData: [],
      callableTableColumn: [],
      paymentTableList: [],
      paymentTableColumn: [],
      paymentTableData: []
    };
  },
  watch: {
    detailData () {
      console.log(this.detailData)
      if (this.detailData.firstSettlementDate && this.detailData.couponPeriods) {
        let times;
        if (this.detailData.couponFrequency === '0') {
          times = 7776000000;
        } else if (this.detailData.couponFrequency === '1') {
          times = 15552000000;
        } else {
          times = 31104000000;
        }
        for (let i = 0; i < Math.ceil(parseInt(this.detailData.couponPeriods) / 6); i++) {
          this.paymentTableList.push({
            tableColumn: [],
            tableData: []
          });
        }
        for (let i = 1; i <= parseInt(this.detailData.couponPeriods); i++) {
          const addTimes = times * i;
          this.paymentTableColumn.push({
            label: i + '/' + this.detailData.couponPeriods,
            prop: i + '/' + this.detailData.couponPeriods,
            width: 155
          });
          this.paymentTableData.push({
            [i + '/' + this.detailData.couponPeriods]: moment(new Date(this.detailData.firstSettlementDate).getTime() + addTimes).format('YYYY-MM-DD HH:mm:ss')
          });
        }
        const columnArr = [];
        const dataArr = [];
        for (let i = 0; i < this.paymentTableColumn.length; i += 6) {
          const column = [{
            label: 'Coupon Periods',
            prop: 'couponPeriods',
            width: 125
          }];
          column.push(...this.paymentTableColumn.slice(i, i + 6));
          columnArr.push(column);
        }
        for (let i = 0; i < this.paymentTableData.length; i += 6) {
          const data = [{
            couponPeriods: 'Timestamp'
          }];
          this.paymentTableData.slice(i, i + 6).forEach(v => {
            data[0][Object.keys(v)[0]] = v[Object.keys(v)[0]];
          });
          dataArr.push(data);
        }

        this.paymentTableList.forEach((v, k) => {
          v.tableColumn = columnArr[k];
          v.tableData = dataArr[k];
        });
        const lastColumn = this.paymentTableList[this.paymentTableList.length - 1].tableColumn;
        this.paymentTableList[this.paymentTableList.length - 1].tableColumn[lastColumn.length - 1].label = lastColumn[lastColumn.length - 1].label + ' (Redemption)';
      }
      const dateList = this.detailData.callDateList;
      if (dateList && dateList.length) {
        for (let i = 0; i < Math.ceil(dateList.length / 6); i++) {
          this.callableTableList.push({
            tableColumn: [],
            tableData: []
          });
        }
        for (let i = 1; i <= dateList.length; i++) {
          this.callableTableColumn.push({
            label: i + '',
            prop: i + '',
            width: 155
          });
          this.callableTableData.push({
            [i]: dateList[i - 1]
          });
        }
        const columnArr = [];
        const dataArr = [];
        for (let i = 0; i < this.callableTableColumn.length; i += 6) {
          const column = [{
            label: 'Serial Number',
            prop: 'serialNumber',
            width: 125
          }];
          column.push(...this.callableTableColumn.slice(i, i + 6));
          columnArr.push(column);
        }
        for (let i = 0; i < this.callableTableData.length; i += 6) {
          const data = [{
            serialNumber: 'Timestamp'
          }];
          this.callableTableData.slice(i, i + 6).forEach(v => {
            data[0][Object.keys(v)[0]] = v[Object.keys(v)[0]];
          });
          dataArr.push(data);
        }
        this.callableTableList.forEach((v, k) => {
          v.tableColumn = columnArr[k];
          v.tableData = dataArr[k];
        });
        // const lastColumn = this.callableTableList[this.callableTableList.length - 1].tableColumn;
        // this.callableTableList[this.callableTableList.length - 1].tableColumn[lastColumn.length - 1].label = lastColumn[lastColumn.length - 1].label + ' (Redemption)';
      }
    }
  }
};
</script>

