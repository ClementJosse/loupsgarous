<template>
  <draggable v-model="playerList" item-key="id" @end="updateFirebase">
    <!-- Utilisation du slot item -->
    <template #item="{ element }">
      <div class="player-item">
        <!-- Assurez-vous qu'il y a un seul conteneur parent -->
        {{ element }}
      </div>
    </template>
  </draggable>
</template>

<script setup>
import { ref } from 'vue'
import draggable from 'vuedraggable'
import { getDatabase, ref as dbRef, onValue, update } from 'firebase/database'
import { useRoute } from 'vue-router'

// 1) Récupération de l'ID de la partie depuis l'URL
const route = useRoute()
const gameId = route.params.gameId

// 2) Configuration de Firebase
const database = getDatabase()
const partiesRef = dbRef(database, `/${gameId}`)

// 3) Variables réactives
const playerList = ref([])

// 4) Écoute en temps réel du nœud correspondant
onValue(partiesRef, (snapshot) => {
  const data = snapshot.val()
  if (data && data.playerList) {
    playerList.value = data.playerList
  }
})

// 5) Mise à jour de Firebase quand l'ordre change
function updateFirebase() {
  update(partiesRef, {playerList : playerList.value})
}
</script>

<style scoped>
.player-item {
  margin: 8px 0;
  padding: 8px;
  background: #efefef;
  border: 1px solid #ccc;
  cursor: grab;
}
</style>
