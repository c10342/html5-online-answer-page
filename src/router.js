import Vue from 'vue'
import Router from 'vue-router'
import Login from './views/Login.vue'
import Register from './views/Register.vue'
import Index from './views/Index.vue'
import Home from './views/Home.vue'
import UpdatePwd from './views/UpdatePwd.vue'
import UpdateName from './views/UpdateName.vue'
import UserInfo from './views/UserInfo.vue'
import ConsultQuestions from './views/ConsultQuestions.vue'
import AddQuestion from './views/AddQuestion.vue'
import PublishedQuestions from './views/PublishedQuestions.vue'
import AnswerQuestion from './views/AnswerQuestion.vue'
import EditQuestion from './views/EditQuestion.vue'
import AnsweredList from './views/AnsweredList.vue'
import AnswerDetail from './views/AnswerDetail.vue'
import CommentList from './views/CommentList.vue'
import QuestionsStatistics from './views/QuestionsStatistics.vue'
import StatisticsDetail from './views/StatisticsDetail.vue'
import AnswerUserList from './views/AnswerUserList.vue'
import NotFound from './views/NotFound.vue'

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
      component: Login
    },
    {
      path: '/register',
      name: 'register',
      component: Register
    },
    {
      path: '/index',
      name: 'index',
      component: Index,
      children: [{
          path: '/index',
          redirect: '/home'
        },
        {
          path: '/home',
          name: 'home',
          component: Home
        },
        {
          path: '/updatePwd',
          name: 'updatePwd',
          component: UpdatePwd
        },
        {
          path: '/updateName',
          name: 'updateName',
          component: UpdateName
        },
        {
          path: '/userInfo',
          name: 'userInfo',
          component: UserInfo
        },
        {
          path: '/consultQuestions',
          name: 'consultQuestions',
          component: ConsultQuestions
        },
        {
          path: '/addQuestion',
          name: 'addQuestion',
          component: AddQuestion
        },
        {
          path: '/publishedQuestions',
          name: 'publishedQuestions',
          component: PublishedQuestions
        },
        {
          path: '/answerQuestion/:id',
          name: 'answerQuestion',
          component: AnswerQuestion
        },
        {
          path: '/editQuestion/:id',
          name: 'editQuestion',
          component: EditQuestion
        },
        {
          path: '/answeredList',
          name: 'answeredList',
          component: AnsweredList
        },
        {
          path: '/answerDetail/:id',
          name: 'answerDetail',
          component: AnswerDetail
        },
        {
          path: '/commentList/:id',
          name: 'commentList',
          component: CommentList
        },
        {
          path: '/questionsStatistics',
          name: 'questionsStatistics',
          component: QuestionsStatistics
        },
        {
          path: '/statisticsDetail/:id',
          name: 'statisticsDetail',
          component: StatisticsDetail
        },
        {
          path: '/answerUserList/:id',
          name: 'answerUserList',
          component: AnswerUserList
        },
      ]
    },
    {
      path:'*',
      name:'notFound',
      component:NotFound
    }
  ]
})

// export default new Router({
//   mode: 'history',
//   base: process.env.BASE_URL,
//   routes: [{
//       path: '/',
//       name: '/',
//       redirect: '/login'
//     },
//     {
//       path: '/login',
//       name: 'login',
//       component: () => import('./views/Login.vue')
//     },
//     {
//       path: '/register',
//       name: 'register',
//       component: () => import('./views/Register.vue')
//     },
//     {
//       path: '/index',
//       name: 'index',
//       component: () => import('./views/Index.vue'),
//       children: [{
//           path: '/index',
//           redirect: '/home'
//         },
//         {
//           path: '/home',
//           name: 'home',
//           component: () => import('./views/Home.vue')
//         },
//         {
//           path: '/updatePwd',
//           name: 'updatePwd',
//           component: () => import('./views/UpdatePwd.vue')
//         },
//         {
//           path: '/updateName',
//           name: 'updateName',
//           component: () => import('./views/UpdateName.vue')
//         },
//         {
//           path: '/userInfo',
//           name: 'userInfo',
//           component: () => import('./views/UserInfo.vue')
//         },
//         {
//           path: '/consultQuestions',
//           name: 'consultQuestions',
//           component: () => import('./views/ConsultQuestions.vue')
//         },
//         {
//           path: '/addQuestion',
//           name: 'addQuestion',
//           component: () => import('./views/AddQuestion.vue')
//         },
//         {
//           path: '/publishedQuestions',
//           name: 'publishedQuestions',
//           component: () => import('./views/PublishedQuestions.vue')
//         },
//         {
//           path: '/answerQuestion/:id',
//           name: 'answerQuestion',
//           component: () => import('./views/AnswerQuestion.vue')
//         },
//         {
//           path: '/editQuestion/:id',
//           name: 'editQuestion',
//           component: () => import('./views/EditQuestion.vue')
//         },
//         {
//           path: '/answeredList',
//           name: 'answeredList',
//           component: () => import('./views/AnsweredList.vue')
//         },
//         {
//           path: '/answerDetail/:id',
//           name: 'answerDetail',
//           component: () => import('./views/AnswerDetail.vue')
//         },
//         {
//           path: '/commentList/:id',
//           name: 'commentList',
//           component: () => import('./views/CommentList.vue')
//         },
//         {
//           path: '/questionsStatistics',
//           name: 'questionsStatistics',
//           component: () => import('./views/QuestionsStatistics.vue')
//         },
//         {
//           path: '/statisticsDetail/:id',
//           name: 'statisticsDetail',
//           component: () => import('./views/StatisticsDetail.vue')
//         },
//         {
//           path: '/answerUserList/:id',
//           name: 'answerUserList',
//           component: () => import('./views/AnswerUserList.vue')
//         },
//       ]
//     },
//     {
//       path:'*',
//       name:'notFound',
//       component:() => import('./views/NotFound.vue')
//     }
//   ]
// })