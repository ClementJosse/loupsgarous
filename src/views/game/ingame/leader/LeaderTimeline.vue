<template>
    <div class="w-full bg-dark-background h-[clamp(0px,40vw,200px)] flex items-center flex-col">
        <div class="text-white text-lg bg-blue-background m-[clamp(0px,2vw,10px)] p-[clamp(0px,2vw,10px)] rounded-xl">
            'Action'
        </div>
        <div class="flex flex-row w-[clamp(0px,90vw,450px)] items-center justify-between z-10">
            <img v-if="props.gameInfo.time === 'Jour'" src="@/assets/sun.svg" class="w-[clamp(0px,5vw,25px)]">
            <img v-if="props.gameInfo.time === 'Nuit'" src="@/assets/moon.svg" class="w-[clamp(0px,5vw,25px)]">

            <template v-for="(role, index) in props.gameInfo.timeline" :key="index">
                <img :src="getImagePath(role)" :class="[
                    { 'h-[clamp(0px,5vw,25px)]': index !== props.gameInfo.timelineIndex },
                    {
                        'w-[clamp(0px,15vw,75px)]': index === props.gameInfo.timelineIndex,
                        'h-[clamp(0px,15vw,75px)]': index === props.gameInfo.timelineIndex,
                        'border-[clamp(0px,0.5vw,2.5px)]': index === props.gameInfo.timelineIndex,
                        'rounded-md': index === props.gameInfo.timelineIndex,
                        'border-purple-important': index === props.gameInfo.timelineIndex,
                        'bg-purple-important': index === props.gameInfo.timelineIndex
                    }
                ]" />
                <button v-wave @click="nextRole()"
                    class="w-[clamp(0px,10vw,50px)] h-[clamp(0px,10vw,50px)] rounded-full justify-items-center active:scale-105">
                    <img v-if="index === props.gameInfo.timelineIndex" src="@/assets/next.svg"
                        class="w-[clamp(0px,5vw,25px)]">
                </button>
            </template>

            <img v-if="props.gameInfo.time === 'Jour'" src="@/assets/moon.svg" class="w-[clamp(0px,5vw,25px)]">
            <img v-if="props.gameInfo.time === 'Nuit'" src="@/assets/sun.svg" class="w-[clamp(0px,5vw,25px)]">

        </div>
        <!-- Ligne d'arrière-plan avec deux parties -->
        <div class="absolute top-[clamp(0px,22vw,110px)] w-[clamp(0px,85vw,425px)] flex z-0">
            <div v-if="props.gameInfo.timeline.length > 0" class="bg-purple-important h-[clamp(0px,0.5vw,2.5px)]"
                :style="{ width: `${(props.gameInfo.timelineIndex + 1) * 100}%` }"></div>
            <div v-if="props.gameInfo.timeline.length > 0" class="bg-disabled h-[clamp(0px,0.5vw,2.5px)]"
                :style="{ width: `${(props.gameInfo.timeline.length + 1 - props.gameInfo.timelineIndex) * 100}%` }">
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref } from 'vue';
import { getDatabase, ref as dbRef, onValue, update } from 'firebase/database';
import { useRoute } from 'vue-router';

const route = useRoute();
const gameId = route.params.gameId;
const gameInfo = ref(null);
const database = getDatabase();
const partiesRef = dbRef(database, `/${gameId}`);

const props = defineProps({
    gameInfo: {
        type: Object
    }
});

const getImagePath = (role) => {
    return new URL(`../../../../assets/roles/${role}.png`, import.meta.url).href;
};

const nextRole = () => {
    console.log('next')
    // si timelineIndex === timeline.lengh, inverser/nuit et jour et recréer la timeline en fonction des variables, de la nuit/jour, mettre timelineIndex = 0 
    // sinon timelineIndex++
    if (props.gameInfo.timeline.length - 1 === props.gameInfo.timelineIndex) {
        console.log('fini!')
        console.log(props.gameInfo.time)
        if (props.gameInfo.time === 'Jour') {
            update(partiesRef, { time: 'Nuit' })
            generateNightTimeline()
        }
        else {
            update(partiesRef, { time: 'Jour' })
            update(partiesRef, { dayNightNumberIndex: props.gameInfo.dayNightNumberIndex + 1 })
            generateDayTimeline()
        }
        update(partiesRef, { timelineIndex: 0 })
    }
    else {
        update(partiesRef, { timelineIndex: props.gameInfo.timelineIndex + 1 })
    }
}

const generateNightTimeline = () => {
    
}

const generateDayTimeline = () => {
    
}

</script>