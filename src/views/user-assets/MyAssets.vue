<template>
  <div>
    <sub-header title="Asset Balance" navTitle="Asset Centre" ref="myAssetsRef" :menus="subMenus" @handleClick="handleClick"></sub-header>
    <div class="main-container">
      <Bonds v-if="navActive === '0'" ></Bonds>
      <AssetBacked v-else-if="navActive === '1'"></AssetBacked>
      <Currencies v-else-if="navActive === '2'"></Currencies>
    </div>
  </div>
</template>
<script>
import SubHeader from '@/components/SubHeader.vue';
import Bonds from './components/Bonds.vue';
import AssetBacked from './components/AssetBacked.vue';
import Currencies from './components/Currencies.vue';
export default {
  name: 'MyAssets',
  data () {
    return {
      navActive: '0',
      subMenus: [{
        name: 'Bonds',
        key: '0',
        functionCode: 'asseBalance.bonds.list'
      }, {
        name: 'Asset-Backed',
        key: '1',
        functionCode: 'asseBalance.abs.list'
      }, {
        name: 'Currencies',
        key: '2',
        functionCode: 'asseBalance.currencies.list'
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
      this.navActive = menu.key;
    }
  },
  created () {
    this.$nextTick(() => {
      if (this.menuKey) {
        this.activeIndex = this.menuKey;
        if (this.activeIndex === '0') {
          this.$refs.myAssetsRef.handleClick({
            name: 'Bonds',
            key: '0'
          }, Number(this.activeIndex));
        } else if (this.activeIndex === '1') {
          this.$refs.myAssetsRef.handleClick({
            name: 'Asset-Backed',
            key: '1'
          }, Number(this.activeIndex));
        } else if (this.activeIndex === '2') {
          this.$refs.myAssetsRef.handleClick({
            name: 'Currencies',
            key: '2'
          }, Number(this.activeIndex));
        }
      }
    });
  },
  components: {
    'sub-header': SubHeader,
    Bonds,
    AssetBacked,
    Currencies
  }
};
</script>
