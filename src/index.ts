import type { App } from 'vue'
import Vue3RichEditor from './Vue3RichEditor.vue'

export default {
  install(app: App) {
    app.component('Vue3RichEditor', Vue3RichEditor)
  },
}

export { Vue3RichEditor }
