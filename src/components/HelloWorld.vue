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
      <p>
        普通ajax操作结果：{{ajaxMsg}}
      </p>
    </div>

    <button @click="ajax" > 普通ajax操作， 测试token是否过期 </button>
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
      customerMsg: '',
      ajaxMsg: ''
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

// 有对应的角色权限才能访问成功，否则 被keycloak 的拦截器拒绝，出现403 cors异常： 
/** 

  Access to XMLHttpRequest at 'http://127.0.0.1:8082/admin' from origin 'http://192.168.1.103:8080' has been blocked by CORS policy: No 'Access-Control-Allow-Origin' header is present on the requested resource.
HelloWorld.vue?e90b:63 AxiosError{ message: 'Network Error', name: 'AxiosError', code: 'ERR_NETWORK', config: {…}, request: XMLHttpRequest,…}
xhr.js?1a5c:220          

GET http://127.0.0.1:8082/admin net::ERR_FAILED 403

*/
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
    },
    ajax() {
      axios({
        method: 'get',
        url: 'http://127.0.0.1:8082/test',
        headers: {'Authorization': 'Bearer ' + this.keycloak.token}
      })
      .then(response => {
        this.ajaxMsg = response.data
      })
      .catch(error => {
        console.log(error)
      })
    }
  }
}
</script>
