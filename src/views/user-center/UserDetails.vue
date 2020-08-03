<template>
  <div>
    <bread-crumbs :data="breadData"></bread-crumbs>
    <div class="main-container" style="padding:0;">
      <div class="UserDetails">
        <div class="UserDetails-basdInfo">
          <div class="basdInfo-title">
            <span>General Information</span>
            <div class="basdInfo-titleBtn" v-if="emailStatus === 0 ? true:false" v-permissions="'organization.account.email'">
               <el-button type="primary" v-if="!isSendEmail"  :loading="isLoadingEmail"  @click="sendEmail">Email Active</el-button>
               <el-button type="primary" disabled v-else>Retry in {{emailCountdown}}s</el-button>
            </div>
          </div>
          <div class="basdInfo-content" v-loading="loading">
            <div class="content-item">
              <div class="contentItem-label">Name:</div>
              <div class="contentItem-info">{{beforeData.name}}</div>
            </div>
            <div class="content-item">
              <div class="contentItem-label">Email:</div>
              <div class="contentItem-info">{{beforeData.email}}</div>
            </div>
            <div class="content-item">
              <div class="contentItem-label">User ID:</div>
              <div class="contentItem-info">{{beforeData.userId}}<span class="operation" v-clipboard:copy="beforeData.userId" v-clipboard:success="copySuccess" v-clipboard:error="copyError"><img src="@/assets/images/copy.png" alt=""></span></div>
            </div>
            <div class="content-item">
              <div class="contentItem-label">Role:</div>
              <div class="contentItem-info">{{beforeData.roles}}<span v-permissions="'organization.account.role'" @click="editRoleFn" class="operation"><img src="@/assets/images/edit.png" alt=""></span></div>
            </div>
            <div class="content-item">
              <div class="contentItem-label">Organisation:</div>
              <div class="contentItem-info">{{beforeData.merchantName}}</div>
            </div>
            <div class="content-item">
              <div class="contentItem-label">Org ID:</div>
              <div class="contentItem-info">{{beforeData.merchantNo}}</div>
            </div>
            <div class="content-item">
              <div class="contentItem-label">Status:</div>
              <div class="contentItem-info">
                <span style="color:#E6471F;" v-if="beforeData.accountStatus === 0">Disable</span>
                <span style="color:#52B88F;" v-else-if="beforeData.accountStatus === 1">Active</span>
                <span class="operation" v-permissions="'organization.account.status'" @click="editStatusFn"><img src="@/assets/images/edit.png" alt=""></span>
              </div>
            </div>
          </div>
        </div>
        <div class="UserDetails-table">
          <div class="list-title">Record History</div>
          <element-table :columns="columns" :data="data" v-loading="tableLoading"
            pager :pageTotal="pageTotal" :pageIndex="searchParam.page" @handleChangePage="handleChangePage">
            <template v-slot:operateStatus="{row}">
              <span style="color:#FF9A00;" v-if="row.operateStatus === 0">In Progress</span>
              <span style="color:#52B88F;" v-else-if="row.operateStatus === 1">Success</span>
              <span style="color:#E6471F;" v-else-if="row.operateStatus === 2">Failed</span>
            </template>
          </element-table>
        </div>
      </div>
    </div>
    <!-- edit role -->
    <el-dialog v-loading="editRoleLoading" custom-class="editRoleForm" title="Edit Role" width="630px" @close="roleClose('roleForm')" :visible.sync="editRoledialogVisible">
      <el-form :model="roleForm" :rules="roleRules" ref="roleForm">
        <div class="role-label">Role:</div>
        <el-form-item prop="roles">
          <el-radio-group v-model="roleForm.roles">
            <el-radio v-for="(v, k) in roleArr" :key="k" :label="v.roleNo">{{v.name}}</el-radio>
          </el-radio-group>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button class="editRoleBtn" type="primary" @click="editRoleSubmit('roleForm')">Submit</el-button>
      </div>
    </el-dialog>
    <!-- edit status -->
    <el-dialog v-loading="editStatusLoading" custom-class="editStatusForm" title="Edit Status" width="630px" @close="statusClose('statusForm')" :visible.sync="editStatusdialogVisible">
      <el-form :model="statusForm" :rules="statusRules" ref="statusForm">
        <div class="role-label">Status:</div>
        <el-form-item prop="roles">
          <el-radio-group v-model="statusForm.status">
            <el-radio :label="0">Disable</el-radio>
            <el-radio :label="1">Active</el-radio>
          </el-radio-group>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button class="editRoleBtn" type="primary" @click="editStatusSubmit('statusForm')">Submit</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import BreadCrumbs from '@/components/BreadCrumbs.vue';
import ElementTable from '@components/ElementTable.vue';
import { roleLogList, getAccountDetailInfo, roleQuery, changeRoles, updateUserStatus, sendActivateEmail } from '@/api/account';
import { formatDate } from '@/common/util.js';
import { notify } from '@/common/util';

export default {
  name: 'UserDetails',
  inject: ['reload'],
  data () {
    return {
      editRoledialogVisible: false,
      editRoleLoading: false,
      roleForm: {
        roles: ''
      },
      roleRules: {
        roles: [{ required: true, message: 'This field is required.', trigger: 'change' }]
      },
      roleArr: [],
      editStatusdialogVisible: false,
      editStatusLoading: false,
      statusForm: {
        status: ''
      },
      statusRules: {
        status: [{ required: true, message: 'This field is required.', trigger: 'change' }]
      },
      breadData: [],
      searchParam: {
        page: 1
      },
      pageTotal: 0,
      loading: false,
      tableLoading: false,
      beforeData: [],
      data: [],
      columns: [{
        prop: 'updateAt',
        label: 'Timestamp',
        formatter: (row, column, cellValue, index) => {
          return cellValue ? formatDate(cellValue, 'YYYY-MM-DD HH:mm:ss') : '--';
        }
      }, {
        prop: 'operateLog',
        label: 'Actions'
      }, {
        prop: 'createBy',
        label: 'Operator'
      }, {
        prop: 'operateStatus',
        label: 'Status',
        isSlot: true
      }],
      emailStatus: 1,
      isLoadingEmail: false,
      emailTimer: null,
      isSendEmail: false,
      emailCountdown: 60
    };
  },
  computed: {
    roles () {
      return this.$route.query.roles;
    },
    userNo () {
      return this.$route.query.userNo;
    },
    menuKey () {
      return this.$route.query.menuKey;
    }
  },
  methods: {
    async sendEmail () {
      this.isLoadingEmail = true;
      const data = await sendActivateEmail({
        params: {
          email: this.beforeData.email
        },
        slient: true,
        notify: notify.any
      });
      this.isLoadingEmail = false;
      if (data.code === '1000') {
        this.isSendEmail = true;
        this.emailTimer = setInterval(() => {
          if (!this.isSendEmail || this.emailCountdown === 0) {
            this.isSendEmail = false;
            clearInterval(this.emailTimer);
            this.emailCountdown = 60;
          } else {
            this.emailCountdown--;
          }
        }, 1000);
      }
    },
    // 编辑角色
    editRoleFn () {
      this.getRoleQuery();
      this.editRoledialogVisible = true;
    },
    roleClose (formName) {
      this.$refs[formName].resetFields();
      this.editRoledialogVisible = false;
    },
    editRoleSubmit (formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          if (parseInt(this.beforeData.role[0].roleNo) === parseInt(this.roleForm.roles)) {
            this.$message.warning('No change operation currently exists.');
            return;
          }
          this.subChangeRoles(formName);
        } else {
          return false;
        }
      });
    },
    async subChangeRoles (formName) {
      this.editRoleLoading = true;
      const data = await changeRoles({
        slient: true,
        data: {
          plusFunctions: [this.roleForm.roles],
          minusFunctions: [this.beforeData.role[0].roleNo],
          userNo: this.userNo
        },
        notify: notify.any
      });
      if (data.code === '1000') {
        this.roleClose(formName);
        this.reload();
      } else {
        this.editRoleLoading = false;
      }
    },
    // 编辑状态
    editStatusFn () {
      this.editStatusdialogVisible = true;
      this.statusForm.status = this.beforeData.accountStatus;
    },
    statusClose (formName) {
      this.$refs[formName].resetFields();
      this.editRoledialogVisible = false;
    },
    editStatusSubmit (formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          if (parseInt(this.beforeData.accountStatus) === parseInt(this.statusForm.status)) {
            this.$message.warning('No change operation currently exists.');
            return;
          }
          this.subChangeStatus(formName);
        } else {
          return false;
        }
      });
    },
    async subChangeStatus (formName) {
      this.editStatusLoading = true;
      const data = await updateUserStatus({
        slient: true,
        notify: notify.any,
        data: {
          status: this.statusForm.status,
          userNo: this.userNo
        }
      });
      if (data.code === '1000') {
        this.statusClose(formName);
        this.reload();
      } else {
        this.editStatusLoading = false;
      }
    },
    copySuccess (e) {
      this.$message({
        type: 'success',
        message: 'Copy Success',
        customClass: 'copySuccess'
      });
    },
    copyError (e) {
      this.$message({
        type: 'error',
        message: 'Copy Failed',
        customClass: 'copyError'
      });
    },
    setBreadFn () {
      let breadData = [{
        name: 'Org Centre',
        to: '/userCenter'
      }, {
        name: 'User Record',
        to: '/userCenter/createRecord'
      }, {
        name: 'Details'
      }];
      if (this.roles) {
        let arr = [{
          name: 'Org Centre',
          to: '/userCenter'
        }, {
          name: this.menuKey === '1' ? 'Master' : (this.menuKey === '2' ? 'Issuer' : 'Investor'),
          to: `/userCenter?menuKey=${this.menuKey}`
        }, {
          name: 'Details'
        }];
        this.breadData = [...arr];
      } else {
        let arr = [{
          name: 'Org Centre',
          to: '/userCenter'
        }, {
          name: 'User Record',
          to: '/userCenter/createRecord'
        }, {
          name: 'Details'
        }];
        this.breadData = [...arr];
      }
      this.breadData = breadData;
    },
    handleChangePage (page) {
      this.searchParam.page = page;
      this.getRoleLogList();
    },
    async getRoleQuery () {
      this.editRoleLoading = true;
      const data = await roleQuery();
      if (data.code === '1000') {
        this.roleArr = data.data;
        this.roleForm.roles = this.beforeData.role[0].roleNo;
      } else {
        this.$message.error(data.msg);
      }
      this.editRoleLoading = false;
    },
    async getRoleLogList () {
      this.tableLoading = true;
      const data = await roleLogList({
        slient: true,
        data: {
          userNo: this.userNo,
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
    async queryBeforeData () {
      this.loading = true;
      const data = await getAccountDetailInfo({
        params: {
          userNo: this.userNo
        },
        slient: true,
        notify: notify.error
      });
      if (data.code === '1000') {
        this.beforeData = Object.assign({}, data.data);
        this.beforeData.roles = this.beforeData.role[0].roleName;
        this.emailStatus = this.beforeData.emailStatus;
      }
      this.loading = false;
    }
  },
  components: {
    'bread-crumbs': BreadCrumbs,
    'element-table': ElementTable
  },
  mounted () {
    this.$nextTick(() => {
      this.setBreadFn();
    });
    this.getRoleLogList();
    this.queryBeforeData();
  }
};
</script>

<style lang="scss">
.UserDetails{
  width: 100%;
  background: #f2f2f2;
  .UserDetails-basdInfo{
    height: 245px;
    background: #FFFFFF;
    box-shadow: 0 2px 28px 0 rgba(230,230,230,0.62);
    border-radius: 8px;
    border-radius: 8px;
    margin-bottom: 20px;
    padding: 30px 30px 0;
    .basdInfo-title{
      display: flex;
      justify-content: space-between;
      > span {
        font-size: 24px;
        color: #001F3B;
        line-height: 28px;
        padding-bottom: 30px;
      }
    }
    .basdInfo-content{
      display: flex;
      flex-wrap: wrap;
      .content-item{
        width: 25%;
        .contentItem-label{
          font-size: 14px;
          color: #616367;
          margin-bottom: 9px;
        }
        .contentItem-info{
          font-size: 14px;
          color: #001F3B;
          margin-bottom: 20px;
          > .operation {
            cursor: pointer;
            padding-left: 12px;
            position: relative;
            > img {
              width: 14px;
              position: absolute;
              top: 10%;
            }
          }
        }
      }
    }
  }
  .UserDetails-table{
    min-height: 280px;
    background: #FFFFFF;
    border-radius: 8px;
    border-radius: 8px;
    padding: 30px 30px 0;
    .list-title{
      font-size: 24px;
      color: #001F3B;
      line-height: 28px;
      margin-bottom: 40px;
    }
  }
}
</style>
