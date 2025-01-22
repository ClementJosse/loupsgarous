<template>
    <GameCodeInfo />
    <LeaderListLobby v-if="gameInfo" />
</template>

<script setup>
import { ref, onMounted } from 'vue'
import GameCodeInfo from './GameCodeInfo.vue'
import LeaderListLobby from './LeaderListLobby.vue'
import { getDatabase, ref as dbRef, onValue, set, onDisconnect } from 'firebase/database'
import { useRoute } from 'vue-router'

const route = useRoute()
const gameId = route.params.gameId
const gameInfo = ref(null)
const database = getDatabase()
const partiesRef = dbRef(database, `/${gameId}`)


const initialize = async () => {
    try {

        // Écoute des changements sur la partie dans Firebase
        onValue(partiesRef, (snapshot) => {
            const data = snapshot.val()

            if (data) {
                gameInfo.value = data
            }
        })
    } catch (error) {
        console.error("Erreur d'auth :", error.code, error.message)
    }
}

onMounted(() => {
    initialize()
})
</script>