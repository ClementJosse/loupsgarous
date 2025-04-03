<template>
    <!-- Conteneur principal fixé en bas de la page -->
    <div
        class="fixed bottom-[clamp(0px,10vw,50px)] left-0 w-full z-5 flex flex-col items-center justify-center">
        <!-- Conteneur parent qui gère les événements -->
        <div class="flex flex-col items-center" @mousedown="startFlip" @mouseup="endFlip" @mouseleave="endFlip"
            @touchstart="startFlip" @touchend="endFlip">
            <!-- Carte -->
            <div class="flipcard cursor-pointer select-none" style="perspective: clamp(0px, 1000px, 200vw)">
                <div class="w-full h-full transition-transform duration-300"
                    :style="isFlipped ? 'transform: rotateY(180deg)' : ''" style="transform-style: preserve-3d">
                    <div class="absolute w-full h-full" style="backface-visibility: hidden">
                        <img src="../../../../assets/roles/Back.png" class="w-full h-full object-cover pointer-events-none select-none">
                    </div>
                    <div class="absolute w-full h-full" style="transform: rotateY(180deg); backface-visibility: hidden">
                        <img :src="getImageUrl(imgname)" class="w-full h-full object-cover pointer-events-none select-none">
                    </div>
                </div>
            </div>
            <!-- Zone de contrôle en dessous de la carte -->
            <div class="visible-icon-container flex justify-center items-center rounded-full">
                <!-- Affiche l'icône visible ou notvisible en fonction de l'état -->
                <img v-if="isFlipped" src="../../../../assets/visible.svg" class="visible-icon pointer-events-none select-none">
                <img v-else src="../../../../assets/notvisible.svg" class="visible-icon pointer-events-none select-none">
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref } from 'vue';

// Fonction pour récupérer l'URL des images
const getImageUrl = (imgname) => {
    return new URL(`../../../../assets/roles/${imgname}.png`, import.meta.url).href;
};

// Définition des props
const props = defineProps({
    imgname: {
        type: String,
        default: ''
    }
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