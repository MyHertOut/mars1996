<template>
  <el-dialog
    v-bind="$attrs"
    v-on="$listeners"
    :visible="$attrs.visible"
    :close-on-press-escape="false"
    :width="$attrs.width || '38%'"
    custom-class="common-dialog"
  >
  <slot />
  <span slot="footer" class="dialog-footer" v-if="$attrs.footer != false">
    <slot name="footers">
        <el-button @click="handleCancel">{{ cancelText }}</el-button>
        <el-button type="primary" :class="$attrs.submitClass" @click="handleOK">{{ submitText }}</el-button>
    </slot>
  </span>
  </el-dialog>
</template>

<script>
export default {
  inheritAttrs: false,
  name: 'ElementDialog',
  // props: {
  //   visible: {
  //     type: Boolean,
  //     default: false
  //   }
  // },
  data () {
    const { footer, cancelText, submitText } = this.$attrs;
    return {
      footer,
      cancelText: cancelText || 'Cancel',
      submitText: submitText || 'Submit'
    };
  },
  methods: {
    handleOK () {
      this.$emit('handleOK');
    },
    handleCancel () {
      if (this.$listeners.handleCancel) {
        this.$emit('handleCancel');
      } else {
        this.$emit('update:visible', false);
      }
    }
  }
};
</script>
<style lang="scss">
  .common-dialog {
    .el-dialog__footer {
      padding: 0 60px 30px 0px; // 35px 60px 30px 0px;
    }
    .el-dialog__body {
      padding: 40px; //40px 60px 30px 60px;
    }
    .el-dialog__header {
      padding: 35px 0 0px 40px; //60px;
    }
    .el-form-item__label {
      text-align: left;
    }
    .dialog-footer {
      .el-button {
        height: 40px;
        width: 100px;
        font-size: 16px;
      }
      .el-button+.el-button {
        margin-left: 40px;
      }
    }
  }
</style>
