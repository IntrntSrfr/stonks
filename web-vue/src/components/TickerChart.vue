<template>
    <div class="flex flex-col">
        <div class="flex justify-between align-middle border-b border-dark-200">
            <p class="px-5 py-1 text-light-200">Range</p>    
            <div class="flex flex-row self-end idvide-x">
                <button v-for="(opt, i) in options" :key="i" @click="setSelected(i)" :class="['px-5', 'py-1', 'transition', 'ease-in-out', opt.selected ? 'text-accent-200' : 'text-light-300', 'hover:text-accent-200']">
                    {{ opt.title }}
                </button>
            </div>
        </div>
        <div>
            <Line v-if="history" :data="chartData" :options="chartOptions" height={200} />
        </div>
        <div v-if="error">
            {{ JSON.stringify(error) }}
        </div>
    </div>
</template>

<script setup lang="ts">
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip,
} from 'chart.js'
import { Line } from 'vue-chartjs'

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip,
)

import type { TickerGraphOption } from '@/types';
import { subtractDate } from '@/util/util';
import { computed, onMounted, ref } from 'vue';
import axios from 'axios';

const props = defineProps<{ticker: string, currency: string}>()

const isLoading = ref(false)
const error = ref()
const history = ref()

const options = ref<TickerGraphOption[]>([
    { title: "1D", from: subtractDate(1), selected: false },
    { title: "5D", from: subtractDate(5), selected: false },
    { title: "1M", from: subtractDate(0, 1), selected: true },
]);

const labels = computed(() => history.value ? history.value.map((m: any) => new Date( m.t).toLocaleDateString()) : [])
const values = computed(() => history.value ? history.value.map((m: any) => m.c) : [])
const chartData = computed(() => ({
    labels: labels.value,
    datasets: [
        {
            data: values.value,
            lineTension: 0.2
        },
    ],
}))

const chartOptions = computed(() => ({
    responsive: true,
    maintainAspectRatio: false,
    borderColor: '#00C9A4',
    scales: {
        y: {
            title: {
                display: true, 
                text: `Value - ${props.currency}`
            }
        }
    },
}))

onMounted(async () => {
    await fetchTickerHistoryData(props.ticker, options.value.find(o => o.selected)!.from)
})

const fetchTickerHistoryData = async (name: string, from: Date) => {
    try {
        isLoading.value = false
        error.value = null
        const resp = await axios.get(`http://localhost:8080/api/tickers/${name}/history`, {
            params: {
                from: from.toISOString().substring(0, 10),
                to: new Date().toISOString().substring(0, 10),
            }
        })
        history.value = await resp.data
    } catch (err) {
        error.value = error
    } finally {
        isLoading.value = false
    }
}

const setSelected = async (idx: number) => {
    options.value = options.value.map((opt, i) => i === idx
        ? {...opt, selected: true}
        : {...opt, selected: false}
    )
    await fetchTickerHistoryData(props.ticker, options.value.find(o => o.selected)!.from)
}

</script>

<style scoped>

</style>
