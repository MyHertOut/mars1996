<template>
  <div class="new-trade">
    <bread-crumbs :data="breadData"></bread-crumbs>
    <div class="main-container">
      <div class="title">New Trade</div>
      <div class="content-box common-steps">
        <el-steps :active="stepActive">
          <el-step title="Basic Parameters" class="step-basic"></el-step>
          <el-step title="Review" class="step-view"></el-step>
          <el-step title="End" class="step-end"></el-step>
        </el-steps>
        <div class="new-content">
          <basic @nextStep="nextStep" v-show="stepActive === 0" />
          <review @nextStep="nextStep" v-show="stepActive === 1" :submitData="submitData" />
          <div class="setp-end" v-show="stepActive === 2">
            <div class="end-status">
              <img src="../../assets/images/success.png" alt="logo" />
              <p class="success">Submitted Successfully</p>
              <p class="desc">
                Please wait patiently while the Trade is in creation.
                <br>
                Click on “View Progress” to view Trade  status.
              </p>
              <p class="operation">
                <span @click="$router.push({ name: 'BondTrading' })">Trade Center</span>
                <span @click="stepActive = 0;submitData = {};">Create Trade</span>
                <span @click="$router.push({ name: 'TradeHistory' })">View Progress</span>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import basic from './detail/basic';
import review from './detail/review';

export default {
  name: 'NewTrade',
  data () {
    return {
      stepActive: 0,
      breadData: [
        {
          name: 'Trade Centre'
        }, {
          name: 'Bonds',
          to: '/bond-trading'
        }, {
          name: 'New Trade'
        }
      ],
      submitData: {}
    };
  },
  methods: {
    nextStep ({ step, data, status }) {
      this.submitData = data;
      this.stepActive = step;
    }
  },
  components: {
    basic,
    review
  }
};
</script>
<style scoped lang="scss">
.new-trade {
  .main-container {
    & > .title {
      font-size: 26px;
      color: #001F3B;
      margin-bottom: 40px;
    }
    .setp-end {
      padding: 0 269px 0 206px;
      .end-status {
        text-align: center;
        font-size: 18px;
        img {
          width: 58px;
          height: 58px;
          margin-bottom: 14px;
        }
        p {
          margin-bottom: 10px;
        }
        .desc {
          font-size: 14px;
          color: #192231;
          margin-bottom: 25px;
        }
        .operation {
          display: flex;
          align-items: center;
          justify-content: space-between;
          width: 380px;
          margin: 0 auto;
          span {
            font-size: 14px;
            color: #497EB9;
            cursor: pointer;
            display: inline-block;
            padding: 10px 15px;
            border-radius: 5px;
            border: 1px solid #497EB9;
          }
        }
        .success {
          color: #52B88F;
        }
      }
    }
  }
}
</style>
<style lang="scss">
.new-trade  {
  .el-steps {
    margin-bottom: 62px;
    padding: 0 269px 0 206px;
    .is-text {
      .el-step__icon-inner {
        display: none;
      }
    }
    .step-view {
      .el-step__title {
        position: relative;
        left: -10px;
      }
    }
    .step-basic {
      .el-step__title {
        position: relative;
        left: -45px;
      }
    }
  }
}
</style>
