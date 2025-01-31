<template>
  <div class="text-white text-sm">Liste de joueurs:</div>
  <div
    class="relative flex z-0 flex-col bg-dark-background w-[clamp(0px,84vw,420px)] items-left rounded-xl py-[clamp(0px,8vw,40px)]">
    <div>
      <div
        class="absolute z-[-1] top-[clamp(0px,5vw,25px)] bottom-[clamp(0px,3vw,15px)] right-[clamp(0px,40vw,200px)] left-[clamp(0px,20vw,100px)] border-dashed border-disabled border-[clamp(0px,0.8vw,4px)] rounded-full">
      </div>
      <draggable v-model="playerList" item-key="id" @end="updateFirebase" animation="200" tag="transition-group"
        :component-data="{ name: 'flip-list' }">
        <template #item="{ element }">
          <div
            class="flex flex-row justify-center text-lg z-1 text-white font-semibold bg-blue-background w-min ml-[clamp(0px,30vw,150px)] p-[clamp(0px,1vw,5px)] px-[clamp(0px,3vw,15px)] my-[clamp(0px,2vw,10px)] rounded-xl">
            <div class="text-purple-important font-thin mr-[clamp(0px,1vw,5px)]">⠿</div>{{ element }}
          </div>
        </template>
      </draggable>
    </div>

    <button v-wave class="text-blue-protect flex flex-row justify-center text-lg ">
      <img src="@/assets/select.svg" class="blue-protect h-[clamp(0px,6vw,30px)]" />
      Changer de meneur
    </button>
    <button v-wave class="text-red-kill flex flex-row justify-center text-lg">
      <img src="@/assets/delete.svg" class="red-kill h-[clamp(0px,6vw,30px)]" />
      Supprimer des joueurs
    </button>
  </div>
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
  update(partiesRef, { playerList: playerList.value })
}
</script>

<style scoped>
.blue-protect {
  filter: invert(60%) sepia(14%) saturate(2112%) hue-rotate(175deg) brightness(95%) contrast(84%);
}

.red-kill {
  filter: brightness(0) saturate(100%) invert(51%) sepia(28%) saturate(2252%) hue-rotate(318deg) brightness(90%) contrast(101%);
}

.dark-background {
  filter: invert(10%) sepia(71%) saturate(720%) hue-rotate(166deg) brightness(92%) contrast(100%);
}
</style>
