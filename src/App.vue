<template>
  <div class=" bg-blue-background min-h-screen justify-items-center">
    <iRoles></iRoles>
    <Home></Home>

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

onMounted(() => {
  const database = getDatabase();
  // Référence à la racine (ou à ton nœud de parties)
  const partiesRef = dbRef(database, '/');

  onValue(partiesRef, (snapshot) => {
    const allParties = snapshot.val(); 
    // allParties est un objet { "140125": { ... }, "157648": { ... } }

    // On filtre juste celles ayant status == "lobby"
    const lobbies = [];
    for (let key in allParties) {
      if (allParties[key].status === "lobby") {
        lobbies.push(key);
      }
    }

    console.log("Codes des parties en lobby :", lobbies);
    // lobbies = ["140125", "unAutreCode", ...]
  });
});

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
