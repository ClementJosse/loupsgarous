<template>
    <!-- Liste "principale" -->
    <ul
      class="relative flex z-0 flex-col bg-dark-background w-[clamp(0px,84vw,420px)] items-center rounded-xl"
    >
      <!-- Cercle en arrière-plan (on peut le laisser dans un <li> masqué ou utiliser un pseudo-élément) -->
      <li
        class="absolute z-[-1] top-[clamp(0px,9vw,45px)] bottom-[clamp(0px,9vw,45px)] right-[clamp(0px,12vw,60px)] left-[clamp(0px,12vw,60px)] border-dashed border-disabled border-[clamp(0px,0.8vw,4px)] rounded-full"
      ></li>
  
      <!-- Premier élément s'il y a un nombre impair d'items -->
      <li
        v-if="firstItem"
        class="flex text-lg z-1 flex-row text-white font-semibold items-center bg-blue-background w-min p-[clamp(0px,1vw,5px)] px-[clamp(0px,3vw,15px)] mt-[clamp(0px,5vw,25px)] rounded-xl"
      >
        {{ firstItem }}
      </li>
      <!-- Placeholder (invisible) si la liste est paire, pour garder un "espace" cohérent -->
      <li
        v-else
        class="flex opacity-0 flex-row text-dark-background font-semibold items-center bg-dark-background w-min p-[clamp(0px,1vw,5px)] mt-[clamp(0px,5vw,25px)] rounded-xl"
      >
        .
      </li>
  
      <!-- Conteneur pour les 2 colonnes -->
      <li class="flex flex-row justify-between w-full px-[clamp(0px,5vw,25px)]">
        <!-- Colonne de gauche -->
        <ul class="justify-items-start">
          <li
            v-for="(item, index) in leftColumn"
            :key="index"
            class="text-white text-lg bg-blue-background font-semibold w-min p-[clamp(0px,1vw,5px)] px-[clamp(0px,3vw,15px)] m-[clamp(0px,2vw,10px)] rounded-xl my-[clamp(0px,8vw,40px)]"
          >
            {{ item }}
          </li>
        </ul>
  
        <!-- Colonne de droite -->
        <ul class="justify-items-end">
          <li
            v-for="(item, index) in rightColumn"
            :key="index"
            class="text-white text-lg bg-blue-background font-semibold w-min p-[clamp(0px,1vw,5px)] px-[clamp(0px,3vw,15px)] m-[clamp(0px,2vw,10px)] rounded-xl my-[clamp(0px,8vw,40px)]"
          >
            {{ item }}
          </li>
        </ul>
      </li>
  
      <!-- Élément de bas (placeholder invisible) -->
      <li
        class="flex opacity-0 flex-row text-dark-background font-semibold items-center bg-dark-background w-min p-[clamp(0px,1vw,5px)] mb-[clamp(0px,5vw,25px)] rounded-xl"
      >
        '
      </li>
    </ul>
  </template>
  
  <script>
  export default {
    name: 'NonLinearList',
    props: {
      items: {
        type: Array,
        default: () => [],
      },
    },
    computed: {
      firstItem() {
        // Renvoie le premier élément si le tableau contient un nombre impair d'éléments
        return this.items.length % 2 === 1 ? this.items[0] : null;
      },
      remainingItems() {
        // Les éléments restants après le premier éventuel
        return this.firstItem ? this.items.slice(1) : this.items;
      },
      leftColumn() {
        // Moitié (arrondi à la valeur supérieure) pour la colonne de gauche
        const half = Math.ceil(this.remainingItems.length / 2);
        return this.remainingItems.slice(0, half);
      },
      rightColumn() {
        // Moitié (arrondi à la valeur supérieure) pour la colonne de droite
        const half = Math.ceil(this.remainingItems.length / 2);
        return this.remainingItems.slice(half);
      },
    },
  };
  </script>
  