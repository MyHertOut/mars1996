<template>
  <div v-loading="tableLoading">
    <search-bar
      class="searchBar"
      :selData="selData"
      :nosort="true"
      @handleKeyWord="handleKeyWord"
      :keyWordPlaceholder="'Enter Asset Code / Asset Name'"
    >
      <template v-slot:append>
        <el-select class="addressSelect" v-model="searchParam.userAddress" @change="addressChange">
          <el-option v-for="(v, k) in selData" :key="k" :label="v.label" :value="v.value"></el-option>
        </el-select>
      </template>
    </search-bar>
    <element-table
      :columns="columns"
      :data="data"
      pager
      :pageTotal="pageTotal"
      :pageIndex="searchParam.page"
      @handleChangePage="handleChangePage"
    >
      <template v-slot:edit="{row}">
        <span class="link-txt" @click="goTransfer(row)">Transfer</span>
      </template>
    </element-table>
  </div>
</template>

<script>
import SearchBar from '@components/SearchBar.vue';
import ElementTable from '@components/ElementTable.vue';
import { tradeOrdeAddresses, tradeBalanceListSecurity } from '@/api/user-assets';
import { notify } from '@/common/util.js';

export default {
  name: 'Bonds',
  data () {
    return {
      selData: [],
      searchParam: {
        keyword: '',
        userAddress: '',
        page: 1
      },
      pageTotal: 0,
      tableLoading: false,
      data: [],
      columns: [{
        prop: 'securityCode',
        label: 'Asset Code'
      }, {
        prop: 'securityName',
        label: 'Asset Name'
      }, {
        prop: 'unusable',
        label: 'Not Available',
        formatter: (row, cellValue) => {
          return cellValue ? this.$options.filters.demicrometer(row.unusable) : '--';
        }
      }, {
        prop: 'amount',
        label: 'Available',
        formatter: (row, cellValue) => {
          return cellValue ? this.$options.filters.demicrometer(row.amount) : '--';
        }
      }, {
        prop: 'edit',
        label: 'Operation',
        align: 'center',
        isSlot: true
      }]
    };
  },
  computed: {
    queryAddress () {
      return this.$route.query.address;
    }
  },
  methods: {
    goTransfer (row) {
      let query = {
        menuKey: '0',
        info: row,
        defaultAddress: this.searchParam.userAddress,
        queryAddress: this.queryAddress
      };
      this.$router.push({
        path: '/myAssets/transferAccounts',
        query: {
          data: JSON.stringify(query)
        }
      });
    },
    addressChange () {
      this.getListData();
    },
    handleKeyWord (keyword) {
      this.searchParam.keyword = keyword;
      this.getListData();
    },
    handleChangePage (page) {
      this.searchParam.page = page;
      this.getListData();
    },
    // 未选择地址首次请求获取默认地址
    async getInitList () {
      this.tableLoading = true;
      const resAddress = await tradeOrdeAddresses().catch(() => {
        this.tableLoading = false;
      });
      const { data: addressData, code: addressCode } = resAddress.data;
      if (addressCode === '1000') {
        this.defaultAddress = (addressData || []).find(item => item.label) || {};
        let addressArr = addressData.map(el => {
          return {
            value: el.address,
            label: '【' + el.addressTag + '】' + el.address
          };
        });
        this.selData = [...addressArr];
        if (this.queryAddress) {
          this.searchParam.userAddress = this.queryAddress;
        } else {
          this.searchParam.userAddress = this.defaultAddress.address;
        }
      }
      // 根据地址获取列表
      this.getListData();
    },
    getListData () {
      this.tableLoading = true;
      tradeBalanceListSecurity({
        data: {
          ...this.searchParam
        },
        notify: notify.error
      }).then(res => {
        this.tableLoading = false;
        const { data, code } = res.data;
        if (code === '1000') {
          this.data = data.data || [];
          this.pageTotal = data.count || 0;
        }
      }).catch(() => {
        this.tableLoading = false;
      });
    }
  },
  mounted () {
    this.getInitList();
  },
  components: {
    'search-bar': SearchBar,
    'element-table': ElementTable
  }
};
</script>
