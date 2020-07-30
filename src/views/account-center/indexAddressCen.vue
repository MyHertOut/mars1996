<template>
  <div>
    <sub-header ref="addressCenterRef" title="Address Centre" navTitle="Account Centre" :menus="subMenus" @handleClick="handleClick"></sub-header>
    <div class="main-container" :style="activeIndex === '0' ? 'padding:0' : ''">
      <div v-if="activeIndex === '0'" class="address-Centre">
        <addressCentre :activeIndex="activeIndex"></addressCentre>
      </div>
    </div>
  </div>
</template>

<script>
import SubHeader from '@/components/SubHeader.vue';
import addressCentre from './addressCentre';

export default {
  name: 'accountCenter',
  data () {
    return {
      activeIndex: '0',
      subMenus: [{
        name: 'My Address',
        key: '0',
        functionCode: 'member.address.title'
      }]
    };
  },
  computed: {
    menuKey () {
      return this.$route.query.menuKey;
    }
  },
  watch: {
    menuKey (n, o) {
      if (n === 0) {
        this.$refs.addressCenterRef.handleClick({
          name: 'My Address',
          key: '0'
        }, n);
      };
    }
  },
  methods: {
    handleClick (menu) {
      this.activeIndex = menu.key;
    }
  },
  created () {
    this.$nextTick(() => {
      if (this.menuKey) {
        this.activeIndex = this.menuKey;
        this.$refs.addressCenterRef.handleClick({
          name: 'My Address',
          key: '0'
        }, Number(this.activeIndex));
      }
    });
  },
  components: {
    'sub-header': SubHeader,
    addressCentre
  }
};
</script>
