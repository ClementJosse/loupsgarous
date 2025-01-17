<template>
    <!-- Si l'utilisateur est dans le jeu, on affiche la liste des joueurs -->
    <div v-if="isUsernameInGame" class="bg-green-500">
      <QRCode></QRCode>
      <div>{{ gameInfo.uid_to_username }}</div>
    </div>
  
    <!-- Si l'utilisateur n'est pas encore dans la partie, on affiche le formulaire -->
    <div v-else>
      <div v-if="isPathCorrect" class="flex flex-col h-screen items-center justify-center">
        <h1 class="text-2xl text-white font-light">Quel est ton prénom ?</h1>
        <input v-model="username" type="text" placeholder="... " class="with" />
        <div v-if="username.length > 0">
          <button v-wave class="text-2xl text-purple-important font-medium" @click="joinTheGame">
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
  import { ref } from 'vue'
  import { useRoute } from 'vue-router'
  import { getDatabase, ref as dbRef, onValue, set, onDisconnect} from 'firebase/database'
  import { getAuth, signInAnonymously } from 'firebase/auth'
import QRCode from './QRCode.vue'
  
  const route = useRoute()
  const gameId = route.params.gameId
  
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
}
  </script>
  