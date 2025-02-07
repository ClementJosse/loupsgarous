<template>
  <div class="text-white text-sm tilt-shaking">Liste des joueurs:</div>
  <div ref="componentRef" @click.stop="resetStates"
    class="relative flex z-0 flex-col bg-dark-background w-[clamp(0px,84vw,420px)] items-left rounded-xl mb-[clamp(0px,8vw,40px)] pb-[clamp(0px,5vw,25px)]">
    <div
        class="absolute z-[-1] top-[clamp(0px,5vw,25px)] bottom-[clamp(0px,35vw,175px)] right-[clamp(0px,40vw,200px)] left-[clamp(0px,20vw,100px)] border-dashed border-disabled border-[clamp(0px,0.8vw,4px)] rounded-full">
      </div>
    <div class="py-[clamp(0px,8vw,40px)]">
      <draggable v-model="playerList" item-key="id" @end="updateFirebase" animation="200" tag="transition-group"
        :component-data="{ name: 'flip-list' }" :disabled="kickButtonState || leaderButtonState">
        <template #item="{ element }">
          <button v-wave @click.stop="kickOrPromote"
            class="flex flex-row justify-center text-lg z-1 text-white font-semibold bg-blue-background w-min ml-[clamp(0px,30vw,150px)] p-[clamp(0px,1vw,5px)] px-[clamp(0px,3vw,15px)] my-[clamp(0px,2vw,10px)] rounded-xl">
            <div v-if="kickButtonState"
              class="animate-tilt-shaking text-red-kill font-bold mr-[clamp(0px,1.5vw,7.5px)] w-[clamp(0px,3.5vw,17.5px)]">
              ×
            </div>
            <div v-else-if="leaderButtonState"
              class="animate-tilt-shaking text-blue-protect font-bold mr-[clamp(0px,1.5vw,7.5px)] w-[clamp(0px,3.5vw,17.5px)]">
              ★
            </div>
            <div v-else class="text-purple-important font-bold mr-[clamp(0px,1.5vw,7.5px)] w-[clamp(0px,3.5vw,17.5px)]">
              ⠿
            </div>
            <div :class="[kickButtonState ? 'animate-tilt-shaking' : leaderButtonState ? 'animate-tilt-shaking' : '']">
              {{ element }}
            </div>
          </button>
        </template>
      </draggable>
    </div>

    <hr class="mx-[clamp(0px,12vw,60px)] mb-[clamp(0px,3vw,15px)] h-[clamp(0px,0.5vw,2.5px)] border-0 bg-disabled">

    <button v-wave @click.stop="changeLeaderButtonState" :class="[
      leaderButtonState ? 'text-dark-background bg-blue-protect font-semibold' : 'text-blue-protect bg-dark-background',
      'flex flex-row items-center self-center text-lg w-min whitespace-pre gap-[clamp(0px,2vw,10px)] p-[clamp(0px,2vw,10px)] rounded-xl active:scale-105 mb-[clamp(0px,1vw,5px)]'
    ]">
      <img src="@/assets/select.svg" :class="[leaderButtonState ? 'dark-background' : 'blue-protect']"
        class="h-[clamp(0px,6vw,30px)]" />
      <div class="pr-[clamp(0px,5vw,25px)]">Changer de meneur</div>
    </button>

    <button v-wave @click.stop="changeKickButtonState"
      :class="[kickButtonState ? 'text-dark-background bg-red-kill font-semibold' : 'text-red-kill bg-dark-background']"
      class="flex flex-row items-center self-center text-lg w-min whitespace-pre gap-[clamp(0px,2vw,10px)] p-[clamp(0px,2vw,10px)] rounded-xl active:scale-105">
      <img src="@/assets/delete.svg" :class="[kickButtonState ? 'dark-background' : 'red-kill']"
        class=" h-[clamp(0px,6vw,30px)]" />
      <div class="pr-[clamp(0px,6vw,30px)]">Supprimer des joueurs</div>
    </button>

  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import draggable from 'vuedraggable'
import { getDatabase, ref as dbRef, onValue, update } from 'firebase/database'
import { useRoute } from 'vue-router'

const leaderButtonState = ref(false)
const kickButtonState = ref(false)
const componentRef = ref(null) // Référence pour détecter le clic en dehors

// Récupération de l'ID de la partie depuis l'URL
const route = useRoute()
const gameId = route.params.gameId

// Configuration de Firebase
const database = getDatabase()
const partiesRef = dbRef(database, `/${gameId}`)

// Variables réactives
const playerList = ref([])

// Écoute en temps réel du nœud correspondant
onValue(partiesRef, (snapshot) => {
  const data = snapshot.val()
  if (data && data.playerList) {
    playerList.value = data.playerList
  }
})

// Mise à jour de Firebase quand l'ordre change
function updateFirebase() {
  update(partiesRef, { playerList: playerList.value })
}

// Gérer l'état des boutons
function changeLeaderButtonState() {
  leaderButtonState.value = !leaderButtonState.value
  kickButtonState.value = false
}

function changeKickButtonState() {
  kickButtonState.value = !kickButtonState.value
  leaderButtonState.value = false
}

function kickOrPromote() {
  if (leaderButtonState.value) {
    console.log("Promotion en cours")
  } else if (kickButtonState.value) {
    console.log("Suppression en cours")
  } else {
    console.log("Mouvement normal")
  }
}

// Fonction pour réinitialiser les états si on clique ailleurs
function handleClickOutside(event) {
  if (componentRef.value && !componentRef.value.contains(event.target)) {
    leaderButtonState.value = false
    kickButtonState.value = false
  }
}

function resetStates(event) {
  // Vérifie si le clic est à l'intérieur du composant mais pas sur les boutons
  if (componentRef.value && componentRef.value.contains(event.target)) {
    if (
      !event.target.closest("button") // Si ce n'est pas un bouton
    ) {
      leaderButtonState.value = false
      kickButtonState.value = false
    }
  } else {
    // Si clic à l'extérieur du composant
    leaderButtonState.value = false
    kickButtonState.value = false
  }
}

// Ajouter et supprimer l'écouteur d'événements global
onMounted(() => {
  document.addEventListener("click", resetStates)
  document.addEventListener("click", handleClickOutside)
})

onUnmounted(() => {
  document.removeEventListener("click", resetStates)
  document.removeEventListener("click", handleClickOutside)
})
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
