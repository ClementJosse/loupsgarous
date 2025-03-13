<template>
    <div class="pb-[clamp(0px,10vw,50px)] mt-[clamp(0px,30vw,150px)] mb-[clamp(0px,20vw,100px)]">
        <!-- Liste "principale" -->
        <ul class="relative flex z-0 flex-col w-[clamp(0px,96vw,480px)] items-center rounded-xl">
            <!-- Cercle en arrière-plan (on peut le laisser dans un <li> masqué ou utiliser un pseudo-élément) -->
            <li
                class="absolute z-[-1] top-[clamp(0px,12vw,60px)] bottom-[clamp(0px,7vw,35px)] right-[clamp(0px,10vw,50px)] left-[clamp(0px,10vw,50px)] border-dashed border-disabled border-[clamp(0px,0.8vw,4px)] rounded-full">
            </li>

            <!-- Premier élément s'il y a un nombre impair d'items -->
            <li v-if="middleItem"
                class="flex z-1 text-base flex-row text-white font-semibold p-[clamp(0px,3vw,15px)] rounded-xl mb-[clamp(0px,2vw,10px)]">
                <PlayerInfo :gameInfo='gameInfo' :isRevealed='isRevealed' :uid='middleItem' :isCardRight=false />
            </li>
            <!-- Placeholder (invisible) si la liste est paire, pour garder un "espace" cohérent -->
            <li v-else
                class="flex opacity-0 text-base flex-row text-white font-semibold p-[clamp(0px,3vw,15px)] rounded-xl mb-[clamp(0px,100vw,50px)]">
                .
            </li>

            <!-- Conteneur pour les 2 colonnes -->
            <li class="flex flex-row justify-between w-full ">
                <!-- Colonne de gauche -->
                <ul class="justify-items-start">
                    <li v-for="(item, index) in leftColumn" :key="index"
                        class="text-white text-base font-semibold p-[clamp(0px,3vw,15px)] mb-[clamp(0px,6vw,30px)] rounded-xl"
                        :class="{ 'ml-[clamp(0px,5vw,25px)]': index == 0 }">
                        <PlayerInfo :gameInfo='gameInfo' :isRevealed='isRevealed' :uid='item' :isCardRight=false />
                    </li>
                </ul>

                <!-- Colonne de droite -->
                <ul class="justify-items-end">
                    <li v-for="(item, index) in rightColumn" :key="index"
                        class="text-white text-base font-semibold p-[clamp(0px,3vw,15px)] mb-[clamp(0px,6vw,30px)] rounded-xl"
                        :class="{ 'mr-[clamp(0px,5vw,25px)]': index == 0 }">
                        <PlayerInfo :gameInfo='gameInfo' :isRevealed='isRevealed' :uid='item' :isCardRight=true />
                    </li>
                </ul>
            </li>

            <li class="flex opacity-0 text-base flex-row text-white font-semibold p-[clamp(0px,3vw,15px)] rounded-xl">
                .
            </li>
        </ul>
    </div>
</template>

<script setup>
import { computed } from 'vue';
import PlayerInfo from '../leader/PlayerInfo.vue';

const props = defineProps({
    gameInfo: {
        type: Object
    },
    isRevealed: {
        type: Boolean
    }
});

const middleItem = computed(() => {
    console.log(props)
    // Retourne l'élément central si le nombre d'éléments est impair
    return props.gameInfo.playerList.length % 2 === 1
        ? props.gameInfo.playerList[Math.floor(props.gameInfo.playerList.length / 2)]
        : null;
});

const remainingItems = computed(() => {
    // Crée un nouveau tableau sans l'élément central
    if (middleItem.value !== null) {
        const middleIndex = Math.floor(props.gameInfo.playerList.length / 2);
        return [
            ...props.gameInfo.playerList.slice(0, middleIndex),
            ...props.gameInfo.playerList.slice(middleIndex + 1)
        ];
    }
    // Retourne une copie du tableau original pour éviter les mutations
    return [...props.gameInfo.playerList];
});

const leftColumn = computed(() => {
    // Prend la première moitié et inverse l'ordre
    const half = Math.ceil(remainingItems.value.length / 2);
    return remainingItems.value.slice(0, half).reverse();
});

const rightColumn = computed(() => {
    // Prend la seconde moitié
    const half = Math.ceil(remainingItems.value.length / 2);
    return remainingItems.value.slice(half);
});
</script>