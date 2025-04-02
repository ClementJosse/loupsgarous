<template>
    <!-- Actions du meneur de jour-->
    <div v-if="props.gameInfo.timeline[props.gameInfo.timelineIndex] === 'Vote'"
        class="flex flex-row my-[clamp(0px,3vw,15px)] gap-[clamp(0px,1vw,5px)]">
        <button v-wave class="rounded-lg active:scale-105" @click.stop="currentActiveState.setState('tuer')">
            <img :src="currentActiveState.state === 'tuer' ? tuerOnSvg : tuerSvg" class="h-[clamp(0px,6vw,30px)]">
        </button>
    </div>
    <div v-else-if="props.gameInfo.timeline[props.gameInfo.timelineIndex] === 'Maire'"
        class="flex flex-row my-[clamp(0px,3vw,15px)] gap-[clamp(0px,1vw,5px)]">
        <button v-wave class="rounded-lg active:scale-105" @click.stop="currentActiveState.setState('forcemaire')">
            <img :src="currentActiveState.state === 'forcemaire' ? forcemaireOnSvg : forcemaireSvg"
                class="h-[clamp(0px,6vw,30px)]">
        </button>
    </div>

    <!-- Actions du meneur de nuit -->
    <div v-else-if="props.gameInfo.timeline[props.gameInfo.timelineIndex] === 'Cupidon'"
        class="flex flex-row my-[clamp(0px,3vw,15px)] gap-[clamp(0px,1vw,5px)]">
        <button v-wave class="rounded-lg active:scale-105" @click.stop="currentActiveState.setState('amoureux')">
            <img :src="currentActiveState.state === 'amoureux' ? amoureuxOnSvg : amoureuxSvg"
                class="h-[clamp(0px,6vw,30px)]">
        </button>
    </div>

    <div v-else-if="props.gameInfo.timeline[props.gameInfo.timelineIndex] === 'Enfant sauvage'"
        class="flex flex-row my-[clamp(0px,3vw,15px)] gap-[clamp(0px,1vw,5px)]">
        <button v-wave class="rounded-lg active:scale-105" @click.stop="currentActiveState.setState('model')">
            <img :src="currentActiveState.state === 'model' ? modelOnSvg : modelSvg" class="h-[clamp(0px,6vw,30px)]">
        </button>
    </div>

    <div v-else-if="props.gameInfo.timeline[props.gameInfo.timelineIndex] === 'Voyante'"
        class="flex flex-row my-[clamp(0px,3vw,15px)] gap-[clamp(0px,1vw,5px)]">
        <button v-wave class="rounded-lg active:scale-105" @click.stop="currentActiveState.setState('decouvrir')">
            <img :src="currentActiveState.state === 'decouvrir' ? decouvrirOnSvg : decouvrirSvg"
                class="h-[clamp(0px,6vw,30px)]">
        </button>
    </div>

    <div v-else-if="props.gameInfo.timeline[props.gameInfo.timelineIndex] === 'Salvateur'"
        class="flex flex-row my-[clamp(0px,3vw,15px)] gap-[clamp(0px,1vw,5px)]">
        <button v-wave class="rounded-lg active:scale-105" @click.stop="currentActiveState.setState('proteger')">
            <img :src="currentActiveState.state === 'proteger' ? protegerOnSvg : protegerSvg"
                class="h-[clamp(0px,6vw,30px)]">
        </button>
    </div>

    <div v-else-if="props.gameInfo.timeline[props.gameInfo.timelineIndex] === 'Renard'"
        class="flex flex-row my-[clamp(0px,3vw,15px)] gap-[clamp(0px,1vw,5px)]">
        <button v-if="props.gameInfo.canFoxSnif" v-wave class="rounded-lg active:scale-105">
            <img :src="flaireSvg" class="h-[clamp(0px,6vw,30px)]" @click="flaire()">
        </button>
        <button v-else class="rounded-lg">
            <img :src="flaireOffSvg" class="h-[clamp(0px,6vw,30px)]">
        </button>
    </div>

    <div v-else-if="props.gameInfo.timeline[props.gameInfo.timelineIndex] === 'Loup'"
        class="flex flex-row my-[clamp(0px,3vw,15px)] gap-[clamp(0px,1vw,5px)]">
        <button v-wave class="rounded-lg active:scale-105" @click.stop="currentActiveState.setState('tuer')">
            <img :src="currentActiveState.state === 'tuer' ? tuerOnSvg : tuerSvg" class="h-[clamp(0px,6vw,30px)]">
        </button>
    </div>

    <div v-else-if="props.gameInfo.timeline[props.gameInfo.timelineIndex] === 'Infect père des loups'"
        class="flex flex-row my-[clamp(0px,3vw,15px)] gap-[clamp(0px,1vw,5px)]">
        <button v-wave class="rounded-lg active:scale-105" @click="infecter()">
            <img :src="infecterSvg" class="h-[clamp(0px,6vw,30px)]">
        </button>
    </div>

    <div v-else-if="props.gameInfo.timeline[props.gameInfo.timelineIndex] === 'Sorcière'"
        class="flex flex-row my-[clamp(0px,3vw,15px)] gap-[clamp(0px,1vw,5px)]">
        <button v-if="props.gameInfo.hasLifePotion" v-wave class="rounded-lg active:scale-105"
            @click.stop="currentActiveState.setState('sauver')">
            <img :src="currentActiveState.state === 'sauver' ? sauverOnSvg : sauverSvg" class="h-[clamp(0px,6vw,30px)]">
        </button>
        <button v-else class="rounded-lg">
            <img :src="sauverOffSvg" class="h-[clamp(0px,6vw,30px)]">
        </button>

        <button v-if="props.gameInfo.hasDeathPotion" v-wave class="rounded-lg active:scale-105"
            @click.stop="currentActiveState.setState('tuer')">
            <img :src="currentActiveState.state === 'tuer' ? tuerOnSvg : tuerSvg" class="h-[clamp(0px,6vw,30px)]">
        </button>
        <button v-else class="rounded-lg">
            <img :src="tuerOffSvg" class="h-[clamp(0px,6vw,30px)]">
        </button>
    </div>

    <div v-else-if="props.gameInfo.timeline[props.gameInfo.timelineIndex] === 'Loup blanc'"
        class="flex flex-row my-[clamp(0px,3vw,15px)] gap-[clamp(0px,1vw,5px)]">
        <button v-wave class="rounded-lg active:scale-105" @click.stop="currentActiveState.setState('tuer')">
            <img :src="currentActiveState.state === 'tuer' ? tuerOnSvg : tuerSvg" class="h-[clamp(0px,6vw,30px)]">
        </button>
    </div>

    <div v-else-if="props.gameInfo.timeline[props.gameInfo.timelineIndex] === 'Pyromane'"
        class="flex flex-row my-[clamp(0px,3vw,15px)] gap-[clamp(0px,1vw,5px)]">
        <button v-wave class="rounded-lg active:scale-105" @click.stop="currentActiveState.setState('huiler')">
            <img :src="currentActiveState.state === 'huiler' ? huilerOnSvg : huilerSvg" class="h-[clamp(0px,6vw,30px)]">
        </button>
        <button v-wave class="rounded-lg active:scale-105">
            <img :src="brulerSvg" class="h-[clamp(0px,6vw,30px)]" @click.stop="bruler()">
        </button>
    </div>

    <div v-else-if="props.gameInfo.timeline[props.gameInfo.timelineIndex] === 'Voleur'"
        class="flex flex-row my-[clamp(0px,3vw,15px)] gap-[clamp(0px,1vw,5px)]">
        <button v-wave class="rounded-lg active:scale-105" @click.stop="currentActiveState.setState('voler')">
            <img :src="currentActiveState.state === 'voler' ? volerOnSvg : volerSvg" class="h-[clamp(0px,6vw,30px)]">
        </button>
    </div>

    <div v-else class="flex flex-row my-[clamp(0px,6vw,30px)]">
    </div>

</template>

<script setup>
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
import flaireOffSvg from '../../../assets/actions/flaireOff.svg'

import huilerSvg from '../../../assets/actions/huiler.svg'
import huilerOnSvg from '../../../assets/actions/huilerOn.svg'
import brulerSvg from '../../../assets/actions/bruler.svg'

import tuerSvg from '../../../assets/actions/tuer.svg'
import tuerOnSvg from '../../../assets/actions/tuerOn.svg'
import tuerOffSvg from '../../../assets/actions/tuerOff.svg'

import infecterSvg from '../../../assets/actions/infecter.svg'

import sauverSvg from '../../../assets/actions/sauver.svg'
import sauverOnSvg from '../../../assets/actions/sauverOn.svg'
import sauverOffSvg from '../../../assets/actions/sauverOff.svg'

import volerSvg from '../../../assets/actions/voler.svg'
import volerOnSvg from '../../../assets/actions/volerOn.svg'

import { currentActiveState } from './currentActiveState.js'

import { ref, onMounted, onUnmounted } from 'vue'
import { getDatabase, ref as dbRef, onValue, update, set } from 'firebase/database';
import { useRoute } from 'vue-router';

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

const route = useRoute();
const gameId = route.params.gameId;
const gameInfo = ref(null);
const database = getDatabase();
const partiesRef = dbRef(database, `/${gameId}`);

const infecter = () => {
    const dyingPlayerKey = Object.keys(props.gameInfo.playerStatus)
        .find(key => props.gameInfo.playerStatus[key] === 'dying');

    if (dyingPlayerKey) {
        // Update the status to 'alive'
        props.gameInfo.playerStatus[dyingPlayerKey] = 'alive';

        // Set hasInfected to the dying player's key
        props.gameInfo.hasInfected = dyingPlayerKey;

        // Update Firebase references
        update(partiesRef, {
            playerStatus: { [dyingPlayerKey]: 'alive' },
            hasInfected: dyingPlayerKey
        });
    } else {
        console.log('No dying player found');
    }
}

const bruler = () => {
    Object.keys(props.gameInfo.isOiled).forEach(key => {
        console.log(key)
        if(props.gameInfo.playerStatus[props.gameInfo.isOiled[key]] === 'alive'){
            props.gameInfo.playerStatus[props.gameInfo.isOiled[key]] = 'dying'
            update(partiesRef, {playerStatus: props.gameInfo.playerStatus});
        }
    });
    update(partiesRef, {isOiled: '', hasUsedLighter : true});
}

const flaire = () => {
    props.gameInfo.canFoxSnif = false
    update(partiesRef, {canFoxSnif : false})
}

const handleClickOutside = (event) => {
    currentActiveState.resetState()
}

onMounted(() => {
    document.addEventListener('click', handleClickOutside)
    return { currentActiveState }
})

onUnmounted(() => {
    document.removeEventListener('click', handleClickOutside)
})
</script>