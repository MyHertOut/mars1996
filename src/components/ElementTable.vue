<template>
  <div :class="tableClass" v-loading="loading">
    <el-table
      v-bind="$attrs"
      v-on="$listeners"
      :data="data"
      :row-key="rowKey"
      :expand-row-keys="expandRowKeys"
      @expand-change="handleExpandChange"
    >
      <el-table-column width="1" v-if="isExpand" type="expand">
        <template slot-scope="scope">
          <slot
            name="expand"
            :row="scope.row"
          ></slot>
        </template>
      </el-table-column>
      <template v-for="(item, index) in columns">
        <el-table-column
          v-if="item.isSlot"
          :key="index"
          v-bind="item"
          :show-overflow-tooltip="item.showOverflowTooltip === undefined ? true : item.showOverflowTooltip"
        >
        <template slot-scope="scope">
          <slot
            :name="item.prop"
            :prop="item.prop"
            :row="scope.row"
          ></slot>
        </template>
        </el-table-column>
        <el-table-column
          v-else
          :key="index"
          v-bind="item"
          :show-overflow-tooltip="item.showOverflowTooltip === undefined ? true : item.showOverflowTooltip"
        ></el-table-column>
      </template>
    </el-table>
    <template v-if="pager">
      <el-pagination
        v-if="data.length > 0 && pageTotal >= pageSize"
        background
        layout="prev, pager, next"
        @current-change="handleChangePage"
        :page-size="pageSize"
        :current-page="pageIndex"
        :total="pageTotal"
      >
      </el-pagination>
    </template>
  </div>
</template>

<script>
export default {
  name: 'ElementTable',
  props: {
    tableClass: {
      type: String,
      default: 'common-table'
    },
    isExpand: {
      type: Boolean,
      default: false
    },
    rowKey: {
      type: Function,
      default: (row) => row.id
    },
    expandRowKeys: {
      type: Array,
      default: () => []
    },
    loading: {
      type: Boolean,
      default: false
    },
    // table data
    data: {
      type: Array
    },
    // columns
    columns: {
      type: Array
    },
    // // Does it have a border
    // border: {
    //   type: Boolean,
    //   default: false
    // },
    // Whether it is a zebra stripe
    // stripe: {
    //   type: Boolean,
    //   default: false
    // },
    // Column contents exceed the ellipsis shown
    showTooltip: {
      type: Boolean,
      default: true
    },
    // Whether or not paging is required
    pager: {
      type: Boolean
    },
    pageTotal: {
      type: Number,
      default: 1
    },
    pageIndex: {
      type: Number,
      default: 1
    },
    pageSize: {
      type: Number,
      default: 10
    }
  },
  data () {
    return {};
  },
  inheritAttrs: false,
  methods: {
    // When the current page changes
    handleChangePage (page) {
      this.$emit('handleChangePage', page);
    },
    handleExpandChange (row, expandedRows) {
      this.$emit('handleExpandChange', row, expandedRows);
    }
  }
};
</script>
<style lang="scss">
 .common-table {
    padding-bottom: 30px;
    &::after {
      content: '';
      display: block;
      clear: both;
      width: 0;
      height: 0;
    }
    .el-pagination {
      float: right;
      margin-top: 30px;
      margin-right: 30px;
    }
  }
</style>
