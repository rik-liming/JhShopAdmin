<template>
  <div :class="className" :style="{ height: height, width: width }" />
</template>

<script>
import * as echarts from 'echarts';
import { defineComponent, shallowRef } from 'vue';
import macaronsTheme from '@/styles/echarts/theme/macarons'; // echarts theme
import resize from './mixins/resize';

export default defineComponent({
  mixins: [resize],
  props: {
    className: {
      type: String,
      default: 'chart'
    },
    width: {
      type: String,
      default: '100%'
    },
    height: {
      type: String,
      default: '350px'
    },
    autoResize: {
      type: Boolean,
      default: true
    },
    chartData: {
      type: Object,
      required: true
    }
  },
  data() {
    return {
      chart: null
    };
  },
  watch: {
    chartData: {
      deep: true,
      handler(val) {
        this.setOptions(val);
      }
    }
  },
  mounted() {
    this.$nextTick(() => {
      this.initChart();
    });
  },
  beforeUnmount() {
    if (!this.chart) {
      return;
    }
    this.chart.dispose();
    this.chart = null;
  },
  methods: {
    initChart() {
      this.chart = shallowRef(echarts.init(this.$el, macaronsTheme));
      this.setOptions(this.chartData);
    },
    setOptions(data) {
      this.chart.setOption({
        xAxis: {
          data: ['0', '1', '2', '3', '4', '5', 
            '6', '7', '8','9', '10', '11', '12',
            '13', '14', '15','16', '17', '18', '19',
            '20', '21', '22', '23'
            ],
          boundaryGap: false,
          axisTick: {
            show: false
          }
        },
        grid: {
          left: 10,
          right: 10,
          bottom: 20,
          top: 30,
          containLabel: true
        },
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'cross'
          },
          padding: [5, 10]
        },
        yAxis: {
          axisTick: {
            show: false
          }
        },
        legend: {
          data: ['订单金额走势']
        },
        series: [{
          name: '订单金额走势',
          itemStyle: {
            color: '#FF005A'
          },
          lineStyle: {
            color: '#FF005A',
            width: 2
          },
          smooth: true,
          type: 'line',
          data: data,
          animationDuration: 2800,
          animationEasing: 'cubicInOut'
        },
        ]
      });
    }
  }
});
</script>
