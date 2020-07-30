<template>
    <custom-table
      headTitleProp="name"
      rowKey="serialNo"
      :columns="columns"
      :datas="data"
      :pageParams="pageParams"
      @handleChangePage="handleChangePage"
    >
      <!-- <template v-slot:column-bar="{row}">
        <a :href="row.headTitle">处理中</a>
      </template> -->
      <template v-slot:couponRate="{ prop, row }">
        <span style="color: red;">{{ row[prop] }}%</span>
      </template>
    </custom-table>
</template>

<script>
// import { assetSecurityList } from '@api/distribution-center.js';
import CustomTable from '@components/CustomTable.vue';
import { formatDate, notify } from '@/common/util.js';

export default {
  name: 'BondsList',
  props: {
    data: {
      type: Array,
      default: () => []
    }
  },
  data () {
    return {
      // loading: false,
      // pageParams: {
      //   page: 1,
      //   limit: 1,
      //   total: 0
      // },
      columns: [{
        label: 'Asset Code',
        prop: 'code'
      }, {
        label: 'Coupon Period', // 期数
        prop: 'couponPeriods'
      }, {
        label: 'Issuance Time', // '发行时间',
        prop: 'createAt',
        formatter: (row, cellValue) => {
          return cellValue ? formatDate(cellValue) : '--';
        }
      }, {
        label: 'Issuance Quantity', // 发行数量
        prop: 'issuanceQuantity',
        formatter: (row, cellValue) => {
          return cellValue ? this.$options.filters.demicrometer(cellValue) : '--';
        }
      }, {
        label: 'Coupon Frequency', // 付息频率
        prop: 'couponFrequency'
      },
      {
        label: 'Maturity Date', // 到期时间
        prop: 'maturityDate',
        formatter: (row, cellValue) => {
          return cellValue ? formatDate(cellValue) : '--';
        }
      },
      {
        label: 'Annual Coupon Rate', // 年化利率
        prop: 'couponRate',
        slot: true
      }, {
        label: 'Disbursement Token', // 付息/回购币种
        prop: 'disbursementCode'
      }, {
        label: 'Redemption Date', // 回购时间
        prop: 'redemptionDate'
      }]
    };
  },
  components: {
    'custom-table': CustomTable
  },
  methods: {
    handleChangePage (page) {
      // this.pageParams.page = page;
      // this.getList();
    }
    // getList () {
    //   this.loading = true;
    //   assetSecurityList({
    //     data: {
    //       ...this.pageParams
    //     },
    //     notify: notify.error
    //   }).then(res => {
    //     this.loading = false;
    //     const { code, data } = res.data;
    //     if (code === '1000') {
    //       this.datas = data.data || [];
    //       this.pageParams.total = data.count || 0;
    //     }
    //   }).catch(() => {
    //     this.loading = false;
    //   });
    // }
  }
  // created () {
  //   this.getList();
  // }
};
</script>
