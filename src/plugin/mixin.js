export default {
  computed: {
    bowserUrl () {
      return this.$store.state.common.systemConfig.blockBrowserUrl;
    }
  },
  methods: {
    browserUrltxId (id) {
      const url = this.bowserUrl;
      return url ? `${url}/#/txidDetails?id=${id}` : 'javascript:void(0);';
    },
    browserUrlAddress (id) {
      const url = this.bowserUrl;
      return url
        ? `${url}/#/addressDetail?address=${id}`
        : 'javascript:void(0);';
    }
  }
};
