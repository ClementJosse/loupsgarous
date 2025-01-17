<template>
    <qrcode-vue
      :value="value"
      :level="level"
      :render-as="renderAs"
      :background="background"
      :foreground='foreground'
      :gradient="gradient"
      :margin="margin"
    />
  </template>
  <script setup lang="ts">
    import { ref } from 'vue'
    import QrcodeVue from 'qrcode.vue'
    import type { Level, RenderAs, GradientType, ImageSettings } from 'qrcode.vue'
  
    const value = ref('http://192.168.1.119:5173/140125')
    const level = ref<Level>('M')
    const renderAs = ref<RenderAs>('svg')
    const background = ref('#CAB8FF')
    const foreground = ref('#061F31')
    const margin = ref(2)
    
  
    const gradient = ref(false)

  </script>