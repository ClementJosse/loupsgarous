<template>
  <!-- Si l'utilisateur est déjà dans le jeu, on affiche la liste des joueurs -->
  <div v-if="isUsernameInGame" class="flex flex-col items-center w-full">
    <GameCodeInfo />
    <div class="text-sm">{{ gameInfo.playerList }}</div>
    <LeaderListLobby :items='gameInfo.playerList' />
    <PlayerListLobby :items='gameInfo.playerList' />
  </div>

  <!-- Sinon, on propose d'entrer dans la partie -->
  <JoinTheGame v-else-if="isPathCorrect" :username="username" @update:username="val => (username = val)"
    @joinTheGame="joinTheGame" />

  <CreateTheGame v-else-if="isCreating" :username="username" @update:username="val => (username = val)"
    @createTheGame="createTheGame" />

  <!-- Si la partie n'existe pas ou n'est pas en lobby -->
  <div v-else-if="isPathCorrect === false" class="text-white text-4xl flex flex-col h-screen justify-center">
    Partie non disponible
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { getDatabase, ref as dbRef, onValue, set, onDisconnect } from 'firebase/database'
import { getAuth, signInAnonymously } from 'firebase/auth'
import GameCodeInfo from './GameCodeInfo.vue'
import JoinTheGame from './JoinTheGame.vue'

import { useRoute } from 'vue-router'
import PlayerListLobby from './PlayerListLobby.vue'
import LeaderListLobby from './LeaderListLobby.vue'
import CreateTheGame from './CreateTheGame.vue'
const route = useRoute()

const gameId = route.params.gameId

// Champs réactifs
const username = ref('')
const gameInfo = ref(null)
const isPathCorrect = ref(null)
const isUsernameInGame = ref(false)
const isCreating = ref(null)

// Configuration Firebase
const database = getDatabase()
const partiesRef = dbRef(database, '/' + gameId)
const auth = getAuth()
let UID = null

// Authentification anonyme
signInAnonymously(auth)
  .then(() => {
    UID = auth.currentUser.uid
    console.log("Authentification anonyme :", UID)
  })
  .catch((error) => {
    console.error("Erreur d'auth :", error.code, error.message)
  })

// Écoute des changements sur la partie dans Firebase
onValue(partiesRef, (snapshot) => {
  const data = snapshot.val()

  if (data) {
    gameInfo.value = data
    // On vérifie que la partie est en mode 'lobby'
    isPathCorrect.value = (data.status === 'lobby')

    isCreating.value = (data.status === 'creating') && (data.leader === UID)

    // Vérifie si l'utilisateur (UID) est déjà enregistré dans uid_to_username
    const hasUidToUsername = data.uid_to_username || {}
    isUsernameInGame.value = (UID in hasUidToUsername)

  } else {
    isPathCorrect.value = false
  }
})

function createTheGame() {
  setTimeout(function () {
    console.log("gameJoined!")
    const user = getAuth().currentUser
    if (!user) {
      console.error('Aucun utilisateur connecté !')
      return
    }
    const uid = user.uid

    const uidRef = dbRef(database, `/${gameId}/uid_to_username/${uid}`)
    set(dbRef(database, `/${gameId}/status`), 'lobby' )
    set(dbRef(database, `/${gameId}/leader`), username.value )
    // 1. On programme la suppression en cas de déconnexion
    onDisconnect(uidRef).remove()
      .then(() => {
        // 2. Ensuite, on set la valeur "username" à ce nœud
        return set(uidRef, username.value)
      })
      .then(() => {
        console.log("Utilisateur ajouté + suppression programmée au disconnect")
        isUsernameInGame.value = true
      })
      .catch((err) => {
        console.error("Erreur :", err)
      })
  }, 200)
}

// Méthode pour rejoindre la partie
function joinTheGame() {
  setTimeout(function () {
    console.log("gameJoined!")
    const user = getAuth().currentUser
    if (!user) {
      console.error('Aucun utilisateur connecté !')
      return
    }
    const uid = user.uid

    const uidRef = dbRef(database, `/${gameId}/uid_to_username/${uid}`)

    // 1. On programme la suppression en cas de déconnexion
    onDisconnect(uidRef).remove()
      .then(() => {
        // 2. Ensuite, on set la valeur "username" à ce nœud
        return set(uidRef, username.value)
      })
      .then(() => {
        console.log("Utilisateur ajouté + suppression programmée au disconnect")
        isUsernameInGame.value = true
      })
      .catch((err) => {
        console.error("Erreur :", err)
      })
  }, 200)
}


</script>