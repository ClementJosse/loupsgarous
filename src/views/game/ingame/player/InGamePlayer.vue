<template>
    <DayNight info="day" />
    <!-- Vérifier si playerCards.value est défini avant d'accéder à UID -->
    <FlipCard v-if="playerCards && playerCards.value && UID" :imgname="playerCards.value[UID]" />
    <div v-else>Chargement des cartes...</div>
  </template>
  
  <script setup>
  import DayNight from '../DayNight.vue';
  import FlipCard from '../FlipCard.vue';
  import { useRoute } from 'vue-router';
  import { ref, onMounted } from 'vue';
  import { getDatabase, ref as dbRef, onValue } from 'firebase/database';
  import { getAuth, signInAnonymously } from 'firebase/auth';
  
  const route = useRoute();
  const gameId = route.params.gameId;
  const database = getDatabase();
  const partiesRef = dbRef(database, `/${gameId}`);
  const gameInfo = ref(null);
  const playerCards = ref(null);
  const auth = getAuth();
  let UID = null;
  
  const initialize = async () => {
    try {
      // Authentification anonyme
      await signInAnonymously(auth);
  
      // Écoute des changements sur la partie dans Firebase
      onValue(partiesRef, (snapshot) => {
        const data = snapshot.val();
        if (data) {
          gameInfo.value = data;
          playerCards.value = data.playerCards;
          UID = auth.currentUser.uid; // Définir UID après l'authentification
        }
      });
    } catch (error) {
      console.error('Erreur d\'auth :', error.code, error.message);
    }
  };
  
  onMounted(() => {
    initialize();
  });
  </script>