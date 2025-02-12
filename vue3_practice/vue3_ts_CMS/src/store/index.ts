import { createPinia } from 'pinia'
import { useLoginStore } from './login'
import type { App } from 'vue'

const pinia = createPinia()

function registerStore(app: App) {
  app.use(pinia)
  const { loadLocalstoreAction } = useLoginStore()
  loadLocalstoreAction()
}

export default registerStore
