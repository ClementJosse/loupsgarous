import { createApp } from 'vue'
import App from './App.vue'
import './assets/style.css'
import firebaseConfig from './firebaseConfig'
import { initializeApp } from "firebase/app";

initializeApp(firebaseConfig);

const app = createApp(App)
app.mount('#app')

