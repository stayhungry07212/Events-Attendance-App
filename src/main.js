import Vue from 'vue'
import App from './App'
import * as firebase from './firebase'
import router from './router'
import Vuetify from 'vuetify'
import 'vuetify/dist/vuetify.min.css'
import store from './store'
import Vuex from 'vuex'
import Element from 'element-ui'
import './assets/elementTheme/theme/index.css'

Vue.use(Vuex)
Vue.use(Vuetify)
Vue.use(Element)

Vue.config.productionTip = false

const vuetifyInit = new Vuetify({
  theme: {
    themes: {
      light: {
        primary: '#34344A',
        secondary: '#201F1D',
        success: '#17A398',
        danger: '#EE6C4D',
        warning: '#E3B23C',
        background: '#F7F7FF'
      },
      dark: {
        primary: '#34344A',
        secondary: '#201F1D',
        success: '#17A398',
        danger: '#EE6C4D',
        warning: '#E3B23C',
        background: '#F7F7FF'
      },
    },
  },
})

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  components: { App },
  template: '<App/>',
  store: store,
  firebase,
  vuetify : vuetifyInit,
})
