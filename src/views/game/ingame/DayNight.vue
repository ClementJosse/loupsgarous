<template>
    <div v-if="props.info === 'day'">
        <img src="@/assets/day.svg" class="w-[clamp(0px,100vw,500px)]" />
    </div>
    <div v-else-if="props.info === 'night'">
        <img src="@/assets/night.svg" class="w-[clamp(0px,100vw,500px)]" />
    </div>


</template>

<script setup>
const props = defineProps({
    info: {
        type: String
    },
});

</script>