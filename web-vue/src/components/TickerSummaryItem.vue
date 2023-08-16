<template>
    <div class="flex-1 whitespace-nowrap flex flex-row justify-between border p-2 gap-10 rounded-md border-dark-200 hover:border-dark-300 transition ease-in-out">
        <div>
            {{ name }}
        </div>
        <div>
            {{valueStr}}
        </div>
    </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import {numberToHumanReadable} from '../util/util'

interface SummaryItemProps {
    name: string;
    value: string | number;
}
const props = defineProps<SummaryItemProps>()

const valueStr = computed(() => {
    if(typeof props.value === "number")
        return numberToHumanReadable(props.value)
    return props.value
})

</script>

<style scoped>

</style>