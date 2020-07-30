<template>
  <div>
    <sub-header title="Transaction History" navTitle="Asset Centre" :menus="subMenus" @handleClick="handleClick"></sub-header>
    <div class="main-container">
      <Deposit v-if="navActive === '0'"></Deposit>
      <Withdrawal v-else-if="navActive === '1'"></Withdrawal>
    </div>
  </div>
</template>
<script>
import SubHeader from '@/components/SubHeader.vue';
import Deposit from './components/Deposit.vue';
import Withdrawal from './components/Withdrawal.vue';
export default {
  name: 'MoneyRecord',
  data () {
    return {
      navActive: '0',
      subMenus: [{
        name: 'Deposit',
        key: '0',
        functionCode: 'assetHistory.deposit.list'
      }, {
        name: 'Withdrawal',
        key: '1',
        functionCode: 'assetHistory.withdrawal.list'
      }]
    };
  },
  methods: {
    handleClick (menu) {
      this.navActive = menu.key;
    }
  },
  components: {
    'sub-header': SubHeader,
    Deposit,
    Withdrawal
  }
};
</script>
