<template>
    <GameCodeInfo />
    <LeaderRoleSelectionList />
    <LeaderListLobby v-if="gameInfo" />
    <button v-wave v-if="playerCount === totalCardsValue"
        class="text-green-save active:scale-105 text-2xl mb-[clamp(0px,11vw,60px)] p-[clamp(0px,2vw,10px)] rounded-xl"
        @click="startGame">
        Commencer la partie
    </button>
    <button v-else class="text-disabled text-2xl mb-[clamp(0px,11vw,60px)] p-[clamp(0px,2vw,10px)] rounded-xl" disabled>
        Commencer la partie
    </button>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import GameCodeInfo from '../GameCodeInfo.vue';
import LeaderListLobby from './LeaderListLobby.vue';
import { getDatabase, ref as dbRef, onValue, update } from 'firebase/database';
import { useRoute } from 'vue-router';
import LeaderRoleSelectionList from './LeaderRoleSelectionList.vue';

const route = useRoute();
const gameId = route.params.gameId;
const gameInfo = ref(null);
const database = getDatabase();
const partiesRef = dbRef(database, `/${gameId}`);

const cards = ref([]);
const playerList = ref([]);

const playerCards = ref({})
const playerStatus = ref({})
const playerAction = ref({})

const playerCount = computed(() => playerList.value.length);
const totalCardsValue = computed(() =>
    cards.value.reduce((sum, card) => sum + card.value, 0)
);

const initialize = async () => {
    try {
        // Écoute des changements sur la partie dans Firebase
        onValue(partiesRef, (snapshot) => {
            const data = snapshot.val();

            if (data) {
                gameInfo.value = data;
                playerList.value = data.playerList || [];
                // Mise à jour des cartes
                const cardsData = data.cards || {};
                cards.value = Object.entries(cardsData).map(([name, value]) => ({
                    name,
                    value,
                }));
            }
        });
    } catch (error) {
        console.error('Erreur d\'auth :', error.code, error.message);
    }
};


const distributeCards = () => {
    // Réinitialiser playerCards
    playerCards.value = {};

    // Créer une liste plate de toutes les cartes disponibles
    const allCards = [];
    for (const [name, value] of Object.entries(cards.value)) {
        for (let i = 0; i < value.value; i++) {
            allCards.push(value.name);
        }
    }
    // Mélanger les cartes de manière aléatoire
    allCards.sort(() => Math.random() - 0.5);

    // Distribuer les cartes aux joueurs
    playerList.value.forEach((player, index) => {
        if (allCards[index]) {
            if (!playerCards.value[player]) {
                playerCards.value[player] = [];
            }
            playerCards.value[player] = allCards[index];
        }
    });
};

const setAllPlayersAlive = () => {
    playerStatus.value = {};
    playerList.value.forEach((player, index) => {
        if (!playerStatus.value[player]) {
            playerStatus.value[player] = [];
        }
        playerStatus.value[player] = 'alive';
    });
}


const createPlayerAction = () => {
    playerAction.value = {};
    playerList.value.forEach((player, index) => {
        playerAction.value[player] = '';
    });
    playerAction.value[gameInfo.leader] = '';
}

const startGame = () => {
    setTimeout(function () {
        distributeCards()
        setAllPlayersAlive()
        createPlayerAction()
        update(partiesRef, { status: "ingame" })
        update(partiesRef, { playerCards: playerCards.value })
        update(partiesRef, { playerStatus: playerStatus.value })
        update(partiesRef, { playerAction: playerAction.value })
        update(partiesRef, { time: 'Jour' })
        update(partiesRef, { dayNightNumberIndex: 1 })
        update(partiesRef, { timelineIndex: 0 })
        update(partiesRef, { timeline: ['Distribution initiale'] })
        update(partiesRef, { mayor: false })
        addCardsVariables()
        console.log('La partie commence !');
    }, 200);
}

const addCardsVariables = () => {
    if (Object.values(playerCards.value).includes('Cupidon')) {
        console.log('cupid')
        update(partiesRef, { isInLove: '' })
    }
    if (Object.values(playerCards.value).includes('Enfant sauvage')) {
        update(partiesRef, { model: false })
    }
    if (Object.values(playerCards.value).includes('Salvateur')) {
        update(partiesRef, { previousProtected: false })
    }
    if (Object.values(playerCards.value).includes('Renard')) {
        update(partiesRef, { canFoxSnif: true })
    }
    if (Object.values(playerCards.value).includes('Pyromane')) {
        update(partiesRef, { isOiled: false })
        update(partiesRef, { hasUsedLighter: false })
    }
    if (Object.values(playerCards.value).includes('Infect père des loups')) {
        update(partiesRef, { hasInfected: false })
    }
    if (Object.values(playerCards.value).includes('Sorcière')) {
        update(partiesRef, { hasLifePotion: true })
        update(partiesRef, { hasDeathPotion: true })
    }
}

onMounted(() => {
    initialize();
});
</script>