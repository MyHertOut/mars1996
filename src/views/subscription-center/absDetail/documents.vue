<template>
  <div class="documents" v-loading="loading">
    <el-row>
      <el-col :span="10"><div class="label">Documents (Public):</div></el-col>
    </el-row>
    <picture-item :data="documentPrivacyList" />
    <el-row v-if="type === 1">
      <el-col :span="10"><div class="label">Documents (Private):</div></el-col>
    </el-row>
    <picture-item :data="documentPublicList" v-if="type === 1"/>
    <div class="image__preview">
      <el-image :previewSrcList="previewSrcList" ref="preview"></el-image>
    </div>
  </div>
</template>
<script>
import { getAbsDocument } from '@/api';
import PictureItem from '@/components/PictureItem.vue';
import { notify } from '@/common/util';

export default {
  name: 'Doccuments',
  data () {
    return {
      loading: false,
      documentPrivacyList: [],
      documentPublicList: [],
      previewSrcList: []
    };
  },
  props: ['type'],
  created () {
    this.getInfo();
  },
  components: {
    'picture-item': PictureItem
  },
  methods: {
    async getInfo () {
      this.loading = true;
      const data = await getAbsDocument({
        data: {
          serialNo: this.$route.query.tokenNo
        },
        slient: true,
        notify: notify.error
      });
      this.loading = false;
      if (data.data.data) {
        if (data.data.data.privateDocs) {
          this.documentPrivacyList = data.data.data.privateDocs;
          this.documentPrivacyList.forEach(v => {
            v.src = '/v1/asset/file/readFile?id=' + v.id;
          });
        }
        if (data.data.data.publicDocs) {
          this.documentPublicList = data.data.data.publicDocs;
          this.documentPublicList.forEach(v => {
            v.src = '/v1/asset/file/readFile?id=' + v.id;
          });
        }
      }
    },
    downloadFile (row) {
      let down = document.createElement('a');
      down.download = row.name + '.' + row.suffix;
      down.href = '/v1/asset/file/readFile?id=' + row.id;
      down.click();
    },
    viewImg (row) {
      if (row.suffix === 'pdf') {
        window.open('/v1/asset/file/readFile?id=' + row.id, '_blank');
      } else {
        this.previewSrcList = ['/v1/asset/file/readFile?id=' + row.id];
        this.$refs.preview.showViewer = true;
      }
    },
    retuenImgType (type) {
      if (type === 'pdf') {
        return 'pdf';
      } else {
        return 'img';
      }
    }
  }
};
</script>
<style scoped lang="scss">
.documents {
  padding-left: 34px;
  padding-top: 10px;
  .label {
    font-size: 22px;
    color: #192231;
    margin-bottom: 15px;
  }
  .el-row {
    margin-bottom: 20px;
  }
  .tabel {
    border: 1px solid #EEF1F7;
    border-bottom: 0;
    margin-bottom: 30px;
    .operating-btn {
      display: flex;
      span {
        margin-right: 30px;
        color: #214285;
        cursor: pointer;
        font-size: 16px;
        &:hover {
          text-decoration: underline;
        }
        & + span {
          margin-right: 0px;
        }
      }
    }
    .file-type {
      img {
        width: 28px;
        height: 28px;
        margin-right: 17px;
        vertical-align: middle;
      }
    }
  }
}
</style>
<style lang="scss">
.documents {
  .image__preview {
    .el-image__error {
      display: none;
    }
  }
}
</style>
