import { createApp } from 'vue'
import App from './App.vue'
 

import Keycloak from 'keycloak-js'
import { vueKeycloak } from '@baloise/vue-keycloak'

const app = createApp(App).mount('#app')

// Vue.config.productionTip = false



app.use(vueKeycloak, {
    initOptions: {
      flow: 'standard', // default
      checkLoginIframe: false, // default
      onLoad: 'login-required', // default
    },
    config: {
      url: 'http://112.74.110.95:8080/auth',
      realm: 'demo',
      clientId: 'vue-demo',
    }
})



keycloak.init({ onLoad: initOptions.onLoad, promiseType: 'native' }).then((authenticated) =>{
    if(!authenticated) {
      window.location.reload();
    } else {
        app.prototype.$keycloak = keycloak
      console.log('Authenticated')
    }
    
    setInterval(() =>{
      keycloak.updateToken(70).then((refreshed)=>{
        if (refreshed) {
          console.log('Token refreshed');
        } else {
          console.log('Token not refreshed, valid for '
              + Math.round(keycloak.tokenParsed.exp + keycloak.timeSkew - new Date().getTime() / 1000) + ' seconds');
        }
      }).catch(error => {
        console.log('Failed to refresh token', error)
      })
    }, 60000)
  
  }).catch(error => {
    console.log('Authenticated Failed', error)
  })