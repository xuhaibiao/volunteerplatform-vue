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
                <el-menu default-active="activity" background-color="#EBF1F6" text-color="rgb(37, 35, 35);" active-text-color="#409eff"  unique-opened :collapse="isCollapse" :collapse-transition="false" :router="true">
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
                                <el-form-item label="项目区域" prop="place">
                                    <el-row>
                                        <el-col :span="14">
                                            <v-distpicker :province="screenForm.province" :city="screenForm.city" :area="screenForm.area" 
                                            @province="selectProvince" 
                                            @city="selectCity" 
                                            @area="selectArea">
                                            </v-distpicker>
                                        </el-col>
                                    
                                        <el-col :span="10">
                                            <el-input  v-model="screenForm.activityName" placeholder="活动名" class="handle-input mr10" @keydown.enter.native="seachEnter"></el-input><input v-show="false"/>
                                            <el-button type="primary" icon="el-icon-search" @click="handleSearch">搜索</el-button>
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
                    ref="configurationTable"
                    >
                        <el-table-column prop="activity.id" label="活动编号"  align="center"></el-table-column>
                        <el-table-column prop="activity.name" label="活动名" align="center"></el-table-column>
                        <el-table-column prop="communityName" label="发起社区" align="center"></el-table-column>
                        <el-table-column prop="activityStatus" label="活动状态"  style="color: green" align="center">
                            <template slot-scope="scope">
                                    <span v-if="scope.row.activityStatus==='招募中'" style="color: green">招募中</span>
                                    <span v-else style="color:red">{{scope.row.activityStatus}}</span>
                            </template>
                            
                        </el-table-column>
                        <el-table-column prop="activity.recruitRange" label="面向人群" align="center">
                            <template slot-scope="scope">
                                    {{options[scope.row.activity.recruitRange]}}
                            </template>
                        </el-table-column>
                        <!-- <el-table-column prop="activity.recruitNumber" label="计划招募人数" align="center"  ></el-table-column>
                        <el-table-column prop="hasRecruitedNumber" label="已报名人数" align="center"  ></el-table-column>
                        <el-table-column prop="hasAgreeNumber" label="已招募人数" align="center"  ></el-table-column>
                        <el-table-column prop="activityTimeRange" label="活动时间" align="center"></el-table-column> -->
                        <el-table-column label="操作"  align="center">
                            <template slot-scope="scope">
                                <el-button
                                    type="text"
                                    icon="el-icon-info"
                                    @click="handleInfo(scope.row.activity.id)"
                                    style="color:green"
                                >详情</el-button>
                                <el-button
                                    type="text"
                                    icon="iconfont icon-baoming"
                                    @click="handleSignUp(scope.row)"
                                >报名</el-button>
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
            <!-- 详情弹出框 -->
            <!-- <el-dialog title="活动详情" :visible.sync="infoVisible" >
                <el-form ref="info" :model="info" label-width="100px">
                    <el-form-item label="活动名">
                        <el-lebal v-model="info.activity.name">{{info.activity.name}}</el-lebal>
                    </el-form-item>
                    <el-form-item label="活动所在区" >
                        <el-lebal v-model="info.activity.province">{{info.activity.province}}</el-lebal>
                        <el-lebal v-model="info.activity.city">{{info.activity.city}}</el-lebal>
                        <el-lebal v-model="info.activity.area">{{info.activity.area}}</el-lebal>
                    </el-form-item>
                    <el-form-item label="详细地址">
                        <el-lebal v-model="info.activity.detailAddress">{{info.activity.detailAddress}}</el-lebal>
                    </el-form-item>
                    <el-form-item label="发起社区">
                        <el-lebal v-model="info.communityName">{{info.communityName}}</el-lebal>
                    </el-form-item>
                    <el-form-item label="发起人">
                        <el-lebal v-model="info.sponsor">{{info.sponsor}}</el-lebal>
                    </el-form-item>
                    <el-form-item label="工时/小时">
                        <el-lebal v-model="info.activity.workingHours">{{info.activity.workingHours}}</el-lebal>
                    </el-form-item>
                    <el-form-item label="招募人数">
                        <el-lebal v-model="info.activity.recruitNumber">{{info.activity.recruitNumber}}</el-lebal>
                    </el-form-item>
                    <el-form-item label="招募开始时间">
                        <el-lebal v-model="info.activity.recruitBeginTime">{{info.activity.recruitBeginTime}}</el-lebal>
                    </el-form-item>
                     <el-form-item label="招募截止时间">
                        <el-lebal v-model="info.activity.recruitEndTime">{{info.activity.recruitEndTime}}</el-lebal>
                      </el-form-item>
                    <el-form-item label="活动内容">
                        <el-input v-model="info.activity.content" type="textarea" :disabled="true" :rows="5"></el-input>
                    </el-form-item>
                    
                </el-form>
            </el-dialog> -->
            
            <!-- 报名弹出框 -->
            <el-dialog title="信息确认" :visible.sync="signUpInfoVisible" width="30%">
                <el-form ref="info" :model="info" label-width="100px">
                    <el-form-item label="活动名">
                        <el-lebal v-model="signUpInfo.activity.name">{{signUpInfo.activity.name}}</el-lebal>
                    </el-form-item>
                    <el-form-item label="活动所在区" >
                        <el-lebal v-model="signUpInfo.activity.province">{{signUpInfo.activity.province}}</el-lebal>
                        <el-lebal v-model="signUpInfo.activity.city">{{signUpInfo.activity.city}}</el-lebal>
                        <el-lebal v-model="signUpInfo.activity.area">{{signUpInfo.activity.area}}</el-lebal>
                    </el-form-item>
                    <el-form-item label="详细地址">
                        <el-lebal v-model="signUpInfo.activity.detailAddress">{{signUpInfo.activity.detailAddress}}</el-lebal>
                    </el-form-item>
                    <el-form-item label="发起社区">
                        <el-lebal v-model="signUpInfo.communityName">{{signUpInfo.communityName}}</el-lebal>
                    </el-form-item>
                    <el-form-item label="发起人">
                        <el-lebal v-model="signUpInfo.sponsor">{{signUpInfo.sponsor}}</el-lebal>
                    </el-form-item>
                    <el-form-item label="工时/小时">
                        <el-lebal v-model="signUpInfo.activity.workingHours">{{signUpInfo.activity.workingHours}}</el-lebal>
                    </el-form-item>
                    <el-form-item label="活动内容">
                        <el-input v-model="signUpInfo.activity.content" type="textarea" :disabled="true" :rows="5"></el-input>
                    </el-form-item>
                    <el-form-item label="报名人">
                        <el-lebal v-model="signUpInfo.user.name" :disabled="true" :rows="5">{{signUpInfo.user.name}}</el-lebal>
                    </el-form-item>
                    <el-form-item label="报名人身份证">
                        <el-lebal v-model="signUpInfo.user.idCard" :disabled="true" :rows="5">{{signUpInfo.user.idCard}}</el-lebal>
                    </el-form-item>
                    <el-form-item label="活动开始时间">
                        <el-lebal v-model="signUpInfo.activity.activityBeginTime" :disabled="true" :rows="5">{{signUpInfo.activity.activityBeginTime}}</el-lebal>
                    </el-form-item>
                </el-form>
                <span slot="footer" class="dialog-footer">
                    <el-button type="primary" @click="confirmSignUp">确定报名</el-button>
                    <el-button @click="cancelSignUp">取 消</el-button>
                </span>
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
            screenForm: { 
                province: '', 
                city: '',
                area: '' ,
                activityName:''
            
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
            info:{
                activity:{}
            },

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
                {
                    // icon: 'el-icon-s-home',
                    index: 'setting',
                    title: '    设置',
                    icon: 'iconfont icon-shezhi'
                }, 
            
            ],
            tableData:[{ },
            ],
            options:["社区内部", "全国"]
        };
    },
    // 类似onload
    created() {
        this.collapse = global.collapse;
        this.user = JSON.parse(window.sessionStorage.getItem("user"));
        this.getUserInfo();
        this.getActivity();
        // this.screenForm.province="省";
        // this.screenForm.city="市";
        // this.screenForm.area="区";
      
        
    },
    methods:{
        logout(){
            window.sessionStorage.clear();
            this.$router.push("/login");
        },
        async getUserInfo(){
            const {data :res} = await this.$http.get("information/", {
                params: {  
                    "userId": this.user.id,
                    "type": 0   //代表志愿者
                }  
            });
            window.sessionStorage.setItem("user",JSON.stringify(res.data));
            this.user = res.data;
            
            
        },
        async getActivity(){
            const {data:res} = await this.$http.get("volunteer/activity");
            this.tableData = res.data;
            this.$refs.configurationTable.$el.style.width = '99.5%';
           
            // if( res.status != 200) return this.$message.error("操作失败！！！");
            
        },
        
        collapseChage() {
            this.collapse = !this.collapse;
            global.collapse = !global.collapse;
        },
        
        handleInfo(id) {
            const { href } = this.$router.resolve({
                name: "活动详情",
                path: '/activityInfo',
                query: {
                    activityId: id,

                }
            });
            window.open(href, '_blank');
            // this.info = row;
            // this.infoVisible = true;
    
        },
        handleSignUp(row){
            if(!(row.activityStatus=="招募中")){
                this.$message.warning("活动未在招募时间段！");
            }else if(row.activity.recruitRange == 0 && this.user.communityId != row.communityId){
                this.$message.warning("活动只对社区内部开放，请先加入该社区！");
            }else{
                this.signUpInfo = row;
                this.signUpInfo.user = this.user;
                this.signUpInfoVisible = true;
            }
        },
        async confirmSignUp(){
            this.signUpData.activityId = this.signUpInfo.activity.id;
            this.signUpData.userId = this.signUpInfo.user.id;
            const {data:res} = await this.$http.post("volunteer/activity/signUp",this.signUpData);
            if(res.code == 2){
                this.signUpInfoVisible = false;
                if(res.flag=="warning"){
                    this.$message.warning(res.msg);
                }else{
                    this.$message.error(res.msg);
                }
                
            }else if(res.code == 1){
                this.tableData.hasRecruitedNumber = this.tableData.hasRecruitedNumber+1;
                this.reload();
                this.signUpInfoVisible = false;
                this.$message.success("报名成功！");
            }
        },
        cancelSignUp(){
            this.signUpInfoVisible = false;
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
            if(this.screenForm.province == '') this.screenForm.province = "省";
            if(this.screenForm.city == '') this.screenForm.city = "市";
            if(this.screenForm.area == '') this.screenForm.area = "区";
            const {data:res} = await this.$http.get("volunteer/activity/search",{  
                params: {  
                    "province": this.screenForm.province,
                    "city": this.screenForm.city,
                    "area": this.screenForm.area,
                    "activityName": this.screenForm.activityName
                }  
            });
            this.tableData = res.data;

            
        },
        seachEnter(){
            this.handleSearch();
        },
        reset(){
            this.screenForm.province = '';
            this.screenForm.city = '';
            this.screenForm.area = '';
            this.screenForm.activityName = '';
            this.getActivity();
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




