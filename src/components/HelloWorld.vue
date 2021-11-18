
<template>
  <div class="contentArea">
    <h1>{{ msg }}</h1>

    <h2 v-if="keycloack?.authenticated">✔️ You are logged using keycloak</h2>
    <div class="token">{{ keycloack?.token }}</div>

    <h3>ID: {{ user.ID }}</h3>
    <h3>Full Name: {{ user.FullName }}</h3>
    <h3>First Name: {{ user.FirstName }}</h3>
    <h3>Last Name: {{ user.LastName }}</h3>
    <h3>Email: {{ user.isEmailVerified ? '✔️' : 'X' }} {{ user.Email }}</h3>
    <h3>Username: {{ user.Username }}</h3>

    <h3>Roles:</h3>
    <ul>
      <li v-for="role in rolesToTest">{{ role }}: {{ keycloack?.hasRealmRole(role) }}</li>
    </ul>

    <button @click="logout">Logout</button>
  </div>
</template>

<script setup lang="ts">
import { KeycloakInstance } from 'keycloak-js';
import { reactive, inject } from 'vue'
import useUserInfo, { ICustomUser } from '../types/ICustomUser';

defineProps<{ msg: string }>()

const keycloack = inject<KeycloakInstance>('keycloack');

const user = reactive<ICustomUser>(keycloack ? useUserInfo(keycloack.userInfo) : {});

function logout() {
  keycloack?.logout();
}

const rolesToTest = ["POWERUSER", "BETATESTER"];
</script>

<style scoped>
.contentArea {
  display: flex;
  flex-direction: column;
  justify-content: center;
}

a {
  color: #42b983;
}

label {
  margin: 0 0.5em;
  font-weight: bold;
}

.token {
  text-align: center;
  overflow: scroll;
}
</style>
