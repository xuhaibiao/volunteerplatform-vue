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
                <el-menu default-active="message" background-color="#545c64" text-color="#fff" active-text-color="#409eff" 	unique-opened :collapse="isCollapse" :collapse-transition="false" :router="true">
                    <template v-for="item in items">
                        <el-menu-item :index="item.index" :key="item.index">
                            <i :class="item.icon"></i>
                            <span v-if="!collapse" slot="title">{{ item.title }}</span>
                        </el-menu-item>
                    </template>
                </el-menu>
            </el-aside>

            <el-main>
                <el-tabs v-model="message">
                    <el-tab-pane :label="`未读消息(${unread.length})`" name="first">
                        <el-table :data="unread" :show-header="false" style="width: 100%">
                            <el-table-column>
                                <template slot-scope="scope">
                                    <span class="message-title">{{scope.row.title}}</span>
                                </template>
                            </el-table-column>
                            <el-table-column prop="date" width="180"></el-table-column>
                            <el-table-column width="120">
                                <template slot-scope="scope">
                                    <el-button size="small" @click="handleRead(scope.$index)">标为已读</el-button>
                                </template>
                            </el-table-column>
                        </el-table>
                        <div class="handle-row">
                            <el-button type="primary">全部标为已读</el-button>
                        </div>
                    </el-tab-pane>
                    <el-tab-pane :label="`已读消息(${read.length})`" name="second">
                        <template v-if="message === 'second'">
                            <el-table :data="read" :show-header="false" style="width: 100%">
                                <el-table-column>
                                    <template slot-scope="scope">
                                        <span class="message-title">{{scope.row.title}}</span>
                                    </template>
                                </el-table-column>
                                <el-table-column prop="date" width="150"></el-table-column>
                                <el-table-column width="120">
                                    <template slot-scope="scope">
                                        <el-button type="danger" @click="handleDel(scope.$index)">删除</el-button>
                                    </template>
                                </el-table-column>
                            </el-table>
                            <div class="handle-row">
                                <el-button type="danger">删除全部</el-button>
                            </div>
                        </template>
                    </el-tab-pane>
                    <el-tab-pane :label="`回收站(${recycle.length})`" name="third">
                        <template v-if="message === 'third'">
                            <el-table :data="recycle" :show-header="false" style="width: 100%">
                                <el-table-column>
                                    <template slot-scope="scope">
                                        <span class="message-title">{{scope.row.title}}</span>
                                    </template>
                                </el-table-column>
                                <el-table-column prop="date" width="150"></el-table-column>
                                <el-table-column width="120">
                                    <template slot-scope="scope">
                                        <el-button @click="handleRestore(scope.$index)">还原</el-button>
                                    </template>
                                </el-table-column>
                            </el-table>
                            <div class="handle-row">
                                <el-button type="danger">清空回收站</el-button>
                            </div>
                        </template>
                    </el-tab-pane>
                </el-tabs>
            
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

export default {
     

    data(){
        return{
        
            collapse: false,
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
            message: 'first',
                showHeader: false,
                unread: [{
                    date: '2021-03-14 20:00:00',
                    title: '【系统通知】该系统将于今晚凌晨2点到5点进行升级维护',
                },{
                    date: '2021-03-14 20:00:00',
                    title: '今晚12点整发大红包，先到先得',
                }],
                read: [{
                    date: '2021-03-14 20:00:00',
                    title: '【系统通知】该系统将于今晚凌晨2点到5点进行升级维护'
                }],
                recycle: [{
                    date: '2021-03-14 20:00:00',
                    title: '【系统通知】该系统将于今晚凌晨2点到5点进行升级维护'
                }]
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
        
        collapseChage() {
            this.collapse = !this.collapse;
        },
        handleRead(index) {
                const item = this.unread.splice(index, 1);
                console.log(item);
                this.read = item.concat(this.read);
            },
        handleDel(index) {
            const item = this.read.splice(index, 1);
            this.recycle = item.concat(this.recycle);
        },
        handleRestore(index) {
            const item = this.recycle.splice(index, 1);
            this.read = item.concat(this.read);
        }
    },
    computed: {
        unreadNum(){
            return this.unread.length;
        }
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

.message-title{
    cursor: pointer;
}
.handle-row{
    margin-top: 30px;
}

</style>



