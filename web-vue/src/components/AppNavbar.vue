<template>
    <div class="flex gap-2">
        <RouterLink v-show="showHome" to="/" class="flex items-center p-3 text-light-200 hover:text-light-100 border border-dark-200 rounded-full hover:border-dark-300 transition ease-in-out">
            <fas :icon="['fas', 'home']" class="h-5"/>
        </RouterLink>
        <AppSearchBar/>
    </div>
</template>

<script setup lang="ts">
import AppSearchBar from './AppSearchBar.vue';
defineProps<{
    showHome?: boolean
}>()
</script>

<style scoped>

</style>
