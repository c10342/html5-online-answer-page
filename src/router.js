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
import Mbg from './views/Bg.vue'
import UserMessage from './views/UserMessage.vue'
import MyCommentList from './views/MyCommentList.vue'
import MyMistake from './views/MyMistake.vue'
import CollectionQuestion from './views/CollectionQuestion.vue'
import AssembleQuestion from './views/AssembleQuestion.vue'
import ItemBank from './views/ItemBank.vue'
import Exercises from './views/Exercises.vue'

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
    path: '/bg',
    name: 'bg',
    component: Mbg,
    children: [{
      path: '/login',
      name: 'login',
      component: Login
    },
    {
      path: '/register',
      name: 'register',
      component: Register
    }
    ]
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
    path: '*',
    name: 'notFound',
    component: NotFound
  }
  ]
})

export const routes = [
  {
    path: '/consultQuestions',
    name: 'consultQuestions',
    component: ConsultQuestions,
    type: '1-1'
  },
  {
    path: '/addQuestion',
    name: 'addQuestion',
    component: AddQuestion,
    type: '1-2'
  }, {
    path: '/publishedQuestions',
    name: 'publishedQuestions',
    component: PublishedQuestions,
    type: '1-3'
  }, {
    path: '/answeredList',
    name: 'answeredList',
    component: AnsweredList,
    type: '1-4'
  }, {
    path: '/assembleQuestion',
    name: 'assembleQuestion',
    component: AssembleQuestion,
    type: '2-1'
  },
  {
    path: '/itemBank',
    name: 'itemBank',
    component: ItemBank,
    type: '2-2'
  },
  {
    path: '/myMistake',
    name: 'myMistake',
    component: MyMistake,
    type: '2-3'
  },
  {
    path: '/exercises',
    name: 'exercises',
    component: Exercises,
    type: '2-4'
  },
  {
    path: '/questionsStatistics',
    name: 'questionsStatistics',
    component: QuestionsStatistics,
    type: '3'
  },
  {
    path: '/myCommentList',
    name: 'myCommentList',
    component: MyCommentList,
    type: '4'
  },
  {
    path: '/collectionQuestion',
    name: 'collectionQuestion',
    component: CollectionQuestion,
    type: '5'
  },
  {
    path: '/userMessage',
    name: 'userMessage',
    component: UserMessage,
    type: '6'
  },
]

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