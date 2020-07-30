<template>
  <div class="add-new-document" v-loading="loading">
    <el-form
      :model="ruleForm"
      :rules="rules"
      ref="ruleForm"
      label-width="160px"
      class="add-new-document-form"
      label-position="top"
    >
      <el-form-item label="Documents(Private)："
        prop="privacyName"
        class="privacy-name"
      >
        <!-- <el-input v-model="ruleForm.privacyName" autocomplete="off" maxlength="50" :disabled="ruleForm.privacyUploadList.length >= 10"></el-input> -->
        <el-input
          v-model="ruleForm.privacyName"
          autocomplete="off"
          maxlength="50"
          :disabled="ruleForm.privacyUploadList.length >= 10"
          @blur="$refs.ruleForm.rules.privacyName[0].required = false;"
        ></el-input>
        <!-- <div class="add-btn" @click="privacyAddFile" v-if="ruleForm.privacyUploadList.length < 10">+</div> -->
        <div class="add-btn" v-if="ruleForm.privacyUploadList.length < 10" @click="privacyAddFile">
          <img src="../../../../assets/images/add.png" alt="png">
        </div>
      </el-form-item>
      <el-form-item label="" prop="" class="upload-list">
        <div class="item" v-for="(v, k) in ruleForm.privacyUploadList" :key="k" :name="v.name">
          <p class="item-title">{{v.name}}</p>
          <div class="item-upload" v-if="!v.url" v-loading="v.loading">
            <label :for="'upload' + k">
              <div class="item-btn">
                <!-- <i class="el-icon-upload"></i> -->
                <img src="../../../../assets/images/upload.png" alt="load">
                <span>Upload</span>
              </div>
              <input type="file" v-show="false" :id="'upload' + k" @change="changeUpload(v, $event)" accept=".png,.jpg,.jpeg,.pdf">
            </label>
            <p class="item-desc">Support jpg, png, jpeg and pdf formats, less than 5Mb</p>
          </div>
          <div class="uploaded-img" v-else v-loading="v.loading">
            <label :for="'seeImg' + k">
              <img :src="v.url" alt="img" v-if="!v.isPdf">
              <div class="upload-pdf" v-else>
                <img src="../../../../assets/images/PDF.png" alt="logo" class="pdf-logo">
                <el-popover
                  placement="top-start"
                  trigger="hover"
                  :content="v.pdfName">
                  <span class="pdf-name" slot="reference">{{v.pdfName}}</span>
                </el-popover>
              </div>
              <input type="file" v-show="false" :id="'seeImg' + k" @change="changeUpload(v, $event)" accept=".png,.jpg,.jpeg,.pdf">
              <div class="mask-img" v-if="!v.isPdf"></div>
            </label>
            <div class="del-img">
              <!-- <i class="el-icon-delete-solid" @click="v.url = ''; v.file = null;v.id = '';"></i> -->
              <img src="../../../../assets/images/del-icon.png" alt="del" @click="v.url = ''; v.file = null;v.id = '';" />
            </div>
          </div>
          <div class="del-file" @click="privacySubtractFile(k)">
            <img src="../../../../assets/images/dis-reduce.png" width="26" height="26" alt="png">
          </div>
        </div>
      </el-form-item>
      <el-form-item label="Documents(Public)：" prop="publicName" class="privacy-name">
        <!-- <el-input v-model="ruleForm.publicName" autocomplete="off" maxlength="50" :disabled="ruleForm.publicUploadList.length >= 10"></el-input> -->
        <el-input
          v-model="ruleForm.publicName"
          :disabled="ruleForm.publicUploadList.length >= 10"
          @blur="$refs.ruleForm.rules.publicName[0].required = false;"
          autocomplete="off"
          maxlength="50"
        ></el-input>
        <!-- <div class="add-btn" @click="publicAddFile" v-if="ruleForm.publicUploadList.length < 10">+</div> -->
        <div class="add-btn" @click="publicAddFile" v-if="ruleForm.publicUploadList.length < 10">
          <img src="../../../../assets/images/add.png" width="26" height="26" alt="add">
        </div>
      </el-form-item>
      <el-form-item label="" prop="" class="upload-list">
        <div class="item" v-for="(v, k) in ruleForm.publicUploadList" :key="k"
          :name="v.name" v-loading="v.loading">
          <p class="item-title">{{v.name}}</p>
          <div class="item-upload" v-if="!v.url">
            <label :for="'uploadPub' + k">
              <div class="item-btn">
                <!-- <i class="el-icon-upload"></i> -->
                <img src="../../../../assets/images/upload.png" alt="load">
                <span>Upload</span>
              </div>
              <input type="file" v-show="false" :id="'uploadPub' + k" @change="changeUpload(v, $event)" accept=".png,.jpg,.jpeg,.pdf">
            </label>
            <p class="item-desc">Support jpg, png, jpeg and pdf formats, less than 5Mb</p>
          </div>
          <div class="uploaded-img" v-else>
            <!-- <label :for="'seeImg' + k">
              <img :src="v.url" alt="img">
              <input type="file" v-show="false" :id="'seeImg' + k" @change="changeUpload(v, $event)" accept=".png,.jpg,.jpeg,.pdf">
              <div class="mask-img"></div>
            </label> -->
            <label :for="'seeImgPub' + k">
              <img :src="v.url" alt="img" v-if="!v.isPdf">
              <div class="upload-pdf" v-else>
                <img src="../../../../assets/images/PDF.png" alt="logo" class="pdf-logo">
                <el-popover
                  placement="top-start"
                  trigger="hover"
                  :content="v.pdfName">
                  <span class="pdf-name" slot="reference">{{v.pdfName}}</span>
                </el-popover>
              </div>
              <input type="file" v-show="false" :id="'seeImgPub' + k" @change="changeUpload(v, $event)" accept=".png,.jpg,.jpeg,.pdf">
              <div class="mask-img" v-if="!v.isPdf"></div>
            </label>
            <div class="del-img">
              <img src="../../../../assets/images/del-icon.png" alt="del" @click="v.url = ''; v.file = null;v.id = '';" />
            </div>
          </div>
          <div class="del-file" @click="publicSubtractFile(k)">
            <img src="../../../../assets/images/dis-reduce.png" width="26" height="26" alt="png">
          </div>
        </div>
      </el-form-item>
    </el-form>
    <div class="form-btns">
      <el-button @click="$router.push({ name: 'DisIssueAbsPayment', query: { serialNo: $route.query.serialNo } })">Previous</el-button>
      <el-button type="primary" @click="handleNext">Next</el-button>
      <!-- <el-button type="primary" @click="showImageBox = true">Next</el-button> -->
    </div>
  </div>
</template>
<script>
import { getAbsInfo, newAbsAdd } from '@/api/distribution-center';
// import { notify } from '@/common/util';
import axios from 'axios';

export default {
  name: 'AddNewDocument',
  data () {
    return {
      ruleForm: {
        privacyName: '',
        privacyUploadList: [],
        publicName: '',
        publicUploadList: []
      },
      loading: false,
      rules: {
        privacyName: [{ required: false, trigger: 'blur', message: 'This field is required.' }],
        publicName: [{ required: false, trigger: 'blur', message: 'This field is required.' }]
      },
      url: ''
    };
  },
  created () {
    this.getBeforeInfo();
  },
  methods: {
    async handleNext () {
      this.loading = true;
      const params = {
        privateDocs: this.ruleForm.privacyUploadList.filter(x => x.id).map(v => ({
          id: v.id,
          name: v.name,
          suffix: v.suffix
        })),
        // this.ruleForm.privacyUploadList.filter(x => x.id).map(v => v.id).join(','),
        publicDocs: this.ruleForm.publicUploadList.filter(x => x.id).map(v => ({
          id: v.id,
          name: v.name,
          suffix: v.suffix
        })),
        // this.ruleForm.publicUploadList.filter(x => x.id).map(v => v.id).join(','),
        serialNo: this.$route.query.serialNo
      };

      const resData = await newAbsAdd({ data: params, slient: true });
      if (!resData) return;

      const { code, data } = resData.data;
      if (code === '1000') {
        this.$router.push({ name: 'DisIssueAbsRrestrictions', query: { serialNo: data } });
      }
      this.loading = false;
    },
    async getBeforeInfo () {
      if (this.$route.query.serialNo) {
        // this.loading = true;
        const resData = await getAbsInfo({
          serialNo: this.$route.query.serialNo,
          slient: true
        });
        // this.loading = false;
        if (!resData) return;
        // eslint-disable-next-line
        const { code, data } = resData.data;
        if (data.privateDocs) {
          const privacyFile = data.privateDocs; // JSON.parse(data.privacyFile) || [];
          this.ruleForm.privacyUploadList = privacyFile.map(v => {
            return {
              name: v.name,
              url: '/v1/asset/file/readFile?id=' + v.id,
              file: null,
              titleType: 'ASSET',
              id: v.id,
              suffix: v.suffix,
              loading: false,
              isPdf: v.suffix === 'pdf',
              pdfName: ''
            };
          });
        }
        if (data.publicDocs) {
          const publicFile = data.publicDocs; // JSON.parse(data.publicFile) || [];
          this.ruleForm.publicUploadList = publicFile.map(v => {
            return {
              name: v.name,
              url: '/v1/asset/file/readFile?id=' + v.id,
              file: null,
              titleType: 'ASSET',
              id: v.id,
              suffix: v.suffix,
              loading: false,
              isPdf: v.suffix === 'pdf',
              pdfName: ''
            };
          });
        }
      }
    },
    returnFileSize (number) {
      if (number < 1024) {
        return number + 'bytes';
      } else if (number > 1024 && number < 1048576) {
        return (number / 1024).toFixed(1) + 'KB';
      } else if (number > 1048576) {
        return (number / 1048576).toFixed(1) + 'MB';
      }
    },
    changeUpload (v, file) {
      v.loading = true;
      const fileTypes = [
        'image/jpeg',
        'image/pjpeg',
        'image/png',
        'application/pdf'
      ];
      const res = fileTypes.filter(v => v === file.target.files[0].type);
      if (res.length === 0) {
        v.loading = false;
        file.target.value = null;
        this.$message({ message: 'Support jpg, png, jpeg and pdf formats', type: 'error' });
        return;
      }
      if ((file.target.files[0].size / 1048576) > 5) {
        v.loading = false;
        file.target.value = null;
        this.$message({ message: 'Please upload file less than 5MB', type: 'error' });
        return;
      }
      const reader = new FileReader();
      reader.readAsDataURL(file.target.files[0]);
      reader.onload = async () => {
        const form = new FormData();
        form.append('file', file.target.files[0]);
        form.append('fileName', v.name);
        form.append('biz', v.titleType);
        if (file.target.files[0].type === 'application/pdf') {
          v.isPdf = true;
          v.pdfName = file.target.files[0].name;
        } else {
          v.isPdf = false;
          v.pdfName = '';
        }
        const resData = await axios({
          method: 'post',
          data: form,
          baseURL: process.env.VUE_APP_API_BASE,
          url: '/v1/asset/file/upload'
        });
        if (!resData) return;

        v.loading = false;
        file.target.value = null;
        const { code, data, msg } = resData.data;
        if (code === '1000') {
          v.url = reader.result;
          v.file = file.target.files[0];
          v.name = data.name;
          v.suffix = data.suffix;
          v.id = data.id;
        } else {
          this.$message({ message: msg, type: 'error' });
        }
      };
    },
    privacyAddFile () {
      const refForm = this.$refs.ruleForm;
      refForm.rules.privacyName[0].required = true;

      refForm.validateField('privacyName', msg => {
        if (!msg) {
          this.ruleForm.privacyUploadList.push({
            name: this.ruleForm.privacyName,
            url: '',
            file: null,
            titleType: 'ASSET',
            id: '',
            loading: false
          });
          refForm.rules.privacyName[0].required = false;
          this.ruleForm.privacyName = '';
        }
      });
    },
    publicAddFile () {
      const refForm = this.$refs.ruleForm;
      refForm.rules.publicName[0].required = true;

      refForm.validateField('publicName', msg => {
        if (!msg) {
          this.ruleForm.publicUploadList.push({
            name: this.ruleForm.publicName,
            url: '',
            file: null,
            titleType: 'ASSET',
            id: '',
            loading: false
          });
          refForm.rules.publicName[0].required = false;
          this.ruleForm.publicName = '';
        }
      });
    },
    privacySubtractFile (k) {
      this.ruleForm.privacyUploadList.splice(k, 1);
    },
    publicSubtractFile (k) {
      this.ruleForm.publicUploadList.splice(k, 1);
    }
  }
};
</script>
<style scoped lang="scss">
.add-new-document {
  .add-new-document-form {
    // padding-left: 118px;
    width: 922px; // 724px;
    margin: 0 auto;
    font-size: 16px;
    color: #192231;
    .privacy-name {
      position: relative;
      .add-btn {
        width: 28px;
        height: 28px;
        border-radius: 50%;
        color: #fff;
        text-align: center;
        line-height: 23px;
        position: absolute;
        right: 35%;
        top: 48%;
        font-size: 32px;
        transform: translateY(-50%);
        img {
          width: 100%;
          height: 100%;
          cursor: pointer;
        }
      }
      .dis-add-btn {
        img {
          cursor: no-drop;
        }
      }
    }
    .upload-list {
      width: 1120px;
      margin-top: 20px;
      .item {
        width: 322px;//260px; //270px;
        height: 160px;
        // margin-right: 20px;
        padding-right: 62px;
        position: relative;
        float: left;
        margin-bottom: 10px;
        display: flex;
        flex-direction: column;
        &:hover .del-file {
          visibility: visible;
        }
        .del-file {
          position: absolute;
          right: 23px; // 15px;
          top: 0px;
          visibility: hidden;
          cursor: pointer;
          &:hover {
            // display: block;
            visibility: visible;
            // img {
            //   visibility: visible;
            // }
          }
        }
        .item-title {
          height: 40px;
          background-color: #F4F7FA;
          text-align: center;
          color: #575E6E;
          width: 100%; // 220px;
          display: inline-block;
          padding-left: 10px;
          padding-right: 10px;
          white-space: nowrap;
          text-overflow: ellipsis;
          overflow: hidden;
          word-break: break-all;
        }
        .item-upload {
          height: 120px;
          padding: 20px 0;
          width: 100%; //220px;
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          align-items: center;
          background-color: #FBFBFB;
          .item-desc {
            width: 172px;
            text-align: center;
            line-height: 20px;
            font-size: 14px;
            color: #8D93A1;
            margin-top: 10px;
          }
          .item-btn {
            width: 156px;
            height: 43px;
            border: 1px dashed #214285;
            cursor: pointer;
            display: flex;
            justify-content: space-between;
            padding: 0 34px 0 42px;
            align-items: center;
            // i {
            //   font-size: 20px;
            // }
            img {
              width: 20px;
              height: 20px;
            }
            span {
              color: #214285;
            }
          }
        }
        .uploaded-img {
          height: 120px;
          position: relative;
          width: 100%; //220px;
          &:hover .del-img {
            display: block;
          }
          img {
            width: 100%;
            height: 100%;
            cursor: pointer;
          }
          .mask-img {
            position: absolute;
            width: 100%;
            height: 100%;
            opacity: .45;
            top: 0px;
            left: 0px;
            z-index: 1;
            background-color: #000;
          }
          .del-img {
            position: absolute;
            z-index: 10;
            right: 12px;
            top: 12px;
            color: #fff;
            font-size: 22px;
            display: none;
            cursor: pointer;
            img {
              width: 30px;
              height: 30px;
            }
          }
          .pdf-logo {
            width: 35px;
            height: 50px;
          }
          .upload-pdf {
            height: 100%;
            display: flex;
            justify-content: center;
            align-items: center;
            background-color: #EFF5FF;
            position: relative;
            .pdf-name {
              position: absolute;
              bottom: 0px;
              left: 50%;
              transform: translateX(-50%);
              display: inline-block;
              width: 220px;
              padding: 0px 10px;
              white-space: nowrap;
              text-overflow: ellipsis;
              overflow: hidden;
              word-break: break-all;
              text-align: center;
            }
          }
        }
      }
    }
  }
  .el-input {
    width: 553px;
  }
  .el-form-item {
    margin-bottom: 10px;
  }
}
</style>
<style lang="scss">
// .add-new-document {
//   .el-form-item.is-required:not(.is-no-asterisk)>.el-form-item__label:before {
//     display: none;
//   }
// }
</style>
