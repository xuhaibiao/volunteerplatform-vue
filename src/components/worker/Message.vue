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
                    社区工作者!
                </span>
            </div>
            <el-button type="info" @click="logout">安全退出</el-button>
        </el-header>
        <el-container>
            <el-aside :width="collapse ?'64px':'200px'">
                <!--侧边栏菜单区 unique-opened="true" 只保持一个菜单展开 router开启路由-->
                <el-menu default-active="message" background-color="#545c64" text-color="#fff" active-text-color="#409eff" 	unique-opened :collapse="isCollapse" :router="true">
                    <template v-for="item in items">
                        <el-menu-item :index="item.index" :key="item.index">
                            <i :class="item.icon"></i>
                            <span v-if="!collapse" slot="title">{{ item.title }}</span>
                        </el-menu-item>
                    </template>
                </el-menu>
            </el-aside>

            <el-main>
                <!-- <div align=right> -->
                    <el-button type="success" icon="el-icon-plus" @click="addMessage">消息发布</el-button>
                <!-- </div> -->
                

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

            <el-dialog title="发布消息" :visible.sync="addVisible" width="40%">
                <el-form ref="addMessageForm" :model="addMessageForm" :rules="addMessageRules" label-width="110px">
                    <el-form-item label="消息标题" prop="title" style="width: 60%">
                        <el-input v-model="addMessageForm.title" type="integer"></el-input>
                    </el-form-item>
                    
                    <el-form-item label="消息内容"  prop="content" style="width: 70%">
                        <el-input type="textarea" rows="5" v-model="addMessageForm.content"></el-input>
                    </el-form-item>
                    <el-form-item >
                        <el-button type="primary"  @click="confirmAdd('addMessageForm')">发 布</el-button>
                        <el-button @click="canelAdd">取 消</el-button>
                    </el-form-item>
                </el-form>
                           
            </el-dialog>
        </el-container>
    </el-container>
</template>

<script>
import global from '../../components/Global'
export default {
    inject:['reload'], 

    data(){
        return{
            user:{},
            collapse: '',
            addVisible: false,
            addMessageForm:{
                title: '',
                content: '',
                workerId:'',
                communityId:''
            },
            addMessageRules:{
                title: [
                    { required: true, message: "请输入标题", trigger: "blur" },
                    
                ],
                
                content:[
                    { required: true, message: "请输入消息内容", trigger: "blur" },
                ],

            },
            items: [
                {
                    // icon: 'el-icon-s-home',
                    index: 'activityManagement',
                    title: '    活动管理',
                    icon: 'iconfont icon-banjizhiyuanhuodong-copy'
                },
                {
                    // icon: 'el-icon-s-home',
                    index: 'needEvaluateRecords',
                    title: '    待评价记录',
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
                    title: '    我的社区',
                    icon: 'iconfont icon-zuzhi'
                }, 
                {
                    // icon: 'el-icon-s-home',
                    index: 'message',
                    title: '    消息',
                    icon: 'iconfont icon-xiaoxi'
                },
                {
                    // icon: 'el-icon-s-home',
                    index: 'statistics',
                    title: '    志愿统计',
                    icon: 'iconfont icon-shezhi'
                },
            
            ],
            
            message: 'first',
    
            communityMessage: [{
                

            }],
            systemMessage: [{
                 
            }],
        
            
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
            const {data :res} = await this.$http.get("worker/message", {
                params: {  
                    "userId": this.user.id,
                    "communityId": this.user.communityId
                }  
            });
            this.communityMessage = res.data.communityMessage;
            this.systemMessage = res.data.systemMessage;
        },

        addMessage(){
            this.addVisible = true;
        },

     

        confirmAdd(formName){
            this.$refs[formName].validate(async (valid) => {
            if (valid) {
                this.addMessageForm.workerId = this.user.id;
                this.addMessageForm.communityId = this.user.communityId;
                const {data :res} = await this.$http.post("worker/message/add", this.addMessageForm);
                if (res.code == 1 ) {
                    this.addVisible = false;
                    this.$message.success("发布成功！");
                    this.reload();
                
                }else{
                    this.$message.error("发布失败！！！");
                }
            } else {
                console.log('error submit!!');
                return false;
            }
            });
            
        },
        canelAdd(){
            this.addVisible = false;
        },
        
    }

}
</script>

<style lang="less" scoped>
@import "//at.alicdn.com/t/font_2416161_nazgwdqmnsi.css";

.el-header {
  background-color: #373d41;
  display: flex;
  justify-content: space-between;// 左右贴边
  padding-left: 0%;// 左边界
  align-items: center;// 水平
  color: #fff;
  font-size: 20px;
  div { //左侧div加布局
    display: flex;
    align-items: center;
    span {
      margin-left: 15px;
    }
  }
  
}

.message-title{
    cursor: pointer;
}
.handle-row{
    margin-top: 30px;
}

</style>





