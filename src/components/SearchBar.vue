<template>
  <div class="search-bar">
    <div class="bar-left">
      <el-input
        :placeholder="keyWordPlaceholder"
        v-model="keyWord"
        class="input-with-select"
      >
        <el-button slot="append" @click="$emit('handleKeyWord', keyWord)">Search</el-button>
      </el-input>
      <!-- <el-select v-model="selStatusVal" placeholder="全部状态">
        <el-option
          v-for="item in selDatas"
          :key="item[selValueField]"
          :label="item[selLabelField]"
          :value="item[selValueField]"
        ></el-option>
      </el-select> -->
      <slot name="append"></slot>
    </div>
    <div v-if="!nosort" class="bar-right">
      <span>Sort：&nbsp;</span>
      <ul class="sort-field">
        <li
          v-for="(item, index) in sortList"
          :key="item.field"
          :class="{'active': item.field === sortIndex }"
          @click="handleSortFieldClick(item, index)"
        >
          <span>{{ item.name }}</span>
          <!-- <i :class="sortFieldClass[item.field] || 'el-icon-caret-top'"></i> -->
          <span class="sort-icon-box">
            <i class="el-icon-caret-top" :class="{ 'active': item.top }"></i>
            <i class="el-icon-caret-bottom" :class="{ 'active': item.bottom }"></i>
          </span>
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
export default {
  name: 'ComSearchBar',
  inheritAttrs: false,
  props: {
    nosort: {
      type: Boolean,
      default: false
    },
    keyWordPlaceholder: {
      type: String,
      default: 'Enter Asset Code / Name'
    },
    selectedField: {
      type: String,
      default: ''
    },
    sortFields: {
      type: Array,
      default: () => []
    }
  },
  data () {
    return {
      keyWord: '',
      selStatusVal: '',
      sortIndex: this.selectedField,
      sortList: []
    };
  },
  components: {
    // 'sort-field': SortField
    // 'search-content': SearchContent
  },
  watch: {
    selStatusVal (val) {
      this.$emit('handleSelStatus', val);
    },
    sortFields: {
      handler: function () {
        this.sortList = Object.assign([], this.sortFields);
        this.sortList = this.sortList.map(v => {
          return {
            field: v.field,
            name: v.name,
            top: false,
            bottom: false
          };
        });
        this.sortList.forEach(v => {
          if (v.field === this.selectedField) {
            v.top = true;
          }
        });
        this.sortIndex = this.selectedField;
      },
      immediate: true
    }
  },
  computed: {
    // defaultSortField () {
    //   return (this.sortFields[0] || {}).field;
    // },
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
  },
  methods: {
    resertData () {
      this.keyWord = '';
    },
    handleSortFieldClick (item, index) {
      this.sortList.forEach((v, k) => {
        if (k !== index) {
          v.bottom = false;
          v.top = false;
        }
      });
      if (!item.top && !item.bottom) {
        item.bottom = false;
        item.top = true;
      } else if (item.top && !item.bottom) {
        item.top = false;
        item.bottom = true;
      } else if (!item.top && item.bottom) {
        item.bottom = false;
        item.top = true;
      }
      this.sortIndex = item.field;
      const direction = item.top ? 'asc' : 'desc';
      this.$emit('handleSortFieldClick', item, direction, index);
    }
  }
};
</script>
<style lang="scss" scoped>
.search-bar {
  display: flex;
  justify-content: space-between;
  .bar-right {
    display: flex;
    align-items: flex-end;
    color: #8D93A1;
  }
  .el-select {
    width: 170px;
    margin-right: 30px;
    &.addressSelect{
      width: 400px;
    }
    &:last-child {
      margin-right: 0;
    }
  }
  .input-with-select {
    width: 357px;
    margin-right: 30px;
  }
  /deep/.sort-field {
    display: flex;
    // margin-left: 10px;
    li {
      margin-right: 20px;
      cursor: pointer;
      &:last-child {
        margin-right: 0;
      }
    }
    .active {
      & > span:nth-child(1) {
        color: #214285;
        font-weight: bold;
      }
    }
    .sort-icon-box {
      display: flex;
      flex-direction: column;
      float: right;
      position: relative;
      top: -2px;
      left: 5px;
      i {
        height: 6px;
        font-size: 12px;
      }
      .active {
        color: #214285;
        font-weight: bold;
      }
    }
  }
}
</style>
<style lang="scss">
.search-bar {
  .bar-left {
    .el-input-group__append {
      background-color: #fafafa;
    }
  }
}
</style>
