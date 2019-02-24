import Vue from 'vue'
import DecryptChunk from '../encryption/vue-chunk-decryption-plugin'
import privateKey from '../encryption/decryption-key.asc'

Vue.use(DecryptChunk, { privateKey })

import App from './App.vue'
import router from './router'
import './registerServiceWorker'

Vue.config.productionTip = false
Vue.config.devtools = true

new Vue({
  router,
  render: h => h(App),
}).$mount('#app')
