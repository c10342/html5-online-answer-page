import Vue from 'vue'
import App from './App.vue'

Vue.config.productionTip = false

import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';

import './base.css'

Vue.use(ElementUI);

new Vue({
  render: h => h(App),
}).$mount('#app')
