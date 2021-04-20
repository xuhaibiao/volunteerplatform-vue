import Vue from 'vue'
import VueRouter from 'vue-router'
import Login from '../components/Login.vue'
import Activity from '../components/volunteer/Activity.vue'
import Record from '../components/volunteer/Record.vue'
import VolunteerMessage from '../components/volunteer/Message.vue'
import VolunteerInformation from '../components/volunteer/Information.vue'
import VolunteerCommunity from '../components/volunteer/Community.vue'
import ActivityManagement from '../components/worker/ActivityManagement'
import NeedEvaluateRecords from '../components/worker/NeedEvaluateRecords'
import WorkerInformation from '../components/worker/Information.vue'
import WorkerCommunity from '../components/worker/Community.vue'
import WorkerMessage from '../components/worker/Message.vue'
import Statistics from '../components/worker/Statistics.vue'


Vue.use(VueRouter)

const routes = [
  {
    path:"",
    // redirect:"/volunteer/activity"
    redirect:"/login"
  },
  {
    path:"/login",
    component:Login
  },
  {
    path:"/volunteer/activity",
    component:Activity
  },
  {
    path:"/volunteer/record",
    component:Record
  },
  {
    path:"/volunteer/message",
    component:VolunteerMessage
  },
  {
    path:"/volunteer/information",
    component:VolunteerInformation
  },
  {
    path:"/volunteer/community",
    component:VolunteerCommunity
  },
  {
    path:"/worker/information",
    component:WorkerInformation

  },
  {
    path:"/worker/activityManagement",
    component:ActivityManagement
  },
  {
    path:"/worker/needEvaluateRecords",
    component:NeedEvaluateRecords
  },
  {
    path:"/worker/community",
    component:WorkerCommunity
  },
  {
    path:"/worker/message",
    component:WorkerMessage
  },
  {
    path:"/worker/statistics",
    component:Statistics
  },

  
]

const router = new VueRouter({
  mode:'history',
  routes
})

// 挂载路由导航守卫
router.beforeEach((to, from, next) => {
  // to:将要访问的路径
  // from:从哪里访问的路径
  // next:之后要做的任务，是一个函数
  //    next（）放行， next（'/URL'）强制跳转的路径。
  if (to.path == '/login') return next();// 访问路径为登录
  // 获取flag
  const flagStr = window.sessionStorage.getItem("user");// session取值
  if (!flagStr) return next('/login');// 没登录去登录
  next();
})

export default router
