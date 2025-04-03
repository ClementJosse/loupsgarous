<template>
    <!-- Affichage du role au centre de l'écran pour le pouvoir de la Voyante-->
    <button v-if="showCard" class="z-[100000000] fixed top-0 left-0 w-full h-full flex items-center justify-center"
        @click="setShowCard(false)">
        <img v-if="gameInfo?.playerCards?.[props.uid]" :src="getImageUrl(gameInfo.playerCards[props.uid])"
            class="h-[clamp(0px,80vw,400px)] w-[clamp(0px,80vw,400px)] z-[100000000]">
        <div class="bg-blue-background absolute inset-0 z-[10000000]"></div>
    </button>

    <button @click="clickOnPlayer()" v-wave :disabled="currentActiveState.state === '' && canBeSelected()"
        class="flex items-center gap-[clamp(0px,2vw,10px)] text-[clamp(0px,3.25vw,16.25px)] font-semibold p-[clamp(0px,2vw,10px)] rounded-xl active:scale-105"
        :class="isCardRight ? 'flex-row' : 'flex-row-reverse', currentActiveState.state !== '' && canBeSelected() ? 'animate-tilt-shaking active:bg-dark-background' : ''">
        <div class="flex flex-col gap-[clamp(0px,0.5vw,2.5px)]">
            <!-- Player status-->
            <div class="flex h-[clamp(0px,3vw,15px)] gap-[clamp(0px,1vw,5px)]"
                :class="isCardRight ? 'flex-row-reverse' : 'flex-row'">
                <div v-if="isRevealedClass" class="flex gap-[clamp(0px,1vw,5px)]">
                    <img src="../../../assets/effets/infected.svg" class="h-[clamp(0px,3vw,15px)]"
                        v-if="props.gameInfo.hasInfected === props.uid || (props.gameInfo.playerStatus[props.gameInfo.model] === 'dead' && props.gameInfo.playerCards[props.uid] === 'Enfant sauvage')">
                    <img src="../../../assets/effets/model.svg" class="h-[clamp(0px,3vw,15px)]"
                        v-if="props.gameInfo.model === props.uid">
                    <img src="../../../assets/effets/love.svg" class="h-[clamp(0px,3vw,15px)]"
                        v-if="((props.gameInfo?.isInLove || props.gameInfo.isInLove !== '') && Array.isArray(props.gameInfo?.isInLove) && props.gameInfo.isInLove.includes(props.uid))">
                    <img src="../../../assets/effets/protect.svg" class="h-[clamp(0px,3vw,15px)]"
                        v-if="props.gameInfo.protected === props.uid && props.gameInfo.time === 'Nuit'">
                    <img src="../../../assets/effets/oiled.svg" class="h-[clamp(0px,3vw,15px)]"
                        v-if="((props.gameInfo?.isOiled || props.gameInfo.isOiled !== '') && Array.isArray(props.gameInfo?.isOiled) && props.gameInfo.isOiled.includes(props.uid))">
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
            <div class="flex gap-[clamp(0px,1vw,5px)] h-[clamp(0px,3vw,15px)]">

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
    if (!canBeSelected()) {

    }
    else if (props.gameInfo?.leader == authorUID.value) {
        // Si leader
        console.log('leader clicked on ' + props.uid)

        // action de la voyante
        if (currentActiveState.state === 'decouvrir') {
            setShowCard(true)
        }
        else if (currentActiveState.state === 'model') {
            props.gameInfo.model = props.uid
            update(partiesRef, { model: props.gameInfo.model })
        }
        else if (currentActiveState.state === 'voler') {
            var uidVoleur = null
            Object.keys(props.gameInfo.playerCards).forEach(key => {
                if (props.gameInfo.playerCards[key] == 'Voleur') {
                    uidVoleur = key
                }
            })
            props.gameInfo.playerCards[uidVoleur] = props.gameInfo.playerCards[props.uid]
            props.gameInfo.playerCards[props.uid] = 'Voleur'
            update(partiesRef, { playerCards: props.gameInfo.playerCards })
        }
        else if (currentActiveState.state === 'proteger') {
            props.gameInfo.protected = props.uid
            update(partiesRef, { protected: props.gameInfo.protected })
        }
        else if (currentActiveState.state === 'huiler') {
            if (props.gameInfo.isOiled === '') {
                props.gameInfo.isOiled = [props.uid]
                update(partiesRef, { isOiled: props.gameInfo.isOiled })
            }
            else {
                props.gameInfo.isOiled.push(props.uid)
                update(partiesRef, { isOiled: props.gameInfo.isOiled })
            }
        }
        else if (currentActiveState.state === 'amoureux') {
            if (props.gameInfo.isInLove === '') {
                props.gameInfo.isInLove = [props.uid]
                update(partiesRef, { isInLove: props.gameInfo.isInLove })
                setTimeout(function () {
                    currentActiveState.setState('amoureux')
                }, 0)
            }
            else {
                props.gameInfo.isInLove.push(props.uid)
                update(partiesRef, { isInLove: props.gameInfo.isInLove })
            }
        }
        else if (currentActiveState.state === 'tuer') {
            if (props.gameInfo.time == 'Jour') {
                props.gameInfo.playerStatus[props.uid] = 'died'
                update(partiesRef, { playerStatus: props.gameInfo.playerStatus })
                if ((props.gameInfo?.isInLove || props.gameInfo.isInLove !== '') && Array.isArray(props.gameInfo?.isInLove) && props.gameInfo.isInLove.includes(props.uid)) {
                    killLovers()
                }
                if (props.gameInfo.playerCards[props.uid] === 'Chasseur') {
                    props.gameInfo.timeline.push('Chasseur')
                    update(partiesRef, { timeline: props.gameInfo.timeline })
                }
                if (props.gameInfo.playerStatus[props.gameInfo.mayor] === 'died') {
                    if (!props.gameInfo.timeline.slice(props.gameInfo.timelineIndex, props.gameInfo.timeline.length).includes('Mort Maire')) {

                        props.gameInfo.timeline.push('Mort Maire')
                        update(partiesRef, { timeline: props.gameInfo.timeline })
                    }
                }
            }
            else {
                props.gameInfo.playerStatus[props.uid] = 'dying'
                update(partiesRef, { playerStatus: props.gameInfo.playerStatus })
            }
            if (props.gameInfo.timeline[props.gameInfo.timelineIndex] == 'Sorcière') {
                update(partiesRef, { hasDeathPotion: false })
            }
        }
        else if (currentActiveState.state === 'forcemaire') {
            props.gameInfo.mayor = props.uid
            update(partiesRef, { mayor: props.gameInfo.mayor })
        }
        else if (currentActiveState.state === 'forcevote') {
            props.gameInfo.playerStatus[props.uid] = 'died'
            update(partiesRef, { playerStatus: props.gameInfo.playerStatus })
        }
    }
}

const killLovers = () => {
    props.gameInfo.isInLove.forEach((item) => {
        props.gameInfo.playerStatus[item] = 'died';
        update(partiesRef, { playerStatus: props.gameInfo.playerStatus })
    })
}

const canBeSelected = () => {
    if (props.gameInfo.playerStatus[props.uid] === 'dead') {
        return false
    }
    else if (props.gameInfo?.timeline && props.gameInfo?.timelineIndex) {
        if (props.gameInfo.timeline[props.gameInfo.timelineIndex] === 'Salvateur') {
            if (props.uid === props.gameInfo.protected) {
                return false
            }
            else {
                return true
            }
        }
        else {
            return true
        }
    }
    else {
        return true
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
