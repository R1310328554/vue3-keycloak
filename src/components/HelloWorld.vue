<template>
  <div class="hello">
    {{ msg }}
    <div>
      <p>
        current user: {{user}}
      </p>
      <p>
        roles: {{roles}}
      </p>
      <p>
        {{adminMsg}}
      </p>
      <p>
        {{customerMsg}}
      </p>
    </div>

    <button @click="logout" > 登出 </button>
  </div>
</template>

<script>
import axios from 'axios'
// import { onMounted } from 'vue';   // 使用前需引入生命周期钩子
// import { inject } from 'vue'


export default {
  name: 'HelloWorld',
  inject: ['keycloak'],
  props: {
    msg: String
  },
  data() {
    return {
      user: '',
      roles: [],
      adminMsg: '',
      customerMsg: ''
    }
  },
  created() {
    console.log(" keycloak " + this.keycloak) // 'hello'

    this.user = this.keycloak.idTokenParsed.preferred_username
    this.roles = this.keycloak.realmAccess.roles

    // this.getUser(this.user)
    //         .then(response=>{
    //           this.adminMsg = response.data
    //         })
    //         .catch(error => {
    //           console.log(error)
    //         })

    this.getAdmin()
            .then(response=>{
              this.adminMsg = response.data
            })
            .catch(error => {
              console.log(error)
            })

    this.getCustomer()
            .then(response => {
              this.customerMsg = response.data
            })
            .catch(error => {
              console.log(error)
            })
  },
  methods: {
    getUser(user) {
      return axios({
        method: 'get',
        url: 'http://127.0.0.1:8082/'+user,
        headers: {'Authorization': 'Bearer ' + this.keycloak.token}
      })
    },
    getAdmin() {
      return axios({
        method: 'get',
        url: 'http://127.0.0.1:8082/admin',
        headers: {'Authorization': 'Bearer ' + this.keycloak.token}
      })
    },
    logout() {
      this.keycloak.logout()
    },
    getCustomer() {
      return axios({
        method: 'get',
        url: 'http://127.0.0.1:8082/customer',
        headers: {'Authorization': 'Bearer ' + this.keycloak.token}
      })
    }
  }
}
</script>
