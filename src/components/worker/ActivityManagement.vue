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
                <el-menu default-active="activityManagement" background-color="#EBF1F6" text-color="rgb(37, 35, 35);" active-text-color="#409eff" 	unique-opened :collapse="isCollapse" :collapse-transition="false" :router="true">
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
                                    <el-input  v-model="screenForm.activityName" placeholder="活动名" class="handle-input mr10" @keydown.enter.native="seachEnter"></el-input><input v-show="false"/>
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
                <el-table-column prop="activity.id" label="活动编号" align="center"></el-table-column>
                <el-table-column prop="activity.name" label="活动名" align="center"></el-table-column>
                <el-table-column prop="activityStatus" label="活动状态"  align="center">
                    <template slot-scope="scope">
                        <el-button v-if="scope.row.activityStatus=='招募中'" type="text"  @click="handleReview(scope.row)">招募中,去审核报名</el-button>
                        <el-button v-else-if="scope.row.activityStatus=='招募结束,活动未开始'||scope.row.activityStatus=='活动进行中'" type="text" style="color: green" @click="handleVolunteerInfo(scope.row)">{{scope.row.activityStatus+",查看人员信息"}}</el-button>
                        <el-button v-else-if="scope.row.activityStatus=='活动已结束'" type="text" style="color: orange" @click="handleEvaluateInfo(scope.row)">活动已结束,查看评价</el-button>
                        <el-lebal v-else >{{scope.row.activityStatus}}</el-lebal>
                    </template>
                </el-table-column>
                <el-table-column prop="activity.recruitNumber" label="计划招募人数" align="center"  ></el-table-column>
                <!-- <el-table-column prop="hasRecruitedNumber" label="已报名人数" align="center" ></el-table-column> -->
                <el-table-column prop="hasAgreeNumber" label="已招募人数" align="center" ></el-table-column>
                <!-- <el-table-column prop="activityTimeRange" label="活动时间"  width="230px" align="center"></el-table-column> -->
                <el-table-column label="操作"  align="center">
                    <template slot-scope="scope">
                        <el-button
                            type="text"
                            icon="el-icon-info"
                            style="color:green"
                            @click="handleInfo(scope.row.activity.id)"
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
            <!-- <el-dialog title="活动详情" :visible.sync="infoVisible" width="30%">
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
            
            <!-- 发布弹出框 -->
            <el-dialog title="发布活动" :visible.sync="addVisible" width="60%">
                <el-form ref="addActivityForm" :model="addActivityForm" :rules="addActivityRules" label-width="150px">
                    <el-form-item label="活动名" prop="name" style="width: 80%">
                        <el-input v-model="addActivityForm.name"></el-input>
                    </el-form-item>
                    <el-form-item label="活动省市区" prop="address">
                        <v-distpicker :province="addActivityForm.province" :city="addActivityForm.city" :area="addActivityForm.area" 
                                    @province="selectProvince" 
                                    @city="selectCity" 
                                    @area="selectArea">
                        </v-distpicker>
                    </el-form-item>
                    <el-form-item label="详细地址" prop="detailAddress"  style="width: 80%">
                        <el-input v-model="addActivityForm.detailAddress"></el-input>
                    </el-form-item>
                    <el-form-item label="活动工时" prop="workingHours"  style="width: 40%">
                        <el-input v-model.number="addActivityForm.workingHours" @keyup.native="number1"></el-input>
                    </el-form-item>
                    <el-form-item label="招募人数" prop="recruitNumber"  style="width: 40%">
                        <el-input v-model.number="addActivityForm.recruitNumber" @keyup.native="number2"></el-input>
                    </el-form-item>
                
                    <el-form-item label="招募日期"  prop="recruitDateRange">
                        <el-date-picker
                            v-model="addActivityForm.recruitDateRange"
                            value-format="yyyy-MM-dd HH:mm:ss"
                            type="datetimerange"
                            range-separator="至"
                            start-placeholder="开始日期"
                            end-placeholder="结束日期">
                        </el-date-picker>
                    </el-form-item>
                    <el-form-item label="活动日期"  prop="activityDateRange" >
                        <el-date-picker
                            v-model="addActivityForm.activityDateRange"
                            value-format="yyyy-MM-dd HH:mm:ss"
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
                    <el-form-item label="活动照片" prop="pic">
                        <el-upload
                            ref="upload"
                            class="upload-demo"
                            drag
                            action="http://localhost:9000/worker/activity/add"
                            multiple
                            accept=".jpg,.jpeg,.png,.JPG,.JPEG,.PNG"
                            :on-success="uploadResult"
                            :on-preview="handlePreview"
                            :on-change="addFile"
                            limit="1"
                            list-type="picture"
                            :before-remove="removeFile"
                            :auto-upload="false"
                            :data="addActivityForm"
                            >
                            <i class="el-icon-upload" ></i>
                            <div class="el-upload__text">将图片拖到此处，或<em>点击上传</em></div>
                            <div class="el-upload__tip" slot="tip">只能上传图片</div>
                        </el-upload>
                    </el-form-item>
                    <el-form-item >
                        <el-button type="primary" @click="confirmAdd('addActivityForm')">发 布</el-button>
                        <el-button @click="cancelAdd">取 消</el-button>
                    </el-form-item>
                </el-form>
               
            </el-dialog>

            <!-- 修改弹出框 -->
            <el-dialog title="修改活动" :visible.sync="editVisible"  :show-close=false :close-on-click-modal='false' width="60%">
                <el-form ref="editActivityForm" :model="editActivityForm" :rules="addActivityRules" label-width="150px">
                    <el-form-item label="活动名" prop="name" style="width: 80%">
                        <el-input v-model="editActivityForm.name" ></el-input>
                    </el-form-item>
                    <el-form-item label="活动省市区" prop="address">
                        <v-distpicker :province="editActivityForm.province" :city="editActivityForm.city" :area="editActivityForm.area" 
                                    @province="selectProvince" 
                                    @city="selectCity" 
                                    @area="selectArea">
                        </v-distpicker>
                    </el-form-item>
                    <el-form-item label="详细地址" prop="detailAddress"  style="width: 80%">
                        <el-input v-model="editActivityForm.detailAddress"></el-input>
                    </el-form-item>
                    <el-form-item label="活动工时" prop="workingHours"  style="width: 40%">
                        <el-input v-model.number="editActivityForm.workingHours" @keyup.native="number3"></el-input>
                    </el-form-item>
                    <el-form-item label="招募人数" prop="recruitNumber" style="width: 40%" >
                        <el-input v-model.number="editActivityForm.recruitNumber" @keyup.native="number4"></el-input>
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
                    <el-form-item label="活动内容"  prop="content" style="width: 80%">
                        <el-input type="textarea" rows="5" v-model="editActivityForm.content"></el-input>
                    </el-form-item>
                    <el-form-item label="原活动照片"  prop="pic" style="width: 80%">
                        <el-image    
                        :src="editActivityForm.picUrl" 
                        >
                    </el-image>
                    </el-form-item>
                    
                    <el-form-item label="新活动照片(可不传)" prop="pic">
                        <el-upload
                            ref="editUpload"
                            class="upload-demo"
                            action="http://localhost:9000/worker/activity/editWithPic"
                            multiple
                            accept=".jpg,.jpeg,.png,.JPG,.JPEG,.PNG"
                            :on-success="editUploadResult"
                            :on-preview="handlePreview"
                            :on-change="editAddFile"
                            limit="1"
                            list-type="picture"
                            :before-remove="editRemoveFile"
                            :auto-upload="false"
                            :data="editActivityForm"
                            >
                            <el-button size="small" type="primary">点击上传</el-button>（只能上传图片）
                            <!-- <i class="el-icon-upload" ></i> -->
                            <!-- <div class="el-upload__text">将图片拖到此处，或<em>点击上传</em></div> -->
                            <!-- <div class="el-upload__tip" slot="tip"></div> -->
                        </el-upload>
                    </el-form-item>
                    <el-form-item >
                        <el-button type="primary" @click="confirmEdit('editActivityForm')">确 定</el-button>
                        <el-button @click="cancelEdit">取 消</el-button>
                    </el-form-item>
                </el-form>
            </el-dialog>


            <!-- 审核报名弹出框 -->
            <el-dialog title="报名情况" :visible.sync="reviewVisible" width="90%" >
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
           

            <!-- 参加活动的志愿者列表弹出框 -->
            <el-dialog title="参加人员信息" :visible.sync="volunteerInfoVisible" width="50%" >
                <el-table
                :data="volunteerInfo"
                border
                class="table"
                header-cell-class-name="table-header"
                >
                    <el-table-column prop="id" label="志愿者编号" width="100" align="center"></el-table-column>
                    <el-table-column prop="name" label="姓名" align="center"  width="200"></el-table-column>
                    <el-table-column prop="gender" label="性别" width="100" align="center">
                        <template slot-scope="scope">
                            {{options[scope.row.gender]}}
                        </template>
                    </el-table-column>
                    <el-table-column prop="idCard" label="身份证号" align="center"></el-table-column>
                </el-table>
            </el-dialog>

            <!-- 参加活动的志愿者评价信息弹出框 -->
            <el-dialog title="评价信息" :visible.sync="volunteerEvaluateVisible" width="70%" >
                <el-table
                :data="volunteerEvaluateInfo"
                class="table"
                header-cell-class-name="table-header"
                >
                    <el-table-column prop="id" label="志愿者编号" width="100" align="center"></el-table-column>
                    <el-table-column prop="name" label="姓名" align="center"  width="200"></el-table-column>
                    <el-table-column prop="gender" label="性别" width="100" align="center">
                        <template slot-scope="scope">
                            {{options[scope.row.gender]}}
                        </template>
                    </el-table-column>
                    <el-table-column prop="volunteerEvaluateScore" label="评分" width="100" align="center"></el-table-column>
                    <el-table-column prop="volunteerEvaluateContent" label="评价" align="center"></el-table-column>
                    <el-table-column prop="picUrl" label="志愿照片" align="center">
                        <template slot-scope="scope">
                            <div class="demo-image__preview">
                            <el-image 
                                style="width: 100px; height: 100px"
                                :src="scope.row.picUrl" 
                                >
                            </el-image>
                            <!-- :preview-src-list="[scope.row.picUrl]" -->
                            </div>
                        </template>
                    </el-table-column>
                    <el-table-column prop="workerEvaluate" label="我的评分" align="center"></el-table-column>
                    <el-table-column prop="approvedResult" label="审核情况" align="center"  width="200"></el-table-column>
                    
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
            addActivityRules:{
                name: [
                    { required: true, message: "请输入活动名", trigger: "blur" },
                    // { min: 5, max: 8, message: "长度在 5 到 8 个字符", trigger: "blur" }
                ],
                // address: [
                //     { required: true, message: "请输入省市区", trigger: "blur" },
                // ],
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
            volunteerInfoVisible: false,
            volunteerEvaluateVisible: false,
            collapse: '',
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
                workerId:'',
                province: '', 
                city: '',
                area: '' ,
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
                workerId:'',
                province: '省', 
                city: '市',
                area: '区' ,
                detailAddress:'',
                workingHours:'',
                recruitNumber:'',
                recruitDateRange:[],
                activityDateRange:[],
                // recruitBeginTime:'',
                // recruitEndTime:'',
                // activityBeginTime:'',
                // activityEndTime:'',
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
                // {
                //     // icon: 'el-icon-s-home',
                //     index: 'statistics',
                //     title: '    志愿统计',
                //     icon: 'iconfont icon-shezhi'
                // },
                
            
            ],
            tableData:[{ 

            },
            
            ],
            options: [
                
              "女","男"
            
            ],
            reviewTableData:[
                {
                    volunteer: {},
                    recordId:''
                }
            ],

            volunteerInfo:[{

            }],

            volunteerEvaluateInfo:[{
                
            }],

            file: null,
            editFile: null,
        

        
        };
    },
    // 类似onload
    created() {
        this.collapse = global.collapse;
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
            global.collapse = !global.collapse;
        },
        number1(){　　
            
            this.addActivityForm.workingHours = this.addActivityForm.workingHours.replace(/[^\d]/g,'');
           
    　　},
        number2(){　　
            this.addActivityForm.recruitNumber = this.addActivityForm.recruitNumber.replace(/[^\d]/g,'');
            
    　　},
        number3(){　　
            
            this.editActivityForm.workingHours = this.editActivityForm.workingHours.replace(/[^\d]/g,'');
    　　},
        number4(){　　
           
            this.editActivityForm.recruitNumber = this.editActivityForm.recruitNumber.replace(/[^\d]/g,'');
          
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
        
        async handleSearch(){  
            const {data:res} = await this.$http.get("worker/activity/search",{  
                params: {  
                    "activityName": this.screenForm.activityName
                }  
            });
            this.tableData = res.data;

            
        },
        seachEnter(){
            this.handleSearch();
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

            var activityDateRangeArr = new Array();
            activityDateRangeArr.push(row.activity.activityBeginTime, row.activity.activityEndTime);
            this.$set(this.editActivityForm,'activityDateRange',activityDateRangeArr);

            var recruitDateRangeArr = new Array();
            recruitDateRangeArr.push(row.activity.recruitBeginTime, row.activity.recruitEndTime);
            this.$set(this.editActivityForm,'recruitDateRange',recruitDateRangeArr);

            this.editActivityForm.content = row.activity.content;
            this.editActivityForm.id = row.activity.id;
            this.editActivityForm.picUrl = row.picUrl;
            this.editVisible = true;
        },
        confirmEdit(formName){
            this.$refs[formName].validate(async (valid) => {
            if (valid) {
                if(this.editActivityForm.province=='省'||this.editActivityForm.city=='市'||this.editActivityForm.area=='区'){
                    this.$message.error("请填写完整省市区！");
                    return false;
                }else{
                    
                    this.editActivityForm.workerId = this.user.id;
                    // this.editActivityForm.recruitBeginTime = this.editActivityForm.recruitDateRange[0];
                    // this.editActivityForm.recruitEndTime = this.editActivityForm.recruitDateRange[1];
                    // this.editActivityForm.activityBeginTime = this.editActivityForm.activityDateRange[0];
                    // this.editActivityForm.activityEndTime = this.editActivityForm.activityDateRange[1];
                    // console.log(this.editActivityForm.activityEndTime);
                    // alert("edit");
                
                    if(this.editFile != null){
                        this.$refs.editUpload.submit();
                    }else{
                    
                        console.log(this.editActivityForm.activityDateRange);
                        const {data :res} = await this.$http.post("worker/activity/editWithoutPic", this.editActivityForm);
                        if (res.code == 1 ) {
                            this.$message.success("修改成功！");
                            this.addVisible = false;
                            this.reload();   
                
                        }else{
                            this.$message.error(res.msg);
                        }
                    }
                    
                    
                    // const {data :res} = await this.$http.put("worker/activity/edit", this.editActivityForm);
                    // if (res.code == 1 ) {
                    //     this.editVisible = false;
                    //     this.$message.success("修改成功！");
                    //     this.reload();
                    // }else{
                    //     this.$message.error("修改失败！！！");
                    // }
                }
            } else {
                return false;
            }
            });

            
        },
        cancelEdit(){
            this.editVisible = false;
            // this.editActivityForm.name = '';
            // this.editActivityForm.recruitRange = "全国";
            // this.editActivityForm.province = '';
            // this.editActivityForm.city = '';
            // this.editActivityForm.area = '';
            // this.editActivityForm.detailAddress = '';
            // this.editActivityForm.workingHours = '';
            // this.editActivityForm.recruitNumber = '';
            // this.editActivityForm.recruitDateRange[0] = '';
            // this.editActivityForm.recruitDateRange[1] = '';
            // this.editActivityForm.activityDateRange[0] = '';
            // this.editActivityForm.activityDateRange[1] = '';
            // this.editActivityForm.content = '';
            // this.editActivityForm.id = '';
            
        },
        handleAdd(){
            if(this.user.communityId==-1){
                this.$message.warning("您还未通过社区审核，不具有该权限");
                return;
            }else{
                this.addVisible = true;
            }
            
        },
        cancelAdd(){
            this.addVisible = false;
        },
        // 发布活动
        confirmAdd(formName){
         
            this.$refs[formName].validate(async (valid) => {
            if (valid) {

                if(this.addActivityForm.province =='省'||this.addActivityForm.province ==''
                ||this.addActivityForm.city=='市'||this.addActivityForm.city==''
                ||this.addActivityForm.area=='区'||this.addActivityForm.area==''){
                    this.$message.error("请填写完整省市区！");
                    return false;
                }else if(this.addActivityForm.recruitDateRange[0]+"和"+this.addActivityForm.activityDateRange[0]){
                    this.$message.error("招募开始时间必须在活动时间之前！");
                    return false;
                }else{
                    this.addActivityForm.workerId = this.user.id;
                    if(this.file == null){
                        this.$message.error("请上传志愿活动照片！");
                        return;
                    }else{
                        this.$refs.upload.submit();
                    }
                    // const {data :res} = await this.$http.post("worker/activity/add", this.addActivityForm);
                    // if (res.code == 1 ) {
                    //     this.addVisible = false;
                    //     this.$message.success("发布成功！");
                    //     this.reload();
                        
                    // }else{
                    //     this.$message.error("发布失败！！！");
                    // }
                }
            } else {
                return false;
            }
            });
            
        },
        uploadResult(response, file, fileList){
            if (response.code == 1 ) {
                this.$message.success("发布成功！");
                this.addVisible = false;
                this.reload();
                
            }else{
                this.$message.error(response.msg);
            }


        },
        editUploadResult(response, file, fileList){
            if (response.code == 1 ) {
                // alert("successEdit");
                this.$message.success("修改成功！");
                this.editVisible = false;
                this.reload();
                
                
            }else{
                this.editFile = null;
                this.$message.error(response.msg);
            }


        },
        addFile(file,fileList){
            this.file = file;
        },
        removeFile(file,fileList){
            this.file = null;
        },
        editAddFile(file,fileList){
            this.editFile = file;
        },
        editRemoveFile(file,fileList){
            this.editFile = null;
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

        // 参加活动的志愿者信息 
        async handleVolunteerInfo(row){
            const {data:res} = await this.$http.get("worker/activity/volunteerInfo",{  
                params: {  
                    "activityId": row.activity.id
                }  
            });
            this.volunteerInfo = res.data;
            this.volunteerInfoVisible = true;

        },

        // 对活动的评价信息
        async handleEvaluateInfo(row){
            const {data:res} = await this.$http.get("worker/activity/volunteerEvaluateInfo",{  
                params: {  
                    "activityId": row.activity.id
                }  
            });
            this.volunteerEvaluateInfo = res.data;
            this.volunteerEvaluateVisible = true;
        },

        selectProvince(value) {
            this.addActivityForm.province = value.value;
            this.editActivityForm.province = value.value;
    
        },
        selectCity(value) {
            this.addActivityForm.city = value.value;
            this.editActivityForm.city = value.value;
           
        },
        selectArea(value) {
            this.addActivityForm.area = value.value;
            this.editActivityForm.area = value.value;
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
</style>



