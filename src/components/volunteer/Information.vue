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
                <el-menu default-active="information" background-color="#545c64" text-color="#fff" active-text-color="#409eff" 	unique-opened :collapse="isCollapse" :collapse-transition="false" :router="true">
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
                    <!-- <div class="form-box">
                        <el-form ref="form" :model="form" label-width="80px">
                            <el-form-item label="姓名:">
                                <el-label v-model="form.name" v-text="form.name"></el-label>
                            </el-form-item>
                            <el-form-item label="电话:" >
                                <el-label v-model="form.phone" v-text="form.phone"></el-label>
                            </el-form-item>
                            <el-form-item label="身份证号:">
                                <el-label v-model="form.idCard" v-text="form.idCard"></el-label>
                            </el-form-item>
                            <el-form-item label="密码:">
                                <el-label v-model="form.password" v-text="form.password"></el-label>
                            </el-form-item>
                            <el-form-item label="性别:">
                                <el-label v-model="form.gender" v-text="this.options[form.gender].label"></el-label>
                            </el-form-item>
                            <el-form-item label="志愿时长:">
                                <el-label v-model="form.volunteerHours" v-text="form.volunteerHours"></el-label>
                            </el-form-item>
                            <el-form-item label="志愿分数:">
                                <el-label v-model="form.volunteerAverageScore" v-text="form.volunteerAverageScore"></el-label>
                            </el-form-item>
                            <el-form-item>
                                <el-button type="primary" @click="edit">编辑</el-button>
                                <el-button>取消</el-button>
                            </el-form-item>
                        </el-form>
                    </div> -->
                    <div class="form-box">
                        <el-form ref="form" :model="form" label-width="80px">
                            <el-form-item label="姓名:">
                                <el-label v-model="form.name">{{form.name}}</el-label>
                            </el-form-item>
                            <el-form-item label="电话:" >
                                <el-label v-model="form.phone">{{form.phone}}</el-label>
                            </el-form-item>
                            <el-form-item label="身份证号:">
                                <el-label v-model="form.idCard">{{form.idCard}}</el-label>
                            </el-form-item>
                            <el-form-item label="密码:">
                                <el-label v-model="form.password">{{form.password}}</el-label>
                            </el-form-item>
                            <el-form-item label="性别:">
                                <el-label v-model="options[form.gender]">{{this.options[form.gender]}}</el-label>
                            </el-form-item>
                            <el-form-item label="志愿时长:">
                                <el-label v-model="form.volunteerHours">{{form.volunteerHours}}</el-label>
                            </el-form-item>
                            <el-form-item label="志愿总分:">
                                <el-label v-model="form.volunteerScore">{{form.volunteerScore}}</el-label>
                            </el-form-item>
                            <el-form-item label="志愿次数:">
                                <el-label v-model="form.volunteerNumber">{{form.volunteerNumber}}</el-label>
                            </el-form-item>
                            <el-form-item>
                                <el-button type="primary" @click="edit">编辑</el-button>
                                <el-button>取消</el-button>
                            </el-form-item>
                        </el-form>
                    </div>
                </el-row>
                
            </el-main>
             <!-- 编辑弹出框 -->
            <el-dialog title="信息编辑" :visible.sync="editVisible" width="30%">
                <el-form ref="editForm" :model="editForm" label-width="100px">
                    <el-form-item label="姓名:">
                        <el-input v-model="editForm.name"></el-input>
                    </el-form-item>
                    <el-form-item label="电话:" >
                        <el-input v-model="editForm.phone"></el-input>
                    </el-form-item>
                    <el-form-item label="身份证号:">
                        <el-input v-model="editForm.idCard"></el-input>
                    </el-form-item>
                    <el-form-item label="密码:">
                        <el-input v-model="editForm.password"></el-input>
                    </el-form-item>
                     <el-form-item label="性别:">
                        <el-radio-group v-model="editForm.gender">
                            <el-radio :label= 1>男</el-radio>
                            <el-radio :label= 0>女</el-radio>
                        </el-radio-group>
                    </el-form-item>
                    <!-- <el-form-item label="地区">
                        <v-distpicker :province="form.province" :city="form.city" :area="form.area" 
                                @selected='selected'
                                @province="selectProvince" 
                                @city="selectCity" 
                                @area="selectArea">                
                        </v-distpicker>
                    </el-form-item> -->
                    <el-form-item>
                        <el-button type="primary" @click="onSubmit">提交</el-button>
                        <el-button @click="cancel">取消</el-button>
                    </el-form-item>
                    
                    
                </el-form>
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
            collapse: '',
            editVisible: false,
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
            
            options: [
                
              "女","男"
            
            ],
            form: {
                id: '',
                name: '',
                phone: '',
                idCard: '',
                password: '',
                gender: '',
                volunteerHours: '',
                volunteerScore: '',
                    
            },
            editForm: {
                id: '',
                name: '',
                phone: '',
                idCard: '',
                password: '',
                gender: '',
                type:'',
            },
            user:{}
        };
    },
    // 类似onload

    // mounted(){
    //     this.user = JSON.parse(window.sessionStorage.getItem("user"));
    //     this.getUserInfo();
    // },
    created() {
        this.collapse = global.collapse;
        this.user = JSON.parse(window.sessionStorage.getItem("user"));
        this.getUserInfo();
        
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

        async getUserInfo(){
            const {data :res} = await this.$http.get("information/", {
                params: {  
                    "userId": this.user.id,
                    "type": 0   //代表志愿者
                }  
            });
            window.sessionStorage.setItem("user",JSON.stringify(res.data));
            this.form = res.data;
            
            
        },
        
        async onSubmit() {
            //代表志愿者
            this.editForm.type = 0;
            
            const {data :res} = await this.$http.post("information/edit", this.editForm);
            if(res.code == 1){
                var user = res.data;
                this.form = user;
                window.sessionStorage.setItem("user",JSON.stringify(user));
                this.editVisible = false;
                this.$message.success('更新成功！');
            }else if(res.code == 2){
                 this.$message.error('更新失败！');
            }
            
        },
        cancel(){
            this.editVisible = false;
        },
        edit(){ 
            this.editForm.name = this.form.name;
            this.editForm.phone = this.form.phone;
            this.editForm.idCard = this.form.idCard;
            this.editForm.password = this.form.password;
            this.editForm.gender = this.form.gender;
            this.editForm.id = this.form.id;
            this.editVisible = true;
            
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

.form-box {
    width: 600px;
}

.form-box .line {
    text-align: center;
}


</style>



