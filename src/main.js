import Keycloak from 'keycloak-js';
import { createApp } from 'vue'
import App from './App.vue'

let initOptions = {
  url: "http://112.74.110.95:8080/auth",
  realm: "demo",
  clientId: 'vue-demo'
// let initOptions = {
  // url: import.meta.env.VITE_KEYCLOAK_URL,
  // realm: import.meta.env.VITE_KEYCLOAK_REALM,
  // clientId: import.meta.env.VITE_KEYCLOAK_CLIENTID
}

let keycloak = Keycloak(initOptions);

keycloak.init({ onLoad: 'login-required' }).then(async (auth) => {
  if (!auth) {
    window.location.reload();
  } else {
    console.info("Authenticated");

    await keycloak.loadUserInfo();

    const app = createApp(App);

    app.provide('keycloak', keycloak);
    app.mount('#app');
  }

//Token Refresh
  // setInterval(() => {
  //   keycloak.updateToken(70).then((refreshed) => {
  //     if (refreshed) {
  //       console.info('Token refreshed ' + refreshed);
  //     } else {
  //       console.warn('Token not refreshed, valid for '
  //         + Math.round(keycloak.tokenParsed.exp + keycloak.timeSkew - new Date().getTime() / 1000) + ' seconds');
  //     }
  //   }).catch(() => {
  //     console.error('Failed to refresh token');
  //   });
  // }, 160000)

}).catch(error => {
  console.log('Authenticated Failed', error)
});

