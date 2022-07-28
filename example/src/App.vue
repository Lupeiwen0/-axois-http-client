<script setup lang="ts">
// This starter template is using Vue 3 <script setup> SFCs
// Check out https://vuejs.org/api/sfc-script-setup.html#script-setup
import HelloWorld from './components/HelloWorld.vue'

import HttpClient from '../../src/index'
import type { HttpClientConfig, ProxyConfig, HttpClientRequestConfig } from '../../src/types/index'


const config:HttpClientConfig = {
  baseURL: '/api',
  timeout: 10 * 1000,
  headers: {},
  showMessage: ({ code, message }) => console.log(message, code ),
  errorCallback: (error) => console.log(error),
  requestBeforeHook: (config) => console.log('requestBeforeHook: ', config),
  // 使用自定义响应钩子，默认响应处理将会失效
  // responseAfterHook: (response) => {
  //   console.log('responseAfterHook: ', response);
  //   return Promise.resolve(response)
  // }
}

const proxyConfig:ProxyConfig = {}

const http = new HttpClient(config, proxyConfig)

const option:HttpClientRequestConfig = {
  url: 'auth/resources',
  method: 'GET',
  showErrorMessage: true,
  showSuccessMessage: true,
  useFormData: true,
}
http.request(option).then(res => console.log(res))


</script>

<template>
  <div>
    <a href="https://vitejs.dev" target="_blank">
      <img src="/vite.svg" class="logo" alt="Vite logo" />
    </a>
    <a href="https://vuejs.org/" target="_blank">
      <img src="./assets/vue.svg" class="logo vue" alt="Vue logo" />
    </a>
  </div>
  <HelloWorld msg="Vite + Vue" />
</template>

<style scoped>
.logo {
  height: 6em;
  padding: 1.5em;
  will-change: filter;
}
.logo:hover {
  filter: drop-shadow(0 0 2em #646cffaa);
}
.logo.vue:hover {
  filter: drop-shadow(0 0 2em #42b883aa);
}
</style>
