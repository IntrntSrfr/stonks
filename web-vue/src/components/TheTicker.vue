<template>
    <AppLoader v-if="isLoading"/>
    <div v-else-if="error" class="text-center p-5">{{ error }}</div>
    <div v-else-if="tickerData">
        <AppSection :header="tickerData.name">
            <TickerDescription>{{tickerData.description}}</TickerDescription>
        </AppSection>
        <AppSection header="Value">
            <h1 class="text-4xl">Large value</h1>
        </AppSection>
        <AppSection header="Chart">
            <TickerChart :ticker="(route.params.name as string)" :currency="tickerData.currency_name.toUpperCase()"/>
        </AppSection>
        <AppSection header="Summary">
            <div class="flex flex-wrap gap-1 text-light-200">
                <TickerSummaryItem name="Market Cap" :value="tickerData.market_cap"/>
                <TickerSummaryItem name="Market Cap" :value="tickerData.market_cap"/>
                <TickerSummaryItem name="Market Cap" :value="tickerData.market_cap"/>
                <TickerSummaryItem name="Market Cap" :value="tickerData.market_cap"/>
            </div>
        </AppSection>
        <AppSection header="Info">
            <div class="flex flex-wrap gap-1 text-light-200">
                <div>
                    {{tickerData.name}}. 
                    {{address}}. 
                    Employees: {{employees}}.
                    Currency in {{tickerData.currency_name.toUpperCase()}}.
                </div>
                <a v-if="tickerData.homepage_url" :href="tickerData.homepage_url" target="_blank" class="text-accent-200 hover:text-accent-200 transition ease-in-out">{{tickerData.homepage_url}}</a>
            </div>
        </AppSection>
    </div>    
</template>

<script setup lang="ts">
import AppLoader from '@/components/AppLoader.vue';
import AppSection from '@/components/AppSection.vue';
import TickerDescription from '@/components/TickerDescription.vue';
import TickerSummaryItem from '@/components/TickerSummaryItem.vue';
import TickerChart from '@/components/TickerChart.vue';

import { computed, onMounted, ref, watch } from 'vue';
import { useRoute } from 'vue-router';
import { numberToHumanReadable } from '@/util/util';

import axios from 'axios'

const isLoading = ref(false)
const error = ref()
const tickerData = ref<any>(null)

const route = useRoute()

onMounted(async () => await fetchTickerData(route.params.name as string))

watch(
    () => route.params.name,
    async newName => await fetchTickerData(newName as string)
)

const fetchTickerData = async (name: string) => {
    try{
        isLoading.value = true
        error.value = null
        const resp = await axios.get(`http://localhost:8080/api/tickers/${name}`)
        tickerData.value = await resp.data
    } catch (err) {
        error.value = err
    } finally {
        isLoading.value = false
    }
}

const address = computed( () => {
    if(!tickerData.value) return "";
    let {address1, city, postal_code, state} = tickerData.value.address
    city = city.at(0) + city.slice(1).toLowerCase()
    address1 = address1.split(' ').map((w: string) => w[0] + w.slice(1).toLowerCase()).join(' ')
    return [address1, city, postal_code, state].join(', ')
})

const employees = computed(()=>numberToHumanReadable(tickerData.value.total_employees))

</script>

<style scoped>

</style>