<template>

  <div class="flex flex-row gap-[clamp(0px,3vw,15px)] pt-[clamp(0px,20vw,100px)]">
    <img src="@/assets/logo.svg" class="w-[clamp(0px,35vw,175px)]" />
    <div class="flex flex-col justify-center">
      <h1 class="text-5xl font-jockey text-white">
        Loups-garous
      </h1>
      <h1 class="text-4xl font-jockey text-purple-important">
        sans cartes
      </h1>
    </div>
  </div>

  <p class="text-base font-light text-white mt-[clamp(0px,2vw,10px)]">
    Jouez ensemble, partout, sans le jeu de carte.
  </p>

  <button v-wave type="button" @click="createGame()"
    class="active:scale-105 text-2xl text-blue-background font-semibold bg-purple-important py-[clamp(0px,1.5vw,7.5px)] px-[clamp(0px,20vw,100px)] rounded-full mt-[clamp(0px,30vw,150px)]">
    Créer une partie
  </button>

  <div v-if="lobbyGames.length > 0">
    <p class="flex justify-center text-base font-light text-white mt-[clamp(0px,20vw,100px)] mb-[clamp(0px,2vw,10px)]">
      Rejoindre une partie :
    </p>
    <ul class="flex flex-col justify-center justify-items-center">
      <button v-wave type="button" @click="joinGame(game.code)"
        class="active:scale-105 bg-dark-background justify-center justify-items-center mb-[clamp(0px,3vw,15px)] py-[clamp(0px,1vw,5px)] w-[clamp(0px,84vw,420px)] rounded-xl"
        v-for="(game, index) in lobbyGames" :key="index">
        <div class="text-purple-important text-base font-light">#{{ game.code }}</div>
        <div class="text-white text-lg font-light">{{ game.playersCount }} Joueurs</div>
        <div class="flex flex-row text-white text-lg font-light gap-1">
          Meneur :
          <div class="text-purple-important font-normal">
            {{ game.uid_to_username?.[game.leader] || 'Chargement...' }}
          </div>
        </div>
      </button>
    </ul>
  </div>

</template>

<script setup>
import { ref, onMounted } from 'vue'
import router from '../router'
import { getDatabase, ref as dbRef, onValue, set, get, child } from 'firebase/database'
import { getAuth, signInAnonymously } from 'firebase/auth'

const lobbyGames = ref([])
const database = getDatabase()
const partiesRef = dbRef(database, '/') // Racine ou noeud "parties", selon ta structure
const auth = getAuth()
let UID = null

// Authentification anonyme
signInAnonymously(auth)
  .then(() => {
    UID = auth.currentUser.uid
    console.log("Authentification anonyme :", UID)
  })
  .catch((error) => {
    console.error("Erreur d'auth :", error.code, error.message)
  })

onMounted(() => {

  // Écoute toutes les parties
  onValue(partiesRef, (snapshot) => {
    const data = snapshot.val() || {}
    const filteredGames = []

    // On parcourt chaque clé (ex: "140125", "157648", etc.)
    for (let code in data) {
      const party = data[code]

      // On ne garde que les parties dont le status == "lobby"
      if (party.status === 'lobby') {
        // On détermine le nombre de joueurs
        const playersCount = party.playerList
          ? party.playerList.length
          : 0

        filteredGames.push({
          code,                // code de la partie (ex: 140125)
          leader: party.leader, // meneur
          playersCount,         // nombre de joueurs
          uid_to_username: party.uid_to_username
        })
      }
    }

    lobbyGames.value = filteredGames
  })
})

function joinGame(gameCode) {
  setTimeout(function () {
    router.push(gameCode);
  }, 200);
}

function generateCode() {
  return Math.floor(Math.random() * 1000000).toString().padStart(6, '0');
}

function createGame() {
  setTimeout(function () {

    const code = generateCode();
    const gameRef = child(partiesRef, code);

    try {
      const snapshot = get(gameRef);
      if (snapshot != undefined) {
        console.log("Création d'une partie unique avec le code :", code);

        // Définir les données initiales de la partie
        set(gameRef, {
          status: 'creating',
          leader: UID,
          playerList: ['clemclem', 'auroro', 'longchan', 'lucaca', 'hadrikun', 'aslansama', 'maxmed'],
          uid_to_username: { 'clemclem': '0Clément', 'auroro': '1Aurora', 'longchan': '2Long', 'lucaca': '3Luca', 'hadrikun': '4Hadrien', 'aslansama': '5Aslan', 'maxmed': '6Mahamud' },
          cards: { 'Villageois': 1, 'Loup': 2, 'Sorcière': 1, 'Voyante': 1, 'Chasseur': 1, 'Cupidon': 0, 'Petite fille': 0, 'Voleur': 0, 'Salvateur': 0, 'Loup blanc': 0, "Montreur d'ours": 0, 'Ange': 0, 'Pyromane': 0, 'Enfant sauvage': 0, 'Infect père des loups': 0, 'Renard': 0 }
        });

        // Rediriger vers la nouvelle partie
        router.push(`/${code}`);
      } else {
        console.warn("Le code de partie existe déjà :", code);
        // Relancer la création avec un nouvel essai
        createGame();
      }
    } catch (error) {
      console.error('Erreur lors de la création de la partie:', error);
    }
  }, 200);
}

</script>
