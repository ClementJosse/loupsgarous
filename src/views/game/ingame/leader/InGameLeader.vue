<template>
    <div class="flex flex-col w-full items-center fixed z-20">
        <DayNight :gameInfo="gameInfo" />
        <div class="w-full bg-dark-background justify-items-center pb-[clamp(0px,2vw,10px)]">
            <!-- Bouton pour basculer l'état de révélation -->
            <button v-wave
                class="flex flex-row text-purple-important justify-center active:scale-105 items-center text-xl bg-dark-background font-medium px-[clamp(0px,2vw,10px)] gap-[clamp(0px,10px,2vw)] rounded-xl h-[clamp(0px,50px,10vw)]"
                @click="toggleReveal">
                <div class="flex justify-center items-center">
                    <!-- Affiche l'icône visible ou notvisible en fonction de l'état -->
                    <img v-if="isRevealed" src="../../../../assets/visible.svg" class="w-[clamp(0px,5vw,25px)]">
                    <img v-else src="../../../../assets/notvisible.svg" class="w-[clamp(0px,5vw,25px)]">
                </div>
                Révéler tous les rôles
            </button>
        </div>
    </div>

    <LeaderListInGame :gameInfo='gameInfo' :isRevealed='isRevealed' />

    <LeaderTimeline :gameInfo='gameInfo' class="fixed bottom-0 left-0 w-full z-30" />
</template>

<script setup>
import { ref } from 'vue';
import LeaderListInGame from './LeaderListInGame.vue';
import DayNight from '../DayNight.vue';
import LeaderTimeline from './LeaderTimeline.vue';

const props = defineProps({
    gameInfo: {
        type: Object
    },
});

const isRevealed = ref(false);

const toggleReveal = () => {
    isRevealed.value = !isRevealed.value;
};
</script>