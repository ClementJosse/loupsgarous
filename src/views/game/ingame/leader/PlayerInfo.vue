<template>
    <div v-if="isCardRight" class="flex flex-row items-center gap-[clamp(0px,2vw,10px)]">
        <div class="card-container" :class="{ 'is-revealed': isRevealed }">
                        <div class="flex flex-col">
                {{ gameInfo.uid_to_username[props.uid] }}
            </div>
            <div class="card">
                <div class="card-front">
                    <img src="../../../../assets/roles/Back.png" class="h-[clamp(0px,12vw,60px)]">
                </div>
                <div class="card-back">
                    <img :src="getImageUrl(gameInfo.playerCards[props.uid])" class="h-[clamp(0px,12vw,60px)]">
                </div>
            </div>
        </div>
    </div>
    <div v-else class="flex flex-row items-center gap-[clamp(0px,2vw,10px)]">
        <div class="card-container" :class="{ 'is-revealed': isRevealed }">
            <div class="card">
                <div class="card-front">
                    <img src="../../../../assets/roles/Back.png" class="h-[clamp(0px,12vw,60px)]">
                </div>
                <div class="card-back">
                    <img :src="getImageUrl(gameInfo.playerCards[props.uid])" class="h-[clamp(0px,12vw,60px)]">
                </div>
            </div>
            <div class="flex flex-col">
                {{ gameInfo.uid_to_username[props.uid] }}
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
}

.card {
    width: 100%;
    height: 100%;
    position: relative;
    transform-style: preserve-3d;
    transition: transform 0.6s;
}

.card-front,
.card-back {
    width: 100%;
    height: 100%;
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