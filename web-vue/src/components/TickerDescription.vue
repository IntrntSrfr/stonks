<template>
    <div>
        <div 
            ref="contentRef"
            :class="['text-light-200', 'text-sm', 'transition-height', 'duration-300', 'overflow-hidden', 'relative', showFull ? 'shadow-none' : 'shadow-text']"
            :style="{ height: height }"
        >
            <slot></slot>
        </div>
        <button @click="toggleShowFull" class="text-sm mt-2 text-accent-100 hover:text-accent-200 transition" >
            Show {{showFull ? "less" : "more"}}
        </button>
    </div>
</template>

<script setup lang="ts">
import { onBeforeUnmount, onMounted, ref } from 'vue';

const contentRef = ref<HTMLDivElement | null>(null)
const showFull = ref(false)
const height = ref('3rem')

const calculateHeight = () => {
    if(!contentRef.value) return;
    const fullHeight = `${contentRef.value.scrollHeight}px`;
    height.value = showFull.value ? fullHeight : '3rem';
};

onMounted(()=>{
    calculateHeight()
    window.addEventListener('resize', calculateHeight)    
})

onBeforeUnmount(()=>{
    window.removeEventListener('resize', calculateHeight)
})

const toggleShowFull = () => {
    showFull.value = !showFull.value
    calculateHeight()
}
</script>

<style scoped></style>
