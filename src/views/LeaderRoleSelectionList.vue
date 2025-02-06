<template>
    Rôles:
    8 / 9 joueurs
    <div class="relative flex z-0 flex-col bg-dark-background w-[clamp(0px,84vw,420px)] items-start rounded-xl mb-[clamp(0px,8vw,40px)] pb-[clamp(0px,5vw,25px)]">
        <div v-for="card in cards" :key="card.name" class="flex items-center space-x-2">
            <img :src="getImageUrl(card.name)" alt="Carte" class="w-12 h-12">
            <strong>{{ card.name }}</strong>: {{ card.value }}
        </div>
    </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { getDatabase, ref as dbRef, onValue } from 'firebase/database'
import { useRoute } from 'vue-router'

const route = useRoute()
const gameId = route.params.gameId
const database = getDatabase()
const cards = ref([]) // Liste des cartes avec nom et valeur

// Fonction pour générer le chemin dynamique de l'image
const getImageUrl = (name) => {
    return new URL(`../assets/roles/${name}.png`, import.meta.url).href;
};

const initialize = async () => {
    try {
        const cardsRef = dbRef(database, `/${gameId}/cards`) // Référence Firebase

        // Écoute les changements en temps réel
        onValue(cardsRef, (snapshot) => {
            if (snapshot.exists()) {
                const data = snapshot.val()
                // Transforme l'objet en tableau [{ name: key, value: value }]
                cards.value = Object.entries(data).map(([name, value]) => ({
                    name,
                    value
                }))
            } else {
                cards.value = [] // Si aucun rôle, on vide la liste
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
