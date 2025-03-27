<template>
    <div class="w-full bg-dark-background h-[clamp(0px,40vw,200px)] flex items-center flex-col">
        <div class="flex flex-row pb-[clamp(0px,2.7vw,13.5px)]">
            <Actions :gameInfo="props.gameInfo" :isLeader="true" />
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
                        'bg-dark-background': index === props.gameInfo.timelineIndex
                    }
                ]" />
                <button v-wave v-if="index === props.gameInfo.timelineIndex" @click="nextRole()"
                    class="w-[clamp(0px,10vw,50px)] h-[clamp(0px,10vw,50px)] rounded-full justify-items-center active:scale-105">
                    <img src="@/assets/next.svg" class="w-[clamp(0px,8vw,40px)]">
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
import { getDatabase, ref as dbRef, onValue, update, set } from 'firebase/database';
import { useRoute } from 'vue-router';
import Actions from '../Actions.vue';

const route = useRoute();
const gameId = route.params.gameId;
const gameInfo = ref(null);
const database = getDatabase();
const partiesRef = dbRef(database, `/${gameId}`);
const playerList = ref([]);

const props = defineProps({
    gameInfo: {
        type: Object
    }
});

const getImagePath = (role) => {
    return new URL(`../../../../assets/roles/${role}.png`, import.meta.url).href;
};

const resetPlayerVote = () => {
    if (!props.gameInfo || !props.gameInfo.playerList) {
        console.error('gameInfo or playerList is undefined');
        return;
    }

    var playerVote = props.gameInfo.playerVote || {};

    props.gameInfo.playerList.forEach((player, index) => {
        if (!playerVote[player]) {
            playerVote[player] = [];
        }
        playerVote[player] = '...';
    });

    update(partiesRef, { playerVote: playerVote });
}

const resetPlayerAction = () => {
    if (!props.gameInfo || !props.gameInfo.playerList) {
        console.error('gameInfo or playerList is undefined');
        return;
    }

    var playerAction = props.gameInfo.playerAction || {};

    props.gameInfo.playerList.forEach((player, index) => {
        playerAction[player] = '';
    });
    playerAction[props.gameInfo.leader] = '';
    update(partiesRef, { playerAction: playerAction });
}

const killLovers = () => {
    props.gameInfo.isInLove.forEach((item) => {props.gameInfo.playerStatus[item] = 'died';
    update(partiesRef, { playerStatus: props.gameInfo.playerStatus })})
}

const nextRole = () => {
    console.log('next')
    resetPlayerAction()
    setTimeout(function () {
        // si timelineIndex === timeline.lengh, inverser/nuit et jour et recréer la timeline en fonction des variables, de la nuit/jour, mettre timelineIndex = 0 
        // sinon timelineIndex++
        if (props.gameInfo.timeline.length - 1 === props.gameInfo.timelineIndex) {
            console.log('fini!')
            console.log(props.gameInfo.time)
            if (props.gameInfo.time === 'Jour') {

                Object.keys(props.gameInfo.playerStatus).forEach(key => {
                if (props.gameInfo.playerStatus[key] === 'died') {
                    props.gameInfo.playerStatus[key] = 'dead';
                }
            });
            update(partiesRef, { playerStatus: props.gameInfo.playerStatus })
            
                update(partiesRef, { time: 'Nuit' })
                generateNightTimeline()
            }
            else {
                update(partiesRef, { time: 'Jour' })
                update(partiesRef, { dayNightNumberIndex: props.gameInfo.dayNightNumberIndex + 1 })
                generateDayTimeline()
            }
            update(partiesRef, { timelineIndex: 0 })
            Object.keys(props.gameInfo.playerStatus).forEach(key => {
                if (props.gameInfo.playerStatus[key] === 'dying') {
                    props.gameInfo.playerStatus[key] = 'died';
                    if(props.gameInfo.isInLove.includes(key)){
                        killLovers()
                    }
                }
            });
            update(partiesRef, { playerStatus: props.gameInfo.playerStatus })
        }
        else {
            if (props.gameInfo.timeline[props.gameInfo.timelineIndex] === 'Mort') {
                Object.keys(props.gameInfo.playerStatus).forEach(key => {
                    if (props.gameInfo.playerStatus[key] === 'died') {
                        props.gameInfo.playerStatus[key] = 'dead';
                    }
                });
                update(partiesRef, { playerStatus: props.gameInfo.playerStatus })
            }
            if (props.gameInfo.timeline[props.gameInfo.timelineIndex + 1] === 'Maire' || props.gameInfo.timeline[props.gameInfo.timelineIndex + 1] === 'Vote') {
                resetPlayerVote()
            }
            update(partiesRef, { timelineIndex: props.gameInfo.timelineIndex + 1 })
        }
    }, 200);
}

const generateNightTimeline = () => {
    // Pour chaque role pouvant se réveiller la nuit, vérifier si au moins une personne est vivante avec 
    // et si la/les personnes avec le roles remplissent les conditions pour se réveiller

    // Array des roles des personnes encore en vie
    const cardsAlive = Object.keys(props.gameInfo.playerCards)
        .filter(key => props.gameInfo.playerStatus[key] === "alive")
        .map(key => props.gameInfo.playerCards[key]);

    const newTimeline = []

    if (cardsAlive.includes('Cupidon') && props.gameInfo.isInLove == false) {
        newTimeline.push('Cupidon')
    }
    if (cardsAlive.includes('Enfant sauvage') && props.gameInfo.model == false) {
        newTimeline.push('Enfant sauvage')
    }
    if (cardsAlive.includes('Voyante')) {
        newTimeline.push('Voyante')
    }
    if (cardsAlive.includes('Salvateur')) {
        newTimeline.push('Salvateur')
    }
    if (cardsAlive.includes('Renard') && props.gameInfo.canFoxSnif == true) {
        newTimeline.push('Renard')
    }
    if (cardsAlive.includes('Loup')) {
        newTimeline.push('Loup')
    }
    if (cardsAlive.includes('Infect père des loups') && (props.gameInfo.hasInfected == false)) {
        newTimeline.push('Infect père des loups')
    }
    if (cardsAlive.includes('Sorcière') && (props.gameInfo.hasLifePotion == true || props.gameInfo.hasDeathPotion === true)) {
        newTimeline.push('Sorcière')
    }
    if (cardsAlive.includes('Loup blanc') && props.gameInfo.dayNightNumberIndex % 2 == 0) {
        newTimeline.push('Loup blanc')
    }
    if (cardsAlive.includes('Pyromane') && props.gameInfo.hasUsedLighter == false) {
        newTimeline.push('Pyromane')
    }
    if (cardsAlive.includes('Voleur')) {
        newTimeline.push('Voleur')
    }
    update(partiesRef, { timeline: newTimeline })
}

const generateDayTimeline = () => {
    const newTimeline = []
    newTimeline.push('Mort')
    if (props.gameInfo.mayor === false) {
        newTimeline.push('Maire')
    }
    newTimeline.push('Vote')
    newTimeline.push('Mort Vote')
    update(partiesRef, { timeline: newTimeline })
}

</script>