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
// import Statistics from '../components/worker/Statistics.vue'
import AdministratorHome from '../components/administrator/Home.vue'
import VolunteerAuthority from '../components/administrator/VolunteerAuthority.vue'
import WorkerAuthority from '../components/administrator/WorkerAuthority.vue'
import ActivityAuthority from '../components/administrator/ActivityAuthority.vue'
import AdministratorMessage from '../components/administrator/Message.vue'
import CommunityReview from '../components/administrator/CommunityReview.vue'
import Index from '../components/Index.vue'
import ActivityInfo from '../components/ActivityInfo.vue'
import Register from '../components/Register.vue'





Vue.use(VueRouter)

const routes = [
  {
    path:"",
    // redirect:"/volunteer/activity"
    // redirect:"/login"
    redirect:"/volunteerPlatform/index"
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
  // {
  //   path:"/worker/statistics",
  //   component:Statistics
  // },

  {
    path:"/administrator/home",
    component:AdministratorHome
  },
  {
    path:"/administrator/volunteerAuthority",
    component:VolunteerAuthority
  },
  {
    path:"/administrator/workerAuthority",
    component:WorkerAuthority
  },
  {
    path:"/administrator/activityAuthority",
    component:ActivityAuthority
  },
  {
    path:"/administrator/message",
    component:AdministratorMessage
  },
  {
    path:"/administrator/communityReview",
    component:CommunityReview
  },

  

  {
    path:"/volunteerPlatform/index",
    component:Index
  },
  {
    path:"/activityInfo",
    name: "????????????",
    component:ActivityInfo
  },
  {
    path:"/register",
    component:Register
  },
  
]

const router = new VueRouter({
  mode:'history',
  routes
})

// ????????????????????????
router.beforeEach((to, from, next) => {
  // to:?????????????????????
  // from:????????????????????????
  // next:???????????????????????????????????????
  //    next??????????????? next???'/URL'???????????????????????????
  if (to.path == '/login') return next();// ?????????????????????
  // ??????flag
  const flagStr = window.sessionStorage.getItem("user");// session??????
  // if (!flagStr) return next('/login');// ??????????????????
  next();
})

export default router
