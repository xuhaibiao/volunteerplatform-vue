<template>
    <el-container>
        <el-header>
            <div>
               
                <span> 社区志愿服务网 </span>
            
            </div>
            <el-button type="info" @click="logout">安全退出</el-button>
        </el-header>
        <el-container>
            <el-aside :width="collapse ?'64px':'200px'">
                <!--侧边栏菜单区 unique-opened="true" 只保持一个菜单展开 router开启路由-->
                <el-menu default-active="communityReview" background-color="#EBF1F6" text-color="rgb(37, 35, 35);" active-text-color="#409eff" 	unique-opened :collapse="isCollapse" :collapse-transition="false" :router="true">
                    <template v-for="item in items">
                        <template v-if="item.subs">
                            <el-submenu :index="item.index" :key="item.index" @open="open">
                                <template slot="title">
                                    <i :class="item.icon"></i>
                                    <span slot="title" v-if="!collapse">{{ item.title }}</span>
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
                <el-table
                :data="tableData.slice((currentPage-1)*pagesize,currentPage*pagesize)"
                style="width: 100%"
                >
                <el-table-column prop="community.id" label="社区编号" width="80" align="center"></el-table-column>
                <el-table-column prop="community.name" label="社区名" align="center"></el-table-column>
                <el-table-column prop="community.undertaker" label="发起人" align="center"></el-table-column>
                <el-table-column prop="community.createTime" label="发起日期" align="center"></el-table-column>
                
                <el-table-column label="支撑材料" width="380" align="center">
                    <template slot-scope="scope">
                        <div>
                            <el-button type="text"  @click="download(scope.row)">{{scope.row.fileName+"，点击下载"}}</el-button>
                        </div>
                    </template>
                </el-table-column>
                <el-table-column label="操作"  align="center">
                    <template slot-scope="scope">
                        <el-button type="text" icon="el-icon-check" @click="handleAgree(scope.$index, scope.row)">通过</el-button>
                        <el-button type="text" icon="el-icon-close" style="color:red" @click="handleRefuse(scope.$index, scope.row)">驳回</el-button>
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
import '../../assets/js/china'


export default {
    inject:['reload'], 

    
    data(){
        return{
            

            user:{},
            currentPage:1, //初始页
            pagesize:10,    //    每页的数据
      
           
            
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
                    community: {},
                    fileName:'',
                    fileDate:''
                },
            ],
            
        
        };
    },
    // 类似onload
    created() {
        this.collapse = global.collapse;
        this.user = JSON.parse(window.sessionStorage.getItem("user"));
        this.getNeedReviewCommunities();

    },

    methods:{
       
        logout(){
            window.sessionStorage.clear();
            this.$router.push("/login");
        },
        
        async getNeedReviewCommunities(){
            const {data:res} = await this.$http.get("administrator/communityReview");
            if(res.code == 1){
                this.tableData = res.data;
            }
        },

        async download(row){
            let res = await this.$http.get("administrator/download",{
                responseType: 'blob',
                params: {  
                    "fileName": row.fileName,
                    "fileDate": row.fileDate,
                }  
                });
            if (res) {
                var fileName = row.fileName;
                //eslint-disable-next-line
                const blob = new Blob([res.data], {
                    // 如何后端没返回下载文件类型，则需要手动设置：type: 'application/pdf;chartset=UTF-8' 表示下载文档为pdf，如果是word则设置为msword，excel为excel
                    type: 'application/pdf;chartset=UTF-8'
                });
                //对于<a>标签，只有 Firefox 和 Chrome（内核） 支持 download 属性
                //IE10以上支持blob但是依然不支持download
                if ('download' in document.createElement('a')) { 
                    //支持a标签download的浏览器
                    const link = document.createElement('a')//创建a标签
                    link.download = fileName//a标签添加属性
                    link.style.display = 'none'
                    link.href = URL.createObjectURL(blob)
                    document.body.appendChild(link)
                    link.click()//执行下载
                    URL.revokeObjectURL(link.href) //释放url
                    document.body.removeChild(link)//释放标签
            
                }else{
                    navigator.msSaveBlob(blob, fileName)
                }
            }
        },

        //通过
        async handleAgree(index, row){
            const {data :res} = await this.$http.post("administrator/communityReview/agree",row.community);
            if (res.code == 1 ) {
                this.tableData.splice(index,1);
                this.$message.success("审核通过！"); 
            }else {
                this.$message.error(res.msg);
            }
        },
    
        //驳回
        async handleRefuse(index, row){
            const {data :res} = await this.$http.post("administrator/communityReview/refuse", row.community);
            if (res.code == 1 ) {
                this.tableData.splice(index,1);
                this.$message.success("驳回成功！");                  
            }else{
                this.$message.error(res.msg);
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
@import "//at.alicdn.com/t/font_2416161_9iovrknjytp.css";


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

.handle-input {
    width: 300px;
   
}

.mgb20 {
    margin-bottom: 20px;
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



