import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'

// createApp(App).use(router).use(store).mount('#app')

const app = createApp(App)

app.use(router)
app.use(store)

// Вызываем действие для загрузки меню сразу после подключения хранилища
store.dispatch('fetchMenuItems') // Это запустит Action fetchMenuItems

app.mount('#app')

