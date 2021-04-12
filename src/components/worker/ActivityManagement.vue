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
                <el-menu default-active="activityManagement" background-color="#545c64" text-color="#fff" active-text-color="#409eff" 	unique-opened :collapse="isCollapse" :collapse-transition="false" :router="true">
                    <template v-for="item in items">
                        <el-menu-item :index="item.index" :key="item.index">
                            <i :class="item.icon"></i>
                            <span v-if="!collapse" slot="title">{{ item.title }}</span>
                        </el-menu-item>
                    </template>
            </el-menu>
            </el-aside>

            <el-main>
                <el-row :gutter="20">
                    
                    <el-col :span="20">
                        <div class="form-box">
                            <el-form ref="screenForm" :model="screenForm" label-width="80px">
                                <el-form-item label="活动筛选" prop="place">
                                    <el-input  v-model="screenForm.activityName" placeholder="活动名" class="handle-input mr10"></el-input>
                                    <el-button type="primary" icon="el-icon-search" @click="handleSearch">搜索</el-button>
                                    <el-button type="primary" @click="reset">重置</el-button>
                                    <el-button type="success" icon="el-icon-plus" @click="handleAdd">发布活动</el-button>
                                </el-form-item>
                                <!-- <el-button type="primary" @click="screen(placeholders)">筛选</el-button> -->
                            </el-form>
                        </div>
                    </el-col>
      
                </el-row>
            
                <el-row>
                    <el-table
                :data="tableData.slice((currentPage-1)*pagesize,currentPage*pagesize)"
                border
                class="table"
                header-cell-class-name="table-header"
                >
                <el-table-column prop="activity.id" label="活动编号" width="100" align="center"></el-table-column>
                <el-table-column prop="activity.name" label="活动名" align="center"></el-table-column>
                <el-table-column prop="activityStatus" label="活动状态" align="center">
                    <template slot-scope="scope">
                        <el-button v-if="scope.row.activityStatus=='招募中'" type="text" @click="handleReview(scope.row)">招募中,去审核报名</el-button>
                        <el-lebal v-else >{{scope.row.activityStatus}}</el-lebal>
                    </template>
                </el-table-column>
                <el-table-column prop="activity.recruitNumber" label="计划招募人数" align="center" width="120" ></el-table-column>
                <el-table-column prop="hasRecruitedNumber" label="已报名人数" align="center" width="100" ></el-table-column>
                <el-table-column prop="hasAgreeNumber" label="已招募人数" align="center" width="100" ></el-table-column>
                <el-table-column prop="activityTimeRange" label="活动时间" align="center"></el-table-column>
                <el-table-column label="操作" width="250" align="center">
                    <template slot-scope="scope">
                        <el-button
                            type="text"
                            icon="el-icon-info"
                            style="color:green"
                            @click="handleInfo(scope.row)"
                        >详情</el-button>
                        <el-button type="text" icon="el-icon-edit" @click="handleEdit(scope.row)">修改</el-button>
                        
                        <el-button type="text" icon="el-icon-delete" style="color:red" @click="handleDelete(scope.$index, scope.row)">删除</el-button>
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
            <!-- 详情弹出框 -->
            <el-dialog title="活动详情" :visible.sync="infoVisible" width="30%">
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
            </el-dialog>
            
            <!-- 发布弹出框 -->
            <el-dialog title="发布活动" :visible.sync="addVisible" width="40%">
                <el-form ref="addActivityForm" :model="addActivityForm" :rules="addActivityRules" label-width="110px">
                    <el-form-item label="活动名" prop="name" style="width: 60%">
                        <el-input v-model="addActivityForm.name" type="integer"></el-input>
                    </el-form-item>
                    <el-form-item label="活动省市区" prop="address">
                        <v-distpicker :province="addActivityForm.province" :city="addActivityForm.city" :area="addActivityForm.area" 
                                    @province="selectProvince" 
                                    @city="selectCity" 
                                    @area="selectArea">
                        </v-distpicker>
                    </el-form-item>
                    <el-form-item label="详细地址" prop="detailAddress"  style="width: 70%">
                        <el-input v-model="addActivityForm.detailAddress"></el-input>
                    </el-form-item>
                    <el-form-item label="活动工时" prop="workingHours"  style="width: 30%">
                        <el-input v-model.number="addActivityForm.workingHours"></el-input>
                    </el-form-item>
                    <el-form-item label="招募人数" prop="recruitNumber"  style="width: 30%">
                        <el-input v-model.number="addActivityForm.recruitNumber"></el-input>
                    </el-form-item>
                
                    <el-form-item label="招募日期"  prop="recruitDateRange">
                        <el-date-picker
                            v-model="addActivityForm.recruitDateRange"
                            type="datetimerange"
                            range-separator="至"
                            start-placeholder="开始日期"
                            end-placeholder="结束日期">
                        </el-date-picker>
                    </el-form-item>
                    <el-form-item label="活动日期"  prop="activityDateRange" >
                        <el-date-picker
                            v-model="addActivityForm.activityDateRange"
                            type="datetimerange"
                            range-separator="至"
                            start-placeholder="开始日期"
                            end-placeholder="结束日期">
                        </el-date-picker>
                    </el-form-item>
                    
                    <el-form-item label="招募范围">
                        <el-radio-group v-model="addActivityForm.recruitRange">
                            <el-radio label="全国"></el-radio>
                            <el-radio label="本社区"></el-radio>
                        </el-radio-group>
                    </el-form-item>
                    <el-form-item label="活动内容"  prop="content" style="width: 70%">
                        <el-input type="textarea" rows="5" v-model="addActivityForm.content"></el-input>
                    </el-form-item>
                </el-form>
                <span slot="footer" class="dialog-footer">
                    <el-button type="primary" @click="confirmAdd">发 布</el-button>
                    <el-button @click="cnacelAdd">取 消</el-button>
                </span>
            </el-dialog>

            <!-- 修改弹出框 -->
            <el-dialog title="修改活动" :visible.sync="editVisible" width="40%">
                <el-form ref="editActivityForm" :model="editActivityForm" :rules="addActivityRules" label-width="110px">
                    <el-form-item label="活动名" prop="name" style="width: 60%">
                        <el-input v-model="editActivityForm.name" type="integer"></el-input>
                    </el-form-item>
                    <el-form-item label="活动省市区" prop="address">
                        <v-distpicker :province="editActivityForm.province" :city="editActivityForm.city" :area="editActivityForm.area" 
                                    @province="selectProvince" 
                                    @city="selectCity" 
                                    @area="selectArea">
                        </v-distpicker>
                    </el-form-item>
                    <el-form-item label="详细地址" prop="detailAddress"  style="width: 70%">
                        <el-input v-model="editActivityForm.detailAddress"></el-input>
                    </el-form-item>
                    <el-form-item label="活动工时" prop="workingHours"  style="width: 30%">
                        <el-input v-model.number="editActivityForm.workingHours"></el-input>
                    </el-form-item>
                    <el-form-item label="招募人数" prop="recruitNumber"  style="width: 30%">
                        <el-input v-model.number="editActivityForm.recruitNumber"></el-input>
                    </el-form-item>
                
                    <el-form-item label="招募日期"  prop="recruitDateRange">
                        <el-date-picker
                            v-model="editActivityForm.recruitDateRange"
                            type="datetimerange"
                            range-separator="至"
                            start-placeholder="开始日期"
                            end-placeholder="结束日期">
                        </el-date-picker>
                    </el-form-item>
                    <el-form-item label="活动日期"  prop="activityDateRange" >
                        <el-date-picker
                            v-model="editActivityForm.activityDateRange"
                            type="datetimerange"
                            range-separator="至"
                            start-placeholder="开始日期"
                            end-placeholder="结束日期">
                        </el-date-picker>
                    </el-form-item>
                    
                    <el-form-item label="招募范围">
                        <el-radio-group v-model="editActivityForm.recruitRange">
                            <el-radio label="全国"></el-radio>
                            <el-radio label="本社区"></el-radio>
                        </el-radio-group>
                    </el-form-item>
                    <el-form-item label="活动内容"  prop="content" style="width: 70%">
                        <el-input type="textarea" rows="5" v-model="editActivityForm.content"></el-input>
                    </el-form-item>
                </el-form>
                <span slot="footer" class="dialog-footer">
                    <el-button type="primary" @click="confirmEdit">确 定</el-button>
                    <el-button @click="cnacelEdit">取 消</el-button>
                </span>
            </el-dialog>


            <!-- 审核报名弹出框 -->
            <el-dialog title="报名情况" :visible.sync="reviewVisible" width="80%" >
                <el-table
                :data="reviewTableData"
                border
                class="table"
                header-cell-class-name="table-header"
                >
                <el-table-column prop="volunteer.id" label="志愿者编号" width="100" align="center"></el-table-column>
                <el-table-column prop="volunteer.name" label="志愿者姓名" align="center"  width="200"></el-table-column>
                <el-table-column prop="volunteer.idCard" label="志愿者身份证号" align="center"></el-table-column>
                <el-table-column prop="registrationTime" label="报名时间" align="center"  width="350"></el-table-column>
                <el-table-column prop="volunteer.volunteerHours" label="志愿工时" align="center"  width="150"></el-table-column>
                <el-table-column prop="volunteer.volunteerScore" label="志愿分数" align="center"  width="150"></el-table-column>
                <el-table-column label="操作" width="150" align="center">
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


export default {
    inject:['reload'], 
    components: { VDistpicker },

    data(){
        return{
            addActivityRules:{
                name: [
                    { required: true, message: "请输入活动名", trigger: "blur" },
                    // { min: 5, max: 8, message: "长度在 5 到 8 个字符", trigger: "blur" }
                ],
                address: [
                    { required: true, message: "请输入省市区", trigger: "blur" },
                ],
                detailAddress: [
                    { required: true, message: "请输入详细地址", trigger: "blur" },
                ],
                workingHours:[
                    { required: true, message: "请输入工时", trigger: "blur" },
                    { type: 'integer', required: true, message: "请输入整数", trigger: "blur"  }, 
                ],
                recruitNumber:[
                    { required: true, message: "请输入招募人数", trigger: "blur"  },
                    { type: 'integer', required: true, message: "请输入整数", trigger: "blur"  },
                ],
                recruitDateRange:[
                    { required: true, message: "请输入招募日期", trigger: "blur" },
                ],
                activityDateRange:[
                    { required: true, message: "请输入活动日期", trigger: "blur" },
                ],
                content:[
                    { required: true, message: "请输入活动内容", trigger: "blur" },
                ],

            },
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
            infoVisible: false,
            addVisible: false,
            editVisible: false,
            reviewVisible: false,
            collapse: false,
            info:{
                activity:{}
            },
            signUpInfo:{
                activity:{},
                user:{}
            },
            addActivityForm:{
                name:'',
                recruitRange:'全国',
                worker:{},
                province: '省', 
                city: '市',
                area: '区' ,
                detailAddress:'',
                workingHours:'',
                recruitNumber:'',
                recruitDateRange:[],
                activityDateRange:[],
                content:''

            },
            editActivityForm:{
                id:'',
                name:'',
                recruitRange:'全国',
                worker:{},
                province: '省', 
                city: '市',
                area: '区' ,
                detailAddress:'',
                workingHours:'',
                recruitNumber:'',
                recruitDateRange:[],
                activityDateRange:[],
                content:''

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
                    recordId:''
                }
            ],

        
        };
    },
    // 类似onload
    created() {
        this.user = JSON.parse(window.sessionStorage.getItem("user"));
        this.getActivity();
        this.screenForm.activityName = "";
    },
    methods:{
        logout(){
            window.sessionStorage.clear();
            this.$router.push("/login");
        },
        async getActivity(){
            const {data:res} = await this.$http.get("worker/activity",{
                params: {  
                    "userId": this.user.id
                } 
            });
            this.tableData = res.data;
            // if( res.status != 200) return this.$message.error("操作失败！！！");
            
        },
        
        collapseChage() {
            this.collapse = !this.collapse;
        },
        
        handleInfo(row) {
            this.info = row;
            this.infoVisible = true;
    
        },
        
        async handleSearch(){
            
            const {data:res} = await this.$http.get("worker/activity/search",{  
                params: {  
                    "activityName": this.screenForm.activityName
                }  
            });
            this.tableData = res.data;

            
        },
        reset(){
            this.screenForm.activityName = '';
            this.getActivity();
        },

        handleDelete(index, row){
            this.$confirm('此操作将永久删除该活动, 是否继续?', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
            }).then(() => {
                this.confirmDelete(index, row);
            }).catch(() => {
                this.$message({
                    type: 'info',
                    message: '已取消删除'
                });          
            });

            

        },
        async confirmDelete(index, row){
            const {data:res} = await this.$http.delete("worker/activity/delete",{ 
                params: {  
                    "activityId": row.activity.id
                }  
            });
            if(res.code==1){
                this.tableData.splice(index,1);
                this.$message.success("删除成功！");
            }else {
                this.$message.error("删除失败！");
            }
        },

        handleEdit(row){
            this.editActivityForm.name = row.activity.name;
            this.editActivityForm.recruitRange = row.activity.recruitRange == 1 ? "全国":"本社区";
            this.editActivityForm.province = row.activity.province;
            this.editActivityForm.city = row.activity.city;
            this.editActivityForm.area = row.activity.area;
            this.editActivityForm.detailAddress = row.activity.detailAddress;
            this.editActivityForm.workingHours = row.activity.workingHours;
            this.editActivityForm.recruitNumber = row.activity.recruitNumber;
            this.editActivityForm.recruitDateRange[0] = row.activity.recruitBeginTime;
            this.editActivityForm.recruitDateRange[1] = row.activity.recruitEndTime;
            this.editActivityForm.activityDateRange[0] = row.activity.activityBeginTime;
            this.editActivityForm.activityDateRange[1] = row.activity.activityEndTime;
            this.editActivityForm.content = row.activity.content;
            this.editActivityForm.id = row.activity.id;
            this.editVisible = true;
        },
        async confirmEdit(){
            if(this.editActivityForm.province=='省'||this.editActivityForm.city=='市'||this.editActivityForm.area=='区'){
                this.$message.error("请填写完整省市区！");
            }else{
                this.editActivityForm.worker = this.user;
                const {data :res} = await this.$http.put("worker/activity/edit", this.editActivityForm);
                if (res.code == 1 ) {
                    this.editVisible = false;
                    this.$message.success("修改成功！");
                    this.reload();
                }else{
                    this.$message.error("修改失败！！！");
                }
            }
        },
        cancelEdit(){
            this.editVisible = false;
        },
        handleAdd(){
            this.addVisible = true;
        },
        cnacelAdd(){
            this.addVisible = false;
        },
        async confirmAdd(){
            if(this.addActivityForm.province=='省'||this.addActivityForm.city=='市'||this.addActivityForm.area=='区'){
                this.$message.error("请填写完整省市区！");
            }else{
                this.addActivityForm.worker = this.user;
                const {data :res} = await this.$http.post("worker/activity/edit", this.editActivityForm);
                if (res.code == 1 ) {
                    this.editVisible = false;
                    this.$message.success("发布成功！");
                    this.reload();
                    
                }else{
                    this.$message.error("登录失败！！！");
                }
            }
        },
        //审核报名
        async handleReview(row){
            const {data:res} = await this.$http.get("worker/activity/reviewTable",{  
                params: {  
                    "activityId": row.activity.id
                }  
            });
            this.reviewTableData = res.data;
            this.reviewVisible = true;
        },
        //审核通过
        async handleAgree(index, row){
            this.re
            const {data :res} = await this.$http.post("worker/activity/agreeJoin",row);
            if (res.code == 1 ) {
                this.reviewTableData.splice(index,1);
                this.$message.success("同意报名审核成功！");
                    
            }else{
                this.$message.error("同意报名审核失败！");
            }
        },
    
        //审核未通过
        async handleRefuse(index, row){
            
            const {data :res} = await this.$http.post("worker/activity/refuseJoin", row);
            if (res.code == 1 ) {
                this.reviewTableData.splice(index,1);
                this.$message.success("拒绝报名审核成功！");
                    
            }else{
                this.$message.error("拒绝报名审核失败！");
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



