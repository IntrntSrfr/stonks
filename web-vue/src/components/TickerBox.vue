<template>
    <div class="flex flex-row justify-between border p-2 gap-10 rounded-md border-dark-200 cursor-pointer hover:border-dark-300 transition ease-in-out">
        <div class="flex flex-col truncate">
            <div class="truncate">{{name}}</div>
            <div v-if="market" class="text-xs text-light-200">{{market}}</div>
        </div>
        <div class="flex flex-col items-end shrink-0">
            <div>{{ value}} <span class="text-light-200">{{ currency }}</span></div>
            <div :class="[change.startsWith('-') ? 'text-accent-2-100' : 'text-accent-100', 'text-xs']">{{ change }}</div>
        </div>
    </div>
</template>

<script setup lang="ts">
import type { StockInfo } from '@/types';
defineProps<StockInfo>()
</script>

<style scoped>

</style>