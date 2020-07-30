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
        <el-select v-model="searchParam.bussType" @change="typeChange">
          <el-option v-for="(v, k) in selDataType" :key="k" :label="v.label" :value="v.value"></el-option>
        </el-select>
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
      <template v-slot:assetType="{row}">
        <span v-if="row.assetType === 1">Bonds</span>
        <span v-else-if="row.assetType === 2">Digital Currency</span>
        <span v-else-if="row.assetType === 3">Certificate</span>
        <span v-else>--</span>
      </template>
      <template v-slot:bussType="{row}">
        <span v-if="row.bussType === 0">Issuance</span>
        <span v-if="row.bussType === 1">Coupon Payments</span>
        <span v-if="row.bussType === 2">Redemption</span>
        <span v-if="row.bussType === 3">Additional Issuance</span>
        <span v-if="row.bussType === 4">Transfer</span>
      </template>
      <template v-slot:status="{row}">
        <div class="status-text">
          <span :class="stateColor(row.status)">{{row.status | stateText}}</span>
          <el-popover
            v-if="row.status == 0 || row.status == 3"
            placement="top-start"
            trigger="hover"
            width="260"
            :content="row.errorMsg">
            <span class="list-icon icon-question" slot="reference">?</span>
          </el-popover>
        </div>
      </template>
    </element-table>
  </div>
</template>

<script>
import SearchBar from '@components/SearchBar.vue';
import ElementTable from '@components/ElementTable.vue';
import { tradeOrdeAddresses, balanceListOutTransfer } from '@/api/user-assets';
import { notify, formatDate } from '@/common/util.js';

export default {
  name: 'Deposit',
  data () {
    return {
      selData: [],
      selDataType: [{
        value: '',
        label: 'All'
      }, {
        value: '0',
        label: 'Issuance'
      }, {
        value: '1',
        label: 'Coupon Payments'
      }, {
        value: '2',
        label: 'Redemption'
      }, {
        value: '3',
        label: 'Additional Issuance'
      }, {
        value: '4',
        label: 'Transfer'
      }],
      searchParam: {
        bussType: '',
        keyword: '',
        userAddress: '',
        page: 1
      },
      pageTotal: 0,
      tableLoading: false,
      data: [],
      columns: [{
        prop: 'tokenCode',
        label: 'Asset Code'
      }, {
        prop: 'assetType',
        label: 'Asset Type',
        isSlot: true
      }, {
        prop: 'bussType',
        label: 'Trans Type',
        isSlot: true
      }, {
        prop: 'amount',
        label: 'Amount',
        formatter: (row, cellValue) => {
          return cellValue ? this.$options.filters.demicrometer(row.amount) : '--';
        }
      }, {
        prop: 'destinationAddress',
        label: 'Destination Address',
        width: '180px',
        formatter: (row, column, cellValue, index) => {
          const url = this.browserAddressUrl(cellValue);
          return cellValue ? <a class="link-txt" href={url} target="_blank">{cellValue}</a> : '--';
        }
      }, {
        prop: 'targetAddress',
        label: 'Source Address',
        formatter: (row, column, cellValue, index) => {
          const url = this.browserAddressUrl(cellValue);
          return cellValue ? <a class="link-txt" href={url} target="_blank">{cellValue}</a> : '--';
        }
      }, {
        prop: 'status',
        label: 'Status',
        isSlot: true
      }, {
        prop: 'lastTime',
        label: 'Timestamp',
        formatter: (row, column, cellValue, index) => {
          return cellValue ? formatDate(cellValue, 'YYYY-MM-DD HH:mm:ss') : '--';
        }
      }, {
        prop: 'txId',
        label: 'Operation',
        align: 'center',
        formatter: (row, column, cellValue, index) => {
          const url = this.browserTxIdUrl(cellValue);
          return cellValue ? <a class="link-txt" href={url} target="_blank">Details</a> : '--';
        }
      }]
    };
  },
  computed: {
    browserUrl () {
      return this.$store.state.common.systemConfig.blockBrowserUrl;
    }
  },
  filters: {
    stateText (value) {
      let text;
      switch (value) {
        // 0: Sign Failed, 3: Failed
        case 0:
        case 3:
          text = 'Failed';
          break;
        case 1: // Pending
          text = 'In Progress';
          break;
        case 2: // Success
          text = 'Success';
      }
      return text;
    }
  },
  methods: {
    browserTxIdUrl (id) {
      const url = this.browserUrl;
      return url ? `${url}/#/txidDetails?id=${id}` : '';
    },
    browserAddressUrl (id) {
      const url = this.browserUrl;
      return url ? `${url}/#/addressDetail?address=${id}` : '';
    },
    stateColor (state) {
      let color;
      switch (state) {
        // 0: Sign Failed, 3: Failed
        case 0:
        case 3:
          color = 'rejected';
          break;
        case 1: // Pending
          color = 'padding';
          break;
        case 2: // Success
          color = 'success';
      }
      return color;
    },
    typeChange () {
      this.getListData();
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
        this.searchParam.userAddress = this.defaultAddress.address;
      }
      // 根据地址获取列表
      this.getListData();
    },
    getListData () {
      this.tableLoading = true;
      balanceListOutTransfer({
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
