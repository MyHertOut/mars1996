<template>
  <div class="bar-left">
    <el-input placeholder="资产代码/资产名称" v-model="keyWord" class="input-with-select">
      <el-button slot="append" @click="$emit('handleKeyWord', keyWord)">Search</el-button>
    </el-input>
    <el-select v-model="selStatusVal" placeholder="全部状态">
      <el-option
        v-for="item in selDatas"
        :key="item[selValueField]"
        :label="item[selLabelField]"
        :value="item[selValueField]"
      ></el-option>
    </el-select>
    <slot>
      {{ $children  }}
    </slot>
  </div>
</template>
<script>
/*  说明：如需渲染其他label和value字段用法：
   selData: {
        fields: {
          labelField: 'labelField',
          valueField: 'valueField'
        },
        data: [{
          labelField: '测试',
          valueField: '1'
        }]
      },
正常用法：
   selData: [{
      label: '测试',
      value: '1'
    }]
*/
export default {
  name: 'ComSearchContent',
  inheritAttrs: false,
  data () {
    return {
      keyWord: '',
      selStatusVal: ''
    };
  },
  watch: {
    selStatusVal (val) {
      this.$emit('handleSelStatus', val);
    }
  },
  computed: {
    lacalData () {
      return this.$attrs.selData;
    },
    localField () {
      return this.lacalData.fields || {};
    },
    selDatas () {
      return this.lacalData.data || this.lacalData;
    },
    selLabelField () {
      return this.localField.labelField || 'label';
    },
    selValueField () {
      return this.localField.valueField || 'value';
    }
  }
};
</script>
