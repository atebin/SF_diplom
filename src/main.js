import Vue from 'vue'
import VueRouter from 'vue-router'
import App from './App.vue'
import Home from './views/Home.vue'
import Notice from './views/Notice.vue'
import Cases from './views/Cases.vue'
import Officers from './views/Officers.vue'
import OfficerDetail from './views/OfficerDetail.vue'


Vue.config.productionTip = false
Vue.use(VueRouter);

const routes = [
  { path: '/', text: 'Главная', component: Home},  
  { path: '/home', text: 'Главная', component: Home},  
  { path: '/notice', text: 'Сообщить о краже', component: Notice, props: {newCaseMode: 'noAuth'}},  
  { path: '/cases', text: 'Украденные велосипеды', component: Cases},
  { path: '/officers', text: 'Ответственные сотрудники', component: Officers},
  { name: 'officerDetail', text: 'Ответственные сотрудники', path: '/officer/:id', component: OfficerDetail},
]

const router = new VueRouter({
  routes // сокращённая запись для `routes: routes`
})

new Vue({
  router,
  render: h => h(App),
}).$mount('#app')
