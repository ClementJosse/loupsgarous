<template>
    <div class="w-full bg-dark-background h-[clamp(0px,40vw,200px)] flex items-center flex-col">
        <div class="text-white bg-blue-background m-[clamp(0px,2vw,10px)] p-[clamp(0px,2vw,10px)] rounded-xl">
            'Action'
        </div>
        <div class="flex flex-row w-[clamp(0px,90vw,450px)] items-center justify-between">
            <img src="@/assets/sun.svg" class="h-[clamp(0px,5vw,25px)]">

            <template v-for="(role, index) in timeline" :key="index">
                <img :src="getImagePath(role)" :class="[
                    { 'h-[clamp(0px,5vw,25px)]': index !== timelineIndex },
                    {
                        'w-[clamp(0px,15vw,75px)]': index === timelineIndex,
                        'h-[clamp(0px,15vw,75px)]': index === timelineIndex,
                        'border-[clamp(0px,0.5vw,2.5px)]': index === timelineIndex,
                        'rounded-md': index === timelineIndex,
                        'border-purple-important': index === timelineIndex,
                        'bg-purple-important': index === timelineIndex
                    }
                ]" />
                <!-- Insérer next.svg après l'élément correspondant à timelineIndex -->
                <img v-if="index === timelineIndex" src="@/assets/next.svg" class="w-[clamp(0px,5vw,25px)]" />
            </template>

            <img src="@/assets/moon.svg" class="h-[clamp(0px,5vw,25px)]">
        </div>
    </div>
</template>

<script setup>
import { ref } from 'vue';

const timeline = ref([
    'Cupidon',
    'Enfant sauvage',
    'Voyante',
    'Salvateur',
    'Renard',
    'Pyromane',
    'Loup',
    'Infect père des loups',
    'Sorcière',
    'Loup blanc',
    'Voleur'
]);
const timelineIndex = ref(1);

const getImagePath = (role) => {
    return new URL(`../../../../assets/roles/${role}.png`, import.meta.url).href;
};
</script>