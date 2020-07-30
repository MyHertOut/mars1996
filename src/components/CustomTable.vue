<template>
  <div class="custom-table">
    <template v-if="datas && datas.length">
    <ul class="zs-table">
      <li class="zs-row" v-for="dataItem in datas" :key="dataItem[rowKey]" @click="handleRowClick(dataItem)">
        <div class="zs-row__header">
          <div class="title">
            <span v-if="dataItem.tokenMark" class="txt-currency">{{dataItem.tokenMark}}</span>
            <span v-else-if="dataItem.currency" class="txt-currency">{{dataItem.currency}}</span>
            <span>{{ dataItem[headTitleProp] }}</span>
          </div>
          <div class="op-bar">
            <slot name="opbar" v-bind="dataItem"></slot>
          </div>
        </div>
        <div class="zs-row__body">
          <div class="columns">
              <el-col v-for="(item, index) in columns" :key="item.prop" :span="item.span || 8"
              :style="(index === rowFirstColumnIndex ||
              index === rowFirstColumnIndex + 1 ||
              index === rowFirstColumnIndex + 2) ? 'margin-bottom: 0;' : ''">
                <label class="label" :title="item.label" v-if="item.label" :style="item.labelWidth ? 'width:' + item.labelWidth + 'px' : ''">{{ item.label }}：</label>
                <div class="label-value" v-if="item.slot" :style="'width:' + item.valueWidth + 'px;'">
                  <slot :name="item.prop" :prop="item.prop" :row="dataItem">
                  </slot>
                </div>
                <div class="label-value" v-else-if="item.formatter">
                  {{ item.formatter(dataItem, dataItem[item.prop] ) }}
                </div>
                <div class="label-value" v-else>
                  {{ dataItem[item.prop] }}
                </div>
              </el-col>
          </div>
          <div class="status">
            <slot name="column-bar" :row="dataItem"></slot>
          </div>
        </div>
      </li>
    </ul>
    <el-pagination
      v-if="pager && total > 10"
      background
      layout="prev, pager, next"
      :page-size="limit"
      :current-page="page"
      :total="total"
      @current-change="handleChangePage"
    ></el-pagination>
    </template>
    <div v-else class="nodata">
      <img src="../assets/images/address-empty.png" alt="nodata" class="address-empty">
    </div>
  </div>
</template>
<script>
export default {
  name: 'CustomTable',
  props: {
    // 每条数据唯一性字段名
    rowKey: {
      required: true,
      type: String,
      default: 'rowNo'
    },
    headTitleProp: {
      type: String,
      default: 'name'
    },
    // 列表数据
    datas: {
      type: Array,
      default: () => []
    },
    // 列名
    columns: {
      type: Array,
      default: () => []
    },
    limit: {
      type: Number,
      default: 10
    },
    page: {
      type: Number,
      default: 1
    },
    total: {
      type: Number,
      default: 0
    },
    // pageParams: {
    //   type: Object,
    //   default: () => ({
    //     limit: 10,
    //     page: 1,
    //     total: 0
    //   })
    // },
    // 是否需要分页，默认true需要
    pager: {
      type: Boolean,
      default: true
    }
  },
  data () {
    return {};
  },
  computed: {
    rowFirstColumnIndex () {
      return (Math.ceil(this.columns.length / 3) - 1) * 3;
    }
  },
  methods: {
    // When the current page changes
    handleChangePage (page) {
      this.$emit('handleChangePage', page);
    },
    // click row
    handleRowClick (row) {
      this.$emit('handleRowClick', row);
    }
  }
};
</script>
<style lang="scss" scoped>
@import '@/style/mixins.scss';
.custom-table {
  margin-top: 30px;
  .zs-table {
    .zs-row {
      // max-height: 156px;
      // padding: 0 40px 0 20px;
      border: 1px solid #f1f1f1;
      margin-bottom: 12px;
      cursor: pointer;
      transition: all 0.5s;
      &:last-child {
        margin-bottom: 0;
      }
      &:hover {
        box-shadow: 0 0 4px 4px rgba(104, 140, 180, 0.11);
      }
      &__header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        height: 48px;
        margin: 0 1px 0 1px;
        padding: 0 40px 0 20px;
        border-bottom: 1px solid #E9E9E9;
        font-size: 12px;
        background: #FBFBFB;
        .title {
          display: flex;
          align-items: center;
          font-size: 16px;
          color: #001f3b;
        }
        .txt-currency {
          margin-right: 8px;
          padding: 2px 14px;
          border-radius: 4px;
          font-size: 14px;
          background: rgba(19, 172, 0, 0.58); // rgb(19 172 0 / 0.58);
          color: #fff;
        }
        .op-bar {
          color: #214285;
        }
      }
      &__body {
        display: flex;
        // align-items: center;
        justify-content: space-between;
        // height: calc(100% - 48px);
        padding: 14px 40px 14px 20px;
        color: #575e6e;
        .columns {
          flex: 1;
        }
        .status {
          display: flex;
          width: 150px;
          flex-direction: column;
          align-items: flex-end;  //center;
          justify-content: center;
          .el-button+.el-button {
            margin-left: 0;
          }
        }
        .el-row {
          margin-bottom: 8px;
          &:last-child {
            margin-bottom: 0;
          }
        }
        .el-col {
          margin-bottom: 9px;
        }
        .label {
          display: inline-block;
          width: 150px; //136px;
          margin-right: 20px;
          color: #8d93a1;
          @include overflow-text;
        }
        .label-value {
          display: inline-block;
          width: 120px;//110px; // 52%;
          @include overflow-text;
        }
      }
    }
  }
  .nodata {
    margin-top: 100px;
    height: 300px;
    text-align: center;
  }
}
</style>
