import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

export default new Router({
  mode: 'history',
  base: process.env.BASE_URL,
  routes: [{
      path: '/',
      name: '/',
      redirect: '/login'
    },
    {
      path: '/login',
      name: 'login',
      component: () => import('./views/Login.vue')
    },
    {
      path: '/register',
      name: 'register',
      component: () => import('./views/Register.vue')
    },
    {
      path: '/index',
      name: 'index',
      component: () => import('./views/Index.vue'),
      children: [{
          path: '/index',
          redirect: '/home'
        },
        {
          path: '/home',
          name: 'home',
          component: () => import('./views/Home.vue')
        },
        {
          path: '/updatePwd',
          name: 'updatePwd',
          component: () => import('./views/UpdatePwd.vue')
        },
        {
          path: '/updateName',
          name: 'updateName',
          component: () => import('./views/UpdateName.vue')
        },
        {
          path: '/userInfo',
          name: 'userInfo',
          component: () => import('./views/UserInfo.vue')
        },
        {
          path: '/consultQuestions',
          name: 'consultQuestions',
          component: () => import('./views/ConsultQuestions.vue')
        },
        {
          path: '/addQuestion',
          name: 'addQuestion',
          component: () => import('./views/AddQuestion.vue')
        },
        {
          path: '/publishedQuestions',
          name: 'publishedQuestions',
          component: () => import('./views/PublishedQuestions.vue')
        },
        {
          path: '/answerQuestion/:id',
          name: 'answerQuestion',
          component: () => import('./views/AnswerQuestion.vue')
        },
        {
          path: '/editQuestion/:id',
          name: 'editQuestion',
          component: () => import('./views/EditQuestion.vue')
        },
        {
          path: '/answeredList',
          name: 'answeredList',
          component: () => import('./views/AnsweredList.vue')
        },
        {
          path: '/answerDetail/:id',
          name: 'answerDetail',
          component: () => import('./views/AnswerDetail.vue')
        },
        {
          path: '/commentList/:id',
          name: 'commentList',
          component: () => import('./views/CommentList.vue')
        },
        {
          path: '/questionsStatistics',
          name: 'questionsStatistics',
          component: () => import('./views/QuestionsStatistics.vue')
        },
        {
          path: '/statisticsDetail/:id',
          name: 'statisticsDetail',
          component: () => import('./views/StatisticsDetail.vue')
        },
        {
          path: '/answerUserList/:id',
          name: 'answerUserList',
          component: () => import('./views/AnswerUserList.vue')
        },
      ]
    },
    {
      path:'*',
      name:'notFound',
      component:() => import('./views/NotFound.vue')
    }
  ]
})