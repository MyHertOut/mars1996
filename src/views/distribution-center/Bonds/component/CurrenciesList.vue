<template>
   <custom-table :columns="columns" :datas="datas">
    <template v-slot:opbar="row">
        查看详情>
    </template>
    <template v-slot:column-bar="{row}">
        <a :href="row.headTitle">处理中</a>
    </template>
    <template v-slot:rate="{ prop, row }">
        <span style="color: red;">{{ row[prop] }}%</span>
    </template>
    </custom-table>
</template>

<script>
import CustomTable from '@components/CustomTable.vue';
import { formatDate } from '@/common/util.js';

export default {
  name: 'CurrenciesList',
  data () {
    return {
      datas: [{
        headTitle: 'Currency name',
        code: 'GATE',
        name: '名称名称',
        periods: 30,
        time: 1594173542725,
        quantity: 20000,
        rate: 5.14,
        frequency: '按月付息'
      }],
       columns: [{
        label: 'Asset Code',
        prop: 'code'
      }, {
        label: 'Issuance Quantity', // 期数
        prop: 'periods'
      }, {
        label: 'Issuance Time', // '发行时间',
        prop: 'time',
        formatter: (row, cellValue) => {
          return cellValue ? formatDate(cellValue) : '--';
        }
      }, {
        label: 'Currency',
        prop: 'quantity',
        formatter: (row, cellValue) => {
          return cellValue ? this.$options.filters.demicrometer(cellValue) : '--';
        }
      }, {
        label: 'Token Type',
        prop: 'frequency'
      }]
    };
  },
  components: {
    'custom-table': CustomTable
  }
};
</script>
