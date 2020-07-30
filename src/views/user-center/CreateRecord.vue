<template>
  <div>
    <bread-crumbs :data="breadData"></bread-crumbs>
    <div class="main-container" v-loading="tableLoading">
      <div class="user-center">
        <div class="userCenter-titile">User Record</div>
        <search-bar
          class="searchBar"
          :nosort="true"
          @handleSelStatus="handleSelStatus"
          @handleKeyWord="handleKeyWord"
          :keyWordPlaceholder="'Name / Email'"
        >
          <template v-slot:append>
            <el-select v-model="searchParam.roleNo" @change="accountRoleChange">
              <el-option v-for="(v, k) in selData" :key="k"
                :label="v.label"
                :value="v.value"
              ></el-option>
            </el-select>
            <el-select v-model="searchParam.registerStatus" @change="accountStatusChange">
              <el-option v-for="(v, k) in selDataAno" :key="k"
                :label="v.label"
                :value="v.value"
              ></el-option>
            </el-select>
          </template>
        </search-bar>
        <element-table :columns="columns" :data="data"
          pager :pageTotal="pageTotal" :pageIndex="searchParam.page" @handleChangePage="handleChangePage">
          <template v-slot:edit="{row}">
            <span  @click="goDetail(row)" v-permissions="'organization.account.details'" style="color:#214285;cursor: pointer;">Details</span>
          </template>
          <template v-slot:registerStatus="{row}">
            <span style="color:#F1A22B;" v-if="row.registerStatus === 0">Process</span>
            <span style="color:#52B88F;" v-else-if="row.registerStatus === 1">Success</span>
            <span style="color:#E6471F;" v-else-if="row.registerStatus === 2">Fail</span>
          </template>
        </element-table>
      </div>
    </div>
  </div>
</template>
<script>
import BreadCrumbs from '@/components/BreadCrumbs.vue';
import SearchBar from '@components/SearchBar.vue';
import ElementTable from '@components/ElementTable.vue';
import { roleQuery, userRecordList } from '@/api/account';
import { formatDate } from '@/common/util.js';

export default {
  name: 'CreateRecord',
  data () {
    return {
      breadData: [{
        name: 'Org Centre',
        to: '/userCenter'
      }, {
        name: 'User Record'
      }],
      selDataAno: [{
        value: '',
        label: 'All Status'
      }, {
        value: '0',
        label: 'Process'
      }, {
        value: '1',
        label: 'Success'
      }, {
        value: '2',
        label: 'Fail'
      }],
      selData: [{
        value: '',
        label: 'All Roles'
      }],
      searchParam: {
        page: 1,
        searchValue: '',
        registerStatus: '',
        roleNo: ''
      },
      pageTotal: 0,
      tableLoading: false,
      data: [],
      roles: [],
      columns: [
        {
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
          prop: 'registerStatus',
          label: 'Status',
          isSlot: true
        }, {
          prop: 'createAt',
          label: 'Creation Timestamp',
          formatter: (row, column, cellValue, index) => {
            return cellValue ? formatDate(cellValue, 'YYYY-MM-DD HH:mm:ss') : '--';
          }
        }, {
          prop: 'updateAt',
          label: 'Updated Timestamp',
          formatter: (row, column, cellValue, index) => {
            return cellValue ? formatDate(cellValue, 'YYYY-MM-DD HH:mm:ss') : '--';
          }
        }, {
          prop: 'edit',
          label: 'operation',
          align: 'center',
          isSlot: true
        }
      ]
    };
  },
  methods: {
    goDetail (row) {
      this.$router.push({
        name: 'UserDetails',
        query: {
          userNo: row.userNo
        }
      });
    },
    handleClick (menu) {
      this.searchParam.roleNo = menu.key;
      this.getUserRecordList();
    },
    handleSelStatus (state) {
      this.searchParam.roleNo = state;
      this.getUserRecordList();
    },
    handleKeyWord (keyword) {
      this.searchParam.searchValue = keyword;
      this.getUserRecordList();
    },
    accountStatusChange () {
      this.getUserRecordList();
    },
    accountRoleChange () {
      this.getUserRecordList();
    },
    handleChangePage (page) {
      this.searchParam.page = page;
      this.getUserRecordList();
    },
    async getUserRecordList () {
      this.tableLoading = true;
      const data = await userRecordList({
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
    },
    async getRoleQuery () {
      const data = await roleQuery();
      if (data.code === '1000') {
        this.roles = data.data;
        let arr = this.roles.map(el => {
          return {
            label: el.name,
            value: el.roleNo
          };
        });
        this.selData = [...this.selData, ...arr];
      } else {
        this.$message.error(data.msg);
      }
    }
  },
  components: {
    'bread-crumbs': BreadCrumbs,
    'search-bar': SearchBar,
    'element-table': ElementTable
  },
  mounted () {
    this.getRoleQuery();
    this.getUserRecordList();
  }
};
</script>

<style lang="scss" scoped>
.user-center {
  .userCenter-titile{
    padding-bottom: 20px;
    font-family: PingFangSC-Semibold;
    font-size: 24px;
    color: #001f3b;
    line-height: 28px;
  }
  .userCenter-top {
    padding-bottom: 20px;
    .userCenter-topOne {
      width: 357px;
      height: 40px;
      border-radius: 8px;
      .el-input__inner {
        border: 1px solid #dddfe7;
      }
    }
    .userCenter-topSec {
      margin: 0 30px;
    }
  }
  .userCenter-table {
  }
}
</style>
