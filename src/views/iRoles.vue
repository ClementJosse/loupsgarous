<template>
    <div class="relative">
        <div class="absolute left-1/2 flex flex-row justify-end w-[clamp(0px,47vw,235px)]">
            <button @click="toggleSidePanel"
                class="flex flex-start z-30 gap-[clamp(0px,1vw,5px)] mt-[clamp(0px,2vw,10px)] py-[clamp(0px,2vw,10px)] px-[clamp(0px,3vw,15px)] active:scale-105 rounded-xl">
                <img src="@/assets/i.svg" class="w-[clamp(0px,7vw,35px)]" />
                <h1 class="text-xl text-purple-important font-medium">
                    Rôles
                </h1>
            </button>
        </div>
        <transition name="slide">
            <div v-if="isSidePanelOpen" class="fixed inset-0 bg-dark-background z-40 flex flex-col">
                <div class="relative w-full">
                    <div
                        class="absolute left-1/2 flex flex-row justify-end w-[clamp(0px,47vw,235px)] mt-[clamp(0px,2vw,10px)]">
                        <button @click="toggleSidePanel"
                            class="flex flex-start z-50 gap-[clamp(0px,1vw,5px)] py-[clamp(0px,2vw,10px)] px-[clamp(0px,3vw,15px)] active:scale-105 rounded-xl">
                            <img src="@/assets/close.svg" class="w-[clamp(0px,7vw,35px)]" />
                            <h1 class="text-xl text-purple-important font-medium">
                                Fermer
                            </h1>
                        </button>
                    </div>
                    <div class="flex flex-col items-center mt-[clamp(0px,15vw,75px)]">
                        <h1 class="text-white w-full text-4xl mb-[clamp(0px,2vw,10px)] text-center">Liste des rôles</h1>
                        <div
                            class="z-10 h-[clamp(0px,0.5vw,2.5px)] px-[clamp(0px,20vw,100px)] mb-[clamp(0px,4vw,20px)] border-100 bg-disabled">
                        </div>
                        <div
                            class="no-scrollbar overflow-y-auto h-[90vh] pt-[clamp(0px,10vw,50px)] pb-[clamp(0px,40vw,200px)] w-[clamp(0px,90vw,450px)]">
                            <div v-for="role in roles" :key="role"
                                class="flex flex-row mb-[clamp(0px,10vw,50px)] gap-[clamp(0px,2.5vw,12.5px)]">
                                <div class="flex flex-col items-center w-[clamp(0px,30vw,150px)] flex-shrink-0">
                                    <img :src="getImagePath(role)" :alt="role" class="w-full" />
                                    <h4 class="text-white text-sm">Camps:</h4>
                                    <div class="flex flex-row">
                                        <template v-for="(camp, index) in cardsGameInfos[role].winsWith" :key="index">
                                            <div v-if="camp === 'village'" class="flex items-center">
                                                <img src="@/assets/camps/village.svg" class="h-[clamp(0px,5vw,25px)]" />
                                            </div>
                                            <div v-else-if="camp === 'loups'" class="flex items-center">
                                                <img src="@/assets/camps/loups.svg" class="h-[clamp(0px,5vw,25px)]" />
                                            </div>
                                            <div v-else-if="camp === 'seul'" class="flex items-center">
                                                <img src="@/assets/camps/seul.svg" class="h-[clamp(0px,5vw,25px)]" />
                                            </div>
                                            <span v-else>{{ camp }}</span>
                                            <span v-if="index < cardsGameInfos[role].winsWith.length - 1"
                                                class="text-white font-sm text-sm px-[clamp(0px,0.5vw,2.5px)]">/</span>
                                        </template>
                                    </div>
                                </div>
                                <div class="flex flex-col">
                                    <span :style="{ color: cardsGameInfos[role].color }" class="text-xl font-bold">{{
                                        role }}</span>
                                    <p class="text-white text-sm"
                                        v-html="formatDescription(cardsGameInfos[role].description)"></p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </transition>
    </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue';
import cardsGameInfos from '../cardsGameInfos.json';

const isSidePanelOpen = ref(false);
const roles = ref(Object.keys(cardsGameInfos));

const toggleSidePanel = () => {
    isSidePanelOpen.value = !isSidePanelOpen.value;

    if (isSidePanelOpen.value) {
        document.body.classList.add('overflow-hidden');
    } else {
        document.body.classList.remove('overflow-hidden');
    }
};

// Nettoyage au démontage du composant (utile si le composant est détruit pour éviter les effets persistants)
onUnmounted(() => {
    document.body.classList.remove('overflow-hidden');
});

const getImagePath = (roleName) => {
    return `/src/assets/roles/${roleName}.png`;
};


const formatDescription = (description) => {
    return description
        .replace(/\{\{camps\.village\}\}/g, `<img src="/src/assets/camps/village.svg" class="inline h-[clamp(0px,5vw,25px)]" />`)
        .replace(/\{\{camps\.loups\}\}/g, `<img src="/src/assets/camps/loups.svg" class="inline h-[clamp(0px,5vw,25px)]" />`)
        .replace(/\{\{camps\.seul\}\}/g, `<img src="/src/assets/camps/seul.svg" class="inline h-[clamp(0px,5vw,25px)]" />`)
        .replace(/\{\{actions\.model\}\}/g, `<img src="/src/assets/actions/model.svg" class="inline h-[clamp(0px,5vw,25px)]" />`)
        .replace(/\{\{actions\.tuer\}\}/g, `<img src="/src/assets/actions/tuer.svg" class="inline h-[clamp(0px,5vw,25px)]" />`)
        .replace(/\{\{actions\.amoureux\}\}/g, `<img src="/src/assets/actions/amoureux.svg" class="inline h-[clamp(0px,5vw,25px)]" />`)
        .replace(/\{\{actions\.huiler\}\}/g, `<img src="/src/assets/actions/huiler.svg" class="inline h-[clamp(0px,5vw,25px)]" />`)
        .replace(/\{\{actions\.bruler\}\}/g, `<img src="/src/assets/actions/bruler.svg" class="inline h-[clamp(0px,5vw,25px)]" />`)
        .replace(/\{\{actions\.proteger\}\}/g, `<img src="/src/assets/actions/proteger.svg" class="inline h-[clamp(0px,5vw,25px)]" />`)
        .replace(/\{\{actions\.sauver\}\}/g, `<img src="/src/assets/actions/sauver.svg" class="inline h-[clamp(0px,5vw,25px)]" />`)
        .replace(/\{\{actions\.voler\}\}/g, `<img src="/src/assets/actions/voler.svg" class="inline h-[clamp(0px,5vw,25px)]" />`)
        .replace(/\{\{actions\.decouvrir\}\}/g, `<img src="/src/assets/actions/decouvrir.svg" class="inline h-[clamp(0px,5vw,25px)]" />`)
        .replace(/\{\{actions\.infecter\}\}/g, `<img src="/src/assets/actions/infecter.svg" class="inline h-[clamp(0px,5vw,25px)]" />`);
};
</script>

<style scoped>
.slide-enter-active,
.slide-leave-active {
    transition: transform 0.3s ease;
}

.slide-enter-from,
.slide-leave-to {
    transform: translateX(100%);
}

.slide-enter-to,
.slide-leave-from {
    transform: translateX(0);
}

/* Hide scrollbar for Chrome, Safari and Opera */
.no-scrollbar::-webkit-scrollbar {
    display: none;
}

/* Hide scrollbar for IE, Edge and Firefox */
.no-scrollbar {
    -ms-overflow-style: none;
    scrollbar-width: none;
}
</style>
