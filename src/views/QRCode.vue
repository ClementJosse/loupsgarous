<template>
    <qrcode-vue :value="props.value" :level="level" :render-as="renderAs" :background="background"
        :foreground="foreground" :gradient="gradient" :margin="margin" :size="computedSize" />
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onBeforeUnmount } from 'vue'
import QrcodeVue from 'qrcode.vue'
import type { Level, RenderAs } from 'qrcode.vue'

const props = defineProps({
    value: {
        type: String,
        required: true
    }
})

const level = ref<Level>('Q')
const renderAs = ref<RenderAs>('svg')
const background = ref('#CAB8FF')
const foreground = ref('#061F31')
const margin = ref(2)
const gradient = ref(false)

// 1) Stocker la largeur de la fenêtre dans un ref
const vw = ref(window.innerWidth)

// 2) Mettre à jour vw lors du resize
function handleResize() {
    vw.value = window.innerWidth
}

onMounted(() => {
    window.addEventListener('resize', handleResize)
})

onBeforeUnmount(() => {
    window.removeEventListener('resize', handleResize)
})

// 3) computedSize se base sur vw
const computedSize = computed(() => {
    // clamp(0px, 60vw, 300px) équivaut en JS à :
    // Math.max(0, Math.min(300, 0.60 * vw.value))
    //
    // Mais on peut faire plus direct :
    return Math.min(300, 0.60 * vw.value) // 60vw, max 300
})

</script>