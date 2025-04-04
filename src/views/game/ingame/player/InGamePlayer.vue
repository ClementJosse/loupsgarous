<template>
  <DayNight :gameInfo="gameInfo" class="fixed z-20" />
  <PlayerListInGame :gameInfo='gameInfo' />
  <FlipCard class="fixed bottom-0 left-0 w-full z-30" v-if="props.gameInfo && props.uid" :uid="props.uid" :gameInfo="props.gameInfo"/>
  <div class="fixed bottom-0 left-0 w-full z-0">
    <div class="h-[clamp(0px,15vw,75px)] gradient"></div>
    <div class="h-[clamp(0px,5vw,25px)] bg-blue-background pointer-events-none select-none"></div>
    <div class="h-[clamp(0px,40vw,200px)] bg-dark-background pointer-events-none select-none"></div>
  </div>
</template>

<script setup>
import DayNight from '../DayNight.vue';
import FlipCard from './FlipCard.vue';
import PlayerListInGame from './PlayerListInGame.vue';

const props = defineProps({
  gameInfo: {
    type: Object
  },
  uid: {
    type: String
  }
});

</script>

<style scoped>
.gradient {
  background: linear-gradient(to top, #193143FF, #19314300);
  pointer-events: none;
  user-select: none;
}
</style>
