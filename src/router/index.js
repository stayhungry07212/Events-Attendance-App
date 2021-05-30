import Vue from 'vue'
import Router from 'vue-router'
import HelloWorld from '@/pages/HelloWorld'
import eventDetails from '@/pages/eventDetails'
import SignUp from '@/pages/SignUp'
import Profile from '@/pages/Profile'
import AuthGuard from './authGuard'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/signup',
      name: 'SignUp',
      component: SignUp
    },
    {
      path: '/eventDetails/:id',
      name: 'eventDetails',
      component: eventDetails
    },
    {
      path: '/profile',
      name: 'profile',
      component: Profile,
      beforeEnter: AuthGuard
    },
    {
      path: '/',
      name: 'HelloWorld',
      component: HelloWorld
    }
  ]
})
