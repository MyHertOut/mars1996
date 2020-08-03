<template>
  <div class="view-detail">
    <!-- <el-breadcrumb separator-class="el-icon-arrow-right" class="view-breadcrumb">
      <el-breadcrumb-item>Issuance</el-breadcrumb-item>
      <el-breadcrumb-item :to="{ name: $route.query.href }">{{$route.query.href}}</el-breadcrumb-item>
      <el-breadcrumb-item v-if="$route.query.state !== undefined">Details</el-breadcrumb-item>
      <el-breadcrumb-item v-else>Preview</el-breadcrumb-item>
    </el-breadcrumb> -->
    <div class="view-content" v-loading="loading">
      <!-- <p class="headlines" v-if="$route.query.state !== undefined">Details</p>
      <p class="headlines" v-else>Preview</p> -->
      <div class="view-item">
        <p class="head-title">Basic Parameters</p>
        <el-row :gutter="20">
          <!-- <el-col :span="5" v-if="detailData.type"><div class="sub-title">Security Type：</div></el-col>
          <el-col :span="7" v-if="detailData.type"><div class="grid-content">{{securityTypeList.filter(v => v.value === detailData.type)[0].label}}</div></el-col> -->
          <el-col :span="4" v-if="detailData.bondsType"><div class="sub-title">Bond Type：</div></el-col>
          <el-col :span="8" v-if="detailData.bondsType"><div class="grid-content">{{bondsTypeList.filter(v => v.value === detailData.bondsType)[0].label}}</div></el-col>
          <el-col :span="4" v-if="detailData.issuerName"><div class="sub-title">Issuer Name：</div></el-col>
          <el-col :span="8" v-if="detailData.issuerName"><div class="grid-content">{{detailData.issuerName}}</div></el-col>
        </el-row>
        <!-- <el-row :gutter="20" v-if="detailData.smtCode">
          <el-col :span="5"><div class="sub-title">SMT Code：</div></el-col>
          <el-col :span="8">
            <p style="margin-bottom: 10px;">smti-00-001-0-1-v1</p>
            <div :class="{'SMTA-item': $route.query.state !== undefined}" @click="isActiveSMTA = !isActiveSMTA">
              <span>{{detailData.smtCode}}</span>
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
          <el-col :span="4" v-if="detailData.code"><div class="sub-title">Security Code：</div></el-col>
          <el-col :span="8" v-if="detailData.code"><div class="grid-content">{{detailData.code}}</div></el-col>
          <el-col :span="4" v-if="detailData.name"><div class="sub-title">Security Name：</div></el-col>
          <el-col :span="8" v-if="detailData.name"><div class="grid-content">{{detailData.name}}</div></el-col>
        </el-row>
        <!-- <el-row :gutter="20" v-if="detailData.debtSeniority && detailData.classOfSecurity">
          <el-col :span="5" v-if="detailData.issuerName"><div class="sub-title">Issuer Name：</div></el-col>
          <el-col :span="7" v-if="detailData.issuerName"><div class="grid-content">{{detailData.issuerName}}</div></el-col>
          <el-col :span="5" v-if="detailData.debtSeniority"><div class="sub-title">Debt Seniority：</div></el-col>
          <el-col :span="6" v-if="detailData.debtSeniority"><div class="grid-content">{{detailData.debtSeniority}}fffff</div></el-col>
        </el-row> -->
        <!-- <el-row :gutter="20" v-if="detailData.underlyingIndex">
          <el-col :span="5"><div class="sub-title">Underyling Index：</div></el-col>
          <el-col :span="7"><div class="grid-content">{{detailData.underlyingIndex}}</div></el-col>
        </el-row> -->
        <el-row :gutter="20">
          <el-col :span="4" v-if="detailData.issueRating"><div class="sub-title">Issue Rating：</div></el-col>
          <el-col :span="8" v-if="detailData.issueRating"><div class="grid-content" style="overflow-wrap: break-word;word-break: keep-all;">{{detailData.issueRating.split(',').join('、')}}</div></el-col>
          <el-col :span="4" v-if="detailData.companyLei"><div class="sub-title">Company LEI：</div></el-col>
          <el-col :span="8" v-if="detailData.companyLei"><div class="grid-content">{{detailData.companyLei}}</div></el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="4" v-if="detailData.uniqueIdentifierCode"><div class="sub-title">Unique Identifier Code：</div></el-col>
          <el-col :span="8" v-if="detailData.uniqueIdentifierCode"><div class="grid-content" style="overflow-wrap: break-word;word-break: keep-all;">{{detailData.uniqueIdentifierCode.split(',').join('、')}}</div></el-col>
          <el-col :span="4" v-if="detailData.debtSeniority"><div class="sub-title">Debt Seniority：</div></el-col>
          <el-col :span="8" v-if="detailData.debtSeniority"><div class="grid-content">{{ debtSeniorityComputed}}</div></el-col>
        </el-row>
        <p class="head-title">Issuance Information</p>
        <el-row :gutter="20">
          <el-col :span="4" v-if="detailData.issuanceAddress"><div class="sub-title">Issuance Address：</div></el-col>
          <el-col :span="8" v-if="detailData.issuanceAddress">
            <div class="grid-content">
              <a class="link-txt" :href="browserUrlAddress(detailData.issuanceAddress)" target="_blank">{{detailData.issuanceAddress}}</a>
            </div>
          </el-col>
          <el-col :span="4" v-if="detailData.issuanceQuantity"><div class="sub-title">Issuance Quantity：</div></el-col>
          <el-col :span="8" v-if="detailData.issuanceQuantity"><div class="grid-content">{{detailData.issuanceQuantity | demicrometer}}</div></el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="4" v-if="detailData.parValuePerToken"><div class="sub-title">Par Value Per Unit：</div></el-col>
          <el-col :span="8" v-if="detailData.parValuePerToken"><div class="grid-content">{{detailData.parValuePerToken | demicrometer}}</div></el-col>
          <el-col :span="4" v-if="detailData.currency"><div class="sub-title">Currency：</div></el-col>
          <el-col :span="8" v-if="detailData.currency"><div class="grid-content">{{detailData.currency}}</div></el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="4" v-if="detailData.settlementCode"><div class="sub-title">Settlement Token：</div></el-col>
          <!-- v-if="detailData.settlementToken" -->
          <el-col :span="8" v-if="detailData.settlementCode">
            <div class="grid-content">
                {{detailData.settlementCode }}
                <!-- {{settlementTokenDesc(detailData.settlementToken, 'info')}} -->
            </div>
          </el-col>
          <el-col :span="4" v-if="detailData.dayCountConvention"><div class="sub-title">Day Count Convention：</div></el-col>
          <el-col :span="8" v-if="detailData.dayCountConvention"><div class="grid-content">{{dayCountConventionList.filter(v => v.value === detailData.dayCountConvention)[0].label}}</div></el-col>
        </el-row>
        <el-row :gutter="20" v-if="detailData.acknowledgeTc">
          <el-col :span="4"><div class="sub-title">Terms & Conditions：</div></el-col>
          <el-col :span="20">
            <div class="grid-content terms-conditions" style="word-wrap: break-word;word-break: keep-all;white-space:initial;">
              <pre>{{detailData.acknowledgeTc}}</pre>
            </div>
          </el-col>
        </el-row>
        <p class="head-title">Coupon & Principal</p>
        <el-row :gutter="20">
          <el-col :span="4" v-if="detailData.couponRate"><div class="sub-title">Coupon Rate(%)：</div></el-col>
          <el-col :span="8" v-if="detailData.couponRate"><div class="grid-content">{{couponRateDesc(detailData.couponRate)}}</div></el-col>
          <el-col :span="4" v-if="detailData.couponFrequency"><div class="sub-title">Coupon Frequency：</div></el-col>
          <el-col :span="8" v-if="detailData.couponFrequency">
            <div class="grid-content">{{couponFrequencyList.filter(v => v.value === detailData.couponFrequency)[0] ? couponFrequencyList.filter(v => v.value === detailData.couponFrequency)[0].label : ''}}</div>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="4" v-if="detailData.couponPeriods"><div class="sub-title">Coupon Periods：</div></el-col>
          <el-col :span="8" v-if="detailData.couponPeriods"><div class="grid-content">{{detailData.couponPeriods}}</div></el-col>
          <el-col :span="4" v-if="detailData.firstSettlementDate"><div class="sub-title">First Settlement Date：</div></el-col>
          <el-col :span="8" v-if="detailData.firstSettlementDate"><div class="grid-content">{{detailData.firstSettlementDate | dateFormat}}</div></el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="4" v-if="detailData.maturityDate"><div class="sub-title">Maturity Date：</div></el-col>
          <el-col :span="8" v-if="detailData.maturityDate"><div class="grid-content">{{detailData.maturityDate | dateFormat}}</div></el-col>
          <el-col :span="4" v-if="detailData.redemptionDate"><div class="sub-title">Redemption Date：</div></el-col>
          <el-col :span="8" v-if="detailData.redemptionDate"><div class="grid-content">{{detailData.redemptionDate | dateFormat}}</div></el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="4"><div class="sub-title">Disbursement Token：</div></el-col>
          <el-col :span="8"><div class="grid-content">{{detailData.disbursementCode }}</div></el-col>
          <el-col :span="4"><div class="sub-title">Callable Bond：</div></el-col>
          <el-col :span="8"><div class="grid-content">{{!!detailData.callable ? 'Callable' : 'Non-Callable'}}</div></el-col>
        </el-row>
        <el-row :gutter="20" v-if="detailData.couponPeriods">
          <el-col :span="4"><div class="sub-title">Coupon Payment Date：</div></el-col>
        </el-row>
        <template v-if="detailData.couponPeriods">
          <div class="payment-date-table" v-for="(val, key) in paymentTableList" :key="key">
            <el-table :data="val.tableData" stripe>
              <template v-for="(v, k) in val.tableColumn">
                <el-table-column
                  :key="k"
                  :prop="v.prop"
                  :width="v.width"
                  :label="v.label">
                </el-table-column>
              </template>
            </el-table>
          </div>
        </template>
        <!-- <el-row :gutter="20" v-if="detailData.callable">
          <el-col :span="5"><div class="sub-title">Callable Bond：</div></el-col>
          <el-col :span="19"><div class="grid-content">{{detailData.callable ? 'Callable' : 'Non-Callable'}}</div></el-col>
        </el-row>
        <el-row :gutter="20" v-if="detailData.callableDate">
          <el-col :span="5"><div class="sub-title">Callable Dates：</div></el-col>
        </el-row>
        <div v-if="detailData.callableDate" class="payment-date-table">
          <template v-for="(val, key) in callableTableList">
            <el-table :data="val.tableData" stripe style="margin-bottom: 23px;" :key="key">
              <template v-for="(v, k) in val.tableColumn">
                <el-table-column
                  v-if="k > 0"
                  :key="k"
                  :prop="v.prop"
                  :width="v.width"
                  :label="v.label">
                  <template slot-scope="scope" v-if="k > 0">
                    <span>{{formatDate(scope.row[v.prop])}}</span>
                  </template>
                </el-table-column>
                <el-table-column
                  v-else
                  :key="k"
                  :prop="v.prop"
                  :width="v.width"
                  :label="v.label">
                </el-table-column>
              </template>
            </el-table>
          </template>
        </div> -->
        <!-- <el-row :gutter="20" v-if="detailData.callableDate">
          <el-col :span="19" v-for="(val, key) in callableTableList" :key="key">
            <div v-if="detailData.callableDate">
              <span v-for="(v, k) in detailData.callableDate.split(',')" :key="k">{{formatDate(v)}}、</span>
            </div>
          </el-col>
        </el-row> -->
        <el-row :gutter="20" v-if="detailData.disbursementToken">
          <el-col :span="4" v-if="detailData.disbursementToken"><div class="sub-title">Disbursement Token：</div></el-col>
          <el-col :span="20" v-if="detailData.disbursementToken"><div class="grid-content">{{settlementTokenDesc(detailData.disbursementToken)}}</div></el-col>
          <!-- <el-col :span="6" v-if="detailData.disbursementTokenAddress"><div class="sub-title">Disbursement Address(Contract)：</div></el-col>
          <el-col :span="6" v-if="detailData.disbursementTokenAddress"><div class="grid-content">{{detailData.disbursementTokenAddress}}</div></el-col> -->
        </el-row>
        <p class="head-title" v-if="detailData.privacyFile || detailData.publicFile">Docs</p>
        <el-row :gutter="20" v-if="detailData.privacyFile">
          <el-col :span="4"><div class="sub-title">Documents(Private)</div></el-col>
        </el-row>
         <picture-item :data="documentPrivacyList" />
        <!-- <div class="document-list" v-if="detailData.privacyFile">
          <div class="document-item" v-for="(v, k) in documentPrivacyList" :key="k">
            <p class="document-item-title">{{v.name}}</p>
            <p class="document-item-img">
              <img :src="v.src" alt="logo">
            </p>
          </div>
        </div> -->
        <el-row :gutter="20" v-if="detailData.publicFile">
          <el-col :span="4"><div class="sub-title">Documents(Public)</div></el-col>
        </el-row>
        <picture-item :data="documentPublicList" />
        <!-- <div class="document-list" v-if="detailData.publicFile">
          <div class="document-item" v-for="(v, k) in documentPublicList" :key="k">
            <p class="document-item-title">{{v.name}}</p>
            <p class="document-item-img">
              <img :src="v.src" alt="logo">
            </p>
          </div>
        </div> -->
        <template v-if="($route.query.state == 4 && $route.query.type === 'View')  || ($route.query.state == 5 && $route.query.type === 'View')">
          <p class="head-title" v-if="detailData.updateTime || detailData.txId || detailData.contractAddress">On-Chain Information</p>
          <el-row :gutter="20" v-if="$route.query.state == 4 && detailData.updateTime">
            <el-col :span="4"><div class="sub-title">Issue Date：</div></el-col>
            <el-col :span="20"><div class="grid-content">{{detailData.updateTime | dateFormat}}</div></el-col>
          </el-row>
          <el-row :gutter="20" v-if="detailData.txId">
            <el-col :span="5"><div class="sub-title">TX ID：</div></el-col>
            <el-col :span="18">
              <div class="grid-content">
                <a class="link-txt" :href="browserUrltxId(detailData.txId)" target="_blank">{{detailData.txId}}</a>
              </div>
            </el-col>
          </el-row>
          <el-row :gutter="20" v-if="detailData.contractAddress">
            <el-col :span="5"><div class="sub-title">Contract Address：</div></el-col>
            <el-col :span="18">
              <div class="grid-content">
                <a class="link-txt" :href="browserUrlAddress(detailData.contractAddress)" target="_blank">{{detailData.contractAddress}}</a>
              </div>
            </el-col>
          </el-row>
        </template>
        <p class="head-title" v-if="detailData.kycList && detailData.kycList.length">Trade Restrictions</p>
        <!-- <p class="head-title" v-if="kycInstitutional.length">Institutional</p> -->
        <!-- <el-row :gutter="20">
          <el-col :span="5"><div>Country of Incorporation</div></el-col>
        </el-row> -->
        <div class="select-country" v-if="filterCountryData('kycInstitutional', 1).length">
          <p class="country-title">Institutional Investor【Permit】</p>
          <!-- instituPermitted -->
          <el-table border :data="filterCountryData('kycInstitutional', 1)" style="width: 100%">
            <el-table-column prop="countryName" label="Country of Incorporation"></el-table-column>
            <el-table-column prop="residencyName" label="Country of Operation"></el-table-column>
          </el-table>
        </div>
        <div class="select-country" v-if="filterCountryData('kycInstitutional', 2).length">
          <p class="country-title">Institutional Investor【Prohibit】</p>
          <!-- instituProhibited -->
          <el-table border :data="filterCountryData('kycInstitutional', 2)" style="width: 100%">
            <el-table-column prop="countryName" label="Country of Incorporation"></el-table-column>
            <el-table-column prop="residencyName" label="Country of Operation"></el-table-column>
          </el-table>
        </div>
        <!-- <p class="head-title" v-if="kycIndividual.length">Individual</p> -->
        <div class="select-country" v-if="filterCountryData('kycIndividual', 1).length">
          <p class="country-title">Individual Investor【Permit】</p>
          <!-- indiviPermitted -->
          <el-table border :data="filterCountryData('kycIndividual', 1)" style="width: 100%">
            <el-table-column prop="countryName" label="Country"></el-table-column>
            <el-table-column prop="type" label="Type"></el-table-column>
            <el-table-column prop="risk" label="Risk Tolerance"></el-table-column>
            <el-table-column prop="residencyName" label="Residency"></el-table-column>
          </el-table>
        </div>
        <div class="select-country" v-if="filterCountryData('kycIndividual', 2).length">
          <p class="country-title">Individual Investor【Prohibit】</p>
          <!-- indiviProhibited -->
          <el-table border :data="filterCountryData('kycIndividual', 2)" style="width: 100%">
            <el-table-column prop="countryName" label="Country"></el-table-column>
            <el-table-column prop="type" label="Type"></el-table-column>
            <el-table-column prop="risk" label="Risk Tolerance"></el-table-column>
            <el-table-column prop="residencyName" label="Residency"></el-table-column>
          </el-table>
        </div>
        <!-- <div class="country-type">
          <template
            v-if="getKycInfo(kycEnums.investorInstitu, kycEnums.kycCountry, kycEnums.permit).length"
          >
             <p class="left">Permitted</p>
             <p class="right">
               {{ getKycInfo(kycEnums.investorInstitu, kycEnums.kycCountry, kycEnums.permit).map(item => item.country).join('、') }}
            </p>
          </template>
          <template v-else-if="getKycInfo(kycEnums.investorInstitu, kycEnums.kycCountry, kycEnums.prohibited).length">
             <p class="left">Prohibited</p>
             <p class="right">{{ getKycInfo(kycEnums.investorInstitu, kycEnums.kycCountry, kycEnums.prohibited).map(item => item.country).join('、') }}</p>
          </template>
        </div>
        <el-row :gutter="20">
          <el-col :span="5"><div>Country of Operation</div></el-col>
        </el-row>
        <div class="country-type">
          <template v-if="getKycInfo(kycEnums.investorInstitu, kycEnums.kycResidency, kycEnums.permit).length">
            <p class="left">Permitted</p>
            <p class="right">{{ getKycInfo(kycEnums.investorInstitu, kycEnums.kycResidency, kycEnums.permit).map(item => item.country).join('、') }}</p>
          </template>
          <template v-else-if="getKycInfo(kycEnums.investorInstitu, kycEnums.kycResidency, kycEnums.prohibited).length">
             <p class="left">Prohibited</p>
             <p class="right">{{ getKycInfo(kycEnums.investorInstitu, kycEnums.kycResidency, kycEnums.prohibited).map(item => item.country).join('、') }}</p>
          </template>
        </div> -->
        <!-- <p class="head-title">Individual</p>
        <el-row :gutter="20">
          <el-col :span="5"><div>Nationality</div></el-col>
        </el-row>
        <div class="nationality-table">
          <template v-if="getKycInfo(kycEnums.investorIndivi, kycEnums.kycCountry, kycEnums.permit).length">
            <div class="nationality-left">Permitted</div>
            <el-table :data="getKycInfo(kycEnums.investorIndivi, kycEnums.kycCountry, kycEnums.permit)" stripe style="width: 835px;" border>
              <template v-for="(v, k) in nationalityTableColumn">
                <el-table-column :prop="v.prop" :label="v.label" :key="k" align="center">
                </el-table-column>
              </template>
            </el-table>
          </template>
          <template v-else-if="getKycInfo(kycEnums.investorIndivi, kycEnums.kycCountry, kycEnums.prohibited).length">
            <div class="nationality-left">Prohibited</div>
            <el-table :data="getKycInfo(kycEnums.investorIndivi, kycEnums.kycCountry, kycEnums.prohibited)" stripe style="width: 835px;" border>
              <template v-for="(v, k) in nationalityTableColumn">
                <el-table-column :prop="v.prop" :label="v.label" :key="k" align="center">
                </el-table-column>
              </template>
            </el-table>
          </template>
        </div>
        <el-row :gutter="20">
          <el-col :span="5"><div>Country of Operation</div></el-col>
        </el-row>
        <div class="country-type">
          <template v-if="getKycInfo(kycEnums.investorIndivi, kycEnums.kycResidency, kycEnums.permit).length">
            <p class="left">Permitted</p>
            <p class="right">{{ getKycInfo(kycEnums.investorIndivi, kycEnums.kycResidency, kycEnums.permit).map(item => item.country).join('、') }}</p>
          </template>
          <template v-else-if="getKycInfo(kycEnums.investorIndivi, kycEnums.kycResidency, kycEnums.prohibited).length">
            <p class="left">Prohibited</p>
            <p class="right">{{ getKycInfo(kycEnums.investorIndivi, kycEnums.kycResidency, kycEnums.prohibited).map(item => item.country).join('、') }}</p>
          </template>
        </div> -->
        <template v-if="$route.query.type === 'Review'">
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
        <div class="form-btns" v-if="$route.query.type === 'Review'">
          <el-button @click="$router.push({ name: 'DisIssueBondsRestrictions' })">Previous</el-button>
          <el-button type="primary">Next</el-button>
        </div>
        <div class="form-btns" v-if="$route.query.state === undefined">
          <el-button @click="$router.push({ name: 'DisIssueBondsRestrictions', query: { serialNo: $route.query.serialNo} })">Previous</el-button>
          <el-button type="primary" @click="secondPwdDialogVisible = true">Submit</el-button>
        </div>
        <div class="return-btn" v-else>
          <el-button type="primary" @click="$router.push({ name: 'IssuanceBondsList' })">Return</el-button>
        </div>
      </div>
    </div>
    <element-dialog
      :visible.sync="secondPwdDialogVisible"
      v-loading="secondaryPwdloading"
    >
      <el-form ref="secondPwdForm" :model="secondPwdForm" :rules="secondPwdRules"
        label-width="176px" label-position="left" @submit.native.prevent>
        <el-form-item label="Secondary Password：" prop="secondaryPwd">
          <el-input v-model.trim="secondPwdForm.secondaryPwd" type="password"></el-input>
        </el-form-item>
      </el-form>
      <template v-slot:footers>
        <el-button type="primary" @click="handleSecondaryPwd" style="width: 100px;height:40px;">Submit</el-button>
      </template>
    </element-dialog>
  </div>
</template>
<script>
import {
  getReviewDetails,
  getSecurityInfo,
  issueSubmit
} from '@/api/distribution-center';
import moment from 'moment';
import PictureItem from '@/components/PictureItem.vue';
import { debtSeniorityList } from '@/common/enums.js';
import { notify, secondaryPwdReg, encryptSecondPwd, calculatePeriod } from '@/common/util';

export default {
  name: '',
  data () {
    const kycEnums = {
      permit: 1, // permitted: 1:Permitted 2: prohibited
      prohibited: 2, // permitted: 1:Permitted 2: prohibited
      kycCountry: 1, // kycType: 1:NATIONAL 2: Residency
      kycResidency: 2, // kycType: 1:NATIONAL 2: Residency
      investorInstitu: 0, // investorType 0 institutional, 1 individual
      investorIndivi: 1 // investorType 0 institutional, 1 individual
    };
    return {
      kycEnums,
      secondPwdDialogVisible: false,
      secondaryPwdloading: false,
      isActiveSMTA: false,
      reviewStatus: true,
      couponFrequencyList: [
        {
          label: 'Quarterly',
          value: '0'
        },
        {
          label: 'Semi-annually',
          value: '1'
        },
        {
          label: 'Annually',
          value: '2'
        }
      ],
      securityTypeList: [
        {
          label: 'Bonds',
          value: '0'
        }
      ],
      dayCountConventionList: [
        {
          label: '30 / 360',
          value: '0'
        }, {
          label: '30 / 365',
          value: '1'
        }, {
          label: 'Actual / 360',
          value: '2'
        }, {
          label: 'Actual / 365',
          value: '3'
        }, {
          label: 'Actual / Actual',
          value: '4'
        }
      ],
      bondsTypeList: [
        {
          label: 'Asset-backed Security',
          value: '0'
        }, {
          label: 'Corporate',
          value: '1'
        }, {
          label: 'High Yield Corporate',
          value: '2'
        }, {
          label: 'Sovereign',
          value: '3'
        }, {
          label: 'Quasi-Sovereign',
          value: '4'
        }
      ],
      // [
      //   {
      //     label: 'Government Bonds',
      //     value: '0'
      //   }, {
      //     label: 'Corporate Bonds',
      //     value: '1'
      //   }, {
      //     label: 'Certificates of Deposits',
      //     value: '2'
      //   }, {
      //     label: 'Others',
      //     value: '3'
      //   }
      // ],
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
      // SMTAtableData: [],
      paymentTableColumn: [],
      paymentTableData: [],
      paymentTableList: [],
      callableTableList: [],
      callableTableColumn: [],
      callableTableData: [],
      documentPrivacyList: [],
      documentPublicList: [],
      nationalityTableColumn: [
        {
          label: 'Country',
          prop: 'country'
        }, {
          label: 'Type',
          prop: 'investor'
        }, {
          label: 'Risk Tolerance',
          prop: 'riskTolerance'
        }
      ],
      nationalityTableData: [
        {
          country: 'country',
          type: 'type',
          riskTolerance: 'riskTolerance'
        }, {
          country: 'country',
          type: 'type',
          riskTolerance: 'riskTolerance'
        }
      ],
      detailData: {},
      kycInstitutional: [], // institutional kyc info
      kycIndividual: [], // individual kyc info
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
                // eslint-disable-next-line
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
  created () {
    if (this.$route.query.type === 'Step') {
      this.getStepDetail();
    } else {
      this.getDetail();
    }
  },
  computed: {
    bowserUrl () {
      return this.$store.state.common.systemConfig.blockBrowserUrl;
    },
    debtSeniorityComputed () {
      const obj = debtSeniorityList.filter(v => v.value === this.detailData.debtSeniority)[0] || {};
      return obj.label;
    },
    instituPermitted () {
      // const data = [];
      // this.kycInstitutional.filter(x => x.permitted == 1).forEach(item => {
      //   data.push(...item.countryList);
      // });
      // return data || [];
      return this.filterCountryData('kycInstitutional', 1);
    },
    instituProhibited () {
      // const data = [];
      // this.kycInstitutional.filter(x => x.permitted == 2).forEach(item => {
      //   data.push(...item.countryList);
      // });
      // return data || [];
      return this.filterCountryData('kycInstitutional', 2);
    },
    indiviPermitted () {
      // const data = [];
      // this.kycIndividual.filter(x => x.permitted == 1).forEach(item => {
      //   data.push(...item.countryList);
      // });
      // return data || [];
      return this.filterCountryData('kycIndividual', 1);
    },
    indiviProhibited () {
      // const data = [];
      // this.kycIndividual.filter(x => x.permitted == 2).forEach(item => {
      //   data.push(...item.countryList);
      // });
      // return data || [];
      return this.filterCountryData('kycIndividual', 2);
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
    'picture-item': PictureItem
  },
  methods: {
    // // // 获取机构下的数据
    // kycInstituData (kycType, permitType) {
    //   const data = this.kycInstitutional.filter(x => x.kycType === kycType) || [];
    //   return data.filter(x => x.permitted === permitType) || [];
    // },
    // // 获取个人下的数据
    // kycIndiviDatas (kycType, permitType) {
    //   const data = this.kycIndividual.filter(x => x.kycType === kycType) || [];
    //   return data.filter(x => x.permitted === permitType) || [];
    // },
    // getKycInfo (investorType, kycType, permitType) {
    //   const obj = {
    //     0: this.kycInstitutional,
    //     1: this.kycIndividual
    //   };
    //   const data = obj[investorType].filter(x => x.kycType === kycType) || [];
    //   return data.filter(x => x.permitted === permitType) || [];
    // },
    filterCountryData (kycType, permitType) {
      const data = [];
      this[kycType].filter(x => x.permitted === permitType).forEach(item => {
        data.push(...item.countryList);
      });
      return data || [];
    },
    browserUrltxId (id) {
      const url = this.bowserUrl;
      return url ? `${url}/#/txidDetails?id=${id}` : 'javascript:void(0);';
    },
    browserUrlAddress (id) {
      const url = this.bowserUrl;
      return url ? `${url}/#/addressDetail?address=${id}` : 'javascript:void(0);';
    },
    couponRateDesc (num) {
      // return parseInt(num) + '%';
      return num + '%';
    },
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
    // async SMTDetail () {
    //   const data = await getSMTDetail({
    //     smtCode: this.detailData.smtCode
    //   }).catch(() => {});
    //   if (data && data.code === '1000') {
    //     this.SMTAtableData = data.data || [];
    //   }
    // },
    settlementTokenDesc (desc, type) {
      if (!desc) return '';
      const arr = ['Digital Currency', 'Certificate'];
      const str = desc.split(',') || [];
      if (str[1] !== "''") {
        if (type !== 'info') {
          return arr[str[0]] + ' - ' + str[1] + str[2];
        } else {
          return `${arr[str[0]]}-${str[1]}`; // str[1] + ' ' + arr[str[0]];
        }
      } else {
        return `${arr[str[0]]}-${str[2]}`;
        // str[2] + ' ' + arr[str[0]];
      }
    },
    formatDate (num) {
      if (Number(num)) {
        return moment(new Date(Number(num))).format('YYYY-MM-DD HH:mm:ss');
      } else {
        return moment(new Date(num)).format('YYYY-MM-DD HH:mm:ss');
      }
    },
    async getDetail () {
      this.loading = true;
      const data = await getReviewDetails({
        serialNo: this.$route.query.serialNo,
        slient: true,
        notify: notify.error
      }).catch(() => {
        this.loading = false;
      });
      if (!data) return;

      this.loading = false;
      if (data.code === '1000') {
        this.detailData = Object.assign(this.detailData, data.data);
        const kycList = this.detailData.kycList || [];
        this.kycInstitutional = kycList.filter(item => item.investorType === 0) || [];
        this.kycIndividual = kycList.filter(item => item.investorType === 1) || [];
        // this.SMTDetail();
        if (this.detailData.privacyFile) {
          this.documentPrivacyList = this.detailData.privacyFile;
          this.documentPrivacyList.forEach(v => {
            v.src = '/v1/asset/file/readFile?id=' + v.id;
          });
        }
        if (this.detailData.publicFile) {
          this.documentPublicList = this.detailData.publicFile; // JSON.parse(this.detailData.publicFile);
          this.documentPublicList.forEach(v => {
            v.src = '/v1/asset/file/readFile?id=' + v.id;
          });
        }
        if (this.detailData.firstSettlementDate && this.detailData.couponPeriods) {
          let tableDatas = calculatePeriod(new Date(this.detailData.firstSettlementDate), this.detailData.couponFrequency, this.detailData.couponPeriods);
          for (let i = 0; i < Math.ceil(parseInt(this.detailData.couponPeriods) / 6); i++) {
            this.paymentTableList.push({
              tableColumn: [],
              tableData: []
            });
          }
          for (let i = 1; i <= parseInt(this.detailData.couponPeriods); i++) {
            this.paymentTableColumn.push({
              label: i + '/' + this.detailData.couponPeriods,
              prop: i + '/' + this.detailData.couponPeriods,
              width: 150
            });
          }
          this.paymentTableData = tableDatas.map(v => {
            return {
              [v.periods]: v.time
            };
          });
          const columnArr = [];
          const dataArr = [];
          for (let i = 0; i < this.paymentTableColumn.length; i += 6) {
            const column = [{
              label: 'Coupon Periods',
              prop: 'couponPeriods',
              width: 125
            }];
            column.push(...this.paymentTableColumn.slice(i, i + 6));
            columnArr.push(column);
          }
          for (let i = 0; i < this.paymentTableData.length; i += 6) {
            const data = [{
              couponPeriods: 'Timestamp'
            }];
            this.paymentTableData.slice(i, i + 6).forEach(v => {
              data[0][Object.keys(v)[0]] = v[Object.keys(v)[0]];
            });
            dataArr.push(data);
          }

          this.paymentTableList.forEach((v, k) => {
            v.tableColumn = columnArr[k];
            v.tableData = dataArr[k];
          });
          const lastColumn = this.paymentTableList[this.paymentTableList.length - 1].tableColumn;
          this.paymentTableList[this.paymentTableList.length - 1].tableColumn[lastColumn.length - 1].label = lastColumn[lastColumn.length - 1].label + ' (Redemption)';
        }

        if (this.detailData.callableDate) {
          for (let i = 0; i < Math.ceil(this.detailData.callableDate.split(',').length / 6); i++) {
            this.callableTableList.push({
              tableColumn: [],
              tableData: []
            });
          }
          for (let i = 1; i <= this.detailData.callableDate.split(',').length; i++) {
            this.callableTableColumn.push({
              label: i + '',
              prop: i + '',
              width: 155
            });
            this.callableTableData.push({
              [i]: this.detailData.callableDate.split(',')[i - 1]
            });
          }
          const columnArr = [];
          const dataArr = [];
          for (let i = 0; i < this.callableTableColumn.length; i += 6) {
            const column = [{
              label: 'Serial Number',
              prop: 'serialNumber',
              width: 125
            }];
            column.push(...this.callableTableColumn.slice(i, i + 6));
            columnArr.push(column);
          }
          for (let i = 0; i < this.callableTableData.length; i += 6) {
            const data = [{
              serialNumber: 'Timestamp'
            }];
            this.callableTableData.slice(i, i + 6).forEach(v => {
              data[0][Object.keys(v)[0]] = v[Object.keys(v)[0]];
            });
            dataArr.push(data);
          }
          this.callableTableList.forEach((v, k) => {
            v.tableColumn = columnArr[k];
            v.tableData = dataArr[k];
          });
          // const lastColumn = this.callableTableList[this.callableTableList.length - 1].tableColumn;
          // this.callableTableList[this.callableTableList.length - 1].tableColumn[lastColumn.length - 1].label = lastColumn[lastColumn.length - 1].label + ' (Redemption)';
        }
      }
    },
    // async stepSubmit () {
    // this.secondPwdDialogVisible = true;
    // const params = Object.assign({}, this.detailData);
    // if (this.detailData.privacyFile) {
    //   params.privacyFile = JSON.parse(this.detailData.privacyFile).map(v => v.id).join(',') || null;
    // }
    // if (this.detailData.publicFile) {
    //   params.publicFile = JSON.parse(this.detailData.publicFile).map(v => v.id).join(',') || null;
    // }
    // this.loading = true;
    // const data = await issueSubmit({ data: params, slient: true, notify: notify.any });
    // if (data.code === '1000') {
    //   this.$router.push({
    //     name: 'Securities'
    //   });
    // }
    // this.loading = false;
    // },
    async getStepDetail () {
      this.loading = true;
      const data = await getSecurityInfo({
        serialNo: this.$route.query.serialNo,
        notify: notify.error,
        slient: true
      }).catch(() => {
        this.loading = false;
      });
      if (!data) return;

      this.loading = false;
      if (data.code === '1000') {
        this.detailData = Object.assign(this.detailData, data.data);
        const kycList = this.detailData.kycList || [];
        this.kycInstitutional = kycList.filter(item => item.investorType === 0) || [];
        this.kycIndividual = kycList.filter(item => item.investorType === 1) || [];
        // this.SMTDetail();
        if (this.detailData.privacyFile) {
          this.documentPrivacyList = this.detailData.privacyFile;
          this.documentPrivacyList.forEach(v => {
            v.src = '/v1/asset/file/readFile?id=' + v.id;
          });
        }
        if (this.detailData.publicFile) {
          this.documentPublicList = this.detailData.publicFile; // JSON.parse(this.detailData.publicFile);
          this.documentPublicList.forEach(v => {
            v.src = '/v1/asset/file/readFile?id=' + v.id;
          });
        }
        if (this.detailData.firstSettlementDate && this.detailData.couponPeriods) {
          let tableDatas = calculatePeriod(new Date(this.detailData.firstSettlementDate), this.detailData.couponFrequency, this.detailData.couponPeriods);
          for (let i = 0; i < Math.ceil(parseInt(this.detailData.couponPeriods) / 6); i++) {
            this.paymentTableList.push({
              tableColumn: [],
              tableData: []
            });
          }
          for (let i = 1; i <= parseInt(this.detailData.couponPeriods); i++) {
            this.paymentTableColumn.push({
              label: i + '/' + this.detailData.couponPeriods,
              prop: i + '/' + this.detailData.couponPeriods,
              width: 150
            });
          }
          this.paymentTableData = tableDatas.map(v => {
            return {
              [v.periods]: v.time
            };
          });
          const columnArr = [];
          const dataArr = [];
          for (let i = 0; i < this.paymentTableColumn.length; i += 6) {
            const column = [{
              label: 'Coupon Periods',
              prop: 'couponPeriods',
              width: 135
            }];
            column.push(...this.paymentTableColumn.slice(i, i + 6));
            columnArr.push(column);
          }
          for (let i = 0; i < this.paymentTableData.length; i += 6) {
            const data = [{
              couponPeriods: 'Timestamp'
            }];
            this.paymentTableData.slice(i, i + 6).forEach(v => {
              data[0][Object.keys(v)[0]] = v[Object.keys(v)[0]];
            });
            dataArr.push(data);
          }

          this.paymentTableList.forEach((v, k) => {
            v.tableColumn = columnArr[k];
            v.tableData = dataArr[k];
          });

          const lastPaymentTableList = this.paymentTableList[this.paymentTableList.length - 1].tableData[0];
          const objKeyArr = Object.keys(lastPaymentTableList);
          lastPaymentTableList[objKeyArr[objKeyArr.length - 1]] = moment(this.detailData.redemptionDate).format('YYYY-MM-DD HH:mm:ss');

          const lastColumn = this.paymentTableList[this.paymentTableList.length - 1].tableColumn;
          this.paymentTableList[this.paymentTableList.length - 1].tableColumn[lastColumn.length - 1].label = lastColumn[lastColumn.length - 1].label + ' (Redemption)';
        }

        if (this.detailData.callableDate) {
          for (let i = 0; i < Math.ceil(this.detailData.callableDate.split(',').length / 6); i++) {
            this.callableTableList.push({
              tableColumn: [],
              tableData: []
            });
          }
          for (let i = 1; i <= this.detailData.callableDate.split(',').length; i++) {
            this.callableTableColumn.push({
              label: i + '',
              prop: i + '',
              width: 154
            });
            this.callableTableData.push({
              [i]: this.detailData.callableDate.split(',')[i - 1]
            });
          }
          const columnArr = [];
          const dataArr = [];
          for (let i = 0; i < this.callableTableColumn.length; i += 6) {
            const column = [{
              label: 'Serial Number',
              prop: 'serialNumber',
              width: 135
            }];
            column.push(...this.callableTableColumn.slice(i, i + 6));
            columnArr.push(column);
          }
          for (let i = 0; i < this.callableTableData.length; i += 6) {
            const data = [{
              serialNumber: 'Timestamp'
            }];
            this.callableTableData.slice(i, i + 6).forEach(v => {
              data[0][Object.keys(v)[0]] = v[Object.keys(v)[0]];
            });
            dataArr.push(data);
          }
          this.callableTableList.forEach((v, k) => {
            v.tableColumn = columnArr[k];
            v.tableData = dataArr[k];
          });
          // const lastColumn = this.callableTableList[this.callableTableList.length - 1].tableColumn;
          // this.callableTableList[this.callableTableList.length - 1].tableColumn[lastColumn.length - 1].label = lastColumn[lastColumn.length - 1].label + ' (Redemption)';
        }
      }
    },
    handleSecondaryPwd () {
      this.$refs.secondPwdForm.validate(async valid => {
        if (!valid) return;
        // const addressObj = this.$store.state.common.IssuanceAddress.securities || {};
        // const address = addressObj.address;
        const params = Object.assign({}, this.detailData);

        // if (this.detailData.privacyFile) {
        //   params.privacyFile = JSON.parse(this.detailData.privacyFile).map(v => v.id).join(',') || null;
        // }
        // if (this.detailData.publicFile) {
        //   params.publicFile = JSON.parse(this.detailData.publicFile).map(v => v.id).join(',') || null;
        // }
        this.secondaryPwdloading = true;
        const data = await issueSubmit({
          data: {
            ...params,
            secondaryPwd: encryptSecondPwd(this.secondPwdForm.secondaryPwd),
            // issuanceAddress: address,
            ownerAddress: params.issuanceAddress
          },
          slient: true,
          notify: notify.any
        }).catch(() => {
          this.secondaryPwdloading = false;
          this.secondPwdDialogVisible = false;
        });
        this.secondaryPwdloading = false;
        if (data.code === '1000') {
          this.secondPwdDialogVisible = false;
          this.$router.push({
            name: 'DisIssueBondsSubmitSuccess'
          });
        }
      });
    }
  }
};
</script>
<style scoped lang="scss">
.view-detail {
  // width: 1200px;
  // margin: 0 auto;
  font-size: 14px; //16px;
  color: #001F3B;
  // margin-bottom: 117px;
  .el-breadcrumb {
    height: 60px;
    display: flex;
    align-items: center;
  }
  .view-content {
    // box-shadow: 0 2px 28px 0 rgba(166,193,255,0.38);
    // border-radius: 4px;
    // padding: 0 30px; //30px;
    // background-color: #fff;
    .headlines {
      font-size: 28px;
      color: #001F3B;
    }
    .view-item {
      padding: 0  42px; // 12px;//40px;
      .head-title {
        font-size: 20px;
        margin-bottom: 20px;
        // margin-top: 40px;
        font-weight: 600;
      }
      .grid-content {
        overflow-wrap: break-word;
        word-break: keep-all;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }
      .sub-title {
        width: 150px;
        color: #8D93A1;
      }
      .el-row {
        display: flex;
        align-items: center;
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
      .terms-conditions {
        max-height: 800px;
        overflow: auto;
      }
    }
  }
  // .link-txt {
  //   color: #214285;
  //   &:hover {
  //     text-decoration: underline;
  //     color: #497EB9;
  //   }
  // }
  .select-country {
    margin-bottom: 30px;
    .country-title {
      margin-bottom: 14px;
      color: #8D93A1;
      font-size: 16px;
    }
    /deep/ .el-table {
      th {
        background-color: #FBFBFB;
        &:first-child {
          .cell {
            padding-left: 42px;
          }
        }
      }
      .el-table__body {
        td:first-child {
          .cell {
            padding-left: 42px;
          }
        }
      }
    }
  }
}
</style>
<style lang="scss">
.view-detail {
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
                  word-break: break-word;
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
      .payment-date-table {
        .el-table {
          &::after {
            display: none;
          }
          .el-table__header {
            border-top: 1px solid #EBEEF5;
            border-left: 1px solid #EBEEF5;
            th {
              border-right: 1px solid #EBEEF5;
            }
          }
          .el-table__body {
            border-left: 1px solid #EBEEF5;
            td {
              border-right: 1px solid #EBEEF5;
            }
          }
        }
      }
    }
  }
}
</style>
