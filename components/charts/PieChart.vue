<template>
  <div class="chart-container" :style="{ height: height + 'px' }" role="img" :aria-label="ariaLabel">
    <canvas ref="chartCanvas"></canvas>
  </div>
</template>

<script lang="ts" setup>
import { ChartData, ChartOptions } from 'chart.js';
import Chart from 'chart.js/auto';
import { onMounted, ref, toRefs, watch } from 'vue';

const props = defineProps({
  chartData: {
    type: Object as () => ChartData,
    required: true
  },
  chartOptions: {
    type: Object as () => ChartOptions,
    default: () => ({})
  },
  height: {
    type: [Number, String],
    default: 300
  },
  ariaLabel: {
    type: String,
    default: 'Pie chart displaying data'
  }
});

const { chartData, chartOptions } = toRefs(props);
const chartCanvas = ref<HTMLCanvasElement | null>(null);
let chart: Chart | null = null;

const initChart = () => {
  if (chartCanvas.value) {
    const ctx = chartCanvas.value.getContext('2d');
    if (ctx) {
      chart = new Chart(ctx, {
        type: 'pie',
        data: chartData.value,
        options: {
          responsive: true,
          maintainAspectRatio: false,
          ...chartOptions.value
        }
      });
    }
  }
};

const updateChart = () => {
  if (chart) {
    chart.data = chartData.value;
    chart.options = {
      responsive: true,
      maintainAspectRatio: false,
      ...chartOptions.value
    };
    chart.update();
  }
};

const destroyChart = () => {
  if (chart) {
    chart.destroy();
    chart = null;
  }
};

onMounted(() => {
  initChart();
});

watch([chartData, chartOptions], () => {
  updateChart();
});

defineExpose({
  destroyChart
});
</script>

<style scoped>
.chart-container {
  position: relative;
  width: 100%;
}
</style>