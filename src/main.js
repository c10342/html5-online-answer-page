import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store' 

import './registerServiceWorker'

import '../public/css/reset.css'
import '../public/css/font-awesome.css'

import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';

import './base.css'

import ECharts from 'vue-echarts' // 在 webpack 环境下指向 components/ECharts.vue
import "echarts/lib/chart/line";
import 'echarts/lib/chart/bar';
import 'echarts/lib/chart/pie';
import "echarts/lib/component/polar";
import "echarts/lib/component/tooltip"
import "echarts/lib/component/title";
import "echarts/lib/component/legendScroll";

import {formatDate,numToPercent} from './util/index'

import Bg from './components/Bg.vue'
import Single from './components/Single'
import Multiple from './components/Multiple'
import Judgement from './components/Judgement'
import Answer from './components/Answer'

Vue.component('bg',Bg)
Vue.component('Single',Single)
Vue.component('Multiple',Multiple)
Vue.component('Answer',Answer)
Vue.component('Judgement',Judgement)

Vue.component('v-chart', ECharts)

Vue.use(ElementUI);

Vue.config.productionTip = false

Vue.filter('formatDate',formatDate)
Vue.filter('numToPercent',numToPercent)

// 登录权限控制
router.beforeEach((to, from, next) => {
  // 用户没有登录
  if (!store.state.userInfo._id) {
    // 登录注册页面不需要登录
    if(to.name == 'login' || to.name == 'register'){
      next()
    }else{
      next({name:'login'})
    }
  }else{ //用户已经登录了
    next()
  }
})

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
