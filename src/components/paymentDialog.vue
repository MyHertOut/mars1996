<template>
  <div>
    <el-dialog title="Payment" :visible.sync="paymentDialog" width="744px" class="payment-dialog" @close="closeDialog">
      <div class="payment-content">
        <div class="payment-info">
          <p class="label" v-if="data.paymentType === 2">Amount Payable ({{data.currency}})</p>
          <p class="label" v-else>Amount Payable ({{data.tokenMark}})</p>
          <p class="amount">{{formatNumber(data.payAmount)}}</p>
        </div>
        <div class="collection-info">
          <p class="collection-title">Collection Information:</p>
          <p class="collection-value">{{data.offerPaymentInfo}}</p>
        </div>
        <div class="note">
          <p class="note-title">Payment Note:</p>
          <p><el-input v-model="payNote" placeholder="Please enter" :disabled="paymentBtnLoading"></el-input></p>
        </div>
        <div class="file">
          <p class="file-title">
            <span>Payment Voucher:</span>
            <label for="paymentUpload" class="file-opration">
              <img src="../assets/images/upload.png" alt="logo">
              <span>Upload</span>
              <input type="file" v-show="false" id="paymentUpload" @change="changeUpload" accept=".png,.jpg,.jpeg,.pdf">
            </label>
          </p>
          <div class="file-list" v-if="fileList.length > 0">
            <p v-for="(v, k) in fileList" :key="k">
              <span class="file-no">{{k + 1}}、</span>
              <span class="file-name">{{v.fileName}}</span>
              <span><i class="el-icon-loading" v-if="v.isLoad"></i></span>
              <span class="delete" @click="deleteFile(k)">Delete</span>
            </p>
          </div>
        </div>
        <div class="payment-credentials">
          <div class="payment-credentials-icon">
            <img src="../assets/images/tips.png" alt="logo">
          </div>
          Once payment is completed, please submit your payment information here so that the publisher can find your payment and confirm the settlement.
        </div>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="paymentBtnLoading = false;$emit('closeDialog');">Cancel</el-button>
        <el-button type="primary" @click="submitPayment" :loading="paymentBtnLoading">Confirm</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
import axios from 'axios';

export default {
  name: 'PaymentDialog',
  props: ['isShow', 'data', 'paymentBtnLoading'],
  data () {
    return {
      payNote: '',
      paymentDialog: false,
      fileList: []
    };
  },
  watch: {
    isShow (n, o) {
      this.paymentDialog = n;
    }
  },
  created () {
    this.paymentDialog = this.isShow;
  },
  methods: {
    formatNumber (num) {
      return parseFloat(num);
    },
    closeDialog () {
      this.$emit('closeDialog');
    },
    submitPayment () {
      this.$emit('submitPayment', Object.assign({ fileList: this.fileList, paymentInfo: this.payNote }, this.data));
    },
    deleteFile (k) {
      this.fileList.splice(k, 1);
    },
    changeUpload (file) {
      if ((file.target.files[0].size / 1048576) > 5) {
        this.$message({ message: 'Please upload file less than 5MB', type: 'error' });
        return;
      }
      const fileTypes = [
        'image/jpeg',
        'image/pjpeg',
        'image/png',
        'application/pdf'
      ];
      const res = fileTypes.filter(v => v === file.target.files[0].type);
      if (res.length === 0) {
        file.target.value = null;
        this.$message({ message: 'Support jpg, png, jpeg and pdf formats', type: 'error' });
        return;
      }
      const reader = new FileReader();
      reader.readAsDataURL(file.target.files[0]);
      reader.onload = async () => {
        const form = new FormData();
        form.append('file', file.target.files[0]);
        form.append('fileName', file.target.files[0].name);
        form.append('biz', 'TRADE');
        let fileObj = {
          id: null,
          isLoad: true,
          key: this.fileList.length,
          fileName: file.target.files[0].name
        };
        this.fileList = [fileObj];
        const data = await axios({
          method: 'post',
          data: form,
          baseURL: process.env.VUE_APP_API_BASE,
          url: '/v1/asset/file/upload'
        });
        if (data.data.code === '1000') {
          fileObj.isLoad = false;
          fileObj.id = data.data.data.id;
        } else {
          this.$message({ message: data.data.msg, type: 'error' });
        }
        file.target.value = null;
      };
    }
  }
};
</script>
<style lang="scss">
.payment-dialog {
  .el-dialog__header {
    padding: 44px 0px 40px 40px;
    .el-dialog__title {
      font-size: 26px;
      color: #001F3B;
    }
  }
  .el-dialog__body {
    padding: 0 40px;
  }
  .el-dialog__footer {
    padding-right: 40px;
  }
  .dialog-footer {
    button {
      width: 100px;
      margin-right: 40px;
      height: 40px;
      & + button {
        margin-right: 0px;
      }
    }
  }
  .payment-content {
    .payment-info {
      width: 100%;
      height: 128px;
      // background: url()
      background-color: #234fb9;
      border-radius: 8px;
      padding: 30px 0;
      color: #fff;
      text-align: center;
      margin-bottom: 40px;
      .label {
        font-size: 16px;
        margin-bottom: 10px;
      }
      .amount {
        font-size: 38px;
      }
    }
    .collection-info {
      margin-bottom: 40px;
      .collection-title {
        font-size: 16px;
        color: #122E48;
      }
      .collection-value {
        margin-top: 17px;
        border: 1px solid #D8D8D8;
        padding: 12px 15px;
      }
    }
    .note {
      margin-bottom: 32px;
      .note-title {
        font-size: 14px;
        color: #8D93A1;
        margin-bottom: 17px;
      }
    }
    .file {
        margin-bottom: 40px;
      .file-title {
        display: flex;
        justify-content: space-between;
        align-items: center;
        img {
          width: 19px;
          margin-right: 10px;
        }
        .file-opration {
          cursor: pointer;
        }
      }
      .file-list {
        margin-top: 12px;
        padding: 20px;
        padding-bottom: 5px;
        background-color: #FBFBFB;
        color: #214285;
        position: relative;
        & > p {
          margin-bottom: 15px;
        }
        .file-no {
          margin-right: 20px;
        }
        .file-name {
          cursor: pointer;
          margin-right: 5px;
          &:hover {
            color: #497EB9;
            text-decoration: underline;
          }
        }
        .delete {
          position: absolute;
          right: 20px;
          cursor: pointer;
          color: #E6471F;
        }
      }
    }
    .payment-credentials {
      width: 100%;
      height: 72px;
      background-color: #FFF6E7;
      padding: 15px 20px;
      color: #FF9A00;
      margin-bottom: 23px;
      .payment-credentials-icon {
        float: left;
      }
      img {
        width: 18px;
        height: 18px;
        margin-right: 12px;
      }
    }
  }
}
</style>
