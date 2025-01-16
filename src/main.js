import { createApp } from 'vue'
import App from './App.vue'
import './assets/style.css'
import firebaseConfig from './firebaseConfig'
import { initializeApp } from "firebase/app";
import VWave from 'v-wave'

initializeApp(firebaseConfig);

const app = createApp(App)
app.use(VWave, {
    color: '#61646B',
    initialOpacity: 1,
    easing: 'ease-out'
  })

app.mount('#app')

