<template>
  <div class="chart-container" style="height: 300px">
    <canvas ref="chartCanvas"></canvas>
  </div>
</template>

<script setup lang="ts">
import { useUserStore } from '@/stores/userStore';
import Chart from 'chart.js/auto';
import { computed, onMounted, onUnmounted, ref, watch } from 'vue';

const props = defineProps({
  timespan: {
    type: Number,
    default: 60
  },
  refreshRate: {
    type: Number,
    default: 2000
  }
});

const userStore = useUserStore();
const chartCanvas = ref<HTMLCanvasElement | null>(null);
let chart: Chart | null = null;

const timestamps: string[] = [];
const cpuData: number[] = [];

// Calculer le nombre maximum de points à afficher
const maxDataPoints = computed(() => {
  return Math.ceil(props.timespan * 1000 / props.refreshRate);
});

const createChart = () => {
  if (!chartCanvas.value) return;

  const gradientFill = chartCanvas.value.getContext('2d')?.createLinearGradient(0, 0, 0, 300);
  if (gradientFill) {
    gradientFill.addColorStop(0, 'rgba(59, 130, 246, 0.5)');
    gradientFill.addColorStop(1, 'rgba(59, 130, 246, 0.0)');
  }

  chart = new Chart(chartCanvas.value, {
    type: 'line',
    data: {
      labels: timestamps,
      datasets: [{
        label: 'CPU %',
        data: cpuData,
        borderColor: '#3B82F6',
        backgroundColor: gradientFill || 'rgba(59, 130, 246, 0.1)',
        fill: true,
        tension: 0.3,
        pointRadius: 0,
        borderWidth: 3
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      scales: {
        y: {
          beginAtZero: true,
          max: 100,
          grid: {
            display: true,
            color: 'rgba(0, 0, 0, 0.05)'
          },
          ticks: {
            callback: (value) => `${value}%`
          }
        },
        x: {
          grid: {
            display: false
          },
          ticks: {
            maxRotation: 0,
            autoSkip: true,
            maxTicksLimit: 8
          }
        }
      },
      animation: {
        duration: 300
      },
      plugins: {
        legend: {
          display: false
        },
        tooltip: {
          mode: 'index',
          intersect: false,
          callbacks: {
            label: (context) => `CPU: ${context.parsed.y.toFixed(1)}%`
          },
          backgroundColor: 'rgba(0, 0, 0, 0.7)',
          padding: 10,
          cornerRadius: 4
        }
      },
      interaction: {
        mode: 'nearest',
        axis: 'x',
        intersect: false
      }
    }
  });
};

const updateChart = () => {
  if (!chart) return;

  const now = new Date();
  const timeStr = now.toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit', second: '2-digit' });

  timestamps.push(timeStr);
  cpuData.push(userStore.systemData.cpu.usage);

  // Limiter le nombre de points selon le timespan
  while (timestamps.length > maxDataPoints.value) {
    timestamps.shift();
    cpuData.shift();
  }

  chart.update('none');
};

let intervalId: ReturnType<typeof setInterval>;

const setupInterval = () => {
  if (intervalId) {
    clearInterval(intervalId);
  }
  intervalId = setInterval(updateChart, props.refreshRate);
};

// Surveiller les changements de props
watch(() => props.refreshRate, (newRate) => {
  setupInterval();
});

watch(() => props.timespan, () => {
  // Réinitialiser le graphique si le timespan change
  if (chart) {
    chart.destroy();
  }

  // Vider les données existantes
  timestamps.length = 0;
  cpuData.length = 0;

  // Initialiser avec une valeur
  const now = new Date();
  timestamps.push(now.toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit', second: '2-digit' }));
  cpuData.push(userStore.systemData.cpu.usage || 0);

  // Recréer le graphique
  createChart();
});

onMounted(() => {
  const now = new Date();
  timestamps.push(now.toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit', second: '2-digit' }));
  cpuData.push(userStore.systemData.cpu.usage || 0);

  createChart();
  setupInterval();
});

onUnmounted(() => {
  if (intervalId) {
    clearInterval(intervalId);
  }
  if (chart) {
    chart.destroy();
  }
});
</script>

<style scoped>
.chart-container {
  width: 100%;
  position: relative;
  border-radius: 8px;
  padding: 8px;
  background-color: rgba(255, 255, 255, 0.5);
}
</style>