<template>
  <div>
    <sub-header title="Trade Orders" navTitle="Order Centre" ref="myAssetsRef" :menus="subMenus"
      @handleClick="handleClick" :defaultIndex="navActive"></sub-header>
    <div class="main-container">
      <TradeOrdersBonds v-if="navActive === 0" ></TradeOrdersBonds>
      <AssetBacked v-else-if="navActive === 1"></AssetBacked>
    </div>
  </div>
</template>
<script>
import SubHeader from '@/components/SubHeader.vue';
import TradeOrdersBonds from './components/TradeOrdersBonds.vue';
import AssetBacked from './components/tradeAssetBacked.vue';
export default {
  name: 'MyAssets',
  data () {
    return {
      navActive: 0,
      subMenus: [{
        name: 'Bonds',
        key: 0,
        functionCode: 'order.centre.trade.bonds'
      }, {
        name: 'Asset-Backed',
        key: 1,
        functionCode: 'order.centre.trade.abs'
      }]
    };
  },
  computed: {
    menuKey () {
      return this.$route.query.menuKey;
    }
  },
  methods: {
    handleClick (menu) {
      this.navActive = parseInt(menu.key);
    }
  },
  created () {
    if (this.$route.query.navActive) {
      this.navActive = parseInt(this.$route.query.navActive);
    }
    this.$nextTick(() => {
      if (this.menuKey) {
        this.activeIndex = this.menuKey;
        if (this.activeIndex === 0) {
          this.$refs.myAssetsRef.handleClick({
            name: 'Bonds',
            key: 0
          }, Number(this.activeIndex));
        } else if (this.activeIndex === 1) {
          this.$refs.myAssetsRef.handleClick({
            name: 'Asset-Backed',
            key: 1
          }, Number(this.activeIndex));
        }
      }
    });
  },
  components: {
    'sub-header': SubHeader,
    TradeOrdersBonds,
    AssetBacked
  }
};
</script>
