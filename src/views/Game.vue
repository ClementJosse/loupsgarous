<template>
  <!-- Si l'utilisateur est dans le jeu, on affiche la liste des joueurs -->
  <div v-if="isUsernameInGame" class="flex flex-col items-center w-full">

    <div
      class="flex flex-col items-center bg-dark-background w-full pb-[clamp(0px,6vw,30px)] pt-[clamp(0px,16vw,80px)]">
      <div class="flex flex-col items-center">
        <h3 class="text-white text-base font-light">Code de la partie</h3>
        <h2 class="text-purple-important text-2xl font-medium">#{{ gameId }}</h2>
      </div>
      <QRCode class="pt-[clamp(0px,1vw,5px)]" :value="'http://192.168.1.119:5173/' + gameId"></QRCode>
      <button v-wave @click="copyToClipboard"
        class="flex flex-row bg-blue-background items-center gap-[clamp(0px,2vw,10px)] p-[clamp(0px,2vw,10px)] rounded-xl active:scale-105 m-[clamp(0px,4vw,20px)]">
        <img src="@/assets/copy.svg" class="w-[clamp(0px,6vw,30px)]" />
        <h1 class="text-purple-important font-medium text-base">
          Copier le lien de la partie
        </h1>
      </button>
      <h3 class="text-white text-sm font-light ">Partage le QR code pour inviter tes amis dans la partie</h3>
    </div>

    <div class="text-sm">{{ gameInfo.uid_to_username }}</div>
  </div>

  <!-- Si l'utilisateur n'est pas encore dans la partie, on affiche le formulaire -->
  <div v-else>
    <div v-if="isPathCorrect" class="flex flex-col h-screen items-center justify-center">
      <h1 class="text-2xl text-white font-light">Quel est ton prénom ?</h1>
      <input v-model="username" type="text" placeholder="... " class="with" />
      <div v-if="username.length > 0">
        <button v-wave class="text-2xl text-purple-important font-medium active:scale-105" @click="joinTheGame">
          Rejoindre la partie
        </button>
      </div>
      <div v-else>
        <h1 class="text-2xl text-disabled font-regular">Rejoindre la partie</h1>
      </div>
    </div>
  </div>

  <!-- Si la partie n'existe pas ou n'est pas en lobby -->
  <div v-if="isPathCorrect === false">
    Partie non disponible
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRoute } from 'vue-router'
import { getDatabase, ref as dbRef, onValue, set, onDisconnect } from 'firebase/database'
import { getAuth, signInAnonymously } from 'firebase/auth'
import { Clipboard } from "v-clipboard"

import QRCode from './QRCode.vue'

const route = useRoute()
const gameId = route.params.gameId

// On construit le lien à copier
const gameLink = computed(() => `http://192.168.1.119:5173/${gameId}`)

// Champs réactifs
const username = ref('')
const gameInfo = ref(null)
const isPathCorrect = ref(null)
const isUsernameInGame = ref(false)  // <-- booléen plutôt que string

// Firebase
const database = getDatabase()
const partiesRef = dbRef(database, '/' + gameId)
const auth = getAuth()
let UID = null

// Auth anonyme
signInAnonymously(auth)
  .then(() => {
    UID = auth.currentUser.uid
    console.log("Authentification anonyme :", UID)
  })
  .catch((error) => {
    console.error("Erreur d'auth :", error.code, error.message)
  })

// Écoute les changements sur la partie
onValue(partiesRef, (snapshot) => {
  const data = snapshot.val()

  if (data) {
    gameInfo.value = data
    // La partie est-elle en lobby ?
    isPathCorrect.value = (data.status === 'lobby')

    // Si la clé uid_to_username existe ET si UID est déjà dedans,
    // alors l'utilisateur est déjà dans la partie
    const hasUidToUsername = data.uid_to_username || {}
    isUsernameInGame.value = (UID in hasUidToUsername)

  } else {
    isPathCorrect.value = false
  }
})

// Fonction pour rejoindre la partie
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

function copyToClipboard() {
  Clipboard.copy(gameLink.value)
}
</script>