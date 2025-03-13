<template>
  <!-- État de chargement -->
  <div v-if="isLoading" class="text-white text-4xl flex flex-col h-screen justify-center">
    <Loader />
  </div>

  <!-- Gestion des erreurs -->
  <div v-else-if="hasError" class="text-white text-4xl flex flex-col h-screen justify-center text-center">
    Partie non disponible
  </div>

  <!-- Contenu principal une fois chargé -->
  <div v-else class="w-full">
    <!-- Si l'utilisateur est déjà dans le jeu -->
    <div v-if="isUsernameInGame" class="w-full">
      <div v-if="isLeader" class="w-full">
        <div v-if="isInLobby" class="flex flex-col items-center w-full">
          <LobbyLeader />
        </div>
        <div v-else-if="isInGame" class="flex flex-col items-center w-full">
          <InGameLeader :gameInfo="gameInfo" />
        </div>
      </div>
      <div v-else>
        <div v-if="isInLobby" class="flex flex-col items-center w-full">
          <LobbyPlayer :gameInfo="gameInfo" />
        </div>
        <div v-else-if="isInGame" class="flex flex-col items-center w-full">
          <InGamePlayer :gameInfo="gameInfo" />
        </div>
      </div>
    </div>

    <!-- Sinon, propositions de rejoindre/créer -->
    <JoinTheGame v-else-if="isInLobby" :username="username" @update:username="val => (username = val)"
      @joinTheGame="joinTheGame" />

    <CreateTheGame v-else-if="isCreating" :username="username" @update:username="val => (username = val)"
      @createTheGame="createTheGame" />

    <!-- Fallback si partie indisponible -->
    <div v-else class="text-white text-4xl flex flex-col h-screen justify-center text-center">
      Partie non disponible
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { getDatabase, ref as dbRef, onValue, set, get, update, onDisconnect } from 'firebase/database'
import { getAuth, signInAnonymously } from 'firebase/auth'
import JoinTheGame from './JoinTheGame.vue'
import Loader from './Loader.vue'
import { useRoute } from 'vue-router'
import CreateTheGame from './CreateTheGame.vue'
import LobbyLeader from './lobby/leader/LobbyLeader.vue'
import LobbyPlayer from './lobby/player/LobbyPlayer.vue'
import InGameLeader from './ingame/leader/InGameLeader.vue'
import InGamePlayer from './ingame/player/InGamePlayer.vue'

const route = useRoute()
const gameId = route.params.gameId

// Champs réactifs
const username = ref('')
const gameInfo = ref(null)
const isInLobby = ref(false)
const isInGame = ref(false)
const isUsernameInGame = ref(false)
const isLeader = ref(null)
const isCreating = ref(false)
const isLoading = ref(true)
const hasError = ref(false)

// Configuration Firebase
const database = getDatabase()
const partiesRef = dbRef(database, `/${gameId}`)
const auth = getAuth()
let UID = null
const leader = ref(null)

// Fonction d'initialisation asynchrone
const initialize = async () => {
  try {
    // Authentification anonyme
    await signInAnonymously(auth)
    UID = auth.currentUser.uid
    console.log("Authentification anonyme :", UID)

    // Écoute des changements sur la partie dans Firebase
    onValue(partiesRef, (snapshot) => {
      const data = snapshot.val()

      if (data) {
        gameInfo.value = data
        // On vérifie que la partie est en mode 'lobby'
        isInLobby.value = (data.status === 'lobby')

        // Vérifie si l'utilisateur est en train de créer la partie
        isCreating.value = (data.status === 'creating') && (data.leader === UID)

        // Vérifie si l'utilisateur (UID) est déjà enregistré dans uid_to_username
        const hasUidToUsername = data.uid_to_username || {}
        isUsernameInGame.value = hasUidToUsername.hasOwnProperty(UID)

        isInGame.value = (data.status === 'ingame')

        leader.value = data.leader
        isLeader.value = (data.leader === UID)
      } else {
        isInLobby.value = false
      }

      isLoading.value = false
    }, (error) => {
      console.error("Erreur de récupération des données :", error)
      hasError.value = true
      isLoading.value = false
    })
  } catch (error) {
    console.error("Erreur d'auth :", error.code, error.message)
    hasError.value = true
    isLoading.value = false
  }
}

onMounted(() => {
  initialize()
})

// Méthode pour créer une partie
function createTheGame() {
  console.log("Création de la partie en cours...")
  const user = auth.currentUser
  if (!user) {
    console.error('Aucun utilisateur connecté !')
    return
  }
  const uid = user.uid

  const uidRef = dbRef(database, `/${gameId}/uid_to_username/${uid}`)

  // Mise à jour des données de la partie
  set(dbRef(database, `/${gameId}/status`), 'lobby')
    .then(() => {
      set(uidRef, username.value)
    })
    .then(() => {
      console.log("Utilisateur ajouté + suppression programmée au disconnect")
      isUsernameInGame.value = true
      console.log("dbRef(database, `/${gameId}/uid_to_username/`)[0]" + dbRef(database, `/${gameId}/uid_to_username/`)[0])
    })
    .catch((err) => {
      console.error("Erreur lors de la création de la partie :", err)
    })
}

function joinTheGame() {
  console.log("Rejoindre la partie en cours...")
  const user = auth.currentUser
  if (!user) {
    console.error('Aucun utilisateur connecté !')
    return
  }

  const uid = user.uid
  const usernameValue = username.value

  if (!usernameValue) {
    console.error('Le pseudo est vide !')
    return
  }

  const gameRef = dbRef(database, `/${gameId}/`)

  // Récupérer l'état actuel du jeu
  get(gameRef)
    .then((snapshot) => {
      const gameData = snapshot.val() || {}
      const playerList = Array.isArray(gameData.playerList) ? gameData.playerList : []

      // Ajouter le pseudo s'il n'est pas déjà présent
      if (!playerList.includes(uid)) {
        playerList.push(uid)
      }

      // Mise à jour en un seul appel
      return update(gameRef, {
        [`uid_to_username/${uid}`]: usernameValue,
        playerList: playerList
      })
    })
    .catch((err) => {
      console.error("Erreur lors de la jonction de la partie :", err)
    })
}
</script>