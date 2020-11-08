import Vue from 'vue'
import VueRouter from 'vue-router'
import App from './App.vue'
import Home from './views/Home.vue'
import Cases from './views/Cases.vue'
import Officers from './views/Officers.vue'
import TestApi from './views/TestApi.vue'


Vue.config.productionTip = false
Vue.use(VueRouter);

const routes = [
  { path: '/home', component: Home, props: {newCaseMode: 'noAuth'}},  
  { path: '/cases', component: Cases},
  { path: '/officers', component: Officers},
  { path: '/testapi', component: TestApi}, 
]

const router = new VueRouter({
  routes // сокращённая запись для `routes: routes`
})

new Vue({
  router,
  render: h => h(App),
}).$mount('#app')
