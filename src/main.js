import { createApp } from 'vue'
import App from './App.vue'
import 'bootstrap';
import * as VueRouter from 'vue-router';

import HomePage from './pages/HomePage.vue'

import axios from 'axios';
//Configureer Axios globaal. 
//Hiermee is toegestaan Cross Domain Cookies te versturen.
axios.defaults.withCredentials = true;
const router = VueRouter.createRouter({
  history: VueRouter.createWebHistory(process.env.BASE_URL),
  routes: [
    {
      path: '/chart',
      component: HomePage,
    },
    {
      path: '/',
      component: HomePage,
    }
  ]
});

createApp(App)
  .use(router)
  .mount('#app')
