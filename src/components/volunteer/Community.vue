<template>
    <el-container>
        <el-header>
            <div>
                <!--伸缩按钮-->
                <div class="collapse-btn" @click="collapseChage">
                    <i v-if="!collapse" class="el-icon-s-fold"></i>
                    <i v-else class="el-icon-s-unfold"></i>
                </div>
                <span style="width=90%">
                    社区志愿服务网 欢迎 
                    <el-lebal style="color:#F00" v-model=this.user.name>{{this.user.name}}</el-lebal> 
                    志愿者，     
                    <el-lebal v-if="this.userCommuntity!=null" style="color:#F00" v-model=this.userCommuntity>您已加入：{{this.userCommuntity.name}}，
                        <el-button type="text" @click="quit" >点击退出组织</el-button>
                    </el-lebal>
                    <el-lebal v-else style="color:#F00" >您尚未加入任何社区组织，可选择申请加入</el-lebal>
                    
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
                            <span v-if="!collapse" slot="title">{{ item.title }}</span>
                        </el-menu-item>
                    </template>
            </el-menu>
            </el-aside>

            <el-main>
                <el-row>
                        <div class="form-box">
                            <el-form ref="screenForm" :model="screenForm" label-width="80px">
                                <el-form-item label="组织区域" prop="place">
                                    <el-row >
                                        <el-col :span="14">
                                            <v-distpicker :province="screenForm.province" :city="screenForm.city" :area="screenForm.area" 
                                            @province="selectProvince" 
                                            @city="selectCity" 
                                            @area="selectArea">
                                            </v-distpicker>
                                        </el-col>
                                    
                                        <el-col :span="10">
                                            <el-input  v-model="screenForm.communityName" placeholder="组织名" class="handle-input mr10" @keydown.enter.native="seachEnter"></el-input><input v-show="false"/>
                                            <el-button type="primary" icon="el-icon-search" @click="handleSearch" >搜索</el-button>
                                            <el-button type="primary" @click="reset">重置</el-button>
                                        </el-col>
                                        
                                        
                                    </el-row>
                                    
                                </el-form-item>
                                <!-- <el-button type="primary" @click="screen(placeholders)">筛选</el-button> -->
                            </el-form>
                            
                        </div>
                </el-row>
                
                <el-row>
                    <el-table
                :data="tableData.slice((currentPage-1)*pagesize,currentPage*pagesize)"
                border
                class="table"
                header-cell-class-name="table-header"
                >
                <el-table-column prop="id" label="组织编号" width="100" align="center"></el-table-column>
                <el-table-column prop="name" label="社区组织名" align="center"></el-table-column>
                <el-table-column prop="detailAddress" label="所在地" align="center"></el-table-column>
                <el-table-column prop="undertaker" label="发起人" align="center"></el-table-column>
                
                <el-table-column label="操作" width="180" align="center">
                    <template slot-scope="scope">
                        <el-button
                            type="text"
                            icon="iconfont icon-baoming"
                            @click="handleJoin(scope.row)"
                        >申请加入</el-button>
                    </template>
                </el-table-column>
                    </el-table>
                </el-row>
                
                <div class="block">
                    <!-- <el-pagination
                        style="text-align: right"
                        background
                        @size-change="handleSizeChange"
                        @current-change="handleCurrentChange"
                        :current-page.sync="currentPage3"
                        :page-size="100"
                        layout="prev, pager, next, jumper"
                        :total="1000">
                    </el-pagination> -->
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
                province: '', 
                city: '',
                area: '' ,
                communityName:''
            
            },
            signUpData: {
                activityId:'',
                userId:''
            },
            currentPage:1, //初始页
            pagesize:10,    //    每页的数据
            infoVisible: false,
            signUpInfoVisible: false,
            collapse: '',
            
            userCommuntity:{},
            signUpInfo:{
                activity:{},
                user:{}
            },
            
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
            tableData:[{ },
            ],

            joinData:{
                volunteer:{},
                communityId:'',
            }
        };
    },
    // 类似onload
    created() {
        this.collapse = global.collapse;
        this.user = JSON.parse(window.sessionStorage.getItem("user"));
        this.getCommunity();
        // this.screenForm.province="省";
        // this.screenForm.city="市";
        // this.screenForm.area="区";
        // this.screenForm.communityName = "";
        
    },
    methods:{
        logout(){
            window.sessionStorage.clear();
            this.$router.push("/login");
        },
        
        async getCommunity(){
            const {data:res} = await this.$http.get("volunteer/community",{
                params: {  
                    "volunteerId": this.user.id,
                }  
            });
            this.tableData = res.data.communityOrganizations;
            this.userCommuntity = res.data.userCommuntity;
            this.user = res.data.volunteer;
            window.sessionStorage.setItem("user",JSON.stringify(this.user));
        },
        
        collapseChage() {
            this.collapse = !this.collapse;
            global.collapse = !global.collapse;
        },
        
        
        
        selectProvince(value) {
            this.screenForm.province = value.value
    
        },
        selectCity(value) {
            this.screenForm.city = value.value
           
        },
        selectArea(value) {
            this.screenForm.area = value.value
            
        },
        async handleSearch(){
            if(this.screenForm.province == ''||this.screenForm.province == null) this.screenForm.province = "省";
            if(this.screenForm.city == ''||this.screenForm.city == null) this.screenForm.city = "市";
            if(this.screenForm.area == ''||this.screenForm.area == null) this.screenForm.area = "区";
            const {data:res} = await this.$http.get("volunteer/community/search",{  
                params: {  
                    "province": this.screenForm.province,
                    "city": this.screenForm.city,
                    "area": this.screenForm.area,
                    "communityName": this.screenForm.communityName
                }  
            });
            this.tableData = res.data.communityOrganizations;

        },
        reset(){
            this.screenForm.province = '';
            this.screenForm.city = '';
            this.screenForm.area = '';
            this.screenForm.communityName = '';
            this.getCommunity();
        },

        seachEnter(){
            this.handleSearch();
        },

        async quit(){
            const {data:res} = await this.$http.post("volunteer/community/quit",this.user);
        
            if(res.code==1){
                this.user.communityId = 0;
                this.userCommuntity = null;
                window.sessionStorage.setItem("user",JSON.stringify(this.user));
                this.$message.success("退出成功！");

            }else{
                this.$message.console.error("退出失败！");
            }
        },

        async handleJoin(row){
            if(this.user.communityId != 0){
                this.$message.error("每位志愿者只能加入一个社区组织，请先退出现有组织！");
            }else {
                this.joinData.volunteer = this.user;
                this.joinData.communityId = row.id;
                const {data:res} = await this.$http.post("volunteer/community/join",this.joinData);
                if(res.code==1){
                    this.$message.success("申请已发出！");

                }else{
                    this.$message.error(res.msg);
                }
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
// @import "//at.alicdn.com/t/font_2416161_nazgwdqmnsi.css";
@import "//at.alicdn.com/t/font_2416161_fysvb8ysy79.css";


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


.handle-input {
    width: 200px;
   
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




