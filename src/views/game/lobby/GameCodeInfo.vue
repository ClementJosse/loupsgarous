<template>
    <div
        class="flex flex-col items-center bg-dark-background w-full pb-[clamp(0px,6vw,30px)] pt-[clamp(0px,16vw,80px)]">
        <div class="flex flex-col items-center">
            <h3 class="text-white text-base font-light">Code de la partie</h3>
            <h2 class="text-purple-important text-2xl font-medium">#{{ gameId }}</h2>
        </div>
        <QRCode class="pt-[clamp(0px,1vw,5px)]" :value="'lg.cjosse.com/' + gameId"></QRCode>
        <button v-wave @click="copyToClipboard"
            class="flex flex-row bg-blue-background items-center gap-[clamp(0px,2vw,10px)] p-[clamp(0px,2vw,10px)] rounded-xl active:scale-105 m-[clamp(0px,4vw,20px)]">
            <img src="@/assets/copy.svg" class="w-[clamp(0px,6vw,30px)]" />
            <h1 class="text-purple-important font-medium text-base">
                Copier le lien de la partie
            </h1>
        </button>
        <h3 class="text-white text-sm font-light ">Partage le QR code pour inviter tes amis dans la partie</h3>
    </div>
</template>

<script setup>
import { computed } from 'vue'
import QRCode from './QRCode.vue'
import { Clipboard } from "v-clipboard"
import { useRoute } from 'vue-router'

const route = useRoute()
const gameId = route.params.gameId
const gameLink = computed(() => `lg.cjosse.com/${gameId}`)

function copyToClipboard() {
    setTimeout(function () {
        Clipboard.copy(gameLink.value)
    }, 200);
}
</script>