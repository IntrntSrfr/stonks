<template>
    <div>
        <AppSection header="Recent">
            <RouterLink v-for="r in recent" :to="`/${r.ticker}`">
                <TickerBox v-bind="r"/>
            </RouterLink>
        </AppSection>
        <AppSection header="Popular">
            <RouterLink v-for="r in recent" :to="`/${r.ticker}`">
                <TickerBox v-bind="r"/>
            </RouterLink>
        </AppSection>
    </div>
</template>

<script setup lang="ts">
import type { StockInfo } from '@/types';
import AppSection from './AppSection.vue';
import TickerBox from './TickerBox.vue';

const recent: StockInfo[] = [
    {name: "Apple Inc.", ticker: "AAPL", market: "NASDAQ: AAPL", value: 177.97, currency: "USD", change: "-0.22 (0.12%)"},
    {name: "Tesla Inc.", ticker: "TSLA", market: "NASDAQ: TSLA", value: 245.34, currency: "USD", change: "+3.15 (1.30%)"},
    {name: "Alphabet Inc.", ticker: "GOOG", market: "NASDAQ: GOOG", value: 130.17, currency: "USD", change: "-0.04 (-0.03%)"},
]
</script>

<style scoped>

</style>
