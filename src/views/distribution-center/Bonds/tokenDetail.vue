<template>
  <div class="token-detail">
    <!-- <el-breadcrumb separator-class="el-icon-arrow-right" class="view-breadcrumb">
      <el-breadcrumb-item>Issuance</el-breadcrumb-item>
      <el-breadcrumb-item :to="{ name: $route.query.href }">{{$route.query.name}}</el-breadcrumb-item>
      <el-breadcrumb-item v-if="$route.query.state !== undefined">Details</el-breadcrumb-item>
      <el-breadcrumb-item v-else>Preview</el-breadcrumb-item>
    </el-breadcrumb> -->
    <div class="view-content" v-loading="loading">
      <!-- <p class="headlines" v-if="$route.query.state !== undefined">Details</p>
      <p class="headlines" v-else>Preview</p> -->
      <div class="view-item">
        <!-- <p class="head-title">Issuance Information</p> -->
        <el-row :gutter="20">
          <el-col :span="5"><div class="sub-title">Token Type：</div></el-col>
          <el-col :span="7"><div class="grid-content">{{tokenTypeDesc(info.type)}}</div></el-col>
          <el-col :span="5"><div class="sub-title">Currency：</div></el-col>
          <el-col :span="7"><div class="grid-content">{{info.benchmark}}</div></el-col>
        </el-row>
        <!-- <el-row :gutter="20">
          <el-col :span="5"><div class="sub-title">SMT Code：</div></el-col>
          <el-col :span="8">
            <div :class="{'SMTA-item': $route.query.state !== undefined}" @click="isActiveSMTA = !isActiveSMTA">
              <span>{{info.smtCode}}</span>
              <i class="el-icon-arrow-down" :class="{'active': isActiveSMTA}" v-if="$route.query.state !== undefined"></i>
            </div>
          </el-col>
        </el-row> -->
        <!-- <div class="SMTA-table" :class="{'active-SMTA-table': isActiveSMTA}" v-if="$route.query.state !== undefined">
          <el-table :data="SMTAtableData" stripe style="width: 100%" border>
            <template v-for="(v, k) in SMTAtableColumn">
              <el-table-column
                :key="k"
                v-if="v.prop === 'voteRule'"
                :width="v.width"
                :prop="v.prop"
                :label="v.label">
                <template slot-scope="scope">
                  <span>{{voteRuleDesc(scope.row[v.prop])}}</span>
                </template>
              </el-table-column>
              <el-table-column
                :key="k"
                v-else-if="v.prop === 'functionType'"
                :width="v.width"
                :prop="v.prop"
                :label="v.label">
                <template slot-scope="scope">
                  <span>{{functionTypeDesc(scope.row[v.prop])}}</span>
                </template>
              </el-table-column>
              <el-table-column
                :key="k"
                v-else-if="v.prop === 'votePattern'"
                :width="v.width"
                :prop="v.prop"
                :label="v.label">
                <template slot-scope="scope">
                  <span>{{votePatternDesc(scope.row[v.prop])}}</span>
                </template>
              </el-table-column>
              <el-table-column
                v-else
                :key="k"
                :width="v.width"
                :prop="v.prop"
                :label="v.label">
              </el-table-column>
            </template>
          </el-table>
        </div> -->
        <el-row :gutter="20">
          <el-col :span="5"><div class="sub-title">Token Code：</div></el-col>
          <el-col :span="7"><div class="grid-content">{{info.code}}</div></el-col>
          <!-- <template v-if="info.type != 1">
            <el-col :span="5"><div class="sub-title">Currency：</div></el-col>
            <el-col :span="7"><div class="grid-content">{{info.benchmark}}</div></el-col>
          </template> -->
          <!-- <template v-else> -->
            <el-col :span="5"><div class="sub-title">Token Name：</div></el-col>
            <el-col :span="7"><div class="grid-content" style="word-wrap: break-word;word-break: keep-all;">{{info.name}}</div></el-col>
          <!-- </template> -->
        </el-row>
        <el-row :gutter="20">
          <el-col :span="5"><div class="sub-title">Issuance Quantity：</div></el-col>
          <el-col :span="7"><div class="grid-content">{{info.issuanceQuantity | demicrometer}}</div></el-col>
          <el-col :span="5"><div class="sub-title">Issuance name：</div></el-col>
          <el-col :span="7">
            <div class="grid-content">
              {{info.issuerName}}
            </div>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <!-- <template v-if="info.type != 1">
            <el-col :span="5"><div class="sub-title">Token Name：</div></el-col>
            <el-col :span="7"><div class="grid-content" style="word-wrap: break-word;word-break: keep-all;">{{info.benchmark}} {{info.name}}</div></el-col>
          </template> -->
          <el-col :span="5"><div class="sub-title">Issuance Address：</div></el-col>
          <el-col :span="7">
            <div class="grid-content">
              <a class="link-txt" :href="browserUrlAddress(info.issuanceAddress)" target="_blank">{{info.issuanceAddress}}</a>
            </div>
          </el-col>
        </el-row>
        <!-- <template v-if="$route.query.state == 4 && $route.query.type === 'View'  || $route.query.state == 5 && $route.query.type === 'View'">
          <p class="head-title">On-Chain Information</p>
          <el-row :gutter="20" v-if="$route.query.state == 4">
            <el-col :span="5"><div class="sub-title">Issue Date：</div></el-col>
            <el-col :span="18"><div class="grid-content">{{info.updateTime | dateFormat}}</div></el-col>
          </el-row>
          <el-row :gutter="20">
            <el-col :span="5"><div class="sub-title">TX ID：</div></el-col>
            <el-col :span="18">
              <div class="grid-content">
                <a class="link-txt" :href="getBrowserUrl(info.txId)" target="_blank">{{info.txId}}</a>
              </div>
            </el-col>
          </el-row>
          <el-row :gutter="20">
            <el-col :span="5"><div class="sub-title">Contract Address：</div></el-col>
            <el-col :span="18">
              <div class="grid-content">
                <a class="link-txt" :href="browserUrlAddress(info.contractAddress)" target="_blank">{{info.contractAddress}}</a>
              </div>
            </el-col>
          </el-row>
        </template> -->
        <!-- <template v-if="$route.query.type === 'Review'">
          <p class="head-title">Review Status</p>
          <el-row :gutter="20">
            <el-col :span="5"><div class="sub-title">Whether to pass：</div></el-col>
            <el-col :span="18">
              <el-radio v-model="reviewStatus" :label="true">Approval</el-radio>
              <el-radio v-model="reviewStatus" :label="false">Reject</el-radio>
            </el-col>
          </el-row>
        </template>
        <template v-else-if="$route.query.state === 'Rejected'">
          <p class="head-title">Review Status</p>
          <el-row :gutter="20">
            <el-col :span="5"><div class="sub-title">Whether to pass：</div></el-col>
            <el-col :span="18">
              <el-radio v-model="reviewStatus" :label="true" disabled>Approval</el-radio>
              <el-radio v-model="reviewStatus" :label="false" disabled>Reject</el-radio>
            </el-col>
          </el-row>
        </template>
        <div class="submit" v-if="$route.query.type === 'Review'">
          <el-button @click="$router.push({ name: $route.query.href })">Previous</el-button>
          <el-button type="primary">Next</el-button>
        </div> -->
        <div class="return-btn" v-if="$route.query.state !== undefined">
          <el-button type="primary" @click="$router.push({ name: $route.query.href })">Return</el-button>
        </div>
        <div class="submit" v-else>
          <el-button @click="$router.push({ name: 'DisBondsNewToken', query: { serialNo: $route.query.serialNo }})">Previous</el-button>
          <el-button type="primary" @click="secondPwdDialogVisible = true">Submit</el-button>
        </div>
      </div>
    </div>
     <common-dialog
      width="640px"
      :visible.sync="secondPwdDialogVisible"
      v-loading="secondaryPwdloading"
    >
      <el-form ref="secondPwdForm" :model="secondPwdForm" :rules="secondPwdRules"
        label-width="176px" label-position="left" @submit.native.prevent>
        <!-- <el-form-item label="Secondary Password：" prop="secondaryPassword">
          <el-input type="password"></el-input>
        </el-form-item> -->
        <el-form-item label="Secondary Password：" prop="secondaryPwd">
          <el-input v-model.trim="secondPwdForm.secondaryPwd" type="password"></el-input>
        </el-form-item>
      </el-form>
      <template v-slot:footers>
        <el-button type="primary" @click="handleSecondaryPwd" style="width: 100px;height:40px;">Submit</el-button>
      </template>
    </common-dialog>
  </div>
</template>
<script>
import md5 from 'md5';
import CommonDialog from '@/components/ElementDialog.vue';
import { getTokenReviewDetails, getStepTokenInfo, tokenSubmit } from '@/api/distribution-center';
import { notify, secondaryPwdReg } from '@/common/util';

export default {
  name: 'DisBondsTokenDetail',
  data () {
    return {
      secondPwdDialogVisible: false,
      secondaryPwdloading: false,
      isActiveSMTA: false,
      reviewStatus: true,
      SMTAtableColumn: [
        {
          label: 'Function Name',
          prop: 'functionName',
          width: 150
        }, {
          label: 'Function Type',
          prop: 'functionType'
        }, {
          label: 'SMTPM',
          prop: 'smtPm'
        }, {
          label: 'SMTPO',
          prop: 'smtPo'
        }, {
          label: 'Authorization Model',
          prop: 'votePattern',
          width: 160
        }, {
          label: 'Authorization Rule',
          prop: 'voteRule'
        }, {
          label: 'Authorization Organization',
          prop: 'voteDomains',
          width: 115
        }
      ],
      SMTAtableData: [],
      info: {},
      loading: false,
      secondPwdForm: {
        secondaryPwd: ''
      },
      secondPwdRules: {
        secondaryPwd: [
          { required: true, trigger: 'change', message: 'This field is required.' },
          {
            trigger: 'blur',
            validator: (rule, value, callback) => {
              if (!secondaryPwdReg.test(value)) {
                /* eslint-disable */
                callback('Password does not match the criteria');
                return;
              }
              callback();
            }
          }
        ]
      }
    };
  },
  computed: {
    bowserUrl () {
      return this.$store.state.common.systemConfig.blockBrowserUrl;
    }
  },
  watch: {
    secondPwdDialogVisible (val) {
      if (!val) {
        this.$refs.secondPwdForm.resetFields();
      }
    }
  },
  components: {
    'common-dialog': CommonDialog
  },
  created () {
    if (this.$route.query.state !== undefined) {
      this.getInfo();
    } else {
      this.getStepInfo();
    }
  },
  methods: {
    getBrowserUrl (id) {
      const url = this.bowserUrl;
      return url ? `${url}/#/txidDetails?id=${id}` : 'javascript:void(0);';
    },
    browserUrlAddress (id) {
      const url = this.bowserUrl;
      return url ? `${url}/#/addressDetail?address=${id}` : 'javascript:void(0);';
    },
    async handleSecondaryPwd () {
      this.$refs.secondPwdForm.validate(async valid => {
        if (!valid) return;
        const params = Object.assign({}, this.info);
        params.name = params.benchmark + params.name;
        this.secondaryPwdloading = true;
        const data = await tokenSubmit({
          data: {
            ...params,
            secondaryPwd: md5(this.secondPwdForm.secondaryPwd).toUpperCase(),
            // issuanceAddress: address,
            ownerAddress: params.issuanceAddress // address
          },
          notify: notify.any,
          slient: true
        }).catch(() => {
          this.secondaryPwdloading = false;
          this.secondPwdDialogVisible = false;
        });
        this.secondaryPwdloading = false;
        if (data.code === '1000') {
          this.$router.push({
            name: 'DisIssueTokenSubmitSuccess'
          });
        }
      });
    },
    // async next () {
    //   this.secondPwdDialogVisible = true;
    //   // this.loading = true;
    //   // const params = Object.assign({}, this.info);
    //   // params.name = params.benchmark + params.name;
    //   // const data = await tokenSubmit({ data: params, notify: notify.any, slient: true });
    //   // if (data.code === '1000') {
    //   //   this.$router.push({
    //   //     name: 'SettlementToken'
    //   //   });
    //   // }
    //   // this.loading = false;
    // },
    votePatternDesc (code) {
      const arr = ['Manual', 'Auto'];
      return arr[code];
    },
    functionTypeDesc (code) {
      const arr = ['Query', 'execution'];
      return arr[code];
    },
    voteRuleDesc (code) {
      if (code === 'ALL') {
        return 'All Voters Approved';
      } else if (code === 'ONE_SUCCESS' || code === 'ONE_VOTE_POLICY') {
        return '1 Voters';
      } else if (code === 'ASSIGN_DOMAIN') {
        return 'Designated';
      } else {
        return code;
      }
    },
    // async getSMTInfo () {
    //   const data = await getSMTDetail({
    //     smtCode: this.info.smtCode
    //   });
    //   this.SMTAtableData = data.data;
    // },
    tokenTypeDesc (type) {
      const arr = ['Certificate', 'Digital Currency'];
      return arr[parseInt(type)];
    },
    async getInfo () {
      this.loading = true;
      const data = await getTokenReviewDetails({ serialNo: this.$route.query.serialNo, notify: notify.error });
      if (data.code === '1000') {
        this.info = data.data;
        // this.getSMTInfo();
      }
      this.loading = false;
    },
    async getStepInfo () {
      this.loading = true;
      const data = await getStepTokenInfo({ serialNo: this.$route.query.serialNo, notify: notify.error });
      if (data.code === '1000') {
        this.info = data.data;
        // this.getSMTInfo();
      }
      this.loading = false;
    }
  }
};
</script>
<style scoped lang="scss">
.token-detail {
  // width: 1200px;
  margin: 0 auto;
  font-size: 16px;
  color: #192231;
  // margin-bottom: 117px;
  // .el-breadcrumb {
  //   height: 60px;
  //   display: flex;
  //   align-items: center;
  // }
  .view-content {
    border-radius: 4px;
    // padding: 30px;
    // background-color: #fff;
    // padding-left: 30px;
    width: 1000px;
    margin: 0 auto;
    .headlines {
      font-size: 28px;
      color: #001F3B;
    }
    .view-item {
      padding: 0 50px;
      .head-title {
        font-size: 20px;
        margin-bottom: 40px;
        font-weight: 600;
      }
      .sub-title {
        color: #8D93A1;
      }
      .el-row {
        margin-bottom: 24px;
      }
      .SMTA-item {
        cursor: pointer;
        span {
          margin-right: 20px;
        }
        i {
          transition: all .2s;
        }
        .active {
          transform: rotate(180deg);
        }
      }
      .SMTA-table {
        background-color: #F9FBFF;
        padding: 0px 11px 0px 13px;
        // margin-bottom: 24px;
        max-height: 0px;
        overflow: hidden;
        transition: max-height 1s, padding 1.2s, margin 1.2s;
      }
      .active-SMTA-table {
        margin-bottom: 24px;
        padding: 21px 11px 16px 13px;
        max-height: 1000px;
      }
      .document-list {
        &::after {
          content: '';
          display: block;
          width: 0px;
          height: 0px;
          clear: both;
        }
        .document-item {
          width: 260px;
          height: 150px;
          margin-right: 30px;
          margin-bottom: 30px;
          float: left;
          .document-item-title {
            padding: 10px 12px;
            font-size: 16px;
            height: 40px;
            color: #616266;
            background-color: #F9FBFF;
            border: 1px solid #EFF5FF;
            border-radius: 2px;
          }
          .document-item-img {
            height: 110px;
            img {
              width: 100%;
              height: 100%;
            }
          }
        }
      }
      .country-type {
        width: 1020px;
        height: 48px;
        border: 1px solid #EEF1F7;
        margin-bottom: 35px;
        &::after {
          display: block;
          width: 0px;
          height: 0px;
          clear: both;
        }
        & > .left {
          width: 183px;
          height: 100%;
          text-align: center;
          line-height: 48px;
          font-size: 14px;
          color: #8D93A1;
          float: left;
          border-right: 1px solid #EBEEF5;
        }
        & > .right {
          padding-left: 50px;
          line-height: 48px;
          height: 100%;
          width: 830px;
          font-size: 14px;
          float: left;
        }
      }
      .nationality-table {
        display: flex;
        margin-bottom: 30px;
        .nationality-left {
          width: 184px;
          display: flex;
          justify-content: center;
          align-items: center;
          font-size: 14px;
          color: #8D93A1;
          border: 1px solid #EEF1F7;
          border-right: 0px;
        }
      }
      .submit {
        width: 630px;
        margin: 0 auto;
        display: flex;
        justify-content: space-between;
        margin-top: 100px;
        margin-bottom: 30px;
        button {
          width: 300px;
          height: 40px;
          font-size: 20px;
          font-weight: normal;
          color: #2F39E3;
          &:focus {
            background-color: #fff;
          }
          & + button {
            color: #fff;
          }
        }
      }
      .return-btn {
        width: 630px;
        margin: 0 auto;
        margin-top: 100px;
        margin-bottom: 30px;
        text-align: center;
        button {
          width: 300px;
          height: 40px;
          font-size: 20px;
        }
      }
    }
  }
  .link-txt {
    color: #214285;
    &:hover {
      text-decoration: underline;
      color: #497EB9;
    }
  }
}
</style>
<style lang="scss">
.token-detail {
  .el-breadcrumb {
    .el-breadcrumb__item {
      .el-breadcrumb__inner.is-link {
        font-weight: normal;
        &:hover {
          color: #214285;
        }
      }
      .el-breadcrumb__inner {
        color: #8D93A1;
        margin-right: 16px;
      }
      .el-breadcrumb__separator {
        color: #C7CDDA;
        margin-right: 18px;
      }
    }
    .el-breadcrumb__item[aria-current=page] {
      .el-breadcrumb__inner {
        color: #214285;
      }
    }
  }
  .view-content {
    .view-item {
      .SMTA-table {
        .el-table__header {
          tr {
            th {
              background-color: #F9FBFF;
              &:first-child {
                .cell {
                  color: #8D93A1;
                  padding-left: 38px;
                }
              }
              .cell {
                font-size: 14px;
                color: #8D93A1;
                font-weight: normal;
                padding-left: 20px;
              }
            }
          }
        }
        .el-table__body {
          tr {
            td {
              &:first-child {
                .cell {
                  color: #8D93A1;
                  padding-left: 38px;
                }
              }
              .cell {
                font-size: 14px;
                color: #192231;
                padding-left: 20px;
              }
            }
          }
        }
      }
      .payment-date-table {
        margin-bottom: 25px;
        .el-table {
          .el-table__header {
            tr {
              th {
                &:first-child {
                  // background-color: #F9FBFF;
                }
                .cell {
                  font-size: 14px;
                  color: #8D93A1;
                  font-weight: normal;
                  padding-left: 17px;
                }
              }
            }
          }
          .el-table__body {
            tr {
              td {
                &:first-child {
                  // background-color: #F9FBFF;
                }
                .cell {
                  font-size: 14px;
                  color: #192231;
                  padding-left: 17px;
                }
              }
            }
          }
        }
      }
      .nationality-table {
        .el-table__header {
          tr {
            th {
              background-color: #F9FBFF;
              .cell {
                font-size: 14px;
                color: #8D93A1;
                font-weight: normal;
              }
            }
          }
        }
        .el-table__body {
          tr {
            td {
              .cell {
                font-size: 14px;
                color: #192231;
              }
            }
          }
        }
      }
      .el-table td {
        border-color: #EBEEF5 !important;
      }
    }
  }
}
</style>
