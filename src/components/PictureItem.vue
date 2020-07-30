<template>
  <div class="picture-item">
    <template v-if="data && data.length">
      <el-row class="media-list" v-for="(rowItem, rowIndex) in rowCount" :key="rowIndex">
        <el-col :span="12" v-for="(item, index) in formatterData[rowIndex]" :key="index">
          <a
            v-if="item.suffix === 'pdf'"
            :href="'/v1/asset/file/readFile?id=' + item.id"
            target="_blank"
            class="content"
          >
            <img src="../assets/images/PDF.png" alt="logo" width="28" height="28" />
            <span class="img-name">{{ item.name }}.pdf</span>
          </a>
          <div v-else @click="viewImg(item)" class="content">
            <img src="../assets/images/JPG.png" alt="logo" width="28" height="28" />
            <span class="img-name">{{item.name}}.{{ item.suffix }}</span>
          </div>
        </el-col>
      </el-row>
    </template>
    <template v-else>
      <el-row class="media-list">
        <el-col :span="24" class="nodata">No Data</el-col>
      </el-row>
    </template>
    <div class="image__preview">
      <el-image :previewSrcList="previewSrcList" ref="preview"></el-image>
    </div>
  </div>
</template>
<script>
export default {
  props: {
    data: {
      type: Array,
      default: () => []
    }
  },
  data () {
    return {
      previewSrcList: []
    };
  },
  computed: {
    rowCount () {
      return this.data ? Math.ceil(this.data.length / 2) : 0;
    },
    formatterData () {
      const objData = {};
      for (let i = 0; i < this.rowCount; i++) {
        const arr = [];
        arr.push(this.data[i * 2]);
        if (this.data[i * 2 + 1]) {
          arr.push(this.data[i * 2 + 1]);
        }
        objData[i] = arr;
      }
      return objData;
    }
  },
  methods: {
    viewImg (item) {
      this.previewSrcList = [
        window.location.origin + '/v1/asset/file/readFile?id=' + item.id
      ];
      this.$refs.preview.showViewer = true;
    }
  }
};
</script>
<style lang="scss" scoped>
.picture-item {
  /deep/.image__preview {
    .el-image__error {
      display: none;
    }
  }
  .media-list {
    margin-bottom: 0px !important;
    margin-top: -1px;
    border: 1px solid #eef1f7;
    .nodata {
      color: #909399;
      text-align: center;
      justify-content: center;
    }
    .el-col {
      display: flex;
      align-items: center;
      padding: 16px 0 16px 32px;
      // border-right: 1px solid #EBEEF5;
      &:last-child {
        border-right: none;
      }
    }
    .content {
      display: flex;
      align-items: center;
      cursor: pointer;
      img {
        margin-right: 12px;
      }
      .img-name {
        &:hover {
          color: #497EB9;
          text-decoration: underline;
        }
      }
    }
    li {
      border-right: 1px solid red;
    }
  }
}
</style>
