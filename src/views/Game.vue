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
  <div v-else class="text-white text-4xl flex flex-col h-screen justify-center">
    Partie non disponible
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
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
const isPathCorrect = ref(false)
const isUsernameInGame = ref(false)
const isCreating = ref(false)

// Configuration Firebase
const database = getDatabase()
const partiesRef = dbRef(database, `/${gameId}`)
const auth = getAuth()
let UID = null

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
        isPathCorrect.value = (data.status === 'lobby')

        // Vérifie si l'utilisateur est en train de créer la partie
        isCreating.value = (data.status === 'creating') && (data.leader === UID)

        // Vérifie si l'utilisateur (UID) est déjà enregistré dans uid_to_username
        const hasUidToUsername = data.uid_to_username || {}
        isUsernameInGame.value = hasUidToUsername.hasOwnProperty(UID)
      } else {
        isPathCorrect.value = false
      }
    })
  } catch (error) {
    console.error("Erreur d'auth :", error.code, error.message)
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
    .then(() => set(dbRef(database, `/${gameId}/leader`), username.value))
    .then(() => {
      // Programmer la suppression en cas de déconnexion
      return onDisconnect(uidRef).remove()
    })
    .then(() => {
      // Définir le nom d'utilisateur
      return set(uidRef, username.value)
    })
    .then(() => {
      console.log("Utilisateur ajouté + suppression programmée au disconnect")
      isUsernameInGame.value = true
    })
    .catch((err) => {
      console.error("Erreur lors de la création de la partie :", err)
    })
}

// Méthode pour rejoindre une partie
function joinTheGame() {
  console.log("Rejoindre la partie en cours...")
  const user = auth.currentUser
  if (!user) {
    console.error('Aucun utilisateur connecté !')
    return
  }
  const uid = user.uid

  const uidRef = dbRef(database, `/${gameId}/uid_to_username/${uid}`)

  // Programmer la suppression en cas de déconnexion
  onDisconnect(uidRef).remove()
    .then(() => {
      // Définir le nom d'utilisateur
      return set(uidRef, username.value)
    })
    .then(() => {
      console.log("Utilisateur ajouté + suppression programmée au disconnect")
      isUsernameInGame.value = true
    })
    .catch((err) => {
      console.error("Erreur lors de la jonction de la partie :", err)
    })
}
</script>

<style scoped>
/* Ajoutez vos styles ici si nécessaire */
</style>
