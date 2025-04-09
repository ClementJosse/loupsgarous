<template>
    <!-- Conteneur de la carte -->
    <div class="flipcard-container">
      <!-- Carte en rotation -->
      <div class="flipcard">
        <div class="flipcard-inner">
          <!-- Dos de la carte -->
          <div class="flipcard-front">
            <img :src="backImageUrl" class="w-full h-full object-cover" />
          </div>
          <!-- Face de la carte (rôle aléatoire) -->
          <div class="flipcard-back">
            <img :src="randomRoleImageUrl" class="w-full h-full object-cover" />
          </div>
        </div>
      </div>
    </div>
  </template>
  
  <script setup>
  import { ref, onMounted, onUnmounted } from 'vue';
  
  // Liste des rôles disponibles
  const roles = [
    'Villageois',
    'Loup',
    'Sorcière',
    'Voyante',
    'Chasseur',
    'Cupidon',
    'Petite fille',
    'Voleur',
    'Salvateur',
    'Loup blanc',
    'Montreur d\'ours',
  ];
  
  // URL du dos de la carte
  const backImageUrl = new URL('../../assets/roles/Back.png', import.meta.url).href;
  
  // URL de l'image du rôle aléatoire
  const randomRoleImageUrl = ref('');
  
  // Fonction pour choisir un rôle aléatoire
  const getRandomRoleImageUrl = () => {
    const randomIndex = Math.floor(Math.random() * roles.length);
    const role = roles[randomIndex];
    return new URL(`../../assets/roles/${role}.png`, import.meta.url).href;
  };
  
  // Mettre à jour l'URL de l'image du rôle aléatoire
  const updateRandomRole = () => {
    randomRoleImageUrl.value = getRandomRoleImageUrl();
  };
  
  // Intervalle pour changer le rôle aléatoire
  let intervalId;
  
  // Démarrer l'animation au montage du composant
  onMounted(() => {
    updateRandomRole(); // Initialiser la première image
    intervalId = setInterval(updateRandomRole, 400); // Changer de rôle toutes les 2 secondes
  });
  
  // Nettoyer l'intervalle à la destruction du composant
  onUnmounted(() => {
    clearInterval(intervalId);
  });
  </script>
  
  <style scoped>
  /* Conteneur de la carte */
  .flipcard-container {
    display: flex;
    justify-content: center;
    align-items: center;
    perspective: 1000px; /* Perspective pour l'effet 3D */
  }
  
  /* Carte */
  .flipcard {
    width: clamp(0px,20vw,100px);
    height: clamp(0px,20vw,100px);
    position: relative;
    transform-style: preserve-3d;
    animation: rotate 0.4s infinite linear; /* Animation de rotation */
  }
  
  /* Conteneur interne de la carte */
  .flipcard-inner {
    width: 100%;
    height: 100%;
    position: relative;
    transform-style: preserve-3d;
  }
  
  /* Face avant et arrière de la carte */
  .flipcard-front,
  .flipcard-back {
    width: 100%;
    height: 100%;
    position: absolute;
    backface-visibility: hidden; /* Masquer l'arrière de la carte */
  }
  
  /* Face avant (dos de la carte) */
  .flipcard-front {
    transform: rotateY(0deg);
  }
  
  /* Face arrière (rôle aléatoire) */
  .flipcard-back {
    transform: rotateY(180deg);
  }
  
  /* Animation de rotation */
  @keyframes rotate {
    0% {
      transform: rotateY(0deg);
    }
    50% {
      transform: rotateY(180deg);
    }
    100% {
      transform: rotateY(360deg);
    }
  }
  </style>