import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'

import img from './assets/default.png'

// pwa
import './registerServiceWorker'

// 重置样式
import '../public/css/reset.css'

// 字体图标
import '../public/css/font-awesome.css'

// element
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';

Vue.use(ElementUI);

// 通用基础样式
import './base.css'

// // ECharts
// import ECharts from 'vue-echarts' // 在 webpack 环境下指向 components/ECharts.vue
// import "echarts/lib/chart/line";
// import 'echarts/lib/chart/bar';
// import 'echarts/lib/chart/pie';
// import "echarts/lib/component/polar";
// import "echarts/lib/component/tooltip"
// import "echarts/lib/component/title";
// import "echarts/lib/component/legendScroll";

// Vue.component('v-chart', ECharts)

import {
  formatDate,
  numToPercent
} from './util/index'

// 过滤器
Vue.filter('formatDate', formatDate)
Vue.filter('numToPercent', numToPercent)

// 组件
import Bg from './components/Bg.vue'
import Single from './components/Single'
import Multiple from './components/Multiple'
import Judgement from './components/Judgement'
import Answer from './components/Answer'

Vue.component('bg', Bg)
Vue.component('Single', Single)
Vue.component('Multiple', Multiple)
Vue.component('Answer', Answer)
Vue.component('Judgement', Judgement)

import axios from 'axios'

import {
  whiteList
} from './util/config';

// 请求拦截
axios.interceptors.request.use(function (config) {
  let url = config.url
  if (!whiteList.some(item => url.startsWith(item))) {
    let token = window.sessionStorage.getItem('token') || ''
    config.headers.token = token
  }
  return config;
})
axios.interceptors.response.use(function (config) {
  if (config.data.statusCode == 401) {
    window.sessionStorage.removeItem('token')
    store.commit('setUserInfo', {})
    router.replace({
      name: 'login'
    })
  } else {
    let token = config.headers.token
    if (token) {
      window.sessionStorage.setItem('token', token)
    }
  }

  return config;
})


Vue.config.productionTip = false


// 权限控制
router.beforeEach((to, from, next) => {
  let userInfo = store.state.userInfo
  // 用户没有登录
  if (!userInfo._id) {
    // 登录注册页面不需要登录
    if (to.name == 'login' || to.name == 'register') {
      next()
    } else {
      next({
        name: 'login'
      })
    }
  } else { //用户已经登录了
    let flag = to.meta.flag
    if (flag) {
      let type = to.meta.type
      const index = userInfo.jurisdiction.includes(type)
      if (index) {
        next()
      } else {
        next({
          name: 'notFound'
        })
      }
    } else {
      next()
    }
  }
})

//注册权限
Notification.requestPermission(function (status) {
  // 这将使我们能在 Chrome/Safari 中使用 Notification.permission
  if (Notification.permission !== status) {
    Notification.permission = status;
  }
});


window.addEventListener('offline', function () {
  //消息推送
  var n = new Notification('提示', {
    body: '应用程序处于离线状态',
    tag: 'avenstar', //代表通知的一个识别标签，相同tag时只会打开同一个通知窗口
    icon: img,
    requireInteraction: false //通知保持有效不自动关闭，默认为false
  })
})

new Vue({
  router,
  store,
  mounted() {
    document.dispatchEvent(new Event('render-event'))
  },
  render: h => h(App)
}).$mount('#app')