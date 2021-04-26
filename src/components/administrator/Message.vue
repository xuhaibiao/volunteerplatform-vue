<template>
    <el-container>
        <el-header>
            <div>
               
                <span>社区志愿服务网
                </span>
            </div>
            <div>
                <el-button type="success" icon="el-icon-plus" @click="addMessage">消息发布</el-button>
                <el-button type="info" @click="logout">安全退出</el-button>
            </div>
            
        </el-header>
        <el-container>
            <el-aside :width="collapse ?'64px':'200px'">
                <!--侧边栏菜单区 unique-opened="true" 只保持一个菜单展开 router开启路由-->
                 <el-menu default-active="message" background-color="#EBF1F6" text-color="rgb(37, 35, 35);" active-text-color="#409eff" 	unique-opened :collapse="isCollapse" :collapse-transition="false" :router="true">
                    <template v-for="item in items">
                        <template v-if="item.subs">
                            <el-submenu :index="item.index" :key="item.index">
                                <template slot="title">
                                    <i :class="item.icon"></i>
                                    <span slot="title">{{ item.title }}</span>
                                </template>
                                <template v-for="subItem in item.subs">
                                    <el-submenu
                                        v-if="subItem.subs"
                                        :index="subItem.index"
                                        :key="subItem.index"
                                    >
                                        <template slot="title">{{ subItem.title }}</template>
                                        <el-menu-item
                                            v-for="(threeItem,i) in subItem.subs"
                                            :key="i"
                                            :index="threeItem.index"
                                        >{{ threeItem.title }}</el-menu-item>
                                    </el-submenu>
                                    <el-menu-item
                                        v-else
                                        :index="subItem.index"
                                        :key="subItem.index"
                                    >{{ subItem.title }}</el-menu-item>
                                </template>
                            </el-submenu>
                        </template>

                        <template v-else>
                            <el-menu-item :index="item.index" :key="item.index">
                            <i :class="item.icon"></i>
                            <span v-if="!collapse" slot="title">{{ item.title }}</span>
                            </el-menu-item>
                        </template>
                        
                    </template>
                </el-menu>
            </el-aside>

            <el-main>
                <!-- <div align=right> -->
                   
                <!-- </div> -->
                

                <el-row>
                    <el-table
                    :data="tableData.slice((currentPage-1)*pagesize,currentPage*pagesize)"
                    style="width: 100%"
                    ref="configurationTable"
                    >
                        <el-table-column type="expand">
                            <template slot-scope="props">
                                <el-form label-position="left" inline class="demo-table-expand">
                                    <el-form-item label="内容" >
                                        <span>{{props.row.content}}</span>
                                    </el-form-item>
                                    <el-form-item label="发送者">
                                        <span>{{props.row.sender}}</span>
                                    </el-form-item>
                                    <el-form-item label="接收者">
                                        <span>{{ props.row.recipient}}</span>
                                    </el-form-item>
                                    
                                </el-form>
                            </template>
                        </el-table-column>
                        <el-table-column prop="id" label="消息编号" align="center"></el-table-column>
                        <el-table-column prop="title" label="消息标题" align="center"></el-table-column>
                        <el-table-column prop="type" label="消息类型" align="center">
                            <template slot-scope="scope">
                                    {{messageType[scope.row.type]}}
                                </template>
                        </el-table-column>
                        <el-table-column prop="createTime" label="创建时间" align="center"></el-table-column>
                    </el-table>   
                   
                </el-row>
                

                <div class="block">
                    <el-pagination
                        style="text-align: right"
                        background
                        @size-change="handleSizeChange"
                        @current-change="handleCurrentChange"
                        :current-page="currentPage"
                        :page-sizes="[1, 10, 20, 40]" 
                        :page-size="pagesize"        
                        layout="total, sizes, prev, pager, next, jumper"
                        :total="tableData.length">   
                    </el-pagination>
                </div>

                
            </el-main>

            <el-dialog title="发布消息" :visible.sync="addVisible" width="40%">
                <el-form ref="addMessageForm" :model="addMessageForm" :rules="addMessageRules" label-width="110px">
                    <el-form-item label="消息标题" prop="title" style="width: 60%">
                        <el-input v-model="addMessageForm.title" type="integer"></el-input>
                    </el-form-item>
                    
                    <el-form-item label="消息内容"  prop="content" style="width: 70%">
                        <el-input type="textarea" rows="5" v-model="addMessageForm.content"></el-input>
                    </el-form-item>
                    <el-form-item label="面向人群" prop="userType">
                        <el-select v-model="addMessageForm.userType" placeholder="请选择">
                            <el-option
                            v-for="item in options"
                            :key="item.value"
                            :label="item.label"
                            :value="item.value">
                            </el-option>
                        </el-select>
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
            tableData:[],
            currentPage:1, //初始页
            pagesize:10,    //    每页的数据
            options: [{
                value: '0',
                label: '全平台用户'
                }, {
                value: '1',
                label: '志愿者'
                }, {
                value: '2',
                label: '社区工作者'
            }],
            addMessageForm:{
                title: '',
                content: '',
                userType:'0'
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
                    index: 'home',
                    title: '    主页',
                    icon: 'iconfont icon-geren1'
                },
                {
                    index: 'message',
                    title: '    消息',
                    icon: 'iconfont icon-xiaoxi'
                },
                {
                    // icon: 'el-icon-s-home',
                    // index: 'authorityManagement',
                    index: '3',
                    title: '    权限管理',
                    icon: 'iconfont icon-quanxianguanli',
                    subs: [
                        {
                            index: 'activityAuthority',
                            title: '活动权限'
                        },
                        {
                            index: '3-2',
                            title: '用户权限',
                            subs: [
                                {
                                    index: 'volunteerAuthority',
                                    title: '志愿者权限'
                                },
                                {
                                    index: 'workerAuthority',
                                    title: '社区工作者权限'
                                }
                            ]
                        },
                        
                    ]
                },
            
            ],
            
            messageType:[
                "",
                "申请加入社区消息",
                "申请退出社区消息",
                "取消活动报名消息",
                "工作者发布社区消息",
                "系统消息",

            ]
    
            
        
            
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
            const {data :res} = await this.$http.get("administrator/message");
            this.tableData = res.data;
        },

        addMessage(){
            this.addVisible = true;
        },

        confirmAdd(formName){
            this.$refs[formName].validate(async (valid) => {
            if (valid) {
                const {data :res} = await this.$http.post("administrator/message/add", this.addMessageForm);
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

        // 初始页currentPage、初始每页数据数pagesize和数据data
        handleSizeChange(size) {
                this.pagesize = size;
                console.log(this.pagesize)  //每页下拉显示数据
        },
        handleCurrentChange(currentPage){
                this.currentPage = currentPage;
                console.log(this.currentPage)  //点击第几页
        },
        
    }

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
      margin-left: 35px;
    }
  }
  
}
.el-aside{
    background-color: #EBF1F6;
}
.el-main{
     /* background-image: url(./assets/img/main.png); */
     background-color: #EBF1F6;

}

.message-title{
    cursor: pointer;
}
.handle-row{
    margin-top: 30px;
}

</style>





