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
                <el-menu default-active="community" background-color="#EBF1F6" text-color="rgb(37, 35, 35);" active-text-color="#409eff" 	unique-opened :collapse="isCollapse" :collapse-transition="false" :router="true">
                    <template v-for="item in items">
                        <el-menu-item :index="item.index" :key="item.index">
                            <i :class="item.icon"></i>
                            <span v-if="!collapse" slot="title" >{{ item.title }}</span>
                        </el-menu-item>
                    </template>
            </el-menu>
            </el-aside>

            <el-main >
                <el-row :gutter="20">
                    <el-col :span="8">
                        <el-card shadow="hover" class="mgb20" style="height:252px;  background: #EAEDF1 " v-cloak>
                    
                            <div class="user-info-list">
                                社区组织编号：
                                <span><el-lebal v-model="this.communityInfo.id">{{this.communityInfo.id}}</el-lebal></span>
                            </div>
                            <div class="user-info-list">
                                社区组织名：
                                <span><el-lebal v-model="this.communityInfo.name">{{this.communityInfo.name}}</el-lebal></span>
                            </div>
                            <div class="user-info-list">
                                社区组织地点：
                                <span><el-lebal v-model="this.communityInfo.detailAddress">{{this.communityInfo.detailAddress}}</el-lebal></span>
                            </div>
                            <div class="user-info-list">
                                创建人：
                                <span><el-lebal v-model="this.communityInfo.undertaker">{{this.communityInfo.undertaker}}</el-lebal></span>
                            </div>
                            <div class="user-info-list">
                                创建日期：
                                <span><el-lebal v-model="this.communityInfo.createTime">{{this.communityInfo.createTime}}</el-lebal></span>
                            </div>

                            <div class="user-info-list">
                                <el-button
                                    type="text"
                                    @click="handleJoinList"
                                >查看申请列表</el-button>
                            </div>
                        </el-card>
                    </el-col>



                    <el-col :span="16">
                        <el-card shadow="hover" class="mgb20" style="height:252px;  background: #EAEDF1 ">
                            <el-table
                                :data="workerTableData"
                                class="table"
                                header-cell-class-name="table-header"
                                >
                                <el-table-column prop="id" label="工作者编号" width="100" align="center"></el-table-column>
                                <el-table-column prop="name" label="工作者姓名" align="center"></el-table-column>
                                <el-table-column prop="phone" label="工作者电话" align="center"></el-table-column>
                                <el-table-column prop="email" label="工作者邮箱" align="center"  ></el-table-column>
                                
                            </el-table>
                            
                        </el-card>
                    </el-col>
                </el-row>   
       
                <el-row>
                    <el-card shadow="hover" class="mgb20" style="  background: #EAEDF1 ">
                        <el-table
                            :data="volunteerTableData.slice((currentPage-1)*pagesize,currentPage*pagesize)"
                            class="table"
                            header-cell-class-name="table-header"
                            
                            >
                            <el-table-column prop="id" label="志愿者编号" align="center"></el-table-column>
                            <el-table-column prop="name" label="志愿者姓名" align="center" ></el-table-column>
                            <el-table-column prop="phone" label="志愿者电话" align="center" width="120px"></el-table-column>
                            <el-table-column prop="gender" label="志愿者性别" align="center"  >
                                <template slot-scope="scope">
                                    {{options[scope.row.gender]}}
                                </template>
                            </el-table-column>
                            <el-table-column prop="idCard" label="志愿者身份证号" align="center"  ></el-table-column>
                            <el-table-column prop="volunteerHours" label="志愿者总工时" align="center" ></el-table-column>
                            <el-table-column prop="volunteerScore" label="志愿者总分数" align="center" ></el-table-column>
                            <el-table-column prop="volunteerNumber" label="志愿者志愿次数" align="center" ></el-table-column>
                            <el-table-column prop="address" label="志愿者地址" align="center" ></el-table-column>
                        </el-table>
                            
                    </el-card>
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
                        :total="volunteerTableData.length">   
                    </el-pagination>
                </div>
            </el-main>
           
            
         
       

            <!-- 申请加入列表弹出框 -->
            <el-dialog title="报名情况" :visible.sync="joinListVisible" width="100%" >
                <el-table
                :data="joinListData"
                border
                class="table"
                header-cell-class-name="table-header"
                >
                    <el-table-column prop="volunteer.id" label="志愿者编号" align="center"></el-table-column>
                    <el-table-column prop="volunteer.name" label="志愿者姓名" align="center"  ></el-table-column>
                    <el-table-column prop="volunteer.idCard" label="志愿者身份证号" align="center"></el-table-column>
                    <el-table-column prop="volunteer.volunteerHours" label="志愿工时" align="center"  ></el-table-column>
                    <el-table-column prop="volunteer.volunteerScore" label="志愿总分" align="center" ></el-table-column>
                    <el-table-column prop="volunteer.volunteerNumber" label="志愿次数" align="center"  ></el-table-column>
                    <el-table-column prop="message.createTime" label="申请时间" align="center"  ></el-table-column>
                    <el-table-column label="操作" align="center">
                        <template slot-scope="scope">
                            <!-- <el-button
                                type="text"
                                icon="el-icon-info"
                                style="color:green"
                                @click="handleInfo(scope.row)"
                            >详情</el-button> -->
                            <el-button type="text" icon="el-icon-check" @click="handleAgree(scope.$index, scope.row)">同意</el-button>
                            <el-button type="text" icon="el-icon-close" style="color:red" @click="handleRefuse(scope.$index, scope.row)">拒绝</el-button>
                        </template>
                    </el-table-column>
                </el-table>
            </el-dialog>
           
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
            communityInfo:{

            },
            workerTableData:[{
                
            }],
            volunteerTableData:[{

            }],
            
            currentPage:1, //初始页
            pagesize:10,    //    每页的数据
            
            joinListVisible: false,
            collapse: '',
            info:{
                activity:{}
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
            tableData:[{ 

            },
            ],
            reviewTableData:[
                {
                    volunteer: {},
                    
                }
            ],
            options: [
                
              "女","男"
            
            ],
            joinListData:[
                {
                    volunteer:{},
                    message:''
                }
            ],

            
                
            
        };
    },
    // 类似onload
    created() {
        this.collapse = global.collapse;
        this.user = JSON.parse(window.sessionStorage.getItem("user"));
        this.getMyCommunity();
        
    },
    methods:{
        logout(){
            window.sessionStorage.clear();
            this.$router.push("/login");
        },
        async getMyCommunity(){
            const {data:res} = await this.$http.get("worker/community",{
                params: {  
                    "communityId": this.user.communityId
                } 
            });
            this.communityInfo = res.data.userCommuntity;
            this.workerTableData = res.data.workers;
            this.volunteerTableData = res.data.volunteers;

            
            // if( res.status != 200) return this.$message.error("操作失败！！！");
            
        },
        
        collapseChage() {
            this.collapse = !this.collapse;
            global.collapse = !global.collapse;
        },
        
        
        
        //申请通过
        async handleAgree(index, row){
            
            const {data :res} = await this.$http.post("worker/community/agreeJoin",row.message);
            if (res.code == 1 ) {
                this.joinListData.splice(index,1);
                this.$message.success("同意加入成功！");
                    
            }else {
                if(res.flag == "-1"){
                    this.joinListData.splice(index,1);
                    this.$message.error(res.msg);
                }else{
                    this.$message.error(res.msg);
                }
                
            }
        },
    
        //申请未通过
        async handleRefuse(index, row){
            
            const {data :res} = await this.$http.post("worker/community/refuseJoin", row.message);
            if (res.code == 1 ) {
                this.joinListData.splice(index,1);
                this.$message.success("拒绝加入成功！");
                    
            }else{
                this.$message.error("拒绝加入失败！");
            }
        },



        selectProvince(value) {
            this.addActivityForm.province = value.value
    
        },
        selectCity(value) {
            this.addActivityForm.city = value.value
           
        },
        selectArea(value) {
            this.addActivityForm.area = value.value
        },

        async handleJoinList(){
            const {data:res} = await this.$http.get("worker/community/joinList",{  
                params: {  
                    "communityId": this.communityInfo.id
                }  
            });
            this.joinListData = res.data;
            this.joinListVisible = true;
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
      margin-left: 15px;
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

.user-info-list {
    font-size: 14px;
    // color: rgb(240, 35, 35);
    line-height: 25px;
}

// .user-info-list span {
//     margin-left: 70px;
// }

.mgb20 {
    margin-bottom: 20px;
}



[v-cloak] {
    display: none;
}
</style>



