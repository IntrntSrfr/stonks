<template>
    <form @submit.prevent="handleSubmit" class="flex-1 flex gap-1 border border-dark-200 rounded-full focus-within:border-dark-300 hover:border-dark-300 transition ease-in-out">
        <input type="text" v-model="searchText" placeholder="AAPL" class="flex-1 ml-4 text-lg bg-transparent outline-none w-full min-w-[2em]"/>
        <Transition>
            <button v-show="searchText.length" type="button" @click="searchText = ''" :class="['flex', 'items-center', 'px-2', 'py-3', 'transition', 'text-light-200', 'hover:text-light-100']">
                <fas :icon="['fas', 'close']" class="h-5"/>
            </button>
        </Transition>
        <button class="flex items-center px-2 py-3 mr-2 transition text-light-200 hover:text-light-100">
            <fas :icon="['fas', 'magnifying-glass']" class="h-5"/>
        </button>
    </form>
    <div class="search-results" v-if="false">
        <div v-for="r in searchResults" class="search-result">{{r}}</div>
    </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue';
import { useRouter } from 'vue-router';

const searchText = ref("")
const searchResults = ref<string[]>([])
const textUpper = computed(() => searchText.value.toUpperCase())

const router = useRouter()

const handleSubmit = (e: Event) => {
    e.preventDefault()
    if(!isValidTicker(textUpper.value)) return;
    router.push({name: 'ticker', params: {name: textUpper.value}})
    searchText.value = ''
}

const isValidTicker = (ticker: string) => {
        if(ticker.length > 5 || ticker.length < 1) return false
        return true
}
</script>

<style scoped>
</style>
