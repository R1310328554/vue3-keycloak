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

keycloak.init({
    onLoad: 'login-required',
    checkLoginIframe: false //防止登陆后重复刷新 
}).then(async(auth) => {
    if (!auth) {
        console.log('window reload', auth)
        window.location.reload();
    } else {
        console.info("Authenticated");

        await keycloak.loadUserInfo();


        keycloak.loadUserProfile().success((data) => {
            console.info("loadUserProfile ");
            // requestAuth;
            window.localStorage.setItem("username", JSON.stringify(data.username));
            window.localStorage.setItem("token", JSON.stringify(keycloak.token));
        });

        const app = createApp(App);

        app.provide('keycloak', keycloak);
        app.mount('#app');
    }

    // Token Refresh; updateToken是自动刷新token 的意思，参数是token 的剩余时间, 如果少于，则跳转到登录页面
    setInterval(() => {
        keycloak.updateToken(70).then((refreshed) => {
            if (refreshed) {
                console.info('Token refreshed ' + refreshed);
            } else {
                console.warn('Token not refreshed, valid for ' +
                    Math.round(keycloak.tokenParsed.exp + keycloak.timeSkew - new Date().getTime() / 1000) + ' seconds');
            }
        }).catch(() => {
            console.error('Failed to refresh token');
        });
    }, 1000)

}).catch(error => {
    console.log('Authenticated Failed', error)
})