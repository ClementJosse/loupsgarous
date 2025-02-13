<template>
    <GameCodeInfo />
    <PlayerRoleSelectionList />
    <PlayerListLobby :gameInfo='gameInfo' />
</template>

<script setup>
import GameCodeInfo from '../GameCodeInfo.vue'
import PlayerListLobby from './PlayerListLobby.vue'
import PlayerRoleSelectionList from './PlayerRoleSelectionList.vue'

const props = defineProps({
    gameInfo: {
        type: Object
    },
});

</script>