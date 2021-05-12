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
                <el-menu default-active="record" background-color="#EBF1F6" text-color="rgb(37, 35, 35);" active-text-color="#409eff" 	unique-opened :collapse="isCollapse" :router="true">
                    <template v-for="item in items">
                        <el-menu-item :index="item.index" :key="item.index">
                            <i :class="item.icon"></i>
                            <span v-if="!collapse" slot="title">{{ item.title }}</span>
                        </el-menu-item>
                    </template>
                </el-menu>
            </el-aside>

            <el-main>
                <el-table
                :data="tableData.slice((currentPage-1)*pagesize,currentPage*pagesize)"
                style="width: 100%"
                ref="configurationTable"
                >
                <el-table-column type="expand">
                    <template slot-scope="props">
                        <el-form label-position="left" inline class="demo-table-expand">
                            <el-form-item label="记录编号" >
                                <span>{{ props.row.volunteerRecord.id }}</span>
                            </el-form-item>
                            <el-form-item label="记录状态">
                                <span>{{statusAndButtonText[props.row.volunteerRecord.status].statusText}}</span>
                            </el-form-item>
                            <el-form-item label="记录生成时间">
                                <span>{{ props.row.recordCreateTime }}</span>
                            </el-form-item>
                            <el-form-item label="我的评价">
                                <span>{{ props.row.volunteerRecord.volunteerEvaluateContent }}</span>
                            </el-form-item>
                            <el-form-item label="我的评分">
                                <span>{{ props.row.volunteerRecord.volunteerEvaluateScore }}</span>
                            </el-form-item>
                            <el-form-item label="工作人员评分">
                                <span>{{ props.row.volunteerRecord.workerEvaluate }}</span>
                            </el-form-item>
                            <el-form-item>
                                <el-button type="text" @click="handleInfo(props.row.activityResponse.activity.id)">活动详情</el-button>                                
                            </el-form-item>
                        </el-form>
                    </template>
                </el-table-column>
                <el-table-column prop="volunteerRecord.id" label="记录编号" width="80" align="center"></el-table-column>
                <el-table-column prop="activityResponse.activity.name" label="参与活动名" align="center"></el-table-column>
                <el-table-column prop="recordCreateTime" label="记录生成时间" align="center"></el-table-column>
                <el-table-column prop="volunteerRecord.status"  label="记录状态" align="center">
                    <template slot-scope="scope">
                        <span>{{statusAndButtonText[scope.row.volunteerRecord.status].statusText}}</span>
                    </template>
                </el-table-column>
                <el-table-column label="操作" width="280" align="center">
                    <template slot-scope="scope">
                        <el-button
                            :disabled="(scope.row.volunteerRecord.status===1 || scope.row.volunteerRecord.status===3 || scope.row.volunteerRecord.status===5
                            || scope.row.volunteerRecord.status===6 || scope.row.volunteerRecord.status===7|| scope.row.volunteerRecord.status===8)"
                            type="primary"
                            style="width:150px"
                            @click="handleCancelOrEvaluate(scope.$index, scope.row)"
                        >{{statusAndButtonText[scope.row.volunteerRecord.status].buttonText}}</el-button>
                    </template>
                </el-table-column>
                </el-table>
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
            <!-- <el-dialog title="活动详情" :visible.sync="infoVisible">
                <el-form ref="info" :model="info" label-width="100px">
                    <el-form-item label="活动编号">
                        <el-lebal v-model="info.activityResponse.activity.id">{{info.activityResponse.activity.id}}</el-lebal>
                    </el-form-item>
                    <el-form-item label="活动名">
                        <el-lebal v-model="info.activityResponse.activity.name">{{info.activityResponse.activity.name}}</el-lebal>
                    </el-form-item>
                    <el-form-item label="活动地址" >
                        <el-lebal v-model="info.activityResponse.activity.province">{{info.activityResponse.activity.province}}</el-lebal>
                        &nbsp;
                        <el-lebal v-model="info.activityResponse.activity.city">{{info.activityResponse.activity.city}}</el-lebal>
                        &nbsp;
                        <el-lebal v-model="info.activityResponse.activity.area">{{info.activityResponse.activity.area}}</el-lebal>
                        &nbsp;
                        <el-lebal v-model="info.activityResponse.activity.detailAddress">{{info.activityResponse.activity.detailAddress}}</el-lebal>
                    </el-form-item>
                    <el-form-item label="发起社区">
                        <el-lebal v-model="info.activityResponse.communityName">{{info.activityResponse.communityName}}</el-lebal>
                    </el-form-item>
                    <el-form-item label="发起人">
                        <el-lebal v-model="info.activityResponse.sponsor">{{info.activityResponse.sponsor}}</el-lebal>
                    </el-form-item>
                    <el-form-item label="工时/小时">
                        <el-lebal v-model="info.activityResponse.activity.workingHours">{{info.activityResponse.activity.workingHours}}</el-lebal>
                    </el-form-item>
                    <el-form-item label="招募人数">
                        <el-lebal v-model="info.activityResponse.activity.recruitNumber">{{info.activityResponse.activity.recruitNumber}}</el-lebal>
                    </el-form-item>
                    <el-form-item label="活动开始时间">
                        <el-lebal v-model="info.activityResponse.activity.activityBeginTime">{{info.activityResponse.activity.activityBeginTime}}</el-lebal>
                    </el-form-item>
                     <el-form-item label="活动截止时间">
                        <el-lebal v-model="info.activityResponse.activity.activityEndTime">{{info.activityResponse.activity.activityEndTime}}</el-lebal>
                      </el-form-item>
                    <el-form-item label="活动内容">
                        <el-input v-model="info.activityResponse.activity.content" type="textarea" :disabled="true" :rows="5"></el-input>
                    </el-form-item>
                    
                </el-form>
            </el-dialog> -->


            <!-- 评价弹出框 -->
            <el-dialog title="评价" :visible.sync="evaluateVisible" :before-close="handleEvaluateClose" width="50%">
                <el-form ref="evaluateRef" :model="evaluate" label-width="200px" :rules="evaluateRules">
                    <el-form-item label="给出您的评分" prop="score">
                        <el-rate v-model="evaluate.score"></el-rate>
                       
                    </el-form-item>

                    <el-form-item label="描述工作内容及感受" prop="content">
                        <el-input
                        type="textarea"
                        style="width: 360px"
                        :rows="5"
                        v-model="evaluate.content"
                        maxlength="50"
                        show-word-limit>
                        </el-input>
                     </el-form-item>

                    <el-form-item label="志愿照片证明" prop="pic">
                        <el-upload
                                ref="upload"
                                class="upload-demo"
                                drag
                                action="http://localhost:9000/volunteer/record/evaluate"
                                multiple
                                accept=".jpg,.jpeg,.png,.JPG,.JPEG,.PNG"
                                :on-success="uploadResult"
                                :on-preview="handlePreview"
                                :on-change="addFile"
                                limit="1"
                                list-type="picture"
                                :before-remove="removeFile"
                                :auto-upload="false"
                                :data="evaluate"
                                >
                                <i class="el-icon-upload" ></i>
                                <div class="el-upload__text">将图片拖到此处，或<em>点击上传</em></div>
                                <div class="el-upload__tip" slot="tip">只能上传图片</div>
                            </el-upload>
                       
                    </el-form-item>


                    
                </el-form>
                <span slot="footer">
                    <el-button type="primary" @click="confirmEvaluate">确 定</el-button>
                    <el-button @click="cancelEvaluate">取 消</el-button>
                </span>
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
            file: null,
            infoVisible: false,
            evaluateVisible: false,
            collapse: '',
            currentPage:1, //初始页
            pagesize:10,    //    每页的数据
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
            tableData:[{
                volunteerRecord: {},
                activityResponse: {
                    activity:{}
                }

            }],
            info:{
                volunteerRecord:{},
                activityResponse:{
                    activity:{}
                }
            },
            evaluate:{
                score: 0,
                content: '',
                recordId:0,
                recordStatus:4,
            },
            statusAndButtonText: [
                {
                    statusText:"报名审核中",
                    buttonText:"取消报名"
                },
                {
                    statusText:"报名未通过",
                    buttonText:"不可操作"
                },
                {
                    statusText:"报名通过",
                    buttonText:"取消报名"
                },
                {
                    statusText:"活动进行中",
                    buttonText:"不可操作"
                },
                {
                    statusText:"志愿结束待评价",
                    buttonText:"去评价"
                },
                {
                    statusText:"已评价，待工作者审核",
                    buttonText:"不可操作"
                },
                {
                    statusText:"已评价，审核通过",
                    buttonText:"不可操作"
                },
                {
                    statusText:"该记录涉及活动已被删除",
                    buttonText:"不可操作"
                },
                {
                    statusText:"志愿审核未通过",
                    buttonText:"不可操作"
                },
                
            ],
            cancelSignUpData: {
                volunteerRecord:{},
                communityId: '',
                activityId: '',
                activityName:'',
            },
            user:{},
            evaluateRules:{
                content: [
                    { required: true, message: "请输入不少于10个字的描述内容", trigger: "blur" },
                    { min: 10, message: "至少10个字！", trigger: "blur" }
                    
                ],
                
                
            },
        };
    },
    // 类似onload
    created() {
        this.user = JSON.parse(window.sessionStorage.getItem("user"));
        this.collapse =  global.collapse;
        this.getRecords();

    },
    methods:{
        logout(){
            window.sessionStorage.clear();
            this.$router.push("/login");
        },
        
        selected(data){
             console.log(data);
        },
        find(){
            console.log(placeholders);
        },
        collapseChage() {
            this.collapse = !this.collapse;
            global.collapse = !global.collapse;
        },
        async getRecords(){
           
            const {data:res} = await this.$http.get("volunteer/record",{  
                params: {  
                    "userId": JSON.parse(window.sessionStorage.getItem("user")).id
                }  
            });
            this.tableData = res.data;
            this.$refs.configurationTable.$el.style.width = '99.5%';
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

        //评价或取消报名按钮
        // todo:取消报名
        async handleCancelOrEvaluate(index, row){
            if(row.volunteerRecord.status == 4||row.volunteerRecord.status == 6){
                this.evaluate.recordId = row.volunteerRecord.id;
                this.evaluate.recordStatus = row.volunteerRecord.status;
                this.evaluateVisible = true;
            }else{
                this.cancelSignUpData.volunteerRecord = row.volunteerRecord;
                this.cancelSignUpData.communityId = row.activityResponse.communityId;
                this.cancelSignUpData.activityId = row.activityResponse.activity.id;
                this.cancelSignUpData.activityName = row.activityResponse.activity.name;
                const {data :res} = await this.$http.post("volunteer/record/cancelSignUp", this.cancelSignUpData);
                if(res.code == 1){
                    this.tableData[index].volunteerRecord.status = 1;
                }
            }
            
        },
        
        cancelEvaluate(){
            this.evaluateVisible = false;
            this.evaluate.score = 0;
            this.evaluate.content = '';
            this.file = null;
           
        },
        handleEvaluateClose(){
            this.cancelEvaluate();
        },

        confirmEvaluate(){
            this.$refs.evaluateRef.validate(async valid=>{
                if (!valid) return;
                if(this.file == null){
                    this.$message.error("请上传志愿照片！");
                    return;
                }else{
                    this.$refs.upload.submit();
                }
                
            });
            
            
            // const {data :res} = await this.$http.post("volunteer/record/evaluate", this.evaluate);
            // if(res.code == 1){
            //     // this.cancelEvaluate();
            //     this.reload();
            //     this.$message.success('评价成功！');
            // }else if(res.code == 2){
            //     this.cancelEvaluate();
            //     this.$message.error(res.msg);
                 
            // }
        },
        
        uploadResult(response, file, fileList){
            if(response.code == 2){
                this.cancelEvaluate();
                this.$message.error(response.msg);
            }else{
                this.reload();
                this.$message.success("评价成功！");
                
            }
        },
        addFile(file,fileList){
            this.file = file;
        },
        removeFile(file,fileList){
            this.file = null;
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

</style>

<style >

.demo-table-expand {
    font-size: 0;
  }
.demo-table-expand label {
    width: 100px;
    color: #99a9bf;
  }
.demo-table-expand .el-form-item {
    margin-right: 0;
    margin-bottom: 0;
    width: 50%;
}
</style>



