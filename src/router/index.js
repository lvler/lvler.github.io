import Vue from 'vue'
import Router from 'vue-router'
import Index from '@/components/Index'
import Check from '@/components/Check'
import Instruction from '@/components/Instruction'
import NotFound from '@/components/NotFound'
import vueHeadful from 'vue-headful'
import Notifications from 'vue-notification'

Vue.use(Router);
Vue.use(Notifications);
Vue.component('vue-headful', vueHeadful);

export default new Router({
  // mode: 'history',
  routes: [
    {
      path: '/',
      name: 'index',
      component: Index
    },
    {
      path: '/instruction',
      name: 'instruction',
      component: Instruction
    },
    {
      path: '/check/:data',
      name: 'check',
      component: Check
    },
    {
      path: '/404',
      name: '404',
      component: NotFound,
    },
    {
      path: '*',
      redirect: '/404'
    }
  ]
})
