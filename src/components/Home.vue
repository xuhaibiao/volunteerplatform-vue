<template>
    <el-container>
        <el-header>
            <div>
                <!--伸缩按钮-->
                <div class="collapse-btn" @click="collapseChage">
                    <i v-if="!collapse" class="el-icon-s-fold"></i>
                    <i v-else class="el-icon-s-unfold"></i>
                </div>
                <span>社区志愿服务网</span>
            </div>
            <el-button type="info" @click="logout">安全退出</el-button>
        </el-header>
        <el-container>
            <el-aside :width="collapse ?'64px':'200px'">
                <!--侧边栏菜单区 unique-opened="true" 只保持一个菜单展开 router开启路由-->
                <el-menu default-active="home" background-color="#545c64" text-color="#fff" active-text-color="#409eff" 	unique-opened :collapse="isCollapse" :collapse-transition="false" :router="true">
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
                    <el-col :span="24">
                        <div class="form-box">
                            <el-form ref="form" :model="form" label-width="80px">
                                <el-form-item label="项目区域">
                                    <el-row :gutter="10">
                                <v-distpicker :placeholders="placeholders" @selected='selected'>
                                        
                                </v-distpicker>
                                
                                </el-row>
                                </el-form-item>
                            </el-form>
                        </div>
                    </el-col>
                </el-row>
                <el-table
                :data="tableData"
                border
                class="table"
                ref="multipleTable"
                header-cell-class-name="table-header"
                @selection-change="handleSelectionChange"
            >
                
                <el-table-column prop="activityId" label="ID" width="55" align="center"></el-table-column>
                <el-table-column prop="activityName" label="活动名" align="center"></el-table-column>
                <el-table-column prop="activityStatus" label="活动状态" align="center"></el-table-column>
                <el-table-column prop="activitySponsor" label="活动发起人" align="center"></el-table-column>
                <el-table-column prop="activityPlannedNum" label="计划招募人数" align="center"></el-table-column>
                <el-table-column prop="activitySignUpNum" label="已报名人数" align="center"></el-table-column>
                <el-table-column prop="activityDate" label="活动时间" align="center"></el-table-column>
                <el-table-column label="操作" width="180" align="center">
                    <template slot-scope="scope">
                        <el-button
                            type="text"
                            icon="el-icon-info"
                            @click="handleInfo(scope.$index, scope.row)"
                        >详情</el-button>
                        <el-button
                            type="text"
                            icon="iconfont icon-baoming"
                            @click="handleSignUp(scope.$index, scope.row)"
                        >报名</el-button>
                    </template>
                </el-table-column>
                </el-table>
                <div class="block">
                    <el-pagination
                        style="text-align: right"
                        background
                        @size-change="handleSizeChange"
                        @current-change="handleCurrentChange"
                        :current-page.sync="currentPage3"
                        :page-size="100"
                        layout="prev, pager, next, jumper"
                        :total="1000">
                    </el-pagination>
                </div>
            
               
            </el-main>
        </el-container>
    </el-container>
</template>

<script>
import VDistpicker from 'v-distpicker'

export default {
     components: { VDistpicker },

    data(){
        return{
            placeholders: {
              province: '------- 省 --------',
              city: '--- 市 ---',
              area: '--- 区 ---',
          },
            // 左侧菜单
            // menuList: [],
            // iconsObject: {
            // '100':'iconfont iconguanliyuan',
            // '200':'iconfont iconsport',
            // '101':'iconfont icondenglu',
            // '102':'iconfont iconmima',
            // '103':'iconfont iconsport',
            // '104':'iconfont iconshangpin',
            // '201':'iconfont iconshu',
            // '202':'iconfont iconkaluli',
            // '203':'iconfont iconshiwu',
            // '204':'iconfont icondenglu',
            // }
            collapse: false,
            items: [
                {
                    // icon: 'el-icon-s-home',
                    index: 'home',
                    title: '    志愿活动',
                    icon: 'iconfont icon-banjizhiyuanhuodong-copy'
                },
                {
                    // icon: 'el-icon-s-home',
                    index: 'resume',
                    title: '    服务履历',
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
                    index: 'setting',
                    title: '    设置',
                    icon: 'iconfont icon-shezhi'
                }, 
            
            ],
            tableData:[
                {
                    activityId: '1',
                    activityName: '活动1',
                    activityStatus: '招募中',
                    activityPlannedNum: '40',
                    activitySignUpNum:'10',
                    activityDate:'2021-3-1至2021-3-3'
                },
                {
                    activityId: '2',
                    activityName: '活动2',
                    activityStatus: '招募已结束',
                    activityPlannedNum: '40',
                    activitySignUpNum:'10',
                    activityDate:'2021-3-1至2021-3-3'
                },
                {
                    activityId: '3',
                    activityName: '活动3',
                    activityStatus: '活动已结束',
                    activityPlannedNum: '40',
                    activitySignUpNum:'10',
                    activityDate:'2021-3-1至2021-3-3'
                },
                {
                    activityId: '4',
                    activityName: '活动4',
                    activityStatus: '招募中',
                    activityPlannedNum: '40',
                    activitySignUpNum:'10',
                    activityDate:'2021-3-1至2021-3-3'
                },
                {
                    activityId: '5',
                    activityName: '活动5',
                    activityStatus: '招募中',
                    activityPlannedNum: '40',
                    activitySignUpNum:'10',
                    activityDate:'2021-3-1至2021-3-3'
                },
            ]
        };
    },
    // 类似onload
    created() {
        this.getMenuList();
    },
    methods:{
        logout(){
            window.sessionStorage.clear();
            this.$router.push("/login");
        },
        async getMenuList(){
            // const {data:res} = await this.$http.get("menus");
            // console.log(res.data);
            // if( res.status != 200) return this.$message.error("操作失败！！！");
            // this.menuList = res.data;
            console.log("getMenuList");
        },
        selected(data){
             console.log(data);
        },
        find(){
            console.log(placeholders);
        },
        collapseChage() {
            this.collapse = !this.collapse;
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


</style>



