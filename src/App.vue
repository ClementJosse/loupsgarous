<template>
  <div class=" bg-blue-background h-screen justify-items-center">
    <iRoles></iRoles>
    <Home></Home>

    <ul class="text-white ">
      <!-- On parcourt le tableau playerList -->
      <li
        v-for="(player, index) in playerList"
        :key="index"
      >
        {{ player }}
      </li>
    </ul>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue' // <-- Import ref et onMounted
import Home from './views/Home.vue'
import iRoles from './views/iRoles.vue'
import { getAuth, signInAnonymously } from 'firebase/auth'
import { getDatabase, ref as dbRef, onValue } from 'firebase/database'

// Variable réactive pour stocker la liste des joueurs
const playerList = ref([])

// Lors du montage du composant, on écoute la DB
onMounted(() => {
  const database = getDatabase()
  // Référence vers la clé "140125"
  const nodeRef = dbRef(database, '140125')
  
  onValue(nodeRef, (snapshot) => {
    const data = snapshot.val()
    // Si 'playerList' existe et est un tableau, on l’assigne
    if (data && data.playerList) {
      playerList.value = data.playerList
      console.log(playerList[0])
    } else {
      // Sinon on met un tableau vide
      playerList.value = []
    }
  })
})

// Authentification anonyme
const auth = getAuth()
let UID = null

signInAnonymously(auth)
  .then(() => {
    UID = auth.currentUser.uid
    console.log("Authentification anonyme :", UID)
  })
  .catch((error) => {
    console.error("Erreur d'auth :", error.code, error.message)
  })
</script>
