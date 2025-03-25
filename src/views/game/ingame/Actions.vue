<template>
    <div v-if="isLeader">
        <!-- Actions du meneur de jour-->
        <div v-if="props.gameInfo.timeline[props.gameInfo.timelineIndex] === 'Vote'"
            class="flex flex-row my-[clamp(0px,3vw,15px)] gap-[clamp(0px,1vw,5px)]">
            <button v-wave class="rounded-lg active:scale-105" @click.stop="toggleCurrentState('forcevote')">
                <img :src="currentActive === 'forcevote' ? forcevoteOnSvg : forcevoteSvg"
                    class="h-[clamp(0px,6vw,30px)]">
            </button>

            <button v-wave class="rounded-lg active:scale-105">
                <img :src="resetSvg" class="h-[clamp(0px,6vw,30px)]">
            </button>
        </div>
        <div v-else-if="props.gameInfo.timeline[props.gameInfo.timelineIndex] === 'Maire'"
            class="flex flex-row my-[clamp(0px,3vw,15px)] gap-[clamp(0px,1vw,5px)]">
            <button v-wave class="rounded-lg active:scale-105" @click.stop="toggleCurrentState('forcemaire')">
                <img :src="currentActive === 'forcemaire' ? forcemaireOnSvg : forcemaireSvg"
                    class="h-[clamp(0px,6vw,30px)]">
            </button>

            <button v-wave class="rounded-lg active:scale-105">
                <img :src="resetSvg" class="h-[clamp(0px,6vw,30px)]">
            </button>
        </div>

        <!-- Actions du meneur de nuit -->
        <div v-else-if="props.gameInfo.timeline[props.gameInfo.timelineIndex] === 'Cupidon'"
            class="flex flex-row my-[clamp(0px,3vw,15px)] gap-[clamp(0px,1vw,5px)]">
            <button v-wave class="rounded-lg active:scale-105" @click.stop="toggleCurrentState('amoureux')">
                <img :src="currentActive === 'amoureux' ? amoureuxOnSvg : amoureuxSvg"
                    class="h-[clamp(0px,6vw,30px)]">
            </button>
        </div>

        <div v-else-if="props.gameInfo.timeline[props.gameInfo.timelineIndex] === 'Enfant sauvage'"
            class="flex flex-row my-[clamp(0px,3vw,15px)] gap-[clamp(0px,1vw,5px)]">
            <button v-wave class="rounded-lg active:scale-105" @click.stop="toggleCurrentState('model')">
                <img :src="currentActive === 'model' ? modelOnSvg : modelSvg"
                    class="h-[clamp(0px,6vw,30px)]">
            </button>
        </div>

        <div v-else-if="props.gameInfo.timeline[props.gameInfo.timelineIndex] === 'Voyante'"
            class="flex flex-row my-[clamp(0px,3vw,15px)] gap-[clamp(0px,1vw,5px)]">
            <button v-wave class="rounded-lg active:scale-105" @click.stop="toggleCurrentState('decouvrir')">
                <img :src="currentActive === 'decouvrir' ? decouvrirOnSvg : decouvrirSvg"
                    class="h-[clamp(0px,6vw,30px)]">
            </button>
        </div>

        <div v-else-if="props.gameInfo.timeline[props.gameInfo.timelineIndex] === 'Salvateur'"
            class="flex flex-row my-[clamp(0px,3vw,15px)] gap-[clamp(0px,1vw,5px)]">
            <button v-wave class="rounded-lg active:scale-105" @click.stop="toggleCurrentState('proteger')">
                <img :src="currentActive === 'proteger' ? protegerOnSvg : protegerSvg"
                    class="h-[clamp(0px,6vw,30px)]">
            </button>
        </div>

        <div v-else-if="props.gameInfo.timeline[props.gameInfo.timelineIndex] === 'Renard'"
            class="flex flex-row my-[clamp(0px,3vw,15px)] gap-[clamp(0px,1vw,5px)]">
            <button v-wave class="rounded-lg active:scale-105">
                <img :src="flaireSvg" class="h-[clamp(0px,6vw,30px)]">
            </button>
        </div>

        <div v-else-if="props.gameInfo.timeline[props.gameInfo.timelineIndex] === 'Pyromane'"
            class="flex flex-row my-[clamp(0px,3vw,15px)] gap-[clamp(0px,1vw,5px)]">
            <button v-wave class="rounded-lg active:scale-105" @click.stop="toggleCurrentState('proteger')">
                <img :src="currentActive === 'proteger' ? protegerOnSvg : protegerSvg"
                    class="h-[clamp(0px,6vw,30px)]">
            </button>
            <button v-wave class="rounded-lg active:scale-105">
                <img :src="brulerSvg" class="h-[clamp(0px,6vw,30px)]">
            </button>
        </div>
        
        <div v-else class="flex flex-row my-[clamp(0px,6vw,30px)]">
        </div>

    </div>
    <!-- Actions des joueurs-->
    <div v-else>
        <div v-if="props.gameInfo.timeline[props.gameInfo.timelineIndex] === 'Maire'"
            class="flex flex-row mt-[clamp(0px,3vw,15px)] mb-[clamp(0px,2vw,10px)] gap-[clamp(0px,3vw,15px)]">
            <button v-wave class="rounded-lg active:scale-105">
                <img src="../../../assets/actions/maire.svg" class="h-[clamp(0px,6vw,30px)]">
            </button>
        </div>
        
        <div v-else class="flex flex-row my-[clamp(0px,6vw,30px)]">
        </div>

    </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import forcevoteSvg from '../../../assets/actions/forcevote.svg'
import forcevoteOnSvg from '../../../assets/actions/forcevoteOn.svg'
import forcemaireSvg from '../../../assets/actions/forcemaire.svg'
import forcemaireOnSvg from '../../../assets/actions/forcemaireOn.svg'
import resetSvg from '../../../assets/actions/reset.svg'

import amoureuxSvg from '../../../assets/actions/amoureux.svg'
import amoureuxOnSvg from '../../../assets/actions/amoureuxOn.svg'

import modelSvg from '../../../assets/actions/model.svg'
import modelOnSvg from '../../../assets/actions/modelOn.svg'

import decouvrirSvg from '../../../assets/actions/decouvrir.svg'
import decouvrirOnSvg from '../../../assets/actions/decouvrirOn.svg'

import protegerSvg from '../../../assets/actions/proteger.svg'
import protegerOnSvg from '../../../assets/actions/protegerOn.svg'

import flaireSvg from '../../../assets/actions/flaire.svg'


const props = defineProps({
    gameInfo: {
        type: Object,
        required: true
    },
    isLeader: {
        type: Boolean,
        default: false
    }
});

const currentActive = ref('')

const toggleCurrentState = (action) => {
    currentActive.value = currentActive.value === action ? '' : action
}

const handleClickOutside = (event) => {
    currentActive.value = ''
}

onMounted(() => {
    document.addEventListener('click', handleClickOutside)
})

onUnmounted(() => {
    document.removeEventListener('click', handleClickOutside)
})
</script>