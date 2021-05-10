<template>
    <div class="login-wrap">
        <div class="ms-login">
            <!--添加表单-->
            <div class="ms-title">注册</div>
            <el-form ref="registerFormRef" :model="registerForm" :rules="registerRules" class="ms-content" label-width="0px">
                <el-row>
                    <el-col :span="12">
                        <el-form-item prop="idCard" >
                            <el-input v-model="registerForm.idCard" style="margin-left:30px" placeholder="请输入身份证号">
                                <el-button slot="prepend" icon="iconfont icon-cardid"></el-button>
                            </el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item prop="username">
                            <el-input v-model="registerForm.username" style="margin-left:40px" placeholder="请输入姓名">
                                <el-button slot="prepend" icon="iconfont icon-denglu"></el-button>
                            </el-input>
                        </el-form-item>
                    </el-col>
                </el-row>

                <el-row>
                    <el-col :span="12">
                        <el-form-item prop="password">
                            <el-input v-model="registerForm.password" type="password" style="margin-left:30px"  placeholder="请输入密码">
                                <el-button slot="prepend" icon="iconfont icon-mima"></el-button>
                            </el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item prop="phone">
                            <el-input v-model="registerForm.phone" style="margin-left:40px" placeholder="请输入电话号">
                                <el-button slot="prepend" icon="iconfont icon-dianhua"></el-button>
                            </el-input>
                        </el-form-item>
                    </el-col>
                </el-row>

                <el-row >
                    <el-col :span="24" style="height:62px">                       
                        <v-distpicker
                                @province="selectProvince" 
                                @city="selectCity" 
                                @area="selectArea" style="margin-left:30px">
                        </v-distpicker>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="12">
                        <el-form-item prop="detailAddress" >
                            <el-input v-model="registerForm.detailAddress" style="margin-left:30px;" placeholder="请输入区级以下地址  ">
                                <el-button slot="prepend" icon="iconfont icon-dizhi"></el-button>
                            </el-input>
                        </el-form-item>
                    </el-col>

                    <el-col :span="12">                  
                            <el-form-item prop="gender" style="margin-left:40px" >
                                <el-radio-group v-model="registerForm.gender">
                                    <el-radio :label= 1>男</el-radio>
                                    <el-radio :label= 0>女</el-radio>
                                </el-radio-group>
                            </el-form-item>
                    </el-col>

                </el-row>

                <el-row >
                    <el-col :span="12">                       
                        <el-form-item prop="userType">
                            <el-select v-model="registerForm.type" placeholder="请选择注册用户类型" style="margin-left:30px">                               
                                <el-option
                                v-for="item in typeOptions"
                                :key="item.value"
                                :label="item.label"
                                :value="item.value">
                                </el-option>
                            </el-select>
                        </el-form-item>
                    </el-col>

                    <el-col :span="12"  v-if="registerForm.type==1">
                        <el-form-item prop="选择社区组织" >
                            <el-autocomplete 
                                class="inline-input"
                                v-model="registerForm.joinCommunityInfo"
                                :fetch-suggestions="querySearch"
                                placeholder="请选择工作的社区"
                                @select="handleSelect"
                                style="margin-left:40px; width:296px;" 
                                >
                                <el-button slot="prepend" icon="iconfont icon-zuzhi" ></el-button>
                            </el-autocomplete>


                        </el-form-item>
                    </el-col>
                </el-row>

                

                <el-divider v-if="registerForm.type==2"></el-divider>

                <el-row v-if="registerForm.type==2">
                    <el-col :span="12">
                        <el-form-item prop="communityName" >
                            <el-input v-model="registerForm.community.name" style="margin-left:30px" placeholder="请输入社区名">
                                <el-button slot="prepend" icon="iconfont icon-zuzhi"></el-button>
                            </el-input>
                        </el-form-item>
                        <el-form-item prop="communityAddress" >
                            <v-distpicker
                                    @province="selectCommunityProvince" 
                                    @city="selectCommunityCity" 
                                    @area="selectCommunityArea" style="margin-left:30px">
                            </v-distpicker>
                        </el-form-item>
                        <el-form-item prop="communityDetailAddress">
                            <el-input v-model="registerForm.community.detailAddress" style="margin-left:30px;"  placeholder="请输入区级以下地址  ">
                                <el-button slot="prepend" icon="iconfont icon-dizhi"></el-button>
                            </el-input>
                        </el-form-item>

                    </el-col>
                     <el-col :span="12">                       
                        <el-upload
                            ref="upload"
                            class="upload-demo"
                            drag
                            action="http://localhost:9000/upload"
                            multiple
                            accept=".pdf"
                            :on-success="uploadResult"
                            :on-preview="handlePreview"
                            :on-change="addFile"
                            limit="1"
                            :before-remove="removeFile"
                            :auto-upload="false"
                            >
                            <i class="el-icon-upload" ></i>
                            <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
                            <div class="el-upload__tip" slot="tip">只能上传pdf文件，且不超过100MB</div>
                        </el-upload>
                    </el-col>
                    
                </el-row>

                    
                
                
                <el-form-item class="btns">
                    <el-button type="primary" @click="confirmSignUp">确定</el-button>
                    <el-button type="info" @click="resetLoginForm">重置</el-button>
                    
                </el-form-item>
            </el-form>
        </div>
    </div>
</template>

<script>
import VDistpicker from 'v-distpicker'
export default {
    components: { VDistpicker },
    data(){
        return{
            registerForm:{
                idCard:'333333333333333333',
                username:'徐嗨嗨',
                password:'123456',
                type: '2',
                gender: 1,
                phone:'33333333333',
                detailAddress:'测试村',
                province: '浙江省', 
                city: '绍兴市',
                area: '柯桥区' ,
                joinCommunityInfo: '',
                community:{
                    name:'1',
                    province: '浙江省', 
                    city: '绍兴市',
                    area: '柯桥区' ,
                    detailAddress:'1'
                }
                
            },
            file: null,
            communities: [],
            registerRules:{
                username: [
                    { required: true, message: "请输入姓名", trigger: "blur" },
                    
                ],
                password: [
                    { required: true, message: "请输入密码", trigger: "blur" },
                    { min: 6, max: 8, message: "密码为 6~8 位", trigger: "blur" }
                ],
                idCard: [
                    { required: true, message: "请输入身份证号", trigger: "blur" },
                    { len: 18, message: "身份证号为 18 位", trigger: "blur" }
                ],
                phone: [
                    { required: true, message: "请输入电话号", trigger: "blur" },
                    { len: 11, message: "电话号为 11 位", trigger: "blur" }
                ],
                detailAddress: [
                    { required: true, message: "请输入区级以下地址", trigger: "blur" },
                    
                ],
                gender: [
                    { required: true, message: "请选择性别", trigger: "blur" },
                    
                ],
                
            },
            typeOptions: [
                {
                    value: '0',
                    label: '志愿者'
                }, 
                {
                    value: '1',
                    label: '社区工作者（加入社区）'
                },
                {
                    value: '2',
                    label: '社区工作者（创建社区）'
                },
            ],
        };
            
    },
    created(){
        this.registerForm.province="浙江省";
        this.registerForm.city="绍兴市";
        this.registerForm.area="柯桥区";
        this.registerForm.community.province="浙江省";
        this.registerForm.community.city="绍兴市";
        this.registerForm.community.area="柯桥区";
        this.loadAll();
       
    },
    methods:{
        resetLoginForm(){
            this.$refs.loginFormRef.resetFields();
        },
     
        selectProvince(value) {
            this.registerForm.province = value.value;
    
        },
        selectCity(value) {
            this.registerForm.city = value.value;
           
        },
        selectArea(value) {
            this.registerForm.area = value.value;
            
        },
        selectCommunityProvince(value) {
            this.registerForm.community.province = value.value;
    
        },
        selectCommunityCity(value) {
            this.registerForm.community.city = value.value;
           
        },
        selectCommunityArea(value) {
            this.registerForm.community.area = value.value;
            
        },
        

        confirmSignUp(){
           this.$refs.registerFormRef.validate(async valid=>{
               if (!valid) return;
                // 调用post请求
                if(this.registerForm.province == '省'||this.registerForm.city == '市'||this.registerForm.area == '区'){
                        this.$message.error("请填写完整的省市区地址！");
                        return;
                }else{
                    if(this.registerForm.type == 0){
                        // 志愿者
                        const {data :res} = await this.$http.post("signUp", this.registerForm);
                        if(res.code==2){
                            console.log(res.msg);
                            this.$message.error(res.msg);
                            return;
                        }else{
                            this.$message.success("注册成功！");
                            this.routerToPage("/login");
                        }
                        
                    }else if(this.registerForm.type == 1){
                        // 工作者（加入社区）
                        if(this.communitiesContainStr(this.communities, this.registerForm.joinCommunityInfo)){
                            const {data :res} = await this.$http.post("signUp", this.registerForm);
                            if(res.code==2){
                                console.log(res.msg);
                                this.$message.error(res.msg);
                            }else{
                                this.$message.success("注册成功！");
                                this.routerToPage("/login");
                            }
                        }else{
                            this.$message.error("选择加入的社区不存在！");
                        }
                        
                        
                    }else{
                        // 工作者（创建社区）
                        // this.$refs.upload.submit();
                        if(this.registerForm.community.name == ""||this.registerForm.community.detailAddress==""
                                    ||this.registerForm.community.province == '省'||this.registerForm.community.city == '市'||this.registerForm.community.area == '区'){
                            this.$message.error("请填写完整的社区信息！");
                            return;
                        }else{
                            if(this.file == null){
                                this.$message.error("请上传创建社区所需材料！");
                                return;
                            }
                            const {data :res} = await this.$http.post("signUp", this.registerForm);
                            if(res.code==2){
                                this.$message.error(res.msg);
                                return;
                            }else{
                                //todo 上传创建社区材料，管理员审核
                            }
                            // this.$refs.upload.submit();

                        }


                    }
                }
                
                
           });
        },

        communitiesContainStr(arr, str){
            for(var i = 0; i < arr.length; i++){
                if(arr[i].value == str){
                    return true;
                }
            }
            return false;
        },
        uploadResult(response, file, fileList){
            console.log(response);
            if(response.code == 2){
                this.$message.error("注册失败，原因为："+response.msg);
            }
            // window.open(response.data);
        },
        addFile(file,fileList){
            this.file = file;
        },
        removeFile(file,fileList){
            this.file = null;
        },
        querySearch(queryString, cb) {
            var communities = this.communities;
            var results = queryString ? communities.filter(this.createFilter(queryString)) : communities;
            // 调用 callback 返回建议列表的数据
            cb(results);
        },
        createFilter(queryString) {
            return (community) => {
            return (community.value.toLowerCase().indexOf(queryString.toLowerCase()) === 0);
            };
        },
        async loadAll() {
            const {data :res} = await this.$http.get("loadAllCommunity");
            if(res.code == 1){
                this.communities = res.data;
            }
           
        },

        routerToPage(newPath){
            const loading = this.$loading({
                lock: true,
                text: '3秒后跳转至登录界面...',
                spinner: 'el-icon-loading',
                background: 'rgba(0, 0, 0, 0.7)'
            });
            setTimeout(() => {
                this.$router.push({path: newPath}); // 强制切换当前路由 path
                loading.close();
            }, 3000);
        },

    //     async download(){
    //         let res = await this.$http.get("download",{
    //             responseType: 'blob',
    //             params: {  
    //                 "fileName": 'xhb.pdf',
    //                 "fileDate": '2021-05-06',
    //             }  
    //          });
    //         if (res) {
    //             var fileName = 'xhb.pdf';
    //             //eslint-disable-next-line
    //             const blob = new Blob([res.data], {
    //                 // 如何后端没返回下载文件类型，则需要手动设置：type: 'application/pdf;chartset=UTF-8' 表示下载文档为pdf，如果是word则设置为msword，excel为excel
    //                 type: 'application/pdf;chartset=UTF-8'
    //             });
    //             //对于<a>标签，只有 Firefox 和 Chrome（内核） 支持 download 属性
    //             //IE10以上支持blob但是依然不支持download
    //             if ('download' in document.createElement('a')) { 
    //                 //支持a标签download的浏览器
    //                 const link = document.createElement('a')//创建a标签
    //                 link.download = fileName//a标签添加属性
    //                 link.style.display = 'none'
    //                 link.href = URL.createObjectURL(blob)
    //                 document.body.appendChild(link)
    //                 link.click()//执行下载
    //                 URL.revokeObjectURL(link.href) //释放url
    //                 document.body.removeChild(link)//释放标签
            
    //             }else{
    //                 navigator.msSaveBlob(blob, fileName)
    //             }

    //         }
    //     }

    }
}
</script>

<style lang="less" scoped>
@import "//at.alicdn.com/t/font_2416161_p3co1sp4bcq.css";

.login-wrap {
    position: relative;
    width: 100%;
    height: 900px;
    // background-image: url(../assets/img/login-bg.jpg);
    background-image: url(../assets/img/001.jpg);
    background-size: cover;
    //  background-color: #a98175;
    // background:#fff url(../assets/img/001.jpg) no-repeat;
   
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
    left: 20%;
    top: 5%;
    width: 800px;
    // height: 100%;
    margin: -190px 0 0 -175px;
    margin: auto;
    border-radius: 5px;
    background: rgba(255, 255, 255, 0.3);
    overflow: hidden;
}

// 跟节点样式
.login_container {
    //   background-color: #2b4b6b;
    //   height: 100%;
    // position: relative;
    width: 100%;
    height: 100%;
    // background-size: 100%;
}

.btns {
    text-align: center;
    display: flex;// 弹性布局
    justify-content: flex-end; // 尾部对齐
}


.ms-content {
    padding: 30px 30px;
}

.el-input{
    width: 80%;
}



</style>



