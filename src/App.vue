<template>
  <div class=" bg-blue-background h-screen justify-items-center">
    <iRoles></iRoles>
    <Home></Home>
  </div>
</template>

<script setup>
 import Home from './views/Home.vue';
 import iRoles from './views/iRoles.vue';
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