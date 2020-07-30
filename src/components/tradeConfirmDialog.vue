<template>
  <div class="trade-confirm-dialog">
    <el-dialog title="Payment Confirmation" :visible.sync="confirmDialog" width="744px" class="confirm-dialog" @close="$emit('closeDialog');">
      <el-form :model="confirmRuleForm" ref="confirmRuleForm" label-width="170px" label-position="left">
        <el-form-item label="Additional Information:" prop="paymentInfo">
          <span v-if="confirmRuleForm.paymentInfo">{{confirmRuleForm.paymentInfo}}</span>
          <span v-else>--</span>
        </el-form-item>
        <el-form-item label="Documents:" prop="documents">
          <div class="documents" v-if="confirmRuleForm.documents">
            <img src="../assets/images/PDF.png" alt="jpg" v-if="data.fileInfo.suffix === 'pdf'">
            <img src="../assets/images/JPG.png" alt="jpg" v-else>
            <span @click="reviewImg">{{confirmRuleForm.documents}}</span>
          </div>
          <div v-else>--</div>
        </el-form-item>
        <div class="confirm-desc">
          <div class="confirm-desc-icon">
            <img src="../assets/images/tips.png" alt="logo">
          </div>
          *Once confirm, token Allocations will be executed
        </div>
      </el-form>
      <div class="image__preview">
        <el-image :previewSrcList="previewSrcList" ref="preview"></el-image>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="confirmLoading = false;$emit('closeDialog');">Cancel</el-button>
        <el-button type="primary" @click="submitConfirm" :loading="confirmLoading">Confirm</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
export default {
  name: 'TradeConfirm',
  props: ['isShow', 'data', 'loading'],
  data () {
    return {
      confirmDialog: false,
      confirmRuleForm: {
        paymentInfo: '',
        documents: ''
      },
      previewSrcList: [],
      confirmLoading: false
    };
  },
  methods: {
    submitConfirm () {
      this.$emit('submitConfirm');
    },
    reviewImg () {
      if (this.data.fileInfo.suffix === 'pdf') {
        window.open(window.location.origin + '/v1/asset/file/readFile?id=' + this.data.fileInfo.id, '_blank');
      } else {
        this.previewSrcList = [
          window.location.origin + '/v1/asset/file/readFile?id=' + this.data.fileInfo.id
        ];
        this.$refs.preview.showViewer = true;
      }
    }
  },
  watch: {
    isShow (n, o) {
      this.confirmDialog = n;
    },
    data (n, o) {
      this.confirmRuleForm = Object.assign({}, n);
      this.confirmRuleForm.documents = n.fileInfo.name;
    },
    loading (n, o) {
      this.confirmLoading = n;
    }
  },
  created () {
    this.confirmDialog = this.isShow;
    this.confirmRuleForm = Object.assign({}, this.data);
    if (this.data && this.data.fileInfo) {
      this.confirmRuleForm.documents = this.data.fileInfo.name;
    }
    this.confirmLoading = this.loading;
  }
};
</script>
<style lang="scss">
.trade-confirm-dialog {
  .confirm-dialog {
    .image__preview {
      .el-image__error {
        display: none;
      }
    }
    .el-dialog__body {
      padding: 0 40px;
      .el-form-item__content {
        font-size: 15px;
        color: #001F3B;
      }
      .documents {
        img {
          width: 28px;
          vertical-align: middle;
          margin-right: 10px;
        }
        span {
          cursor: pointer;
          &:hover {
            text-decoration: underline;
            color: #214285;
          }
        }
      }
    }
    .el-dialog__header {
      padding: 40px;
      .el-dialog__title {
        font-size: 26px;
        color: #001F3B;
      }
    }
    .el-dialog__footer {
      padding-bottom: 35px;
      padding-right: 40px;
      padding-top: 30px;
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
    .confirm-desc {
      background-color: #FFF6E7;
      padding: 20px;
      color: #FF9A00;
      .confirm-desc-icon {
        float: left;
        img {
          width: 18px;
          height: 18px;
          margin-right: 12px;
        }
      }
    }
  }
}
</style>
