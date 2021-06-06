<template>
    <el-container>
        <el-header>
            <div>
               
                <span>社区志愿服务网 </span>
            
            </div>
            <el-button type="info" @click="logout">安全退出</el-button>
        </el-header>
        <el-container>
            <el-aside :width="collapse ?'64px':'200px'">
                <!--侧边栏菜单区 unique-opened="true" 只保持一个菜单展开 router开启路由-->
                <el-menu default-active="workerAuthority" background-color="#EBF1F6" text-color="rgb(37, 35, 35);" active-text-color="#409eff" 	unique-opened :collapse="isCollapse" :collapse-transition="false" :router="true">
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
                
                <el-row>
                    <el-table
                    :data="tableData.slice((currentPage-1)*pagesize,currentPage*pagesize)"
                    style="width: 100%"
                    ref="configurationTable"
                    >
                        <el-table-column type="expand">
                            <template slot-scope="props">
                                <el-form label-position="left" inline class="demo-table-expand">
                                    <el-form-item label="性别" >
                                        <span>{{ options[props.row.worker.gender] }}</span>
                                    </el-form-item>
                                    <el-form-item label="密码">
                                        <span>{{props.row.worker.password}}</span>
                                    </el-form-item>
                                    <el-form-item label="创建时间">
                                        <span>{{ props.row.createTime }}</span>
                                    </el-form-item>
                                    <el-form-item label="电话">
                                        <span>{{ props.row.worker.phone }}</span>
                                    </el-form-item>
                                    <el-form-item label="地址">
                                        <span>{{ props.row.worker.address }}</span>
                                    </el-form-item>
                                    <el-form-item label="邮箱">
                                        <span>{{ props.row.worker.email }}</span>
                                    </el-form-item>
                                
                                </el-form>
                            </template>
                        </el-table-column>
                        <el-table-column prop="worker.id" label="工作者编号" align="center"></el-table-column>
                        <el-table-column prop="worker.name" label="工作者姓名" align="center"></el-table-column>
                        <el-table-column prop="worker.idCard" label="工作者身份证" align="center"></el-table-column>
                        <el-table-column prop="worker.banStatus" label="封禁状态"  align="center">
                            <template slot-scope="scope">
                                <el-switch
                                v-model="scope.row.worker.banStatus"
                                :active-value= '1' 
                                :inactive-value= '0'
                                active-text="封禁"
                                inactive-text="正常"
                                @change="handleBanStatus(scope.row.worker)"
                                >
                                </el-switch>
                            </template>
                        </el-table-column>
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
            
        </el-container>
                
    </el-container>


</template>

<script>
import VDistpicker from 'v-distpicker'
import global from '../../components/Global'

export default {
    inject:['reload'], 
    components: { VDistpicker },

    data(){
        return{
            user:{},
            screenForm: { 
                activityName:''
            
            },
            signUpData: {
                activityId:'',
                userId:''
            },
            currentPage:1, //初始页
            pagesize:10,    //    每页的数据
           
            collapse: '',
           
            
            items: [
                {
                    index: 'home',
                    title: '    主页',
                    icon: 'iconfont icon-geren1'
                },
                {
                    index: 'communityReview',
                    title: '    新建社区审核',
                    icon: 'iconfont icon-icon-test'
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
            tableData:[{ 

            },
            
            ],
            options: [
                
              "女","男"
            
            ],
            banStatus: '1'

        

        
        };
    },
    // 类似onload
    created() {
        this.collapse = global.collapse;
        this.user = JSON.parse(window.sessionStorage.getItem("user"));
        this.getWorker();
        
       
    },
    methods:{
        logout(){
            window.sessionStorage.clear();
            this.$router.push("/login");
        },
        async getWorker(){
            const {data:res} = await this.$http.get("administrator/workerAuthority");
            this.tableData = res.data;
            this.$refs.configurationTable.$el.style.width = '99.5%';
            // if( res.status != 200) return this.$message.error("操作失败！！！");
            
        },
        
        collapseChage() {
            this.collapse = !this.collapse;
            global.collapse = !global.collapse;
        },
        
        async handleBanStatus(row){
            const {data:res} = await this.$http.post("administrator/workerAuthority/changeBanStatus", row);
            if(res.code == 2){
                this.$message.success("改变封禁状态失败！");
            }
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
    background-color: #EBF1F6;
    // overflow-y: hidden;
}

.handle-input {
    width: 300px;
   
}
.mr10 {
    margin-right: 10px;
}

.distpicker-address-wrapper {
  select {
    padding: 0px 10px !important;
    height: 30px !important;
    font-size: 15px !important;
    line-height: 30px !important;
  }
}
</style>



