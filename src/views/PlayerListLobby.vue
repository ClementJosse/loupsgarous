<template>
  <div class="text-white text-sm">Liste des joueurs:</div>
  <div class="pb-[clamp(0px,10vw,50px)]">
    <!-- Liste "principale" -->
    <ul class="relative flex z-0 flex-col bg-dark-background w-[clamp(0px,84vw,420px)] items-center rounded-xl">
      <!-- Cercle en arrière-plan (on peut le laisser dans un <li> masqué ou utiliser un pseudo-élément) -->
      <li
        class="absolute z-[-1] top-[clamp(0px,9vw,45px)] bottom-[clamp(0px,30vw,150px)] right-[clamp(0px,12vw,60px)] left-[clamp(0px,12vw,60px)] border-dashed border-disabled border-[clamp(0px,0.8vw,4px)] rounded-full">
      </li>

      <!-- Premier élément s'il y a un nombre impair d'items -->
      <li v-if="middleItem"
        class="flex  z-1 text-lg flex-row text-white font-semibold items-center bg-blue-background w-min p-[clamp(0px,1vw,5px)] px-[clamp(0px,3vw,15px)] mt-[clamp(0px,5vw,25px)] rounded-xl">
        {{ props.gameInfo.uid_to_username[middleItem] }}
      </li>
      <!-- Placeholder (invisible) si la liste est paire, pour garder un "espace" cohérent -->
      <li v-else
        class="flex opacity-0 text-lg flex-row text-white font-semibold items-center bg-blue-background w-min p-[clamp(0px,1vw,5px)] px-[clamp(0px,3vw,15px)] mt-[clamp(0px,5vw,25px)] rounded-xl">
        .
      </li>

      <!-- Conteneur pour les 2 colonnes -->
      <li class="flex flex-row justify-between w-full px-[clamp(0px,5vw,25px)]">
        <!-- Colonne de gauche -->
        <ul class="justify-items-start">
          <li v-for="(item, index) in leftColumn" :key="index"
            class="text-white text-lg bg-blue-background font-semibold w-min p-[clamp(0px,1vw,5px)] px-[clamp(0px,3vw,15px)] m-[clamp(0px,2vw,10px)] rounded-xl my-[clamp(0px,8vw,40px)]">
            {{ props.gameInfo.uid_to_username[item] }}
          </li>
        </ul>

        <!-- Colonne de droite -->
        <ul class="justify-items-end">
          <li v-for="(item, index) in rightColumn" :key="index"
            class="text-white text-lg bg-blue-background font-semibold w-min p-[clamp(0px,1vw,5px)] px-[clamp(0px,3vw,15px)] m-[clamp(0px,2vw,10px)] rounded-xl my-[clamp(0px,8vw,40px)]">
            {{ props.gameInfo.uid_to_username[item] }}
          </li>
        </ul>
      </li>

      <!-- Élément de bas (placeholder invisible) -->
      <li
        class="flex opacity-0 flex-row text-dark-background font-semibold items-center bg-dark-background w-min p-[clamp(0px,1vw,5px)] mb-[clamp(0px,5vw,25px)] rounded-xl">
        '
      </li>

      <div class="z-10 h-[clamp(0px,0.5vw,2.5px)] px-[clamp(0px,30vw,150px)] mb-[clamp(0px,3vw,15px)] border-100 bg-disabled">
      </div>
      <div class="text-white text-sm">Meneur :</div>
      <div class="flex z-1 text-lg flex-row text-white font-semibold items-center bg-blue-background w-min p-[clamp(0px,1vw,5px)] px-[clamp(0px,3vw,15px)] mb-[clamp(0px,5vw,25px)] mt-[clamp(0px,3vw,15px)] rounded-xl">
        {{ props.gameInfo.uid_to_username[props.gameInfo.leader] }}
      </div>
    </ul>
  </div>
</template>

<script setup>
import { computed } from 'vue';

const props = defineProps({
  gameInfo: {
    type: Object
  },
});

const middleItem = computed(() => {
  // Retourne l'élément central si le nombre d'éléments est impair
  return props.gameInfo.playerList.length % 2 === 1
    ? props.gameInfo.playerList[Math.floor(props.gameInfo.playerList.length / 2)]
    : null;
});

const remainingItems = computed(() => {
  // Crée un nouveau tableau sans l'élément central
  if (middleItem.value !== null) {
    const middleIndex = Math.floor(props.gameInfo.playerList.length / 2);
    return [
      ...props.gameInfo.playerList.slice(0, middleIndex),
      ...props.gameInfo.playerList.slice(middleIndex + 1)
    ];
  }
  // Retourne une copie du tableau original pour éviter les mutations
  return [...props.gameInfo.playerList];
});

const leftColumn = computed(() => {
  // Prend la première moitié et inverse l'ordre
  const half = Math.ceil(remainingItems.value.length / 2);
  return remainingItems.value.slice(0, half).reverse();
});

const rightColumn = computed(() => {
  // Prend la seconde moitié
  const half = Math.ceil(remainingItems.value.length / 2);
  return remainingItems.value.slice(half);
});
</script>
