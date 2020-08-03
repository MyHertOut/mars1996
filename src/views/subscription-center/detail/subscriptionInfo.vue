<template>
  <div class="subscription-instructions">
    <el-steps :active="activeStep">
      <el-step :title="`${formatTime(data.orderStartTime)} - ${formatTime(data.orderEndTime)}`" description="Subscription Period"></el-step>
      <el-step :title="`${formatTime(data.firstSettlementDate)}`" description="First Settlement Date" class="settlement"></el-step>
      <el-step :title="`${formatTime(data.redemptionDate)}`" description="Redemption Date" class="redemption"></el-step>
    </el-steps>
    <div class="instructions-info">
      <!-- <div class="instructions-info-box">
        <div class="instructions-info-title">Subscription Time and Quantity:</div>
        <ul>
          <li>The total subscription time is 9 hours.</li>
          <li>Users can subscribe within the subscription time range.</li>
          <li>The opening date of subscription is 9:00 on September 22, 2019, and the closing date is 18:00 on September 22, 2019.</li>
          <li>The total number of subscriptions is 2,000,000 GATE.</li>
          <li>Minimum order of 1000 per user per single transaction.</li>
        </ul>
      </div>
      <div class="instructions-info-box">
        <div class="instructions-info-title">Methods and Rules of Subscription:</div>
        <ul>
          <li>The system will start to calculate interest at T(completion date)+1.</li>
          <li>Successful subscription will pay the corresponding currency, and obtain the equivalent bond.</li>
        </ul>
      </div>
      <div class="instructions-info-box">
        <div class="instructions-info-title">Rules for Repurchase and Equity Issuance:</div>
        <ul>
          <li>This bond pays monthly interest for a total of 10 periods.</li>
          <li>This bond supports early repurchase.</li>
          <li>This bond will mature on March 24, 2020, the same day the system will conduct the repurchase, and the principal part and the income part will be transferred to the User account within the same day.</li>
        </ul>
      </div> -->
      <pre>{{data.content}}</pre>
    </div>
  </div>
</template>

<script>
import { formatDate } from '@/common/util';

export default {
  name: 'subscriptionInstructions',
  data () {
    return {
      activeStep: 0
    };
  },
  watch: {
    data (n, o) {
      this.calculateStep(n);
    }
  },
  props: ['data'],
  created () {
    this.calculateStep(this.data);
  },
  methods: {
    calculateStep (n) {
      let now = Date.now();
      if (now < n.orderStartTime) {
        this.activeStep = 0;
      } else if (now > n.orderStartTime && now < n.orderEndTime) {
        this.activeStep = 0;
      } else if (now >= n.firstSettlementDate && now < n.redemptionDate) {
        this.activeStep = 1;
      } else if (now >= n.redemptionDate) {
        this.activeStep = 2;
      }
    },
    formatTime (time) {
      return formatDate(time) || '--';
    }
  }
};
</script>
<style scoped lang="scss">
.subscription-instructions {
  padding-top: 30px;
  .el-steps {
    // padding-left: 41px;
    padding-right: 38px;
    // border-bottom: 1px solid #ECEEF5;
    padding-bottom: 14px;
    padding-left: 34px;
  }
  .instructions-info {
    padding: 24px 44px 0 44px;
    .instructions-info-box {
      margin-bottom: 30px;
      .instructions-info-title {
        font-size: 20px;
        color: #192231;
        margin-bottom: 13px;
      }
      ul {
        font-size: 16px;
        color: #616367;
        line-height: 27px;
        padding-left: 17px;
        li {
          margin-bottom: 10px;
          position: relative;
          &::after {
            content: '';
            position: absolute;
            width: 10px;
            height: 10px;
            border-radius: 50%;
            background-color: #626367;
            left: -17px;
            top: 7px;
          }
        }
      }
    }
  }
}
</style>
<style lang="scss">
.subscription-detail {
  .info-bottom {
    .page-box {
      .instructions-page {
        .el-step {
          position: relative;
          .el-step__icon {
            width: 14px;
            height: 14px;
          }
          .el-step__line {
            background-color: #e7e7e7;
          }
        }
        .is-finish, .is-process {
          font-size: 16px;
          color: #192231;
          .is-text {
            background-color: #274381;
            color: #274381;
            border: 0;
          }
        }
        .is-wait {
          font-size: 16px;
          .is-text {
            border: 0;
            background-color: #e7e7e7;
            color: #e7e7e7;
          }
        }
        .el-step__head.is-finish .el-step__line {
          background-color: #274381;
        }
        .redemption {
          width: 25px;
          .el-step__description {
            left: -100px;
          }
          .el-step__title {
            width: 150px;
            position: relative;
            right: 120px;
          }
        }
        .settlement {
          .el-step__description {
            transform: translateX(-50%);
            padding: 0;
            left: 10px;
          }
          .el-step__title {
            transform: translateX(-50%);
            position: relative;
            text-align: center;
            padding-left: 20px;
          }
        }
        .el-step__description {
          position: absolute;
          top: -20px;
          min-width: 120px;
        }
        .el-step__title.is-process {
          font-weight: normal;
        }
      }
    }
  }
}

</style>
