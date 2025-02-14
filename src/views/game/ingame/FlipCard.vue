<template>
    <!-- Conteneur parent qui gère les événements -->
    <div 
      class="flex flex-col items-center"
      @mousedown="startFlip"
      @mouseup="endFlip"
      @mouseleave="endFlip"
      @touchstart="startFlip"
      @touchend="endFlip"
    >
      <!-- Carte -->
      <div 
        class="w-[300px] h-[300px] cursor-pointer select-none"
        style="perspective: 1000px"
      >
        <div 
          class="w-full h-full transition-transform duration-300"
          :style="isFlipped ? 'transform: rotateY(180deg)' : ''"
          style="transform-style: preserve-3d"
        >
          <div class="absolute w-full h-full" style="backface-visibility: hidden">
            <img 
              src="../../../assets/roles/Back.png" 
              class="w-full h-full object-cover"
            >
          </div>
          <div class="absolute w-full h-full" style="transform: rotateY(180deg); backface-visibility: hidden">
            <img 
              src="../../../assets/roles/Ange.png" 
              class="w-full h-full object-cover"
            >
          </div>
        </div>
      </div>
  
      <!-- Zone de contrôle en dessous de la carte -->
      <div class="flex w-[75px] h-[75px] justify-center bg-dark-background">
        <!-- Affiche l'icône visible ou notvisible en fonction de l'état -->
        <img 
          v-if="isFlipped"
          src="../../../assets/visible.svg" 
          class="w-10"
        >
        <img 
          v-else
          src="../../../assets/notvisible.svg" 
          class="w-10"
        >
      </div>
    </div>
  </template>
  
  <script>
  export default {
    data() {
      return {
        isFlipped: false // Gère l'état de la carte (flippée ou non)
      }
    },
    methods: {
      startFlip() {
        this.isFlipped = true; // Active le flip et affiche l'icône visible
      },
      endFlip() {
        this.isFlipped = false; // Désactive le flip et affiche l'icône notvisible
      }
    }
  }
  </script>