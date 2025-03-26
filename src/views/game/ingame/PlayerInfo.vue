<template>
    <button v-if="showCard" class="z-[100000000] fixed top-0 left-0 w-full h-full flex items-center justify-center" @click="setShowCard(false)">
        <img v-if="gameInfo?.playerCards?.[props.uid]" :src="getImageUrl(gameInfo.playerCards[props.uid])"
            class="h-[clamp(0px,80vw,400px)] w-[clamp(0px,80vw,400px)] z-[100000000]">
        <div class="bg-blue-background absolute inset-0 z-[10000000]"></div>
    </button>
    <button @click="clickOnPlayer()" :disabled="currentActiveState.state === ''"
        class="flex items-center gap-[clamp(0px,2vw,10px)] text-[clamp(0px,3.25vw,16.25px)] font-semibold p-[clamp(0px,2vw,10px)] rounded-xl"
        :class="isCardRight ? 'flex-row' : 'flex-row-reverse', currentActiveState.state !== '' ? 'active:scale-105 animate-tilt-shaking' : ''">
        <div class="flex flex-col gap-[clamp(0px,0.5vw,2.5px)]">
            <!-- Player status/ votes-->
            <div class="flex h-[clamp(0px,3vw,15px)] gap-[clamp(0px,1vw,5px)]"
                :class="isCardRight ? 'flex-row-reverse' : 'flex-row'">
                <div v-if="isRevealedClass" class="flex gap-[clamp(0px,1vw,5px)]">
                    <!--
                    <img src="../../../assets/effets/love.svg" class="h-[clamp(0px,3vw,15px)]">
                    <img src="../../../assets/effets/infected.svg" class="h-[clamp(0px,3vw,15px)]">
                    <img src="../../../assets/effets/mentor.svg" class="h-[clamp(0px,3vw,15px)]">
                    <img src="../../../assets/effets/oiled.svg" class="h-[clamp(0px,3vw,15px)]">
                    <img src="../../../assets/effets/protect.svg" class="h-[clamp(0px,3vw,15px)]">
                    -->
                </div>
                <div v-else class="flex">
                    <!-- Section Maire -->
                    <div class="flex flex-row" v-if="gameInfo.timeline[gameInfo.timelineIndex] === 'Maire'">
                        <div v-for="(vote, name) in gameInfo.playerVote" class="flex flex-row">
                            <div v-if="vote === props.uid" class="mx-[clamp(0px,0.5vw,2.5px)]">
                                <img src="../../../assets/effets/mayor.svg" class="h-[clamp(0px,3vw,15px)]">
                            </div>
                        </div>
                    </div>

                    <!-- Section Vote -->
                    <div class="flex flex-row" v-if="gameInfo.timeline[gameInfo.timelineIndex] === 'Vote'">
                        <div v-for="(vote, name) in gameInfo.playerVote" class="flex flex-row">
                            <!-- Vote du maire -->
                            <div v-if="vote === props.uid && name === gameInfo.mayor"
                                class="mx-[clamp(0px,0.5vw,2.5px)]">
                                <img src="../../../assets/effets/mayorvote.svg" class="h-[clamp(0px,3vw,15px)]">
                            </div>
                            <!-- Vote des autres joueurs -->
                            <div v-else-if="vote === props.uid" class="mx-[clamp(0px,0.5vw,2.5px)]">
                                <img src="../../../assets/dying.svg" class="h-[clamp(0px,3vw,15px)]">
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Player Name-->
            <div class="h-[clamp(0px,4vw,20px)] flex " :class="isCardRight ? 'flex-row-reverse' : 'flex-row'">
                <div v-if="gameInfo?.playerStatus?.[props.uid] === 'dead'"
                    class="text-disabled flex flex-row gap-[clamp(0px,1vw,5px)]">
                    <img src="../../../assets/dead.svg" class="h-[clamp(0px,4.5vw,22.5px)] w-auto">
                    <div class="w-full">{{ gameInfo?.uid_to_username?.[props.uid] }}</div>
                </div>
                <div v-else-if="gameInfo?.playerStatus?.[props.uid] === 'died'"
                    class="text-red-kill flex flex-row gap-[clamp(0px,1vw,5px)]">
                    <img v-if="gameInfo?.mayor === props.uid" src="../../../assets/effets/mayor.svg"
                        class="h-[clamp(0px,4.5vw,22.5px)] w-auto">
                    <img src="../../../assets/dying.svg" class="h-[clamp(0px,4.5vw,22.5px)] w-auto">
                    <div class="w-full">{{ gameInfo?.uid_to_username?.[props.uid] }}</div>
                </div>
                <div v-else-if="isRevealedClass && gameInfo?.playerStatus?.[props.uid] === 'dying'"
                    class="flex flex-row text-red-kill gap-[clamp(0px,1vw,5px)]">
                    <img v-if="gameInfo?.mayor === props.uid" src="../../../assets/effets/mayor.svg"
                        class="h-[clamp(0px,4.5vw,22.5px)] w-auto">
                    <img src="../../../assets/dying.svg" class="h-[clamp(0px,4.5vw,22.5px)] w-auto">
                    <div class="w-full">{{ gameInfo?.uid_to_username?.[props.uid] }}</div>
                </div>
                <div v-else class="flex flex-row gap-[clamp(0px,1vw,5px)]"
                    :class="gameInfo?.mayor === props.uid ? 'text-yellow-mayor' : 'text-white'">
                    <img v-if="gameInfo?.mayor === props.uid" src="../../../assets/effets/mayor.svg"
                        class="h-[clamp(0px,4.5vw,22.5px)] w-auto">
                    {{ gameInfo?.uid_to_username?.[props.uid] }}
                </div>
            </div>

            <!-- Player Vote for-->
            <div class="flex gap-[clamp(0px,1vw,5px)] h-[clamp(0px,3vw,15px)]"
                :class="isCardRight ? 'flex-row-reverse' : 'flex-row'">
                <div class="text-purple-important text-[clamp(0px,3vw,15px)]">
                    <div v-if="gameInfo?.timeline &&
                        gameInfo.timelineIndex !== undefined &&
                        gameInfo.timeline[gameInfo.timelineIndex] &&
                        (gameInfo.timeline[gameInfo.timelineIndex] === 'Maire' ||
                            gameInfo.timeline[gameInfo.timelineIndex] === 'Vote')">
                        {{ gameInfo.playerVote?.[props.uid] === '...' ? gameInfo.playerVote?.[props.uid] :
                            gameInfo.uid_to_username[gameInfo.playerVote?.[props.uid]] }}
                    </div>
                </div>
            </div>

        </div>

        <!-- Player Card-->
        <div v-if="gameInfo?.playerStatus?.[props.uid] === 'dead'" class="card-container">
            <div class="absolute inset-0 bg-blue-background"></div>
            <img v-if="gameInfo?.playerCards?.[props.uid]" :src="getImageUrl(gameInfo.playerCards[props.uid])"
                class="h-full w-full opacity-50">
        </div>
        <div v-else-if="gameInfo?.playerStatus?.[props.uid] === 'died'" class="card-container">
            <img v-if="gameInfo?.playerCards?.[props.uid]" :src="getImageUrl(gameInfo.playerCards[props.uid])"
                class="h-full w-full">
        </div>
        <div v-else class="card-container" :class="{ 'is-revealed': isRevealedClass }">
            <div class="card">
                <div class="card-front">
                    <img src="../../../assets/roles/Back.png" class="h-full w-full">
                </div>
                <div class="card-back">
                    <img v-if="gameInfo?.playerCards?.[props.uid]" :src="getImageUrl(gameInfo.playerCards[props.uid])"
                        class="h-full w-full">
                </div>
            </div>
        </div>
    </button>
</template>

<script setup>
import { ref, watch, onMounted } from 'vue';
import { getDatabase, ref as dbRef, onValue, update, set } from 'firebase/database';
import { useRoute } from 'vue-router';
import { getAuth, signInAnonymously } from 'firebase/auth'
import { currentActiveState } from './currentActiveState';

const route = useRoute();
const gameId = route.params.gameId;
const database = getDatabase();
const partiesRef = dbRef(database, `/${gameId}`);
const authorUID = ref(null)
const showCard = ref(false)
const setShowCard = (bool) => {
    showCard.value = bool
}

const props = defineProps({
    gameInfo: {
        type: Object
    },
    isRevealed: {
        type: Boolean
    },
    uid: {
        type: String
    },
    isCardRight: {
        type: Boolean
    },
});

const initialize = async () => {
    try {
        // Authentification anonyme
        const auth = getAuth()
        await signInAnonymously(auth)
        authorUID.value = auth.currentUser.uid
    } catch (error) {
        console.error("Erreur d'auth :", error.code, error.message)
    }
}

const getImageUrl = (imgname) => {
    return new URL(`../../../assets/roles/${imgname}.png`, import.meta.url).href;
};

const isRevealedClass = ref(false);

const clickOnPlayer = () => {
    if (props.gameInfo?.leader == authorUID.value) {
        // Si leader
        console.log('leader clicked on ' + props.uid)

        // action de la voyante
        if (currentActiveState.state === 'decouvrir') {
            setShowCard(true)
        }
    }
    else {
        // Si joueur
        console.log('player clicked on ' + props.uid)
        if (props.gameInfo?.timeline &&
            props.gameInfo.timelineIndex !== undefined &&
            props.gameInfo.timeline[props.gameInfo.timelineIndex] &&
            (props.gameInfo.timeline[props.gameInfo.timelineIndex] === 'Maire' ||
                props.gameInfo.timeline[props.gameInfo.timelineIndex] === 'Vote')) {
            var playerVote = props.gameInfo.playerVote || {}
            console.log(authorUID.value)
            playerVote[authorUID.value] = props.uid
            update(partiesRef, { playerVote: playerVote })
        }
    }
}

watch(() => props.isRevealed, (newVal) => {
    isRevealedClass.value = newVal;
});

onMounted(() => {
    initialize()
})

</script>

<style scoped>
.card-container {
    perspective: 1000px;
    width: clamp(0px, 12vw, 60px);
    height: clamp(0px, 12vw, 60px);
}

.card {
    position: relative;
    transform-style: preserve-3d;
    transition: transform 0.4s;
}

.card-front,
.card-back {
    position: absolute;
    backface-visibility: hidden;
}

.card-front {
    transform: rotateY(0deg);
}

.card-back {
    transform: rotateY(180deg);
}

.is-revealed .card {
    transform: rotateY(180deg);
}
</style>
