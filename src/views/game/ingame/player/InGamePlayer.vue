<template>
  <DayNight info="day" class="fixed" />
  <!-- Afficher FlipCard uniquement si playerCards et UID sont disponibles -->
  <FlipCard class="fixed bottom-0 left-0 w-full z-30" v-if="playerCards && UID" :imgname="playerCards[UID]" />
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
const playerCards = ref({}); // Initialiser comme un objet vide
const auth = getAuth();
const UID = ref(null); // Utiliser une référence réactive pour UID

const initialize = async () => {
  try {
    // Authentification anonyme
    await signInAnonymously(auth);

    // Définir UID après l'authentification
    UID.value = auth.currentUser.uid;

    // Écouter les changements sur playerCards dans Firebase
    const playerCardsRef = dbRef(database, `/${gameId}/playerCards`);
    onValue(playerCardsRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        playerCards.value = data; // Mettre à jour playerCards
        console.log('PlayerCards mis à jour :', playerCards.value);
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