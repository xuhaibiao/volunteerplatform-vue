<template>
    <div class="login-wrap">
        <div class="ms-login">
            <!--添加表单-->
            <div class="ms-title">社区志愿服务系统</div>
            <el-form ref="loginFormRef" :model="loginForm" :rules="loginRules" class="ms-content" label-width="0px">
                <el-form-item prop="username">
                    <el-input v-model="loginForm.username">
                        <el-button slot="prepend" icon="iconfont icon-denglu"></el-button>
                    </el-input>
                </el-form-item>
                <el-form-item prop="password">
                    <el-input v-model="loginForm.password" type="password">
                        <el-button slot="prepend" icon="iconfont icon-mima"></el-button>
                    </el-input>
                </el-form-item>
                <el-form-item prop="userType">
                    <el-select v-model="loginForm.type" placeholder="请选择">
                        <el-option
                        v-for="item in options"
                        :key="item.value"
                        :label="item.label"
                        :value="item.value">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item class="btns">
                    <el-button type="primary" @click="login">登录</el-button>
                    <el-button type="info" @click="resetLoginForm">重置</el-button>
                    <el-button type="primary" @click="signUp">注册</el-button>
                </el-form-item>
            </el-form>
        </div>
    </div>
</template>

<script>
export default {
    data(){
        return{
            loginForm:{
                username:"wwwwww",
                password:"123456",
                type:"1"
            },
            loginRules:{
                username: [
                    { required: true, message: "请输入用户名", trigger: "blur" },
                    { min: 5, max: 8, message: "长度在 5 到 8 个字符", trigger: "blur" }
                ],
                password: [
                    { required: true, message: "请输入密码", trigger: "blur" },
                    { min: 6, max: 8, message: "密码为 6~8 位", trigger: "blur" }
                ]
            },
            options: [{
                value: '0',
                label: '志愿者'
                }, {
                value: '1',
                label: '社区工作者'
                }, {
                value: '2',
                label: '超级管理员'
                }],
            
            };
    },
    methods:{
        resetLoginForm(){
            this.$refs.loginFormRef.resetFields();
        },
        login(){
           this.$refs.loginFormRef.validate(async valid=>{
               if (!valid) return;
                // 调用post请求
                const {data :res} = await this.$http.post("login", this.loginForm);
                if (res.code == 1 ) {
                    console.log(res.data.address);
                
                    window.sessionStorage.setItem("user",JSON.stringify(res.data));
                    this.$message.success("登陆成功！！！");
                    if(res.flag == "0"){
                        // 路由
                        this.$router.push({ path: "/volunteer/activity"});
                    }else if(res.flag == "1"){
                        // 路由
                        this.$router.push({ path: "/worker/activityManagement"});
                    }else{
                        this.$router.push({ path: "/administrator/home"});
                    }
                    
                }else{
                    this.$message.error("登录失败！！！");
                }
           });
        },

        signUp(){
            const { href } = this.$router.resolve({
                
                path: '/register',
                
            });
            window.open(href, '_blank');
        }
        
    }
}
</script>

<style lang="less" scoped>


.login-wrap {
    position: relative;
    width: 100%;
    height: 100%;
    // background-image: url(../assets/img/login-bg.jpg);
    background-image: url(../assets/img/001.jpg);
    background-size: 100%;
}
.ms-title {
    width: 100%;
    line-height: 50px;
    text-align: center;
    font-size: 20px;
    color: #fff;
    border-bottom: 1px solid #ddd;
}
.ms-login {
    position: absolute;
    left: 50%;
    top: 50%;
    width: 350px;
    height: 340px;
    margin: -190px 0 0 -175px;
    border-radius: 5px;
    background: rgba(255, 255, 255, 0.3);
    overflow: hidden;
}

// 跟节点样式
.login_container {
//   background-color: #2b4b6b;
//   height: 100%;
//   background-image: url(../assets/img/login-bg.jpg);
    position: relative;
    width: 100%;
    height: 100%;
    background-image: url(../assets/img/login-bg.jpg);
    background-size: 100%;
}

.btns {
    text-align: center;
    display: flex;// 弹性布局
    justify-content: flex-end; // 尾部对齐
}


.ms-content {
    padding: 30px 30px;
}

</style>



