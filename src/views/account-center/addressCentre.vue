<template>
  <div class="addressCentre-content">
    <search-bar class="searchBar" :nosort="true" @handleKeyWord="handleKeyWord" :keyWordPlaceholder="'Address Name / Address'">
      <template v-slot:append>
        <el-button v-permissions="'member.address.create'" class="addressCentreContent-TopBtn" @click="addWallet = true">Create Address</el-button>
      </template>
    </search-bar>
    <element-table
      :columns="columns"
      :data="data"
      v-loading="tableLoading"
      pager
      :pageTotal="pageTotal"
      :pageIndex="searchParam.page"
      @handleChangePage="handleChangePage"
    >
      <template v-slot:addressTag="{row}">
        <span>{{row.addressTag}}</span>
      </template>
      <template v-slot:default="{row}">
        <div class="addressCentre-addressTag">
          <div class="addressCentre-Default" v-if="row.label">Default</div>
        </div>
      </template>
      <template v-slot:address="{row}">
        <div class="addressCentre-address">
          <span>{{row.address}}</span>
        </div>
      </template>
      <template v-slot:copy="{row}">
        <div class="addressCentre-address">
          <div
            class="operation"
            v-clipboard:copy="row.address"
            v-clipboard:success="copySuccess"
            v-clipboard:error="copyError"
          >
            <img src="@/assets/images/copy.png" alt />
          </div>
        </div>
      </template>
      <template v-slot:addressType="{row}">
        <span v-if="row.type === 1">Institutional</span>
        <span v-else-if="row.type === 0">Individual</span>
        <span v-else>--</span>
      </template>
      <template v-slot:edit="{row}">
        <div class="addressCentre-edit">
          <span @click="goAsstesBalance(row)">Balance</span>
          <span
            v-if="row.kycStatus === 0"
            style="margin-left: 16px; color: #ccc; cursor: auto;width:110px;text-align: center;"
          >In Progress</span>
          <span
            v-else-if="row.kycStatus === 1"
            style="margin-left: 16px;width:110px;text-align: center;cursor: pointer;"
            @click="showKycdialog(row)"
          >View Identity</span>
          <span
            v-else-if="row.kycStatus === 2"
            style="margin-left: 16px; color: #E6471F; cursor: auto;width:110px;text-align: center;"
          >Fail</span>
          <div
            v-else-if="!row.bdId"
            class="addressCentre-Btn"
            @click="showKycdialog(row)"
            v-permissions="'member.identity.create'"
          >Add Identity</div>
        </div>
      </template>
    </element-table>
    <!-- Add -->
    <el-dialog title="Add Wallet Lists" :visible.sync="addWallet" width="770px" custom-class="add-addressForm">
      <el-form
        :model="addForm"
        :rules="addRules"
        ref="addRuleForm"
        label-width="140px"
        class="add-ruleForm"
        label-position="left"
      >
        <el-form-item label="Wallet Label:" prop="addWalletAddreass">
          <el-input placeholder="Enter the address name, up to 20  characters." v-model.trim="addForm.addWalletAddreass" maxlength="20" style="width: 360px;"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="addWalletItem">Done</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import SearchBar from '@components/SearchBar.vue';
import ElementTable from '@components/ElementTable.vue';
// import { formatDate } from '@/common/util.js';
import { getWalletAddress, walletListQuery } from '@/api/account';
import { notify } from '@/common/util';
import { Loading } from 'element-ui';
import { mapGetters } from 'vuex';

export default {
  props: {
    activeIndex: {
      default: '1',
      type: String
    }
  },
  data () {
    return {
      addWallet: false,
      addForm: {
        addWalletAddreass: ''
      },
      addRules: {
        addWalletAddreass: [
          { required: true, trigger: 'blur', message: 'This field is required.' },
          {
            validator: (rule, value, callback) => {
              if (value && value.length < 2) {
                callback(new Error('Min 2 Characters'));
                return;
              }
              callback();
            },
            trigger: 'blur'
          }
        ]
      },
      searchParam: {
        page: 1,
        address: ''
      },
      pageTotal: 0,
      tableLoading: false,
      data: [],
      columns: [{
        prop: 'addressTag',
        label: 'Address Name',
        isSlot: true
      }, {
        prop: 'default',
        isSlot: true,
        width: '105px'
      }, {
        prop: 'address',
        label: 'Address',
        formatter: (row, column, cellValue, index) => {
          const url = this.browserAddressUrl(cellValue);
          return cellValue ? <a class="link-txt" href={url} target="_blank">{cellValue}</a> : '--';
        }
      }, {
        prop: 'copy',
        isSlot: true
      }, {
        prop: 'addressType',
        label: 'Address Type',
        isSlot: true
      }, {
        prop: 'edit',
        label: 'Operation',
        align: 'left',
        isSlot: true
      }]
    };
  },
  computed: {
    ...mapGetters(['userInfo']),
    browserUrl () {
      return this.$store.state.common.systemConfig.blockBrowserUrl;
    }
  },
  methods: {
    goAsstesBalance (val) {
      this.$router.push({
        path: 'myAssets',
        query: {
          address: val.address
        }
      });
    },
    browserAddressUrl (id) {
      const url = this.browserUrl;
      return url ? `${url}/#/addressDetail?address=${id}` : '';
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
    handleKeyWord (keyword) {
      this.searchParam.address = keyword;
      this.queryWallet();
    },
    handleChangePage (page) {
      this.searchParam.page = page;
      this.queryWallet();
    },
    async queryWallet () {
      this.tableLoading = true;
      const data = await walletListQuery({
        slient: true,
        notify: notify.error,
        data: { ...this.searchParam, userNo: this.userInfo.userNo }
      });
      this.tableLoading = false;
      if (data.code === '1000') {
        this.data = data.data.data;
        const { count } = data.data;
        this.pageTotal = count || 0;
      }
    },
    addWalletItem () {
      this.$refs.addRuleForm.validate(async valid => {
        if (valid) {
          const loadingInstance = Loading.service();
          const addressData = await getWalletAddress({
            slient: true,
            data: {
              addressTag: this.addForm.addWalletAddreass
            }
          });
          if (addressData.code === '1000') {
            // const obj = {
            //   addressTag: this.addForm.addWalletAddreass,
            //   label: false,
            //   status: 1,
            //   address: addressData.data,
            //   bdId: null
            // };
            // this.data.push(obj);
            this.addForm.addWalletAddreass = '';
            this.addWallet = false;
            this.$nextTick(() => {
              loadingInstance.close();
            });
            this.queryWallet();
          }
        }
      });
    },
    showKycdialog (v) {
      let data = {
        menuKey: this.activeIndex,
        currentKycItem: v
      };
      this.$router.push({
        path: '/account-center/address-kyc',
        query: {
          data: JSON.stringify(data)
        }
      });
    }
  },
  created () {
    this.queryWallet();
  },
  components: {
    'search-bar': SearchBar,
    'element-table': ElementTable
  }
};

</script>

<style lang="scss">
.addressCentre-content {
  padding: 30px 30px;
  .bar-left {
    width: 100%;
  }
  .addressCentreContent-TopBtn {
    width: 170px;
    height: 40px;
    line-height: 40px;
    padding: 0 20px;
    float: right;
    border-radius: 8px;
    font-size: 14px;
    background: #214285;
    color: #ffffff !important;
    border: none;
  }
  .addressCentre-edit {
    display: flex;
    align-items: center;
    justify-content: center;
    > span {
      font-size: 14px;
      color: #214285;
      cursor: pointer;
      height: 23px;
      // &:hover{
      //   color: #497EB9;
      //   border-bottom: 1px solid #497EB9;
      // }
    }
    .addressCentre-Btn {
      width: 110px;
      height: 32px;
      line-height: 32px;
      text-align: center;
      background: #214285;
      border-radius: 8px;
      font-size: 14px;
      color: #ffffff;
      margin-left: 10px;
      cursor: pointer;
      border: none;
    }
  }
  .addressCentre-address {
    display: flex;
    align-items: center;
    .operation {
      width: 14px;
      display: flex;
      align-items: center;
      cursor: pointer;
      > img {
        width: 100%;
      }
    }
  }
  .addressCentre-addressTag {
    display: flex;
    align-items: center;
    justify-content: space-between;
    > span {
      font-size: 14px;
      color: #1791fc;
      cursor: pointer;
    }
    .addressCentre-Default {
      width: 70px;
      height: 28px;
      line-height: 28px;
      opacity: 0.89;
      background: #dfe9fa;
      border-radius: 6px;
      text-align: center;
    }
    .addressCentre-Btn {
      width: 110px;
      height: 32px;
      line-height: 32px;
      text-align: center;
      background: #214285;
      border-radius: 8px;
      font-size: 14px;
      color: #ffffff;
      cursor: pointer;
    }
  }
  .el-dialog__wrapper {
    .add-addressForm{
      .el-dialog__header {
        padding-left: 55px;
        padding-top: 30px;
        .el-dialog__title {
          color: #001F3B;
          font-size: 26px;
        }
      }
      .el-dialog__body {
        padding-left: 55px;
        padding-top: 35px;
        .el-row {
          .el-input__inner {
            color: #192231;
          }
        }
      }
      .dialog-footer {
        margin-top: 40px;
        text-align: center;
        margin-bottom: 20px;
        button {
          width: 300px;
          height: 40px;
        }
      }
    }
  }
}
</style>
