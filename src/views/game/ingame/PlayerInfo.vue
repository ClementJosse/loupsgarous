<template>
    <div class="flex items-center gap-[clamp(0px,2vw,10px)] text-[clamp(0px,3.25vw,16.25px)] font-semibold"
        :class="isCardRight ? 'flex-row' : 'flex-row-reverse'">
        <div class="flex flex-col gap-[clamp(0px,0.5vw,2.5px)]">
            <!-- Effets/status-->
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
                <div v-else class="flex gap-[clamp(0px,1vw,5px)]">
                    <!--
                    <img src="../../../assets/effets/mayor.svg" class="h-[clamp(0px,3vw,15px)]">
                    <img src="../../../assets/dying.svg" class="h-[clamp(0px,3vw,15px)]">
                    <img src="../../../assets/effets/mayorvote.svg" class="h-[clamp(0px,3vw,15px)]">
                    -->
                </div>
            </div>

            <!-- Nom d'utilisateur -->
            <div class="h-[clamp(0px,4vw,20px)] flex " :class="isCardRight ? 'flex-row-reverse' : 'flex-row'">
                <div v-if="gameInfo.playerStatus[props.uid] === 'dead'"
                    class="text-disabled flex flex-row gap-[clamp(0px,1vw,5px)]">
                    <img src="../../../assets/dead.svg" class="h-[clamp(0px,4.5vw,22.5px)] w-auto">
                    <div class="w-full">{{ gameInfo.uid_to_username[props.uid] }}</div>
                </div>
                <div v-else-if="gameInfo.playerStatus[props.uid] === 'died'"
                    class="text-red-kill flex flex-row gap-[clamp(0px,1vw,5px)]">
                    <img v-if="gameInfo.mayor === props.uid" src="../../../assets/effets/mayor.svg"
                        class="h-[clamp(0px,4.5vw,22.5px)] w-auto">
                    <img src="../../../assets/dying.svg" class="h-[clamp(0px,4.5vw,22.5px)] w-auto">
                    <div class="w-full">{{ gameInfo.uid_to_username[props.uid] }}</div>
                </div>
                <div v-else-if="isRevealedClass && gameInfo.playerStatus[props.uid] === 'dying'"
                    class="flex flex-row text-red-kill gap-[clamp(0px,1vw,5px)]">
                    <img v-if="gameInfo.mayor === props.uid" src="../../../assets/effets/mayor.svg"
                        class="h-[clamp(0px,4.5vw,22.5px)] w-auto">
                    <img src="../../../assets/dying.svg" class="h-[clamp(0px,4.5vw,22.5px)] w-auto">
                    <div class="w-full">{{ gameInfo.uid_to_username[props.uid] }}</div>
                </div>
                <div v-else class="flex flex-row gap-[clamp(0px,1vw,5px)]"
                    :class="gameInfo.mayor === props.uid ? 'text-yellow-mayor' : 'text-white'">
                    <img v-if="gameInfo.mayor === props.uid" src="../../../assets/effets/mayor.svg"
                        class="h-[clamp(0px,4.5vw,22.5px)] w-auto">
                    {{ gameInfo.uid_to_username[props.uid] }}
                </div>
            </div>

            <!-- Effets/status -->
            <div class="flex gap-[clamp(0px,1vw,5px)] h-[clamp(0px,3vw,15px)]"
                :class="isCardRight ? 'flex-row-reverse' : 'flex-row'">
                <div class="flex gap-[clamp(0px,1vw,5px)]" v-if="isRevealedClass">

                </div>
                <div v-else class="text-purple-important text-[clamp(0px,3vw,15px)]">
                    <!-- Aurora -->
                </div>
            </div>
        </div>


        <!-- Carte -->
        <div v-if="gameInfo.playerStatus[props.uid] === 'dead'" class="card-container">
            <div class="absolute inset-0 bg-blue-background"></div>
            <img v-if="gameInfo.playerCards && gameInfo.playerCards[props.uid]"
                :src="getImageUrl(gameInfo.playerCards[props.uid])" class="h-full w-full opacity-50">
        </div>
        <div v-else-if="gameInfo.playerStatus[props.uid] === 'died'" class="card-container">
            <img v-if="gameInfo.playerCards && gameInfo.playerCards[props.uid]"
                :src="getImageUrl(gameInfo.playerCards[props.uid])" class="h-full w-full">
        </div>
        <div v-else class="card-container" :class="{ 'is-revealed': isRevealedClass }">
            <div class="card">
                <div class="card-front">
                    <img src="../../../assets/roles/Back.png" class="h-full w-full">
                </div>
                <div class="card-back">
                    <img v-if="gameInfo.playerCards && gameInfo.playerCards[props.uid]"
                        :src="getImageUrl(gameInfo.playerCards[props.uid])" class="h-full w-full">
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, watch } from 'vue';

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
    }
});

const getImageUrl = (imgname) => {
    return new URL(`../../../assets/roles/${imgname}.png`, import.meta.url).href;
};

const isRevealedClass = ref(false);

watch(() => props.isRevealed, (newVal) => {
    isRevealedClass.value = newVal;
});
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