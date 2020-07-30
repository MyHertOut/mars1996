<template>
  <div v-loading="tableLoading">
    <simplesub-header ref="userCenterRef" :menus="subMenus" @handleClick="handleClick">
      <template v-slot:btns>
        <el-button plain @click="$router.push({path: '/userCenter/createRecord'})" v-permissions="'organization.userRocord.list'">User Record</el-button>
        <el-button type="primary" class="btn-light" @click="$router.push({path: '/userCenter/createUser'})" v-permissions="'organization.account.add'">Create User</el-button>
      </template>
    </simplesub-header>
    <div class="main-container">
      <search-bar
        class="searchBar"
        :selData="selData"
        :nosort="true"
        @handleSelStatus="handleSelStatus"
        @handleKeyWord="handleKeyWord"
        :keyWordPlaceholder="'Name / Email'"
      >
        <template v-slot:append>
          <el-select v-model="searchParam.accountStatus" @change="accountStatusChange">
            <el-option v-for="(v, k) in selData" :key="k"
              :label="v.label"
              :value="v.value"
            ></el-option>
          </el-select>
        </template>
      </search-bar>
      <element-table :columns="columns" :data="data"
        pager :pageTotal="pageTotal" :pageIndex="searchParam.page" @handleChangePage="handleChangePage">
        <template v-slot:edit="{row}">
          <span @click="goDetail(row)" v-permissions="'organization.account.details'" style="color:#214285;cursor: pointer;">Details</span>
        </template>
        <template v-slot:accountStatus="{row}">
          <span style="color:#E6471F;" v-if="!row.accountStatus">Disable</span>
          <span style="color:#52B88F;" v-else>Active</span>
        </template>
      </element-table>
    </div>
  </div>
</template>

<script>
import SearchBar from '@components/SearchBar.vue';
import ElementTable from '@components/ElementTable.vue';
import SimpleSubHeader from '@components/SimpleSubHeader.vue';
import { accountUserList } from '@/api/account';
import { formatDate } from '@/common/util.js';

export default {
  name: 'UserCenter',
  data () {
    return {
      subMenus: [{
        name: 'Issuer',
        key: '2',
        permissions: 'organization.user.list'
      }, {
        name: 'Investor',
        key: '3',
        permissions: 'organization.user.list'
      }, {
        name: 'Master',
        key: '1',
        permissions: 'organization.user.list'
      }],
      selData: [{
        value: '',
        label: 'All'
      }, {
        value: '0',
        label: 'Disable'
      },
      {
        value: '1',
        label: 'Active'
      }],
      searchParam: {
        page: 1,
        roleNo: '2',
        searchValue: '',
        accountStatus: ''
      },
      pageTotal: 0,
      tableLoading: false,
      data: [],
      columns: [{
        prop: 'userId',
        label: 'UserID'
      }, {
        prop: 'accountName',
        label: 'Name'
      }, {
        prop: 'email',
        label: 'Email'
      }, {
        prop: 'roles',
        label: 'Role'
      }, {
        prop: 'accountStatus',
        label: 'Status',
        isSlot: true
      }, {
        prop: 'createAt',
        label: 'Timestamp',
        formatter: (row, column, cellValue, index) => {
          return cellValue ? formatDate(cellValue, 'YYYY-MM-DD HH:mm:ss') : '--';
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
    menuKey () {
      return this.$route.query.menuKey;
    }
  },
  methods: {
    accountStatusChange () {
      this.getAccountList();
    },
    handleClick (menu) {
      this.searchParam.roleNo = menu.key;
      this.getAccountList();
    },
    handleSelStatus (state) {
      this.searchParam.accountStatus = state;
      this.getAccountList();
    },
    handleKeyWord (keyword) {
      this.searchParam.searchValue = keyword;
      this.getAccountList();
    },
    goDetail (row) {
      this.$router.push({
        name: 'UserDetails',
        query: {
          roles: row.roles[0],
          userNo: row.userNo,
          menuKey: this.searchParam.roleNo
        }
      });
    },
    handleChangePage (page) {
      this.searchParam.page = page;
      this.getAccountList();
    },
    async getAccountList () {
      this.tableLoading = true;
      const data = await accountUserList({
        slient: true,
        data: {
          ...this.searchParam
        }
      });
      this.tableLoading = false;
      if (data.code === '1000') {
        this.data = data.data.data || [];
        const { count } = data.data;
        this.pageTotal = count || 0;
      }
    }
  },
  created () {
    this.$nextTick(() => {
      if (this.menuKey) {
        let activeIndex;
        let obj;
        if (this.menuKey === '3') {
          activeIndex = 1;
          obj = {
            name: 'Investor',
            key: '3'
          };
        } else if (this.menuKey === '1') {
          activeIndex = 2;
          obj = {
            name: 'Master',
            key: '1'
          };
        } else if (this.menuKey === '2') {
          activeIndex = 0;
          obj = {
            name: 'Issuer',
            key: '2'
          };
        }
        this.$refs.userCenterRef.handleClick(obj, activeIndex);
      } else {
        this.getAccountList();
      }
    });
  },
  components: {
    'search-bar': SearchBar,
    'element-table': ElementTable,
    'simplesub-header': SimpleSubHeader
  }
};
</script>
