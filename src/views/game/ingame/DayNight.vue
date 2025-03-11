<template>
    <div class="flex flex-col items-center w-full bg-dark-background">
        <div v-if="props.info === 'day'">
            <img src="@/assets/day.svg" class="w-[clamp(0px,100vw,500px)]" />
        </div>
        <div v-else-if="props.info === 'night'">
            <img src="@/assets/night.svg" class="w-[clamp(0px,100vw,500px)]" />
        </div>
    </div>

</template>

<script setup>
const props = defineProps({
    info: {
        type: String
    },
});

</script>