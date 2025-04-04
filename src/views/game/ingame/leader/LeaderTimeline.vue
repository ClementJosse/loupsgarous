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
                <button v-wave v-if="index === props.gameInfo.timelineIndex && !isGameOver()" @click="nextRole()"
                    class="w-[clamp(0px,10vw,50px)] h-[clamp(0px,10vw,50px)] rounded-full justify-items-center active:scale-105">
                    <img src="@/assets/next.svg" class="w-[clamp(0px,8vw,40px)]">
                </button>
            </template>

            <img v-if="props.gameInfo.time === 'Jour'" src="@/assets/moon.svg" class="w-[clamp(0px,5vw,25px)]">
            <img v-if="props.gameInfo.time === 'Nuit'" src="@/assets/sun.svg" class="w-[clamp(0px,5vw,25px)]">

        </div>
        <!-- Ligne d'arrière-plan avec deux parties -->
        <div class="absolute top-[clamp(0px,22vw,110px)] w-[clamp(0px,85vw,425px)] flex z-0">
            <div v-if="isGameOver()" class="bg-purple-important h-[clamp(0px,0.5vw,2.5px)]"
                :style="{ width: `${(props.gameInfo.timelineIndex + 1) * 100}%` }">
            </div>
            <div v-else class="bg-purple-important h-[clamp(0px,0.5vw,2.5px)]"
                :style="{ width: `${(props.gameInfo.timelineIndex + 1) * 100}%` }">
            </div>

            <div v-if="isGameOver()" class="bg-disabled h-[clamp(0px,0.5vw,2.5px)]"
                :style="{ width: `${(props.gameInfo.timeline.length - props.gameInfo.timelineIndex) * 100}%` }">
            </div>
            <div v-else class="bg-disabled h-[clamp(0px,0.5vw,2.5px)]"
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


const resetPlayerAction = () => {
    if (!props.gameInfo || !props.gameInfo.playerList) {
        console.error('gameInfo or playerList is undefined');
        return;
    }

    let playerAction = props.gameInfo.playerAction || {};

    props.gameInfo.playerList.forEach((player, index) => {
        playerAction[player] = '';
    });
    playerAction[props.gameInfo.leader] = '';
    update(partiesRef, { playerAction: playerAction });
}

const killLovers = () => {
    props.gameInfo.isInLove.forEach((item) => {
        props.gameInfo.playerStatus[item] = 'died';
        update(partiesRef, { playerStatus: props.gameInfo.playerStatus })
    })
}

const isGameOver = () => {
    if (props.gameInfo?.timeline && props.gameInfo?.timelineIndex) {
        let currentTurn = props.gameInfo.timeline[props.gameInfo.timelineIndex]
        return (
            currentTurn === "Victoire Ange" ||
            currentTurn === "Victoire Loup blanc" ||
            currentTurn === "Victoire Village" ||
            currentTurn === "Victoire Pyromane" ||
            currentTurn === "Victoire Amoureux" ||
            currentTurn === "Victoire Loups"
        )
    }
    else {
        return false
    }
}

const nextRole = () => {
    console.log('next')
    resetPlayerAction()
    setTimeout(function () {
        // si au bout de la timeline, inverser/nuit et jour et recréer la timeline en fonction des variables, de la nuit/jour, mettre timelineIndex = 0 
        if (props.gameInfo.timeline.length - 1 === props.gameInfo.timelineIndex) {
            console.log('fini!')
            console.log(props.gameInfo.time)
            if (props.gameInfo.time === 'Jour') {

                Object.keys(props.gameInfo.playerStatus).forEach(key => {
                    if (props.gameInfo.playerStatus[key] === 'died') {
                        props.gameInfo.playerStatus[key] = 'dead';
                        console.log('key ' + key)
                        if (props.gameInfo.playerCards[key] === 'Salvateur') {
                            props.gameInfo.protected = ''
                            update(partiesRef, { protected: props.gameInfo.protected })
                        }
                    }
                });
                update(partiesRef, { playerStatus: props.gameInfo.playerStatus })
                update(partiesRef, { time: 'Nuit' })
                generateNightTimeline()
            }
            else {
                if (props.gameInfo?.protected && props.gameInfo.protected !== '') {
                    if (props.gameInfo.playerStatus[props.gameInfo.protected] === 'dying') {
                        props.gameInfo.playerStatus[props.gameInfo.protected] = 'alive'
                        update(partiesRef, { playerStatus: props.gameInfo.playerStatus })
                    }
                }
                update(partiesRef, { time: 'Jour' })
                update(partiesRef, { dayNightNumberIndex: props.gameInfo.dayNightNumberIndex + 1 })
                generateDayTimeline()
            }
            update(partiesRef, { timelineIndex: 0 })
            Object.keys(props.gameInfo.playerStatus).forEach(key => {
                if (props.gameInfo.playerStatus[key] === 'dying') {
                    props.gameInfo.playerStatus[key] = 'died';
                    if (props.gameInfo?.isInLove && props.gameInfo.isInLove.includes(key)) {
                        killLovers()
                    }
                    if (props.gameInfo.playerCards[key] === 'Salvateur') {
                        props.gameInfo.protected = ''
                        update(partiesRef, { protected: props.gameInfo.protected })
                    }
                }
            });
            update(partiesRef, { playerStatus: props.gameInfo.playerStatus })
        }
        // sinon timelineIndex++
        else {
            if (props.gameInfo.timeline[props.gameInfo.timelineIndex] === 'Mort' || props.gameInfo.timeline[props.gameInfo.timelineIndex] === 'Chasseur') {
                Object.keys(props.gameInfo.playerStatus).forEach(key => {
                    if (props.gameInfo.playerStatus[key] === 'died') {
                        props.gameInfo.playerStatus[key] = 'dead';
                    }
                });
                update(partiesRef, { playerStatus: props.gameInfo.playerStatus })
            }
            update(partiesRef, { timelineIndex: props.gameInfo.timelineIndex + 1 })
        }
    }, 200);
}

const generateNightTimeline = () => {
    // Pour chaque role pouvant se réveiller la nuit, vérifier si au moins une personne est vivante avec 
    // et si la/les personnes avec le roles remplissent les conditions pour se réveiller

    // Array des roles des personnes encore en vie
    let cardsAlive = Object.keys(props.gameInfo.playerCards)
        .filter(key => props.gameInfo.playerStatus[key] === "alive")
        .map(key => props.gameInfo.playerCards[key]);

    let newTimeline = []

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
    // s'il y a un au moins Loup, ou le Loup blanc, ou l'Infect père des loups, ou un infecté, ou l'Enfant sauvage transformé encore en vie alors rajouter 'Loup' à la timeline 
    if (cardsAlive.includes('Loup') ||
        cardsAlive.includes('Loup blanc') ||
        cardsAlive.includes('Infect père des loups') ||
        (props.gameInfo?.hasInfected && props.gameInfo.hasInfected !== false && props.gameInfo.playerStatus[props.gameInfo.hasInfected] === 'alive') ||
        (cardsAlive.includes('Enfant sauvage') && props.gameInfo.model !== false && props.gameInfo.playerStatus[props.gameInfo.model] !== 'alive')
    ) {
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

const isChasseurDying = () => {
    return Object.keys(props.gameInfo.playerCards)
        .filter(key => props.gameInfo.playerStatus[key] === "dying")
        .filter(key => props.gameInfo.playerCards[key] === "Chasseur").length > 0
}

const isBearGrowling = () => {


    // récupérer la liste des joueurs vivants
    let playersAlive = Object.keys(props.gameInfo.playerList)
        .filter(key => props.gameInfo.playerStatus[props.gameInfo.playerList[key]] === "alive")
        .map(key => props.gameInfo.playerList[key]);
    

    // trouver la position du montreur d'ours
    let montreurIndex = parseInt(Object.keys(props.gameInfo.playerList)
        .filter(key => props.gameInfo.playerCards[playersAlive[key]] === "Montreur d'ours"))
    

    // Est ce que le montreur d'ours est infecté ? si oui l'ours grognera toujours
    if (props.gameInfo?.hasInfected && props.gameInfo?.hasInfected !== false && props.gameInfo.hasInfected === playersAlive[montreurIndex]) {
        console.log("props.gameInfo.hasInfected " + props.gameInfo.hasInfected)
        console.log("playersAlive[montreurIndex] " + playersAlive)
        console.log("le montreur est infecté, l'ours grogne")
        return true
    }

    // Vérification pour le joueur vivant avant le montreur
    let previousPlayerIndex = (montreurIndex - 1) % playersAlive.length
    let nextPlayerIndex = (montreurIndex + 1) % playersAlive.length
    let test = (montreurIndex + 1)

    console.log("test ",test)
    console.log("playersAlive " + playersAlive[3])
    console.log("(montreurIndex + 1) % playersAlive.length " + (montreurIndex + 1) % playersAlive.length)
    console.log("montreur " + playersAlive[montreurIndex])
    console.log("previousPlayer " + playersAlive[previousPlayerIndex])
    console.log("nextPlayer " + playersAlive[nextPlayerIndex])

    if (props.gameInfo.playerCards[playersAlive[previousPlayerIndex]] === 'Loup' ||
        props.gameInfo.playerCards[playersAlive[previousPlayerIndex]] === 'Loup blanc' ||
        props.gameInfo.playerCards[playersAlive[previousPlayerIndex]] === 'Infect père des loups' ||
        // Si le joueur précédent est infecté
        (props.gameInfo?.hasInfected && props.gameInfo.hasInfected !== false && props.gameInfo.hasInfected === playersAlive[previousPlayerIndex]) ||
        // S'il est l'enfant sauvage et que son model est mort
        (props.gameInfo.playerCards[playersAlive[previousPlayerIndex]] === 'Enfant sauvage' && props.gameInfo.model !== false && !playersAlive.includes(props.gameInfo.model))
    ) {
        console.log('le joueur avant le montreur est loup ou du camps des loups')
        return true
    }

    // Vérification pour le joueur vivant après le montreur
    if (props.gameInfo.playerCards[playersAlive[nextPlayerIndex]] === 'Loup' ||
        props.gameInfo.playerCards[playersAlive[nextPlayerIndex]] === 'Loup blanc' ||
        props.gameInfo.playerCards[playersAlive[nextPlayerIndex]] === 'Infect père des loups' ||
        // Si le joueur précédent est infecté
        (props.gameInfo?.hasInfected && props.gameInfo.hasInfected !== false && props.gameInfo.hasInfected === playersAlive[nextPlayerIndex]) ||
        // S'il est l'enfant sauvage et que son model est mort
        (props.gameInfo.playerCards[playersAlive[nextPlayerIndex]] === 'Enfant sauvage' && props.gameInfo.model !== false && !playersAlive.includes(props.gameInfo.model))
    ) {
        console.log('le joueur après le montreur est loup ou du camps des loups')
        return true
    }

    // Si aucun des deux est un Loup ou du camps des loups, l'ours ne grogne pas
    console.log("pas de joueur loups ou dans le camps des loups détecté par le montreur d'ours")
    return false
}

const generateDayTimeline = () => {
    let newTimeline = []
    let cardsAlive = Object.keys(props.gameInfo.playerCards)
        .filter(key => props.gameInfo.playerStatus[key] === "alive")
        .map(key => props.gameInfo.playerCards[key]);

    newTimeline.push('Mort')
    if (Object.values(props.gameInfo.playerCards).includes('Ange') && !cardsAlive.includes('Ange') && props.gameInfo.dayNightNumberIndex <= 2) {
        newTimeline.push('Victoire Ange')
    }
    else {
        if (cardsAlive.includes("Montreur d'ours") && isBearGrowling()) {
            newTimeline.push("Montreur d'ours")
        }
        if (Object.values(props.gameInfo.playerCards).includes('Chasseur') && isChasseurDying()) {
            newTimeline.push("Chasseur")
        }
        if (props.gameInfo.playerStatus[props.gameInfo.mayor] === 'dying' || props.gameInfo.playerStatus[props.gameInfo.mayor] === 'dead') {
            newTimeline.push("Mort Maire")
        }
        if (props.gameInfo.mayor === false) {
            newTimeline.push('Maire')
        }
        newTimeline.push('Vote')
    }

    update(partiesRef, { timeline: newTimeline })
}

</script>