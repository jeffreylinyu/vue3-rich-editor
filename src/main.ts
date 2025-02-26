import { createApp } from 'vue'
import App from './App.vue'
import { Vue3RichEditor } from './index'

const app = createApp(App)

app.component('Vue3RichEditor', Vue3RichEditor)

app.mount('#app')
