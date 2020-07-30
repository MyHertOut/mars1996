<template>
  <div class="restrictions" v-loading="loading">
    <el-checkbox v-model="institutional" class="institutional">Institutional Investors</el-checkbox>
    <!-- <div class="country-of-incorporation">
      <span class="sub-title">Country of Incorporation：</span>
      <el-radio v-model="countryOfIncorporation" :label="2" :disabled="!institutional">Prohibited</el-radio>
      <el-radio v-model="countryOfIncorporation" :label="1" :disabled="!institutional">Permitted</el-radio>
    </div> -->
    <div class="country-box">
      <div class="country-content">
        <div class="country-item">
          <label class="sub-title">Restriction Type</label>
          <el-select v-model="instituCountry.permitted" :disabled="!institutional">
            <el-option label="Prohibit" :value="2"></el-option>
            <el-option label="Permit" :value="1"></el-option>
          </el-select>
        </div>
        <div class="country-item">
          <label class="sub-title">Country of Incorporation</label>
          <el-select
            v-model="instituCountry.country"
            filterable
            :disabled="!institutional"
            :loading="countryLoading"
          >
            <el-option
              v-for="(item, index) in incorporationCountryList"
              :key="index"
              :label="item.enName"
              :value="item.shortName">
            </el-option>
          </el-select>
        </div>
        <div class="country-item">
          <label class="sub-title">Country of Operation</label>
          <el-select
            v-model="instituCountry.residency"
            filterable
            :loading="countryLoading"
            :disabled="!institutional"
          >
            <el-option
              v-for="(item, index) in operationCountryList"
              :key="index"
              :label="item.enName"
              :value="item.shortName">
            </el-option>
          </el-select>
        </div>
      </div>
      <div class="add-country" v-if="institutional" @click="addIncorporationCountry2">
        <img src="../../../../assets/images/add.png" alt="png">
      </div>
    </div>
    <div class="select-country" v-if="instituCountryData.filter(x => x.permitted == 1).length">
      <p class="sub-title">Permit</p>
      <el-table class="sel-table" :data="instituCountryData.filter(x => x.permitted == 1)" style="width: 100%">
        <el-table-column prop="countryName" label="Country of Incorporation"></el-table-column>
        <el-table-column prop="residencyName" label="Country of Operation"></el-table-column>
        <el-table-column prop="edit" label="" width="130">
          <template slot-scope="scope">
            <img
              class="row-reduce"
              src="../../../../assets/images/dis-reduce.png"
              @click="reduceInstituCountry(scope.row, scope.$index)"
              style="cursor: pointer;"
              width="18" height="18" alt="png" />
          </template>
        </el-table-column>
      </el-table>
      <!-- <div class="sel-table">
        <el-row class="sel-header">
          <el-col :span="8">Country of Incorporation</el-col>
          <el-col :span="14">Country of Operation</el-col>
        </el-row>
        <div class="sel-table-body">
          <el-row
            class="sel-row"
            v-for="(item, k) in instituCountryData.filter(x => x.permitted == 1)"
            :key="k"
          >
            <el-col :span="8">{{ item.country }}</el-col>
            <el-col :span="14">{{ item.residency }}</el-col>
            <el-col :span="2">
              <img
                class="row-reduce"
                src="../../../../../../assets/images/dis-reduce.png"
                @click="reduceInstituCountry(item, k)"
                style="cursor: pointer;"
                width="18" height="18" alt="png" />
            </el-col>
          </el-row>
        </div>
      </div> -->
    </div>
    <div class="select-country" v-if="instituCountryData.filter(x => x.permitted == 2).length">
      <p class="sub-title">Prohibit</p>
      <el-table class="sel-table" :data="instituCountryData.filter(x => x.permitted == 2)" style="width: 100%">
        <el-table-column prop="countryName" label="Country of Incorporation"></el-table-column>
        <el-table-column prop="residencyName" label="Country of Operation"></el-table-column>
        <el-table-column prop="edit" label="" width="130">
          <template slot-scope="scope">
            <img
              class="row-reduce"
              src="../../../../assets/images/dis-reduce.png"
              @click="reduceInstituCountry(scope.row, scope.$index)"
              style="cursor: pointer;"
              width="18" height="18" alt="png" />
          </template>
        </el-table-column>
      </el-table>
      <!-- <div class="sel-table">
        <el-row class="sel-header">
          <el-col :span="8">Country of Incorporation</el-col>
          <el-col :span="14">Country of Operation</el-col>
        </el-row>
        <div class="sel-table-body">
          <el-row class="sel-row" v-for="(item, k) in instituCountryData.filter(x => x.permitted == 2)" :key="k">
            <el-col :span="8">{{ item.country }}</el-col>
            <el-col :span="14">{{ item.residency }}</el-col>
            <el-col :span="2">
              <img
                class="row-reduce"
                src="../../../../../../assets/images/dis-reduce.png"
                @click="reduceInstituCountry(item, k)"
                style="cursor: pointer;"
                width="18" height="18" alt="png" />
            </el-col>
          </el-row>
        </div>
      </div> -->
    </div>
    <!-- <div class="countrys">
      <p class="sub-title">Country</p>
      <div class="countrys-select" v-for="(v, k) in countryIncorporationItemList" :key="k" :style="(k + 1) % 3 === 0 ? 'margin-right: 0px;' : ''">
        <el-select v-model="v.value" :disabled="!institutional || !v.isDefault">
          <el-option
            v-for="(item, index) in incorporationCountryList"
            :key="index"
            :label="item.enName"
            :value="item.enName">
          </el-option>
        </el-select>
        <div class="add-country" v-if="v.type === '+'" @click="addIncorporationCountry(v)" :class="{'dis-add-country': !institutional}">
          <img src="../../../../../../assets/images/add.png" alt="png" v-if="institutional">
        </div>
        <div class="add-country subtract-country" v-else @click="subtractIncorporationCountry(k)" :class="{'dis-add-country': !institutional}">
          <img src="../../../../../../assets/images/reduce.png" alt="png" v-if="institutional">
        </div>
      </div>
    </div> -->
    <!-- <div class="country-of-incorporation">
      <span class="sub-title">Country of Operation:</span>
      <el-radio v-model="countryOfOperation" :label="2" :disabled="!institutional">Prohibited</el-radio>
      <el-radio v-model="countryOfOperation" :label="1" :disabled="!institutional">Permitted</el-radio>
    </div> -->
    <!-- <div class="countrys">
      <p class="sub-title">Country</p>
      <div class="countrys-select" v-for="(v, k) in countryOperationItemList" :key="k" :style="(k + 1) % 3 === 0 ? 'margin-right: 0px;' : ''">
        <el-select v-model="v.value" :disabled="!institutional || !v.isDefault">
          <el-option
            v-for="(item, index) in operationCountryList"
            :key="index"
            :label="item.enName"
            :value="item.enName">
          </el-option>
        </el-select>
        <div class="add-country" v-if="v.type === '+'" @click="addOperationCountry(v)" :class="{'dis-add-country': !institutional}">
          <img src="../../../../../../assets/images/add.png" alt="png" v-if="institutional">
        </div>
        <div class="add-country subtract-country" v-else @click="subtractOperationCountry(k)" :class="{'dis-add-country': !institutional}">
          <img src="../../../../../../assets/images/reduce.png" alt="png" v-if="institutional">
        </div>
      </div>
    </div> -->
    <el-checkbox v-model="individual" class="institutional">Individual Investors</el-checkbox>
    <div class="country-box">
      <div class="country-content">
        <div class="country-item">
          <label class="sub-title">Restriction Type</label>
          <el-select v-model="indiviCountry.permitted" :disabled="!individual">
            <el-option label="Prohibit" :value="2"></el-option>
            <el-option label="Permit" :value="1"></el-option>
          </el-select>
        </div>
        <div class="country-item">
          <label class="sub-title">Country</label>
          <el-select v-model="indiviCountry.country" :loading="countryLoading" :disabled="!individual" filterable>
            <el-option
              v-for="(item, index) in nationalityCountryList"
              :key="index"
              :label="item.enName"
              :value="item.shortName">
            </el-option>
          </el-select>
        </div>
        <div class="country-item">
          <label class="sub-title">Type</label>
          <el-select v-model="indiviCountry.type" :disabled="!individual">
            <el-option
              v-for="item in typeList"
              :key="item.value"
              :label="item.label"
              :value="item.label">
            </el-option>
          </el-select>
        </div>
        <div class="country-item">
          <label class="sub-title">Risk Tolerance</label>
          <el-select v-model="indiviCountry.risk" :disabled="!individual">
            <el-option
              v-for="item in riskList"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
        </div>
        <div class="country-item">
          <label class="sub-title">Residency</label>
          <el-select v-model="indiviCountry.residency" :loading="countryLoading" :disabled="!individual" filterable>
            <el-option
              v-for="(item, index) in residencyCountryList"
              :key="index"
              :label="item.enName"
              :value="item.shortName">
            </el-option>
          </el-select>
        </div>
      </div>
      <div class="add-country" v-if="individual" @click="addnationalityCountry2">
        <img src="../../../../assets/images/add.png" alt="png">
      </div>
    </div>
    <div class="select-country" v-if="indiviCountryData.filter(x => x.permitted == 1).length">
      <p class="sub-title">Permit</p>
      <el-table class="sel-table" :data="indiviCountryData.filter(x => x.permitted == 1)" style="width: 100%">
        <el-table-column prop="countryName" label="Country"></el-table-column>
        <el-table-column prop="type" label="Type"></el-table-column>
        <el-table-column prop="risk" label="Risk Tolerance"></el-table-column>
        <el-table-column prop="residencyName" label="Residency"></el-table-column>
        <el-table-column prop="edit" label="" width="130">
          <template slot-scope="scope">
            <img
              class="row-reduce"
              src="../../../../assets/images/dis-reduce.png"
              @click="reduceIndiviCountry(scope.row, scope.$index)"
              style="cursor: pointer;"
              width="18" height="18" alt="png" />
          </template>
        </el-table-column>
      </el-table>
      <!-- <div class="sel-table">
        <el-row class="sel-header">
          <el-col :span="5">Country</el-col>
          <el-col :span="5">Type</el-col>
          <el-col :span="5">Risk Tolerance</el-col>
          <el-col :span="9">Residency</el-col>
        </el-row>
        <div class="sel-table-body">
          <el-row
            class="sel-row"
            v-for="(item, k) in indiviCountryData.filter(x => x.permitted == 1)"
            :key="k"
          >
            <el-col :span="5">{{ item.country }}</el-col>
            <el-col :span="5">{{ item.type }}</el-col>
            <el-col :span="5">{{ item.risk }}</el-col>
            <el-col :span="7">{{ item.residency }}</el-col>
            <el-col :span="2">
              <img
                class="row-reduce"
                src="../../../../../../assets/images/dis-reduce.png"
                @click="reduceIndiviCountry(item, k)"
                style="cursor: pointer;"
                width="18" height="18" alt="png" />
            </el-col>
          </el-row>
        </div>
      </div> -->
    </div>
    <div class="select-country" v-if="indiviCountryData.filter(x => x.permitted == 2).length">
      <p class="sub-title">Prohibit</p>
      <el-table class="sel-table" :data="indiviCountryData.filter(x => x.permitted == 2)" style="width: 100%">
        <el-table-column prop="countryName" label="Country"></el-table-column>
        <el-table-column prop="type" label="Type"></el-table-column>
        <el-table-column prop="risk" label="Risk Tolerance"></el-table-column>
        <el-table-column prop="residencyName" label="Residency"></el-table-column>
        <el-table-column prop="edit" label="" width="130">
          <template slot-scope="scope">
            <img
              class="row-reduce"
              src="../../../../assets/images/dis-reduce.png"
              @click="reduceIndiviCountry(scope.row, scope.$index)"
              style="cursor: pointer;"
              width="18" height="18" alt="png" />
          </template>
        </el-table-column>
      </el-table>
      <!-- <div class="sel-table">
        <el-row class="sel-header">
          <el-col :span="5">Country</el-col>
          <el-col :span="5">Type</el-col>
          <el-col :span="5">Risk Tolerance</el-col>
          <el-col :span="9">Residency</el-col>
        </el-row>
        <div class="sel-table-body">
          <el-row class="sel-row" v-for="(item, k) in indiviCountryData.filter(x => x.permitted == 2)" :key="k">
            <el-col :span="5">{{ item.country }}</el-col>
            <el-col :span="5">{{ item.type }}</el-col>
            <el-col :span="5">{{ item.risk }}</el-col>
            <el-col :span="7">{{ item.residency }}</el-col>
            <el-col :span="2">
              <img
                class="row-reduce"
                src="../../../../../../assets/images/dis-reduce.png"
                @click="reduceIndiviCountry(item, k)"
                style="cursor: pointer;"
                width="18" height="18" alt="png" />
            </el-col>
          </el-row>
        </div>
      </div> -->
    </div>
    <!-- <div class="country-of-incorporation">
      <span class="sub-title">Nationality:</span>
      <el-radio v-model="nationality" :label="2" :disabled="!individual">Prohibited</el-radio>
      <el-radio v-model="nationality" :label="1" :disabled="!individual">Permitted</el-radio>
    </div>
    <div class="countrys nationality">
      <p class="sub-title nationality-sub">
        <span>Country</span>
        <span>Investor Type</span>
        <span>Risk Tolerance</span>
      </p>
      <div class="countrys-select" v-for="(v, k) in nationalityItemList" :key="k" :style="(k + 1) % 3 === 0 ? 'margin-right: 0px;' : ''">
        <el-select v-model="v.country" :disabled="!individual || !v.isDefault">
          <el-option
            v-for="(item, index) in nationalityCountryList"
            :key="index"
            :label="item.enName"
            :value="item.enName">
          </el-option>
        </el-select>
        <el-select v-model="v.type" :disabled="!individual || !v.isDefault">
          <el-option
            v-for="item in typeList"
            :key="item.value"
            :label="item.label"
            :value="item.value">
          </el-option>
        </el-select>
        <el-select v-model="v.risk" style="margin-right: 0px;" :disabled="!individual || !v.isDefault">
          <el-option
            v-for="item in riskList"
            :key="item.value"
            :label="item.label"
            :value="item.value">
          </el-option>
        </el-select>
        <div class="add-country" v-if="v.between === '+'" @click="addnationalityCountry(v)" :class="{'dis-add-country': !individual}">
          <img src="../../../../../../assets/images/add.png" alt="png" v-if="individual">
        </div>
        <div class="add-country subtract-country" v-else @click="subtractnationalityCountry(k)" :class="{'dis-add-country': !individual}">
          <img src="../../../../../../assets/images/reduce.png" alt="png" v-if="individual">
        </div>
      </div>
    </div>
    <div class="country-of-incorporation">
      <span class="sub-title">Country of Residency:</span>
      <el-radio v-model="countryResidency" :label="2" :disabled="!individual">Prohibited</el-radio>
      <el-radio v-model="countryResidency" :label="1" :disabled="!individual">Permitted</el-radio>
    </div>
    <div class="countrys">
      <p class="sub-title">Country</p>
      <div class="countrys-select" v-for="(v, k) in countryResidencyItemList" :key="k" :style="(k + 1) % 3 === 0 ? 'margin-right: 0px;' : ''">
        <el-select v-model="v.value" :disabled="!individual || !v.isDefault">
          <el-option
            v-for="(item, index) in residencyCountryList"
            :key="index"
            :label="item.enName"
            :value="item.enName">
          </el-option>
        </el-select>
        <div class="add-country" v-if="v.type === '+'" @click="addResidencyCountry(v)" :class="{'dis-add-country': !individual}">
          <img src="../../../../../../assets/images/add.png" alt="png" v-if="individual">
        </div>
        <div class="add-country subtract-country" v-else @click="subtractResidencyCountry(k)" :class="{'dis-add-country': !individual}">
          <img src="../../../../../../assets/images/reduce.png" alt="png" v-if="individual">
        </div>
      </div>
    </div> -->
    <div class="form-btns">
      <el-button @click="$router.push({ name: 'DisIssueBondsDocument', query: { serialNo: $route.query.serialNo } })">Previous</el-button>
      <el-button type="primary" @click="handleNext">Next</el-button>
    </div>
  </div>
</template>
<script>
import { getSecurityInfo, getMemberCountry, newSecurity } from '@/api/distribution-center';

export default {
  name: 'Restrictions',
  data () {
    return {
      loading: false,
      institutional: false,
      individual: false,
      countryLoading: false,
      nationality: 1,
      countryResidency: 1,
      instituCountryData: [],
      indiviCountryData: [],
      indiviCountry: {
        investorType: '', // 0 institutional, 1 individual
        permitted: 1, // Prohibited: 2，Permitted: 1
        type: 'ALL',
        risk: 'ALL'
      },
      instituCountry: {
        investorType: '', // 0 institutional, 1 individual
        permitted: 1, // Prohibited: 2，Permitted: 1
        countryList: [{
          country: '',
          residency: ''
        }]
      },
      typeList: [{
        label: 'ALL',
        value: 'ALL'
      }, {
        label: 'Retail',
        value: '1'
      }, {
        label: 'Accredited',
        value: '2'
      }],
      riskList: [{
        label: 'ALL',
        value: 'ALL'
      }, {
        label: '1',
        value: '1'
      }, {
        label: '2',
        value: '2'
      }, {
        label: '3',
        value: '3'
      }, {
        label: '4',
        value: '4'
      }, {
        label: '5',
        value: '5'
      }],
      countryList: [],
      incorporationCountryList: [],
      operationCountryList: [],
      nationalityCountryList: [],
      residencyCountryList: [],
      countryIncorporationItemList:
      [{
        value: '', // 'China',
        type: '+',
        isDefault: true
      }],
      countryOperationItemList: [{
        value: '', // 'China',
        type: '+',
        isDefault: true
      }],
      nationalityItemList: [{
        country: '', // 'China',
        between: '+',
        type: 0,
        risk: 0,
        isDefault: true
      }],
      countryResidencyItemList: [{
        value: '', // 'Malaysia',
        type: '+',
        isDefault: true
      }]
    };
  },
  watch: {
    institutional (val) {
      if (!val) this.individual = val;
    },
    nationality (n, o) {
      if (n === 1) {
        this.nationalityCountryList.splice(0, 0, { shortName: 'All', value: 'all' });
      } else {
        this.nationalityItemList.forEach((val, key) => {
          if (val.country === 'All' && !val.isDefault) {
            this.nationalityItemList.splice(key, 1);
            this.nationalityItemList[0].country = '';
          }
        });
        this.nationalityCountryList.splice(0, 1);
      }
    },
    countryResidency (n, o) {
      if (n === 1) {
        this.residencyCountryList.splice(0, 0, { shortName: 'All', value: 'all' });
      } else {
        this.countryResidencyItemList.forEach((val, key) => {
          if (val.value === 'All' && !val.isDefault) {
            this.countryResidencyItemList.splice(key, 1);
            this.countryResidencyItemList[0].value = ''; // 'China333';
          }
        });
        this.residencyCountryList.splice(0, 1);
      }
    }
  },
  computed: {
    instituCountryDataPermit () {
      return this.instituCountryData.filter(item => item.permitted === 1) || [];
    },
    instituCountryDataProhibit () {
      return this.instituCountryData.filter(item => item.permitted === 2) || [];
    }
  },
  created () {
    this.getBeforeInfo();
    this.queryMemberCountry();
  },
  methods: {
    async getBeforeInfo () {
      if (this.$route.query.serialNo) {
        // this.loading = true;
        const data = await getSecurityInfo({
          serialNo: this.$route.query.serialNo
        });
        // this.loading = false;
        if (data && data.code === '1000') {
          this.initKycInfo(data.data || []);
        }
      }
    },
    queryMemberCountry () {
      this.countryLoading = true;

      getMemberCountry().then(res => {
        this.countryLoading = false;
        const { code, data } = res;

        if (code === '1000') {
          const resData = data || [];
          this.countryList = resData;
          this.residencyCountryList = [...resData];
          this.incorporationCountryList = [...resData];
          this.operationCountryList = [...resData];
          this.nationalityCountryList = [...resData];

          this.residencyCountryList.splice(0, 0, { enName: 'ALL', value: 'ALL', shortName: 'ALL' });
          this.incorporationCountryList.splice(0, 0, { enName: 'ALL', value: 'ALL', shortName: 'ALL' });
          this.operationCountryList.splice(0, 0, { enName: 'ALL', value: 'ALL', shortName: 'ALL' });
          this.nationalityCountryList.splice(0, 0, { enName: 'ALL', value: 'ALL', shortName: 'ALL' });
        }
      }).catch(() => {
        this.countryLoading = false;
      });
    },
    initKycInfo (data) {
      if (!data.kycList || (data.kycList && !data.kycList.length)) return;

      const kycList = data.kycList;
      const instituData = kycList.filter(x => x.investorType === 0); // 机构
      const indiviData = kycList.filter(x => x.investorType === 1); // 个人
      if (instituData.length) this.institutional = true;
      if (indiviData.length) this.individual = true;
      const obj1 = instituData.find(x => x.permitted === 1) || {}; // 允许
      const obj2 = instituData.find(x => x.permitted === 2) || {}; // 不允许
      const obj3 = indiviData.find(x => x.permitted === 1) || {}; // 允许
      const obj4 = indiviData.find(x => x.permitted === 2) || {}; // 不允许
      const arr1 = [];
      const arr2 = [];

      if (obj1.countryList && obj1.countryList.length) {
        obj1.countryList.forEach(x => {
          arr1.push({
            ...x,
            permitted: 1
          });
        });
      }
      if (obj2.countryList && obj2.countryList.length) {
        obj2.countryList.forEach(x => {
          arr1.push({
            ...x,
            permitted: 2
          });
        });
      }
      if (obj3.countryList && obj3.countryList.length) {
        obj3.countryList.forEach(x => {
          arr2.push({
            ...x,
            permitted: 1
          });
        });
      }
      if (obj4.countryList && obj4.countryList.length) {
        obj4.countryList.forEach(x => {
          arr2.push({
            ...x,
            permitted: 2
          });
        });
      }
      this.instituCountryData = arr1;
      this.indiviCountryData = arr2;
    },
    reduceInstituCountry (item, index) {
      const itemIndex = this.instituCountryData.findIndex(x => x === item);
      if (itemIndex === -1) return;
      this.instituCountryData.splice(itemIndex, 1);
    },
    addIncorporationCountry2 () {
      if (!this.institutional) return;

      const { permitted, country, residency } = this.instituCountry;
      if (!country || !residency) {
        this.$message({ message: 'Please select a country', type: 'error' });
        return;
      }
      const filterData = this.instituCountryData.filter(val => {
        if (val.country === country && val.residency === residency) {
          return val;
        }
      });
      if (filterData.length > 0) return;
      this.instituCountryData.push({
        permitted,
        country,
        residency,
        countryName: (this.incorporationCountryList.find(x => x.shortName === country) || {}).enName,
        residencyName: (this.incorporationCountryList.find(x => x.shortName === residency) || {}).enName
      });
    },
    addIncorporationCountry (v) {
      if (!this.institutional || !v.value) return;

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
    subtractIncorporationCountry (k) {
      if (!this.institutional) return;
      this.countryIncorporationItemList.splice(k, 1);
    },
    addOperationCountry (v) {
      if (!this.institutional || !v.value) return;
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
    subtractOperationCountry (k) {
      if (!this.institutional) return;
      this.countryOperationItemList.splice(k, 1);
    },
    reduceIndiviCountry (item, index) {
      const itemIndex = this.indiviCountryData.findIndex(x => x === item);
      if (itemIndex === -1) return;
      this.indiviCountryData.splice(itemIndex, 1);
    },
    addnationalityCountry2 () {
      if (!this.nationality) return;

      const { permitted, country, residency, type, risk } = this.indiviCountry;
      if (!country || !residency) {
        this.$message({ message: 'Please select a country', type: 'error' });
        return;
      }
      const filterData = this.indiviCountryData.filter(val => {
        if (val.country === country && val.type === type && val.risk === risk &&
          val.residency === residency) {
          return val;
        }
      });
      if (filterData.length > 0) return;
      this.indiviCountryData.push({
        permitted,
        country,
        residency,
        type,
        risk,
        countryName: (this.nationalityCountryList.find(x => x.shortName === country) || {}).enName,
        residencyName: (this.residencyCountryList.find(x => x.shortName === residency) || {}).enName
      });
    },
    addnationalityCountry (v) {
      if (!this.institutional || !this.nationality || !v.country) return;

      const filter = this.nationalityItemList.filter(val => {
        if (val.country === v.country && !val.isDefault && val.type === v.type && val.risk === v.risk) {
          return val;
        }
      });
      if (filter.length === 0) {
        this.nationalityItemList.push({
          country: v.country,
          between: '-',
          type: v.type,
          risk: v.risk
        });
      }
    },
    subtractnationalityCountry (k) {
      if (!this.nationality) return;
      this.nationalityItemList.splice(k, 1);
    },
    addResidencyCountry (v) {
      if (!this.individual || !v.value) return;
      const filter = this.countryResidencyItemList.filter(val => {
        if (val.value === v.value && !val.isDefault) {
          return val;
        }
      });
      if (filter.length === 0) {
        this.countryResidencyItemList.push({
          value: this.countryResidencyItemList[0].value,
          type: '-'
        });
      }
    },
    subtractResidencyCountry (k) {
      if (!this.individual) return;
      this.countryResidencyItemList.splice(k, 1);
    },
    handleNext () {
      const finData2 = { kycList: [] };
      if (this.institutional) {
        const permittedData = this.instituCountryData.filter(x => x.permitted === 1) || [];
        const prohibitedData = this.instituCountryData.filter(x => x.permitted === 2) || [];
        if (!permittedData.length && !prohibitedData.length) {
          this.$message({ message: 'Please add an institutional investors', type: 'error' });
          return;
        }
        finData2.kycList.push({
          investorType: 0,
          permitted: 1,
          countryList: permittedData
        });
        finData2.kycList.push({
          investorType: 0,
          permitted: 2,
          countryList: prohibitedData
        });
      }
      if (this.individual) {
        const permittedData = this.indiviCountryData.filter(x => x.permitted === 1) || [];
        const prohibitedData = this.indiviCountryData.filter(x => x.permitted === 2) || [];
        if (!permittedData.length && !prohibitedData.length) {
          this.$message({ message: 'Please add an individual investors', type: 'error' });
          return;
        }
        finData2.kycList.push({
          investorType: 1,
          permitted: 1,
          countryList: permittedData
        });
        finData2.kycList.push({
          investorType: 1,
          permitted: 2,
          countryList: prohibitedData
        });
      }
      this.loading = true;
      newSecurity({ data: { ...finData2, serialNo: this.$route.query.serialNo }, slient: true }).then(res => {
        this.loading = false;
        if (res.code === '1000') {
          this.$router.push({
            name: 'DisIssueBondsViewdetail',
            query: { type: 'Step', serialNo: res.data }
          });
        }
      }).catch(() => {
        this.loading = false;
      });
    }
  }
};
</script>
<style scoped lang="scss">
.restrictions {
  padding: 0 30px;
  font-size: 16px;
  color: #192231;
  .country-box {
    display: flex;
    margin-bottom: 30px;
    .country-content {
      display: flex;
      flex: 1;
      padding: 30px 28px 23px 20px;
      border-radius: 2px;
      background-color: #FBFBFB;
    }
    .add-country {
      margin: 10px 0 0 20px;
      cursor: pointer;
    }
    .country-item {
      display: flex;
      flex: 1;
      flex-direction: column;
      margin-right: 30px;
      &:first-child {
        flex: initial;
        width: 158px;
      }
      &:last-child {
        margin-right: 0;
      }
    }
    .sub-title {
      color: #8D93A1;
      margin-bottom: 12px;
    }
  }
  .select-country {
    margin-bottom: 30px;
    .sel-table {
      padding-right: 42px;
    }
    /deep/ .sel-table {
      th {
        background-color: #FBFBFB;
      }
      td {
        border-bottom-color: #EBEEF5 !important;
      }
    }
    // .sel-table-body {
    //   max-height: 252px;
    //   overflow-y: auto;
    // }
    .sel-header {
      height: 48px;
      line-height: 48px;
      background-color: #FBFBFB;
      color: #8D93A1;
      font-size: 16px;
      .el-col:first-child {
        padding-left: 42px;
      }
    }
    .sel-row {
      height: 51px;
      line-height: 51px;
      border-top: 1px solid #EBEEF5;
      border-bottom: 1px solid #EBEEF5;
      .el-col:first-child {
        padding-left: 42px;
      }
    }
    .sub-title {
      color: #001F3B;
      margin-bottom: 14px;
    }
  }
// 上面是新样式

  .sub-title {
    color: #616266;
    margin-bottom: 30px;
    margin-right: 25px;
  }
  .nationality-sub {
    display: flex;
    justify-content: space-between;
    margin-right: 0px;
    span {
      width: 270px;
      display: inline-block;
      margin-right: 60px;
    }
  }
  .institutional {
    margin-bottom: 30px;
  }
  .country-of-incorporation {
    margin-bottom: 20px;
  }
  .countrys {
    width: 1040px;
    background-color: #F9FBFF;
    padding: 20px;
    padding-right: 0px;
    margin-bottom: 40px;
    &::after {
      content: '';
      display: block;
      width: 0px;
      height: 0px;
      clear: both;
    }
    .countrys-select {
      float: left;
      position: relative;
      width: 320px;
      padding-right: 50px;
      margin-right: 10px;
      margin-bottom: 20px;
      .el-select {
        width: 100%;
      }
      .add-country {
        width: 28px;
        height: 28px;
        border-radius: 50%;
        border: 1px solid transparent;
        text-align: center;
        line-height: 25px;
        color: #fff;
        position: absolute;
        right: 10px;
        top: 50%;
        transform: translateY(-50%);
        cursor: pointer;
        img {
          width: 100%;
          height: 100%;
        }
      }
      .dis-add-country {
        img {
          cursor: no-drop;
        }
      }
      .subtract-country {
        background-color: #ED4115;
      }
    }
  }
  .nationality {
    .countrys-select {
      width: 100%;
      .el-select {
        width: 270px;
        margin-right: 75px;
      }
    }
  }
  // .submit {
  //   width: 630px;
  //   margin: 0 auto;
  //   display: flex;
  //   justify-content: space-between;
  //   margin-top: 100px;
  //   margin-bottom: 30px;
  //   button {
  //     width: 300px;
  //     height: 40px;
  //     font-size: 20px;
  //     font-weight: normal;
  //     color: #2F39E3;
  //     &:focus {
  //       background-color: #fff;
  //     }
  //     & + button {
  //       color: #fff;
  //     }
  //   }
  // }
}
</style>
<style lang="scss">
.restrictions {
  .institutional {
    &.is-checked {
      .el-checkbox__label {
        color: #192231;
      }
    }
    .el-checkbox__label {
      font-size: 18px;
      color: #192231;
      padding-left: 15px;
      font-weight: normal;
    }
    .el-checkbox__input {
      .el-checkbox__inner {
        &:hover {
          border-color: #DCDFE6;
        }
      }
    }
    .el-checkbox__input.is-checked .el-checkbox__inner {
      background-color: #2F39E3;
      border-color: #2F39E3;
    }
    .el-checkbox__input.is-focus .el-checkbox__inner {
      border-color: #2F39E3;
    }
  }
}
</style>
