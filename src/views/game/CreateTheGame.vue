<template>
    <div class="flex flex-col h-screen items-center justify-center">
        <h1 class="text-2xl text-white font-light">Quel est ton prénom ?</h1>
        <input ref="usernameInput" :value="username" @input="onInput"
            @keyup.enter="username.length > 0 && onCreateClick()" type="text" placeholder=". . ."
            class="m-[clamp(0px,6vw,30px)] p-[clamp(0px,4vw,20px)] bg-dark-background w-[clamp(0px,70vw,350px)] font-semibold text-3xl text-white rounded-xl" />
        <div v-if="username.length > 0">
            <button v-wave
                class="text-2xl text-purple-important font-medium active:scale-105 p-[clamp(0px,2vw,10px)] rounded-xl"
                @click="onCreateClick">
                Créer la partie
            </button>
        </div>
        <div v-else>
            <h1 class="text-2xl text-disabled font-regular p-[clamp(0px,2vw,10px)]">Créer la partie</h1>
        </div>
    </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'

// On définit ici les props et les events (émissions) acceptés par le composant
const props = defineProps({
    username: {
        type: String,
        default: ''
    }
})

const emits = defineEmits(['update:username', 'createTheGame'])

// Référence pour l'input
const usernameInput = ref(null)

// Focus sur l'input au chargement du composant
onMounted(() => {
    usernameInput.value.focus()
})

// Méthode déclenchée lorsqu'on tape dans l'input
function onInput(event) {
    // On émet un événement pour informer le parent que la valeur de `username` a changé
    emits('update:username', event.target.value)
}

// Méthode déclenchée lorsque l'utilisateur clique sur "Créer la partie"
function onCreateClick() {
    emits('createTheGame')
}
</script>