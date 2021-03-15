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
                <div class="form-box">
                <el-form ref="form" :model="form" label-width="80px">
                    <el-form-item label="姓名">
                        <el-input v-model="form.name"></el-input>
                    </el-form-item>
                    <el-form-item label="选择器">
                        <el-select v-model="form.region" placeholder="请选择">
                            <el-option key="Java" label="Java" value="bbk"></el-option>
                            <el-option key="C++" label="C++" value="xtc"></el-option>
                            <el-option key="Python" label="Python" value="imoo"></el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="日期时间">
                        <el-col :span="11">
                            <el-date-picker
                                type="date"
                                placeholder="选择日期"
                                v-model="form.date1"
                                value-format="yyyy-MM-dd"
                                style="width: 100%;"
                            ></el-date-picker>
                        </el-col>
                        <el-col class="line" :span="2">-</el-col>
                        <el-col :span="11">
                            <el-time-picker
                                placeholder="选择时间"
                                v-model="form.date2"
                                style="width: 100%;"
                            ></el-time-picker>
                        </el-col>
                    </el-form-item>
                    
                    <el-form-item label="选择开关">
                        <el-switch v-model="form.delivery"></el-switch>
                    </el-form-item>
                    <el-form-item label="多选框">
                        <el-checkbox-group v-model="form.type">
                            <el-checkbox label="Java" name="type"></el-checkbox>
                            <el-checkbox label="C++" name="type"></el-checkbox>
                            <el-checkbox label="Python" name="type"></el-checkbox>
                        </el-checkbox-group>
                    </el-form-item>
                    <el-form-item label="单选框">
                        <el-radio-group v-model="form.resource">
                            <el-radio label="Java"></el-radio>
                            <el-radio label="C++"></el-radio>
                            <el-radio label="Python"></el-radio>
                        </el-radio-group>
                    </el-form-item>
                    <el-form-item label="文本框">
                        <el-input type="textarea" rows="5" v-model="form.desc"></el-input>
                    </el-form-item>
                    <el-form-item>
                        <el-button type="primary" @click="onSubmit">提交</el-button>
                        <el-button>取消</el-button>
                    </el-form-item>
                </el-form>
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
            ],
            form: {
                name: '',
                region: '',
                date1: '',
                date2: '',
                delivery: true,
                type: ['步步高'],
                resource: '小天才',
                desc: '',
                options: []
            }
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
        onSubmit() {
            this.$message.success('提交成功！');
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

.form-box {
    width: 600px;
}

.form-box .line {
    text-align: center;
}
</style>



