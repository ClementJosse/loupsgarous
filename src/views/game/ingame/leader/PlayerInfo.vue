<template>
    <div class="flex items-center gap-[clamp(0px,2vw,10px)]" :class="isCardRight ? 'flex-row' : 'flex-row-reverse'">
        <!-- Nom d'utilisateur -->
        <div class="text-center">
            {{ gameInfo.uid_to_username[props.uid] }}
        </div>

        <!-- Carte -->
        <div class="card-container" :class="{ 'is-revealed': isRevealedClass }">
            <div class="card">
                <div class="card-front">
                    <img src="../../../../assets/roles/Back.png" class="h-full w-full">
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
    return new URL(`../../../../assets/roles/${imgname}.png`, import.meta.url).href;
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