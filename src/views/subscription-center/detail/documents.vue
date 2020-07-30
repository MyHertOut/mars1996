<template>
  <div class="documents" v-loading="loading">
    <el-row>
      <el-col :span="10"><div class="label">Documents (Public):</div></el-col>
      <el-col :span="23">
        <el-table :data="publicData" style="width: 100%" class="tabel">
          <template  v-for="(val, key) in publicColumn">
            <el-table-column :prop="val.prop" :label="val.label" :key="key" v-if="val.prop === 'operating'">
              <template slot-scope="scope">
                <div class="operating-btn">
                  <span @click="viewImg(scope.row)">View</span>
                  <span @click="downloadFile(scope.row)">Download</span>
                </div>
              </template>
            </el-table-column>
            <el-table-column :prop="val.prop" :label="val.label" :key="key" v-else-if="val.prop === 'suffix'">
              <template slot-scope="scope">
                <div class="file-type">
                  <img src="../../../assets/images/PDF.png" alt="logo" v-if="retuenImgType(scope.row.suffix) === 'pdf'" />
                  <img src="../../../assets/images/JPG.png" alt="logo" v-else />
                  <span>{{scope.row.name + '.' + scope.row.suffix}}</span>
                </div>
              </template>
            </el-table-column>
            <el-table-column :prop="val.prop" :label="val.label" :key="key" v-else></el-table-column>
          </template>
        </el-table>
      </el-col>
    </el-row>
    <el-row v-if="type === 2">
      <el-col :span="10"><div class="label">Documents (Private):</div></el-col>
      <el-col :span="23">
        <el-table :data="privateData" style="width: 100%" class="tabel">
          <template  v-for="(val, key) in privateColumn">
            <el-table-column :prop="val.prop" :label="val.label" :key="key" v-if="val.prop === 'operating'">
              <template slot-scope="scope">
                <div class="operating-btn">
                  <span @click="viewImg(scope.row)">View</span>
                  <span @click="downloadFile(scope.row)">Download</span>
                </div>
              </template>
            </el-table-column>
            <el-table-column :prop="val.prop" :label="val.label" :key="key" v-else-if="val.prop === 'suffix'">
              <template slot-scope="scope">
                <div class="file-type">
                  <img src="../../../assets/images/PDF.png" alt="logo" v-if="retuenImgType(scope.row.suffix) === 'pdf'" />
                  <img src="../../../assets/images/JPG.png" alt="logo" v-else />
                  <span>{{scope.row.name + '.' + scope.row.suffix}}</span>
                </div>
              </template>
            </el-table-column>
            <el-table-column :prop="val.prop" :label="val.label" :key="key" v-else></el-table-column>
          </template>
        </el-table>
      </el-col>
    </el-row>
    <div class="image__preview">
      <el-image :previewSrcList="previewSrcList" ref="preview"></el-image>
    </div>
  </div>
</template>
<script>
import { securityDetailDocument } from '@/api';
import { notify } from '@/common/util';

export default {
  name: 'Doccuments',
  data () {
    return {
      publicColumn: [
        {
          label: 'First name',
          prop: 'name'
        }, {
          label: 'File Type',
          prop: 'suffix'
        }, {
          label: 'Operating',
          prop: 'operating'
        }
      ],
      previewSrcList: [],
      publicData: [],
      privateColumn: [
        {
          label: 'First name',
          prop: 'name'
        }, {
          label: 'File Type',
          prop: 'suffix'
        }, {
          label: 'Operating',
          prop: 'operating'
        }
      ],
      privateData: [],
      loading: false
    };
  },
  computed: {
    type () {
      return parseInt(this.$route.query.type);
    }
  },
  created () {
    this.getInfo();
  },
  methods: {
    async getInfo () {
      this.loading = true;
      const data = await securityDetailDocument({
        data: {
          serialNo: this.$route.query.tokenNo
        },
        slient: true,
        notify: notify.error
      });
      this.loading = false;
      if (data.data.data) {
        this.publicData = data.data.data.publicDocs;
        this.privateData = data.data.data.privateDocs;
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
