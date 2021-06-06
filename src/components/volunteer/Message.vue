<template>
    <el-container>
        <el-header>
            <div>
                <!--伸缩按钮-->
                <div class="collapse-btn" @click="collapseChage">
                    <i v-if="!collapse" class="el-icon-s-fold"></i>
                    <i v-else class="el-icon-s-unfold"></i>
                </div>
                <span>社区志愿服务网 欢迎 
                    <el-lebal style="color:#F00" v-model=this.user.name>{{this.user.name}}</el-lebal> 
                    志愿者，您已累计志愿 
                    <el-lebal style="color:#F00" v-model=this.user.volunteerHours>{{this.user.volunteerHours}}</el-lebal>
                    小时！
                </span>
            </div>
            <el-button type="info" @click="logout">安全退出</el-button>
        </el-header>
        <el-container>
            <el-aside :width="collapse ?'64px':'200px'">
                <!--侧边栏菜单区 unique-opened="true" 只保持一个菜单展开 router开启路由-->
                <el-menu default-active="message" background-color="#EBF1F6" text-color="rgb(37, 35, 35);" active-text-color="#409eff" 	unique-opened :collapse="isCollapse" :collapse-transition="false" :router="true">
                    <template v-for="item in items">
                        <el-menu-item :index="item.index" :key="item.index">
                            <i :class="item.icon"></i>
                            <span v-if="!collapse" slot="title">{{ item.title }}</span>
                        </el-menu-item>
                    </template>
                </el-menu>
            </el-aside>

            <el-main>
                <el-tabs v-model="message">
                    <el-tab-pane :label="`社区组织消息(${communityMessage.length})`" name="first">
                        <el-collapse accordion v-for="c in communityMessage" :key="c.id">
                            <el-collapse-item>
                                <template slot="title">
                                {{c.createTime+"     "+c.title}}
                                </template>
                                <div>{{c.content}}</div>
                            </el-collapse-item>
                        </el-collapse>
                    </el-tab-pane>

                    <el-tab-pane :label="`系统消息(${systemMessage.length})`" name="second">
                        <el-collapse accordion v-for="s in systemMessage" :key="s.id">
                            <el-collapse-item>
                                <template slot="title">
                                {{s.createTime+"     "+s.title}}
                                </template>
                                <div>{{s.content}}</div>
                            </el-collapse-item>
                        </el-collapse>
                    </el-tab-pane>

        
                </el-tabs>
            
            
               
            </el-main>
        </el-container>
    </el-container>
</template>

<script>
import global from '../../components/Global'
export default {
     

    data(){
        return{
        
            collapse: '',
            items: [
                {
                    // icon: 'el-icon-s-home',
                    index: 'activity',
                    title: '    志愿活动',
                    icon: 'iconfont icon-banjizhiyuanhuodong-copy'
                },
                {
                    // icon: 'el-icon-s-home',
                    index: 'record',
                    title: '    志愿记录',
                    icon: 'iconfont icon-icon-test'
                },
                {
                    // icon: 'el-icon-s-home',
                    index: 'information',
                    title: '    个人信息',
                    icon: 'iconfont icon-gerenxinxi'
                },
                {
                    // icon: 'el-icon-s-home',
                    index: 'community',
                    title: '    社区组织',
                    icon: 'iconfont icon-zuzhi'
                }, 
                {
                    // icon: 'el-icon-s-home',
                    index: 'message',
                    title: '    消息',
                    icon: 'iconfont icon-xiaoxi'
                },
             
            
            ],
            message: 'first',
            
            communityMessage: [{
                

            }],
            systemMessage: [{
                 
            }],
            user:{}
        };
    },
    // 类似onload
    created() {
        this.collapse = global.collapse;
        this.user = JSON.parse(window.sessionStorage.getItem("user"));
        this.getMessages();
    },
    methods:{
        logout(){
            window.sessionStorage.clear();
            this.$router.push("/login");
        },
        
        collapseChage() {
            this.collapse = !this.collapse;
            global.collapse = !global.collapse;
        },

        async getMessages(){
            const {data :res} = await this.$http.get("volunteer/message", {
                params: {  
                    "communityId": this.user.communityId,
                    "volunteerId": this.user.id
                }  
            });
            this.communityMessage = res.data.communityMessage;
            this.systemMessage = res.data.systemMessage;
        },
       
    },
    
}
</script>

<style lang="less" scoped>
@import "//at.alicdn.com/t/font_2416161_nazgwdqmnsi.css";

.el-header {
  background-color: #EBF1F6;
  display: flex;
  justify-content: space-between;// 左右贴边
  padding-left: 0%;// 左边界
  align-items: center;// 水平
  color: rgb(37, 35, 35);
  font-size: 20px;
  div { //左侧div加布局
    display: flex;
    align-items: center;
    span {
      margin-left: 15px;
    }
  }
  
}
.el-aside{
    background-color: #EBF1F6;
}
.el-main{
    background-color: #EBF1F6;
    // overflow-y: hidden;
}

.message-title{
    cursor: pointer;
}
.handle-row{
    margin-top: 30px;
}

</style>



