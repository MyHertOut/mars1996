<template>
  <div>
    <bread-crumbs :data="breadData"></bread-crumbs>
    <div class="main-container" v-loading="loading">
      <div class="kyc-edit">
        <div class="kyc-title">Wallet Type</div>
        <div
          class="title"
        >Please select the corresponding wallet type to append KYC information. Once submitted, both the wallet type and KYC information cannot no longer be changed.</div>
        <div class="kyc-type">
          <el-row>
            <el-col :offset="3" :span="4">
              <div class="kyc-typeLabel">Identity Type</div>
            </el-col>
            <el-col :span="14">
              <el-radio-group
                v-model="kycForm.nationality"
                :disabled="currentKycItem && currentKycItem.bdId !== null"
              >
                <el-radio :label="1">Institutional</el-radio>
                <el-radio :label="0">Individual</el-radio>
              </el-radio-group>
            </el-col>
          </el-row>
        </div>
        <template v-if="kycForm.nationality === 1">
          <el-row>
            <el-col :offset="3" :span="4">
              <div class="sub-title">Country of Incorporation</div>
            </el-col>
            <el-col :span="14">
              <div class="countrys">
                <div
                  class="countrys-select"
                  v-for="(v, k) in countryIncorporationItemList"
                  :key="k"
                  :style="(k + 1) % 3 === 0 ? 'margin-right: 0px;' : ''"
                >
                  <el-select
                    v-model="v.value"
                    filterable
                    :disabled="!v.isDefault || currentKycItem && currentKycItem.bdId !== null"
                    placeholder="Select Country"
                  >
                    <el-option
                      v-for="item in countryList"
                      :key="item.enName"
                      :label="item.enName"
                      :value="item.shortName"
                    ></el-option>
                  </el-select>
                </div>
              </div>
            </el-col>
          </el-row>
          <el-row>
            <el-col :offset="3" :span="4">
              <div class="sub-title">Country of Operation</div>
            </el-col>
            <el-col :span="14">
              <div class="countrys">
                <div
                  class="countrys-select"
                  v-for="(v, k) in countryOperationItemList"
                  :key="k"
                  :style="(k + 1) % 3 === 0 ? 'margin-right: 0px;' : ''"
                >
                  <el-select
                    v-model="v.value"
                    filterable
                    :disabled="!v.isDefault || currentKycItem && currentKycItem.bdId !== null"
                    placeholder="Select Country"
                  >
                    <el-option
                      v-for="item in countryList"
                      :key="item.enName"
                      :label="item.enName"
                      :value="item.shortName"
                    ></el-option>
                  </el-select>
                </div>
              </div>
            </el-col>
          </el-row>
        </template>
        <template v-else>
          <el-row v-if="!currentKycItem.kycStatus">
            <el-col :offset="3" :span="21">
              <div class="country-box">
                <div class="countrys nationality">
                  <el-row>
                    <div class="item-column">
                      <span class="label">Nationality：</span>
                      <el-select
                        v-model="nationalityItemObj.country"
                        filterable
                        :disabled="currentKycItem && currentKycItem.bdId !== null"
                        placeholder="Select Country"
                      >
                        <el-option
                          v-for="item in countryList"
                          :key="item.enName"
                          :label="item.enName"
                          :value="item.shortName"
                        ></el-option>
                      </el-select>
                    </div>
                    <div class="item-column">
                      <span class="label">Residency：</span>
                      <el-select
                        v-model="nationalityItemObj.residency"
                        filterable
                        :disabled="currentKycItem && currentKycItem.bdId !== null"
                        placeholder="Select Country"
                      >
                        <el-option
                          v-for="item in countryList"
                          :key="item.enName"
                          :label="item.enName"
                          :value="item.shortName"
                        ></el-option>
                      </el-select>
                    </div>
                  </el-row>
                  <el-row>
                    <div class="item-column">
                      <span class="label">Investor Type：</span>
                      <el-select
                        v-model="nationalityItemObj.investorType"
                        :disabled="currentKycItem && currentKycItem.bdId !== null"
                      >
                        <el-option
                          v-for="item in typeList"
                          :key="item.value"
                          :label="item.label"
                          :value="item.value"
                        ></el-option>
                      </el-select>
                    </div>
                    <div class="item-column">
                      <span class="label">Risk Tolerance：</span>
                      <el-select
                        v-model="nationalityItemObj.risk"
                        :disabled="currentKycItem && currentKycItem.bdId !== null"
                      >
                        <el-option
                          v-for="item in riskList"
                          :key="item.key"
                          :label="item.key"
                          :value="item.value"
                        ></el-option>
                      </el-select>
                    </div>
                  </el-row>
                </div>
                <div
                  v-if="!(currentKycItem && currentKycItem.bdId)"
                  class="add-country"
                  @click="addnationalityCountry"
                >
                  <img src="@/assets/images/add.png" width="24" height="24" alt="png" />
                </div>
              </div>
            </el-col>
          </el-row>
          <el-row>
            <el-col :offset="3" :span="20">
              <el-table :data="kycDialogIndividualData" max-height="260">
                <template slot="empty">
                <img style="padding-top:30px;" src="@/assets/images/address-empty.png" alt="nodata" class="address-empty" />
                </template>
                <template v-for="item in kycDialogIndividualColumn">
                <el-table-column
                    v-if="item.prop === 'edit'"
                    :key="item.prop"
                    :prop="item.prop"
                    :width="item.width"
                    :label="item.label"
                    :formatter="item.formatter"
                >
                    <template slot-scope="scope">
                    <img
                        v-if="!(currentKycItem && currentKycItem.bdId)"
                        class="row-reduce"
                        src="../../assets/images/dis-reduce.png"
                        @click="subtractnationalityCountry(scope.row, scope.$index)"
                        style="cursor: pointer;"
                        width="18"
                        height="18"
                        alt="png"
                    />
                    </template>
                </el-table-column>
                <el-table-column
                    v-else
                    :key="item.prop"
                    :prop="item.prop"
                    :width="item.width"
                    :label="item.label"
                    :formatter="item.formatter"
                ></el-table-column>
                </template>
            </el-table>
            </el-col>
          </el-row>
        </template>
        <div class="addressKycfooter">
          <el-button
            type="primary"
            @click="submitKyc"
            v-if="currentKycItem && currentKycItem.bdId === null"
            v-permissions="'member.identity.create'"
          >Submit</el-button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import BreadCrumbs from '@/components/BreadCrumbs.vue';
import { addKYC, queryRisk, queryCountry, getKycBeroreInfo } from '@/api/account';
import { notify } from '@/common/util';
import { Loading } from 'element-ui';
import { mapGetters } from 'vuex';

export default {
  name: 'CreateRecord',
  data () {
    return {
      breadData: [],
      kycForm: {
        nationality: 1
      },
      typeList: [{
        label: 'Retail',
        value: 1
      }, {
        label: 'Accredited',
        value: 2
      }],
      loading: false,
      riskList: [],
      countryList: [],
      nationalityItemObj: {
        country: '',
        investorType: 1,
        risk: '1',
        residency: ''
      },
      nationalityItemList: [{
        country: '',
        between: '+',
        investorType: 1,
        risk: 'NA',
        isDefault: true
      }],
      countryResidenceItemList: [{
        value: '',
        type: '+',
        isDefault: true
      }],
      countryIncorporationItemList: [{
        value: '',
        type: '+',
        isDefault: true
      }],
      countryOperationItemList: [{
        value: '',
        type: '+',
        isDefault: true
      }],
      searchTimer: null,
      kycDialogIndividualData: [],
      kycDialogIndividualColumn: [{
        prop: 'countryName',
        label: 'Nationality'
      }, {
        prop: 'residencyName',
        label: 'Residency'
      }, {
        prop: 'investorType',
        label: 'Investor Type',
        formatter: (row, column, cellValue, index) => {
          const obj = this.typeList.find(item => item.value === cellValue) || {};
          return obj.label;
        }
      }, {
        prop: 'risk',
        label: 'Risk Tolerance'
      }, {
        prop: 'edit',
        width: 100,
        label: ''
      }]
    };
  },
  computed: {
    ...mapGetters(['userInfo']),
    menuKey () {
      return JSON.parse(this.$route.query.data).menuKey;
    },
    currentKycItem () {
      return JSON.parse(this.$route.query.data).currentKycItem;
    }
  },
  methods: {
    async submitKyc () {
      let finData = [];
      if (this.kycForm.nationality) {
        finData = [{
          country: this.countryIncorporationItemList[0].value,
          residency: this.countryOperationItemList[0].value
        }];
      } else {
        finData = this.kycDialogIndividualData || [];
      }
      const params = {
        address: this.currentKycItem.address,
        type: this.kycForm.nationality,
        userNo: this.userInfo.userNo,
        nationality: finData
      };
      if (finData.length === 0) {
        this.$message({ message: 'Please select a kyc message', type: 'error' });
        return;
      }
      const loadingInstance = Loading.service();
      const data = await addKYC({
        data: params,
        slient: true,
        notify: notify.any
      });
      if (data.code === '1000') {
        this.$router.push({
          path: '/address-center',
          query: {
            menuKey: this.menuKey
          }
        });
      }
      this.$nextTick(() => {
        loadingInstance.close();
      });
    },
    async getCountries () {
      this.loading = true;
      const data = await queryCountry({
        slient: true
      });
      if (data.code === '1000') {
        this.loading = false;
        this.dealWithKyc(this.currentKycItem);
        this.countryList = data.data;
      }
    },
    async queryRisklevel () {
      const data = await queryRisk({
        slient: true
      });
      if (data.code === '1000') {
        this.riskList = data.data;
      }
    },
    async dealWithKyc (v) {
      if (v.bdId) {
        this.loading = true;
        const data = await getKycBeroreInfo({
          slient: true,
          params: {
            address: v.address
          }
        });
        if (data.code === '1000') {
          const resData = data.data || [];
          this.kycForm.nationality = resData[0] && resData[0].type;
          if (this.kycForm.nationality) {
            const obj = resData[0] || {};
            this.countryIncorporationItemList[0].value = obj.country;
            this.countryOperationItemList[0].value = obj.residency;
          } else {
            resData.forEach(val => {
              let countryObj = this.countryList.find(v => {
                return val.country === v.shortName;
              })
              if (countryObj) {
                val.countryName = countryObj.enName;
              }
              let residencyObj = this.countryList.find(v => {
                return val.residency === v.shortName;
              })
              if (residencyObj) {
                val.residencyName = residencyObj.enName;
              }
            })
            this.kycDialogIndividualData = resData;
          }
        }
        this.loading = false;
      } else {
        this.kycForm.nationality = v.status;
      }
    },
    async showKycdialog (v) {
    //   this.currentKycItem = v;
      if (v.bdId) {
        this.loading = true;
        const data = await getKycBeroreInfo({
          slient: true,
          params: {
            address: v.address
          }
        });
        if (data.code === '1000') {
          const resData = data.data || [];
          this.kycForm.nationality = resData[0] && resData[0].type;
          if (this.kycForm.nationality) {
            const obj = resData[0] || {};
            this.countryIncorporationItemList[0].value = obj.country;
            this.countryOperationItemList[0].value = obj.residency;
          } else {
            this.kycDialogIndividualData = resData;
          }
        }
        this.loading = false;
      } else {
        this.kycForm.nationality = v.status;
      }
    },
    addnationalityCountry (v) {
      if (this.currentKycItem && this.currentKycItem.bdId) return;
      const countryNameArr = this.countryList.filter(val => {
        if (this.nationalityItemObj.country === val.shortName || this.nationalityItemObj.residency === val.shortName) {
          return val
        }
      });
      if (countryNameArr.length === 1 ) {
        this.nationalityItemObj.countryName = countryNameArr[0].enName;
        this.nationalityItemObj.residencyName = countryNameArr[0].enName
      } else {
        this.nationalityItemObj.countryName = countryNameArr[0].enName;
        this.nationalityItemObj.residencyName = countryNameArr[1].enName
      }
      const { country, investorType, risk, residency, countryName, residencyName } = this.nationalityItemObj;
      const filter = this.kycDialogIndividualData.filter(val => {
        if (val.country === country && val.investorType === investorType &&
          val.risk === risk && val.residency === residency) {
          return val;
        }
      });
      if (filter.length === 0) {
        this.kycDialogIndividualData.push({
          country,
          residency,
          investorType,
          risk,
          countryName,
          residencyName
        });
      }
    },
    addOperationCountry (v) {
      if (this.currentKycItem && this.currentKycItem.bdId) return;
      const filter = this.countryOperationItemList.filter(val => {
        if (val.value === v.value && !val.isDefault) {
          return val;
        }
      });
      if (filter.length === 0) {
        this.countryOperationItemList.push({
          value: this.countryOperationItemList[0].value,
          type: '-'
        });
      }
    },
    addIncorporationCountry (v) {
      if (this.currentKycItem && this.currentKycItem.bdId) return;
      const filter = this.countryIncorporationItemList.filter(val => {
        if (val.value === v.value && !val.isDefault) {
          return val;
        }
      });
      if (filter.length === 0) {
        this.countryIncorporationItemList.push({
          value: this.countryIncorporationItemList[0].value,
          type: '-'
        });
      }
    },
    addResidenceCountry (v) {
      if (this.currentKycItem && this.currentKycItem.bdId) return;
      const filter = this.countryResidenceItemList.filter(val => {
        if (val.value === v.value && !val.isDefault) {
          return val;
        }
      });
      if (filter.length === 0) {
        this.countryResidenceItemList.push({
          value: this.countryResidenceItemList[0].value,
          type: '-'
        });
      }
    },
    subtractnationalityCountry (row, k) {
      this.kycDialogIndividualData.splice(k, 1);
    },
    subtractResidenceCountry (k) {
      if (this.currentKycItem && this.currentKycItem.bdId) return;
      this.countryResidenceItemList.splice(k, 1);
    },
    subtractIncorporationCountry (k) {
      if (this.currentKycItem && this.currentKycItem.bdId) return;
      this.countryIncorporationItemList.splice(k, 1);
    },
    subtractOperationCountry (k) {
      if (this.currentKycItem && this.currentKycItem.bdId) return;
      this.countryOperationItemList.splice(k, 1);
    },
    copySuccess () {
      if (this.copyTipsObj) {
        this.copyTipsObj.close();
        this.copyTipsObj = this.$message({
          message: 'Operation is successful',
          type: 'success'
        });
      } else {
        this.copyTipsObj = this.$message({
          message: 'Operation is successful',
          type: 'success'
        });
      }
    }
  },
  components: {
    'bread-crumbs': BreadCrumbs
  },
  mounted () {
    this.$nextTick(() => {
      if (this.menuKey) {
        this.breadData = [{
          name: 'Account Centre',
          to: '/account-center'
        }, {
          name: 'Address Centre',
          to: `/address-center?menuKey=${this.menuKey}`
        }, {
          name: 'Add Identity'
        }];
      }
      this.getCountries();
      this.queryRisklevel();
    });
  }
};
</script>

<style lang="scss">
.kyc-edit {
  .kyc-title {
    font-family: Calibri;
    font-size: 24px;
    color: #001f3b;
    line-height: 28px;
  }
  .title {
    margin: 0 auto;
    width: 1124px;
    height: 38px;
    line-height: 38px;
    margin-top: 30px;
    margin-bottom: 62px;
    background: #f4f9fe;
    border-radius: 4px;
    font-family: Calibri;
    font-size: 16px;
    color: #575e6e;
    letter-spacing: 0;
    text-align: left;
    padding-left: 20px;
  }
  .kyc-type {
    margin-bottom: 23px;
    .kyc-typeLabel {
      font-family: Calibri;
      font-size: 14px;
      color: #575e6e;
      letter-spacing: 0;
      text-align: left;
    }
  }
  .sub-title {
    line-height: 40px;
    font-family: Calibri;
    font-size: 14px;
    color: #575e6e;
    letter-spacing: 0;
  }
  .countrys {
    .countrys-select {
      width: 620px;
      height: 40px;
      margin-bottom: 22px;
      .el-select {
        width: 100%;
      }
    }
  }
  .addressKycfooter {
    margin-top: 100px;
    text-align: center;
    // margin-bottom: 40px;
    button {
      width: 400px;
      height: 40px;
    }
  }
  .country-box {
    display: flex;
    margin-bottom: 40px;
    .add-country {
        margin: 15px 0 0 10px;
        cursor: pointer;
    }
  }
  .nationality {
    flex: 1;
    padding: 20px;
    background-color:#FBFBFB; //#F9FBFF;
    .el-row {
        display: flex;
        margin-bottom: 20px;
        &:last-child {
        margin-bottom: 0;
        }
    }
    .item-column {
        display: flex;
        flex-direction: column;
        width: 445px;
        margin-right: 30px;
        &:last-child {
        margin-right: 0;
        }
        .label {
        margin-bottom: 15px;
        }
    }
  }
}
</style>
