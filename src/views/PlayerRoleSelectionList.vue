<template>
    <div class="text-white text-sm font-light h-[clamp(0px,4vw,20px)] mt-[clamp(0px,8vw,40px)]">Rôles:</div>
    <div :class="playerCount === totalCardsValue ? 'text-green-save' : 'text-red-kill'" class="text-lg font-semibold">
        {{ totalCardsValue }} / {{ playerCount }} joueurs
    </div>
    <div
        class="relative flex z-0 flex-row flex-wrap bg-dark-background w-[clamp(0px,84vw,420px)] pt-[clamp(0px,2.5vw,12.5px)] pl-[clamp(0px,2.5vw,12.5px)] gap-[clamp(0px,2vw,10px)] items-start rounded-xl mb-[clamp(0px,8vw,40px)] pb-[clamp(0px,2.5vw,12.5px)]">
        <div v-for="card in cards" :key="card.name" class="flex items-end justify-center">
            <div class="relative">
                <img :src="getImageUrl(card.name)" alt="Carte" class="w-[clamp(0px,25vw,125px)]">
                <div
                    class="absolute bottom-[clamp(0px,2vw,10px)] left-1/2 transform -translate-x-1/2 flex justify-center items-center text-lg font-bold bg-dark-background text-purple-important rounded-full w-[clamp(0px,7vw,35px)] h-[clamp(0px,7vw,35px)]">
                    {{ card.value }}
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { getDatabase, ref as dbRef, onValue, set } from 'firebase/database'
import { useRoute } from 'vue-router'

const route = useRoute()
const gameId = route.params.gameId
const database = getDatabase()
const cards = ref([])
const playerList = ref([])

const playerCount = computed(() => playerList.value.length)
const totalCardsValue = computed(() => cards.value.reduce((sum, card) => sum + card.value, 0))

const getImageUrl = (name) => {
    return new URL(`../assets/roles/${name}.png`, import.meta.url).href;
};

const initialize = async () => {
    try {
        const gameRef = dbRef(database, `/${gameId}`)

        onValue(gameRef, (snapshot) => {
            if (snapshot.exists()) {
                const data = snapshot.val()
                // Mise à jour de la liste des joueurs
                playerList.value = data.playerList || []
                // Mise à jour des cartes avec filtrage
                const cardsData = data.cards || {}
                cards.value = Object.entries(cardsData)
                    .map(([name, value]) => ({
                        name,
                        value
                    }))
                    .filter(card => card.value > 0) // Filtrage des cartes dont la valeur > 0
            } else {
                playerList.value = []
                cards.value = []
            }
        })
    } catch (error) {
        console.error("Erreur Firebase :", error.code, error.message)
    }
}

onMounted(() => {
    initialize()
})
</script>