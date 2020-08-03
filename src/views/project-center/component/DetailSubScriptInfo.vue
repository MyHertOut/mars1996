<template>
  <div class="view-item">
    <el-row :gutter="20">
        <el-col :span="4"><div class="sub-title">Project Name：</div></el-col>
        <el-col :span="8"><div class="grid-content">{{ detailData.orderName }}</div></el-col>
        <el-col :span="4"><div class="sub-title">Subscription Quantity：</div></el-col>
        <el-col :span="6"><div class="grid-content">{{ detailData.quantity | demicrometer }}</div></el-col>
    </el-row>
    <el-row :gutter="20">
        <el-col :span="4"><div class="sub-title">Sales Progress：</div></el-col>
        <el-col :span="8"><div class="grid-content">{{ detailData.remainQuantity | demicrometer }}{{detailData.quantity ? `/${ $options.filters.demicrometer(detailData.quantity)}` : ''}}</div></el-col>
        <el-col :span="4"><div class="sub-title">Payment Method：</div></el-col>
        <el-col :span="6"><div class="grid-content">{{ detailData.paymentTypeDesc }}</div></el-col>
    </el-row>
    <el-row :gutter="20">
        <el-col :span="4"><div class="sub-title">Min Purchase：</div></el-col>
        <el-col :span="8" v-if="detailData.tradeType === 1"><div class="grid-content">{{ detailData.quantity | demicrometer }}</div></el-col>
        <el-col :span="8" v-else><div class="grid-content">{{ detailData.minQuantityOnce | demicrometer }}</div></el-col>
        <el-col :span="4"><div class="sub-title">Max Purchase：</div></el-col>
        <el-col :span="6" v-if="detailData.tradeType === 1"><div class="grid-content">{{ detailData.quantity | demicrometer }}</div></el-col>
        <el-col :span="6" v-else><div class="grid-content">{{ detailData.maxQuantityPer | demicrometer }}</div></el-col>
    </el-row>
    <el-row :gutter="20">
        <el-col :span="4"><div class="sub-title">Currency：</div></el-col>
        <el-col :span="8"><div class="grid-content">{{ detailData.tokenMark || '--' }}</div></el-col>
        <el-col :span="4"><div class="sub-title">Settlement Token：</div></el-col>
        <el-col :span="6"><div class="grid-content">{{detailData.settlementCode}}</div></el-col>
    </el-row>
    <el-row :gutter="20">
        <el-col :span="4"><div class="sub-title">Unit Price：</div></el-col>
        <el-col :span="8"><div class="grid-content">{{ detailData.price | demicrometer }} {{ detailData.currency}}</div></el-col>
        <el-col :span="4"><div class="sub-title">Incremental Size：</div></el-col>
        <el-col :span="6"><div class="grid-content">{{ detailData.priceSize || '--' }}</div></el-col>
    </el-row>
    <el-row :gutter="20">
        <el-col :span="4"><div class="sub-title">Subscription Period Start：</div></el-col>
        <el-col :span="8"><div class="grid-content">{{ detailData.orderStartTime | dateFormat('YYYY-MM-DD HH:mm') }}</div></el-col>
        <el-col :span="4"><div class="sub-title">Subscription Period End：</div></el-col>
        <el-col :span="6"><div class="grid-content">{{ detailData.orderEndTime | dateFormat('YYYY-MM-DD HH:mm') }}</div></el-col>
    </el-row>
    <el-row :gutter="20">
        <el-col :span="4"><div class="sub-title">Settlement Type：</div></el-col>
        <el-col :span="8"><div class="grid-content">Instant Settlement</div></el-col>
        <el-col :span="4"><div class="sub-title">Settlement Datetime：</div></el-col>
        <el-col :span="6"><div class="grid-content">--</div></el-col>
    </el-row>
    <el-row :gutter="20">
        <el-col :span="4"><div class="sub-title">Project Number：</div></el-col>
        <el-col :span="8"><div class="grid-content">{{ detailData.orderCode }}</div></el-col>
        <el-col :span="4"><div class="sub-title">Contract Address：</div></el-col>
        <el-col :span="6">
            <div class="grid-content">
              <a v-if="detailData.contractAddress" class="link-txt" :href="browserUrlAddress(detailData.contractAddress)" target="_blank">{{detailData.contractAddress}}</a>
              <span v-else>--</span>
            </div>
        </el-col>
    </el-row>
    <el-row :gutter="20">
        <el-col :span="4"><div class="sub-title">Subscription Info：</div></el-col>
        <el-col :span="19">
            <div class="grid-content">
            <pre>{{ detailData.content }}</pre>
            </div>
        </el-col>
    </el-row>
</div>
</template>

<script>
import mixins from '@/plugin/mixin.js';

export default {
  name: 'DetailBasicParameters',
  mixins: [mixins],
  props: {
    detailData: {
      type: Object,
      default: () => {
      }
    }
  },
  data () {
    return {
    };
  }
};
</script>
