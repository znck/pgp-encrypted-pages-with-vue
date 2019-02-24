import Vue from 'vue'
import Router from 'vue-router'
import Home from './views/Home.vue'
import EncryptedPage from './components/EncryptedPage.vue'

Vue.use(Router)

export default new Router({
  mode: 'history',
  base: process.env.BASE_URL,
  routes: [
    {
      path: '/',
      name: 'home',
      component: Home,
    },
    {
      path: '/about',
      name: 'about',
      props: {
        component: () =>
          import(/* webpackChunkName: "about.enc" */ './views/About.vue'),
      },
      component: EncryptedPage,
    },
  ],
})
