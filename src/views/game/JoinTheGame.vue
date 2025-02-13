<template>
    <div class="flex flex-col h-screen items-center justify-center">
        <h1 class="text-2xl text-white font-light">Quel est ton prénom ?</h1>
        <input :value="username" @input="onInput" type="text" placeholder=". . ." class="m-[clamp(0px,6vw,30px)] p-[clamp(0px,4vw,20px)] bg-dark-background w-[clamp(0px,70vw,350px)] font-semibold text-3xl text-white rounded-xl" />
        <div v-if="username.length > 0">
            <button v-wave class="text-2xl text-purple-important font-medium active:scale-105 p-[clamp(0px,2vw,10px)] rounded-xl" @click="onJoinClick">
                Rejoindre la partie
            </button>
        </div>
        <div v-else>
            <h1 class="text-2xl text-disabled font-regular p-[clamp(0px,2vw,10px)]">Rejoindre la partie</h1>
        </div>
    </div>
</template>

<script setup>

// On définit ici les props et les events (émissions) acceptés par le composant
const props = defineProps({
    username: {
        type: String,
        default: ''
    }
})

const emits = defineEmits(['update:username', 'joinTheGame'])

// Méthode déclenchée lorsqu'on tape dans l'input
function onInput(event) {
    // On émet un événement pour informer le parent que la valeur de `username` a changé
    emits('update:username', event.target.value)
}

// Méthode déclenchée lorsque l'utilisateur clique sur "Rejoindre la partie"
function onJoinClick() {
    emits('joinTheGame')
}


</script>