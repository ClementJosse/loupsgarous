<template>

    <div v-if="returnToLobbyState"
        class="fixed h-full w-full bg-[#00000077] z-[10000000] text-white text-2xl flex items-center justify-center"
        @click="returnToLobbyState = false">
        <div class="bg-dark-background flex flex-col w-[clamp(0px,70vw,350px)] items-center gap-[clamp(0px,12vw,60px)] py-[clamp(0px,8vw,40px)] rounded-xl"
            @click.stop>
            Retourner au lobby ?
            <button v-wave class="rounded-lg active:scale-105">
                <img :src="lobbySvg" class="h-[clamp(0px,6vw,30px)]" @click.stop="returnToLobby()">
            </button>
        </div>
    </div>

    <div class="flex flex-col w-full bg-dark-background items-center fixed z-20">
        <DayNight :gameInfo="gameInfo" />
        <div
            class="flex flex-row w-[clamp(0px,100vw,500px)] items-center pb-[clamp(0px,2vw,10px)] mt-[clamp(0px,32vw,160px)] bg-dark-background pr-[10px] relative">
            <!-- Bouton centré -->
            <div class="absolute inset-x-0 flex justify-center pointer-events-none">
                <button v-wave
                    class="flex flex-row text-purple-important justify-center active:scale-105 items-center text-xl bg-dark-background font-medium px-[clamp(0px,2vw,10px)] gap-[clamp(0px,10px,2vw)] rounded-xl h-[clamp(0px,50px,10vw)] pointer-events-auto"
                    @click="toggleReveal">
                    <div class="flex justify-center items-center">
                        <img v-if="isRevealed" src="../../../../assets/visible.svg" class="w-[clamp(0px,5vw,25px)]">
                        <img v-else src="../../../../assets/notvisible.svg" class="w-[clamp(0px,5vw,25px)]">
                    </div>
                    Révéler tous les rôles
                </button>
            </div>
            <!-- Bouton à droite -->
            <div class="ml-auto z-30">
                <button v-wave class="p-[clamp(0px,2vw,10px)] rounded-full active:scale-105 bg-dark-background"
                    @click="toggleReturnToLobby()">
                    <img src="../../../../assets/lobby.svg" class="w-[clamp(0px,6vw,30px)] h-[clamp(0px,6vw,30px)]">
                </button>
            </div>
        </div>
    </div>
    <LeaderListInGame :gameInfo='gameInfo' :isRevealed='isRevealed || isGameOver()' />

    <LeaderTimeline :gameInfo='gameInfo' class="fixed bottom-0 left-0 w-full z-30" />
</template>

<script setup>
import { ref } from 'vue';
import { getDatabase, ref as dbRef, onValue, update, set } from 'firebase/database';
import { useRoute } from 'vue-router';
import LeaderListInGame from './LeaderListInGame.vue';
import DayNight from '../DayNight.vue';
import LeaderTimeline from './LeaderTimeline.vue';
import { currentActiveState } from '../currentActiveState.js';
import lobbySvg from '../../../../assets/actions/lobby.svg'

const route = useRoute();
const gameId = route.params.gameId;
const database = getDatabase();
const partiesRef = dbRef(database, `/${gameId}`);
const returnToLobbyState = ref(false);

const props = defineProps({
    gameInfo: {
        type: Object
    },
});

const isRevealed = ref(false);

const toggleReveal = () => {
    let tempState = currentActiveState.state
    isRevealed.value = !isRevealed.value;
    setTimeout(function () {
        currentActiveState.setState(tempState)
    }, 0)
};

const toggleReturnToLobby = () => {
    returnToLobbyState.value = true
    console.log('return to lobby true')
    console.log(returnToLobbyState.value)
};

const returnToLobby = () => {
    set(partiesRef, {
        cards: props.gameInfo.cards,
        leader: props.gameInfo.leader,
        playerList: props.gameInfo.playerList,
        status: "lobby",
        uid_to_username: props.gameInfo.uid_to_username,
    })
    returnToLobbyState.value = false
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
</script>