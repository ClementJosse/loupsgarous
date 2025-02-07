<template>
    <div>Rôles:</div>
    <div>8 / 9 joueurs</div>
    <div
        class="relative flex z-0 flex-row flex-wrap bg-dark-background w-[clamp(0px,84vw,420px)] pt-[clamp(0px,2.5vw,12.5px)] pl-[clamp(0px,2.5vw,12.5px)] gap-[clamp(0px,2vw,10px)] items-start rounded-xl mb-[clamp(0px,8vw,40px)] pb-[clamp(0px,2.5vw,12.5px)]">
        <div v-for="card in cards" :key="card.name" class="flex items-end justify-center">
            <button v-wave v-if="card.value > 0" class="relative active:scale-105" @click="incrementValue(card)">
                <img :src="getImageUrl(card.name)" alt="Carte" class="w-[clamp(0px,25vw,125px)]">
                <div
                    class="absolute bottom-[clamp(0px,2vw,10px)] left-1/2 transform -translate-x-1/2 flex justify-center items-center text-lg font-bold bg-dark-background text-purple-important rounded-full w-[clamp(0px,7vw,35px)] h-[clamp(0px,7vw,35px)]">
                    {{ card.value }}
                </div>
                <button v-wave 
                    class="absolute active:scale-105 top-[clamp(0px,2vw,10px)] left-[clamp(0px,2vw,10px)] transform flex justify-center items-center text-lg font-bold bg-dark-background text-red-kill rounded-full w-[clamp(0px,6vw,30px)] h-[clamp(0px,6vw,30px)]"
                    @click.stop="decrementValue(card)">
                    −
                </button>
            </button>
            <button v-wave v-else class="relative active:scale-105" @click="incrementValue(card)">
                <img :src="getImageUrl(card.name)" alt="Carte" class="w-[clamp(0px,25vw,125px)] opacity-40">
            </button>
        </div>
    </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { getDatabase, ref as dbRef, onValue, set } from 'firebase/database'
import { useRoute } from 'vue-router'

const route = useRoute()
const gameId = route.params.gameId
const database = getDatabase()
const cards = ref([])

const getImageUrl = (name) => {
    return new URL(`../assets/roles/${name}.png`, import.meta.url).href;
};

const initialize = async () => {
    try {
        const cardsRef = dbRef(database, `/${gameId}/cards`)

        onValue(cardsRef, (snapshot) => {
            if (snapshot.exists()) {
                const data = snapshot.val()
                cards.value = Object.entries(data).map(([name, value]) => ({
                    name,
                    value
                }))
            } else {
                cards.value = []
            }
        })
    } catch (error) {
        console.error("Erreur Firebase :", error.code, error.message)
    }
}

const incrementValue = (card) => {
    const cardRef = dbRef(database, `/${gameId}/cards/${card.name}`)
    set(cardRef, card.value + 1)
}

const decrementValue = (card) => {
    if (card.value > 0) {
        const cardRef = dbRef(database, `/${gameId}/cards/${card.name}`)
        set(cardRef, card.value - 1)
    }
}

onMounted(() => {
    initialize()
})
</script>
