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
                <el-menu default-active="needEvaluateRecords" background-color="#EBF1F6" text-color="rgb(37, 35, 35);" active-text-color="#409eff" 	unique-opened :collapse="isCollapse" :router="true">
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
                >
                <el-table-column type="expand">
                    <template slot-scope="props">
                        <el-form label-position="left" inline class="demo-table-expand" label-width="180px">
                            <el-form-item label="活动编号" >
                                <span>{{ props.row.activityId }}</span>
                            </el-form-item>
                            <el-form-item label="活动名">
                                <span>{{ props.row.activityName}}</span>
                            </el-form-item>
                            <el-form-item label="志愿者姓名">
                                <span>{{ props.row.volunteerName }}</span>
                            </el-form-item>
                            <el-form-item label="志愿者身份证">
                                <span>{{ props.row.volunteerIdCard }}</span>
                            </el-form-item>
                            <el-form-item label="志愿者给出评分">
                                <span>{{ props.row.volunteerEvaluateScore }}</span>
                            </el-form-item>
                            <el-form-item label="志愿者志愿描述及评价">
                                <span>{{ props.row.volunteerEvaluatContent }}</span>
                            </el-form-item>
                        </el-form>
                    </template>
                </el-table-column>
                <el-table-column prop="activityName" label="活动名" align="center"></el-table-column>
                <el-table-column prop="volunteerName" label="志愿者姓名" align="center"></el-table-column>
                <el-table-column prop="picUrl" label="志愿照片" align="center">
                    <template slot-scope="scope">
                        <div class="demo-image__preview">
                        <el-image 
                            style="width: 100px; height: 100px"
                            :src="scope.row.picUrl" 
                            :preview-src-list="[scope.row.picUrl]">
                        </el-image>
                        </div>
                    </template>
                </el-table-column>
                <el-table-column label="给出您的评分" width="280" align="center">
                    <template slot-scope="scope">
                        <el-rate v-model="scope.row.evaluateScore"></el-rate>
                            <!-- <el-button type="text" icon="el-icon-check" @click="handleEvaluate(scope.$index, scope.row)"></el-button> -->
                    </template>
                </el-table-column>
                <el-table-column label="志愿审核" width="280" align="center">
                    <template slot-scope="scope">  
                        <!-- <el-button type="text" icon="el-icon-check"  @click="handleEvaluate(scope.$index, scope.row)"></el-button> -->
                        <el-button type="text" icon="el-icon-check" @click="handleEvaluate(scope.$index, scope.row)">通过</el-button>
                        <el-button type="text" icon="el-icon-close" style="color:red" @click="handleRefuse(scope.$index, scope.row)">不通过</el-button>
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
        
        </el-container>
    </el-container>
</template>

<script>
import global from '../../components/Global'
export default {
    inject:['reload'], 

    data(){
        return{
            infoVisible: false,
            evaluateVisible: false,
            collapse: '',
            currentPage:1, //初始页
            pagesize:10,    //    每页的数据
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

            }],
            user:{}
            
        };
    },
    // 类似onload
    created() {
        this.user = JSON.parse(window.sessionStorage.getItem("user"));
        this.collapse = global.collapse;
        this.getNeedEvaluateRecords();
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
        async getNeedEvaluateRecords(){
           
            const {data:res} = await this.$http.get("worker/needEvaluateRecords",{  
                params: {  
                    "userId": JSON.parse(window.sessionStorage.getItem("user")).id
                }  
            });
            this.tableData = res.data;

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

        
        async handleEvaluate(index, row){
            if(row.evaluateScore == null){
                row.evaluateScore = 0;
            }
            const {data :res} = await this.$http.post("worker/needEvaluateRecords/evaluate", row);
            if(res.code == 1){
                this.tableData.splice(index,1);
                this.$message.success('评价成功！');

            }else if(res.code == 2){
                this.$message.error('评价失败！');
                 
            }
        },
        async handleRefuse(index, row){
            const {data :res} = await this.$http.post("worker/needEvaluateRecords/refuse/", row);
            if(res.code == 1){
                this.tableData.splice(index,1);
                this.$message.success('拒绝成功！');

            }else if(res.code == 2){
                this.$message.error('拒绝失败！');
                 
            }
        }
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



