<template>
  <div class="view-item detail-document">
    <div class="label">Documents (Public):</div>
    <picture-item :data="detailData.publicDocs" />
    <div class="label">Documents (Private):</div>
    <picture-item :data="detailData.privateDocs" />
  </div>
</template>

<script>
import PictureItem from '@/components/PictureItem.vue';

export default {
  name: 'DetailDocument',
  props: {
    detailData: {
      type: Object,
      default: () => {}
    }
  },
  data () {
    return {
      documentPrivacyList: [],
      documentPublicList: []
    };
  },
  components: {
    'picture-item': PictureItem
  },
  watch: {
    detailData () {
      if (this.detailData.privateDocs) {
        // this.documentPrivacyList = JSON.parse(this.detailData.privateDocs);
        this.detailData.privateDocs.forEach(v => {
          v.src = '/v1/asset/file/readFile?id=' + v.id;
        });
      }
      if (this.detailData.publicDocs) {
        // this.documentPublicList = JSON.parse(this.detailData.publicDocs);
        this.detailData.publicDocs.forEach(v => {
          v.src = '/v1/asset/file/readFile?id=' + v.id;
        });
      }
    }
  }
};
</script>
<style lang="scss" scoped>
  .detail-document {
    img {
      max-width: 200px;
      max-height: 200px;
    }
    .label {
      margin-top: 30px;
      font-size: 20px;
      color: #192231;
      margin-bottom: 14px;
      &:first-child {
        margin-top: 0;
      }
    }
    .document-item {
      display: inline-block;
      margin-right: 30px;
      &:first-child {
        margin-right: 0;
      }
    }
  }
</style>
