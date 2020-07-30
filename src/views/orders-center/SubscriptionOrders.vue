<template>
  <div>
    <sub-header title="Subscription Orders" navTitle="Order Centre" ref="myAssetsRef" :menus="subMenus"
      @handleClick="handleClick" :defaultIndex="navActive"></sub-header>
    <div class="main-container">
      <Bonds v-if="navActive === 0" ></Bonds>
      <AssetBacked v-else-if="navActive === 1"></AssetBacked>
    </div>
  </div>
</template>
<script>
import SubHeader from '@/components/SubHeader.vue';
import Bonds from './components/Bonds.vue';
import AssetBacked from './components/BondsAssetBacked.vue';
export default {
  name: 'MyAssets',
  data () {
    return {
      navActive: 0,
      subMenus: [{
        name: 'Bonds',
        key: 0,
        functionCode: 'order.centre.subscription.bonds'
      }, {
        name: 'Asset-Backed',
        key: 1,
        functionCode: 'order.centre.subscription.abs'
      }
      ]
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
    Bonds,
    AssetBacked
  }
};
</script>
