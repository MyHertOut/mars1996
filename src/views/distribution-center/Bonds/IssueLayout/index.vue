<template>
  <div class="distribute-bonds-layout">
    <bread-crumbs :data="breadData"></bread-crumbs>
    <div class="main-container">
      <h3 class="title">
        {{ topTitle }}
      </h3>
      <steps class="steps" :data="stepData" v-if="$route.meta.steps !== undefined"></steps>
      <router-view />
    </div>
  </div>
</template>
<script>
import BreadCrumbs from '@components/BreadCrumbs.vue';
import Steps from '@components/ElementSteps.vue';

const opTypeEnum = {
  SettlementToken: 'SettlementToken',
  bondsDetail: 'bondsDetail',
  abs: 'abs'
};
export default {
  data () {
    return {
      // breadData: [{
      //   name: 'Issuance',
      //   to: '/bonds'
      // }, {
      //   name: this.topTitle
      // }]
    };
  },
  components: {
    BreadCrumbs,
    Steps
  },
  computed: {
    metaOptype () {
      return this.$route.meta.opType;
    },
    breadData () {
      return [{
        name: 'Issuance Centre',
        to: '/issuance/bonds'
      }, {
        name: this.topTitle
      }];
    },
    topTitle () {
      const titleObj = {
        [opTypeEnum.SettlementToken]: 'Settlement Currencies Issuance',
        [opTypeEnum.abs]: 'Asset-Backed Issuance',
        [opTypeEnum.bondsDetail]: 'Details'
      };
      return titleObj[this.metaOptype] || 'Bonds Issuance';
    },
    stepData () {
      let arr = [
        'Basic Parameters',
        'Issuance Infor',
        'Coupon & Principal',
        'Docs Upload',
        'Trade Restrictions',
        'Review',
        'End'
      ];
      if (this.metaOptype === opTypeEnum.SettlementToken) {
        arr = ['Issuance Parameters', 'Review', 'End'];
      }
      return arr;
    }
  }
};
</script>

<style lang="scss" scoped>
  .distribute-bonds-layout {
    .title {
      margin-bottom: 40px;
      font-size: 24px;
      color: #001F3B;
    }
    .steps {
      margin-bottom: 60px;
    }
    /deep/.form-container {
      width: 724px;
      margin: 60px auto 0;
      .el-form-item__label {
        color: #8D93A1;
      }
      .el-select {
        width: 100%;
      }
    }
    /deep/.form-btns {
      margin-top: 100px;
      text-align: center;
      .el-button {
        width: 300px;
        height: 40px;
        font-size: 16px;
      }
      .el-button+.el-button {
        margin-left: 30px;
      }
    }
  }
</style>
