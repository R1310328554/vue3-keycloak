import Keycloak, { KeycloakConfig, KeycloakInstance } from 'keycloak-js';
import { createApp } from 'vue'
import App from './App.vue'

let initOptions: KeycloakConfig = {
  url: import.meta.env.VITE_KEYCLOAK_URL as string,
  realm: import.meta.env.VITE_KEYCLOAK_REALM as string,
  clientId: import.meta.env.VITE_KEYCLOAK_CLIENTID as string
}

let keycloak = Keycloak(initOptions);

keycloak.init({ onLoad: 'login-required' }).then(async (auth) => {
  if (!auth) {
    window.location.reload();
  } else {
    console.info("Authenticated");

    await keycloak.loadUserInfo();

    const app = createApp(App);
    app.provide<KeycloakInstance>('keycloack', keycloak);
    app.mount('#app');
  }

//Token Refresh
  setInterval(() => {
    keycloak.updateToken(70).then((refreshed) => {
      if (refreshed) {
        console.info('Token refreshed ' + refreshed);
      } else {
        console.warn('Token not refreshed, valid for '
          + Math.round(keycloak.tokenParsed!.exp! + keycloak.timeSkew! - new Date().getTime() / 1000) + ' seconds');
      }
    }).catch(() => {
      console.error('Failed to refresh token');
    });
  }, 6000)

}).catch(() => {
  console.error("Authenticated Failed");
});