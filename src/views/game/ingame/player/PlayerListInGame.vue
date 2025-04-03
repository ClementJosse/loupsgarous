<template>
    <div class="pb-[clamp(0px,10vw,50px)] mt-[clamp(0px,35vw,175px)] mb-[clamp(0px,20vw,100px)]" :class="'mt-[clamp(0px,35vw,175px)]'">
        <!-- Liste "principale" -->
        <ul
            class="relative flex z-0 flex-col w-[clamp(0px,96vw,480px)] items-center rounded-xl">
            <!-- Cercle en arrière-plan (on peut le laisser dans un <li> masqué ou utiliser un pseudo-élément) -->
            <li
                class="absolute z-[-1] bottom-0 right-[clamp(0px,10vw,50px)] left-[clamp(0px,10vw,50px)] border-dashed border-disabled border-[clamp(0px,0.8vw,4px)] rounded-tl-full rounded-tr-full" 
                :class="props.gameInfo.playerList.length % 2 == 0 ? 'top-[clamp(0px,14vw,70px)]': 'top-[clamp(0px,4vw,20px)]'">
            </li>

            <!-- Premier élément s'il y a un nombre impair d'items -->
            <li v-if="middleItem"
                class="flex z-1 text-base flex-row text-white font-semibold p-[clamp(0px,3vw,15px)] rounded-xl">
                <PlayerInfo :gameInfo='gameInfo' :isRevealed='false || isGameOver()' :uid='middleItem' :isCardRight=false />
            </li>
            <!-- Placeholder (invisible) si la liste est paire, pour garder un "espace" cohérent -->
            <li v-else
                class="flex opacity-0 text-base flex-row text-white font-semibold p-[clamp(0px,3vw,15px)] rounded-xl">
                .
            </li>

            <!-- Conteneur pour les 2 colonnes -->
            <li class="flex flex-row justify-between w-full ">
                <!-- Colonne de gauche -->
                <ul class="justify-items-start">
                    <li v-for="(item, index) in leftColumn" :key="index"
                        class="text-white text-base font-semibold p-[clamp(0px,3vw,15px)] mb-[clamp(0px,2vw,10px)] rounded-xl"
                        :class="{ 'ml-[clamp(0px,5vw,25px)]': index == 0 }">
                        <PlayerInfo :gameInfo='gameInfo' :isRevealed='false || isGameOver()' :uid='item' :isCardRight=false />
                    </li>
                </ul>

                <!-- Colonne de droite -->
                <ul class="justify-items-end">
                    <li v-for="(item, index) in rightColumn" :key="index"
                        class="text-white text-base font-semibold p-[clamp(0px,3vw,15px)] mb-[clamp(0px,2vw,10px)] rounded-xl"
                        :class="{ 'mr-[clamp(0px,5vw,25px)]': index == 0 }">
                        <PlayerInfo :gameInfo='gameInfo' :isRevealed='false || isGameOver()' :uid='item' :isCardRight=true />
                    </li>
                </ul>
            </li>

            <li class="flex w-full p-[clamp(0px,18vw,90px)] gradient">
                
            </li>
        </ul>
    </div>
</template>

<script setup>
import { computed, onMounted, ref } from 'vue';
import PlayerInfo from '../PlayerInfo.vue';
import { getAuth, signInAnonymously } from 'firebase/auth';


const props = defineProps({
    gameInfo: {
        type: Object
    }
});

const playersListFromPlayerView = ref([]);
const auth = getAuth();
const UID = ref(null); // Utiliser une référence réactive pour UID

onMounted(() => {
    initialize()
})

const initialize = async () => {
    try {
        await signInAnonymously(auth);
        UID.value = auth.currentUser.uid;
    }
    catch (error) {
        console.error('Erreur d\'auth :', error.code, error.message);
    }
    console.log("liste actuelle:", props.gameInfo.playerList)
    console.log("uid du joueur:", UID.value)
    playersListFromPlayerView.value = rotatePlayerList(props.gameInfo.playerList, UID.value);
    playersListFromPlayerView.value.pop()
    console.log("liste sans le joueur:", playersListFromPlayerView.value)
}

const rotatePlayerList = (players, currentPlayerUID) => {
    // Find the index of the current player
    const currentPlayerIndex = players.findIndex(player => player === currentPlayerUID);
    console.log("currentPlayerIndex", currentPlayerIndex);

    // If player not found or already last, return original array
    if (currentPlayerIndex === -1 || currentPlayerIndex === players.length - 1) {
        return [...players];
    }

    // Create new array with players after current player, then players before
    return [
        ...players.slice(currentPlayerIndex + 1),
        ...players.slice(0, currentPlayerIndex + 1)
    ];
};

const isGameOver = () => {
    var currentTurn = props.gameInfo.timeline[props.gameInfo.timelineIndex]
    return (
        currentTurn === "Victoire Ange" ||
        currentTurn === "Victoire Loup blanc" ||
        currentTurn === "Victoire Village" ||
        currentTurn === "Victoire Pyromane" ||
        currentTurn === "Victoire Amoureux" ||
        currentTurn === "Victoire Loups"
    )
}

const middleItem = computed(() => {
    console.log(playersListFromPlayerView.value);
    // Vérifie si la liste existe déjà
    if (!playersListFromPlayerView.value) return null;

    // Retourne l'élément central si le nombre d'éléments est impair
    return playersListFromPlayerView.value.length % 2 === 1
        ? playersListFromPlayerView.value[Math.floor(playersListFromPlayerView.value.length / 2)]
        : null;
});

const remainingItems = computed(() => {
    // Vérifie si la liste existe déjà
    if (!playersListFromPlayerView.value) return [];

    // Crée un nouveau tableau sans l'élément central
    if (middleItem.value !== null) {
        const middleIndex = Math.floor(playersListFromPlayerView.value.length / 2);
        return [
            ...playersListFromPlayerView.value.slice(0, middleIndex),
            ...playersListFromPlayerView.value.slice(middleIndex + 1)
        ];
    }
    // Retourne une copie du tableau original pour éviter les mutations
    return [...playersListFromPlayerView.value];
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

<style scoped>
.gradient {
  background: linear-gradient(to top, #193143FF, #19314300);
  pointer-events: none;
  user-select: none;
}
</style>