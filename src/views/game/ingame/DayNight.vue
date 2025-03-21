<template>
    <div class="relative flex flex-col items-center w-full bg-dark-background">
        <!-- Les deux images sont toujours présentes, mais avec une opacité différente selon le moment -->
        <div class="relative w-full">
            <img src="@/assets/day.svg" class="w-[clamp(0px,100vw,500px)] mx-auto transition-opacity duration-1000"
                :class="props.gameInfo.time === 'Jour' ? 'opacity-100' : 'opacity-0'" alt="Day Image" />
            <img src="@/assets/night.svg"
                class="w-[clamp(0px,100vw,500px)] mx-auto absolute top-0 left-1/2 transform -translate-x-1/2 transition-opacity duration-1000"
                :class="props.gameInfo.time === 'Jour' ? 'opacity-0' : 'opacity-100'" alt="Night Image" />
        </div>
        <!-- Texte superposé toujours visible -->
        <div class="absolute inset-0 flex flex-col items-center justify-center text-white">
            <div class="text-lg">{{ props.gameInfo.time }} n° {{ props.gameInfo.dayNightNumberIndex }}</div>
            <div class="text-xl font-semibold">{{ timelineMessageDict[props.gameInfo.timeline[props.gameInfo.timelineIndex]] }}</div>
        </div>
    </div>
</template>

<script setup>
import { ref } from 'vue';
import timelineMessage from '@/timelineMessage.json';

// Utilisez timelineMessage directement comme un objet réactif
const timelineMessageDict = ref(timelineMessage);

const props = defineProps({
    gameInfo: {
        type: Object,
        required: true,
    },
});
</script>
