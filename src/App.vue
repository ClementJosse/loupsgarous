<template>
  <div class=" bg-blue-background min-h-screen justify-items-center">
    <iRoles></iRoles>
    <router-view />

  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue' // <-- Import ref et onMounted
import iRoles from './views/iRoles.vue'
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
  });
});
</script>
