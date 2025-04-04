<template>
    <!-- Conteneur principal fixé en bas de la page -->
    <div class="fixed bottom-[clamp(0px,10vw,50px)] left-0 w-full z-5 flex flex-col items-center justify-center">

        <!-- Conteneur parent qui gère les événements -->
        <div class="flex flex-col items-center" @mousedown="startFlip" @mouseup="endFlip" @mouseleave="endFlip"
            @touchstart="startFlip" @touchend="endFlip">
            <!-- Carte -->
            <div class="flipcard cursor-pointer select-none" style="perspective: clamp(0px, 1000px, 200vw)">
                <div class="w-full h-full transition-transform duration-300"
                    :style="isFlipped ? 'transform: rotateY(180deg)' : ''" style="transform-style: preserve-3d">
                    <div class="absolute w-full h-full" style="backface-visibility: hidden">
                        <img src="../../../../assets/roles/Back.png"
                            class="w-full h-full object-cover pointer-events-none select-none">
                    </div>
                    <div class="absolute w-full h-full" style="transform: rotateY(180deg); backface-visibility: hidden">
                        <div v-if="props.gameInfo?.isInLove && props.gameInfo.isInLove.includes(props.uid)"
                            class="fixed w-full text-center text-pink-love text-lg font-bold "
                            style="top: clamp(-35px, -7vw, 0px);">
                            {{props.gameInfo.uid_to_username[props.gameInfo.isInLove.filter(e => e !==
                                props.uid).toString()]}}
                        </div>
                        <img :src="imageUrl" class="w-full h-full object-cover pointer-events-none select-none">
                        <!-- Status d'infecté-->
                        <div class="fixed justify-items-center content-center top-[clamp(0px,3vw,15px)] left-[clamp(0px,3vw,15px)] h-[clamp(0px,12vw,60px)] w-[clamp(0px,12vw,60px)] bg-dark-background rounded-full"
                            v-if="(props.gameInfo.playerCards[props.uid] === 'Enfant sauvage' && props.gameInfo?.model && props.gameInfo.playerStatus[props.gameInfo.model] !== 'alive')
                                || (props.gameInfo?.hasInfected === props.uid)">
                            <img class="flex h-[clamp(0px,8vw,40px)]" src="../../../../assets/effets/infected.svg">
                        </div>
                        <!-- Status d'amour-->
                        <div class="fixed justify-items-center content-center top-[clamp(0px,3vw,15px)] right-[clamp(0px,3vw,15px)] h-[clamp(0px,12vw,60px)] w-[clamp(0px,12vw,60px)] bg-dark-background rounded-full"
                            v-if="props.gameInfo?.isInLove && props.gameInfo.isInLove.includes(props.uid)">
                            <img class="flex h-[clamp(0px,6vw,30px)]" src="../../../../assets/effets/love.svg">
                        </div>
                        <!-- Status potion de vie-->
                        <div class="fixed justify-items-center content-center bottom-[clamp(0px,3vw,15px)] left-[clamp(0px,3vw,15px)] h-[clamp(0px,12vw,60px)] w-[clamp(0px,12vw,60px)] bg-dark-background rounded-full"
                            v-if="props.gameInfo?.hasLifePotion === true && props.gameInfo.playerCards[props.uid] === 'Sorcière'">
                            <img class="flex h-[clamp(0px,10vw,50px)]" src="../../../../assets/effets/lifeOn.svg">
                        </div>
                        <div class="fixed justify-items-center content-center bottom-[clamp(0px,3vw,15px)] left-[clamp(0px,3vw,15px)] h-[clamp(0px,12vw,60px)] w-[clamp(0px,12vw,60px)] bg-dark-background rounded-full"
                            v-else-if="props.gameInfo?.hasLifePotion === false && props.gameInfo.playerCards[props.uid] === 'Sorcière'">
                            <img class="flex h-[clamp(0px,10vw,50px)]" src="../../../../assets/effets/lifeOff.svg">
                        </div>
                        <!-- Status potion de mort-->
                        <div class="fixed justify-items-center content-center bottom-[clamp(0px,3vw,15px)] right-[clamp(0px,3vw,15px)] h-[clamp(0px,12vw,60px)] w-[clamp(0px,12vw,60px)] bg-dark-background rounded-full"
                            v-if="props.gameInfo?.hasDeathPotion === true && props.gameInfo.playerCards[props.uid] === 'Sorcière'">
                            <img class="flex h-[clamp(0px,10vw,50px)]" src="../../../../assets/effets/deathOn.svg">
                        </div>
                        <div class="fixed justify-items-center content-center bottom-[clamp(0px,3vw,15px)] right-[clamp(0px,3vw,15px)] h-[clamp(0px,12vw,60px)] w-[clamp(0px,12vw,60px)] bg-dark-background rounded-full"
                            v-else-if="props.gameInfo?.hasDeathPotion === false && props.gameInfo.playerCards[props.uid] === 'Sorcière'">
                            <img class="flex h-[clamp(0px,10vw,50px)]" src="../../../../assets/effets/deathOff.svg">
                        </div>
                    </div>
                </div>
            </div>
            <!-- Zone de contrôle en dessous de la carte -->
            <div class="visible-icon-container flex justify-center items-center rounded-full">
                <!-- Affiche l'icône visible ou notvisible en fonction de l'état -->
                <img v-if="isFlipped" src="../../../../assets/visible.svg"
                    class="visible-icon pointer-events-none select-none">
                <img v-else src="../../../../assets/notvisible.svg"
                    class="visible-icon pointer-events-none select-none">
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, computed } from 'vue';

// Définition des props
const props = defineProps({
    uid: {
        type: String,
    },
    gameInfo: {
        type: Object,
    }
});

// Utiliser computed pour rendre imageUrl réactif aux changements de props.imgname
const imageUrl = computed(() => {
    return new URL(`../../../../assets/roles/${props.gameInfo.playerCards[props.uid]}.png`, import.meta.url).href;
});

// État réactif pour gérer le flip de la carte
const isFlipped = ref(false);

// Méthodes pour gérer le flip
const startFlip = () => {
    isFlipped.value = true; // Active le flip
};

const endFlip = () => {
    isFlipped.value = false; // Désactive le flip
};
</script>

<style scoped>
/* Styles pour la carte */
.flipcard {
    width: clamp(0px, 200px, 40vw);
    height: clamp(0px, 200px, 40vw);
    pointer-events: none
}

/* Styles pour le conteneur de l'icône visible */
.visible-icon-container {
    width: clamp(0px, 75px, 15vw);
    height: clamp(0px, 75px, 15vw);
    pointer-events: none
}

/* Styles pour l'icône visible */
.visible-icon {
    width: clamp(0px, 30px, 6vw);
    height: clamp(0px, 30px, 6vw);
    pointer-events: none
}
</style>