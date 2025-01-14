<template>
  <div class=" bg-dark-background h-screen">
    <Home></Home>
  </div>
</template>

<script setup>
 import Home from './views/Home.vue';
 import { getAuth, signInAnonymously } from "firebase/auth";

const auth = getAuth();
signInAnonymously(auth)
  .then(() => {
    console.log("authentification anonyme")
  })
  .catch((error) => {
    const errorCode = error.code;
    const errorMessage = error.message;
    // ...
  });



</script>