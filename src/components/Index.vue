<template>
    <el-container>
        <el-header height="100px">
           <div>
               <span> 社区志愿服务网</span>
           <!-- </div>
           <div> -->
                <el-menu :default-active="1"  class="el-menu-demo" mode="horizontal" @select="handleSelect" >
                    <el-menu-item index="1">活动</el-menu-item>
                    <!-- <el-menu-item index="2">社区</el-menu-item> -->
                </el-menu>  
           </div>

            <div>
                <el-button type="text"  @click="goLogin">去登录</el-button>
                
                <el-button type="text">/</el-button>
                <el-button type="text"  @click="goRegister">注册</el-button>
            </div>
            
        </el-header>
<!-- <div class="line"></div> -->
            <el-main>   
               <el-row>
                    <div class="form-box">
                        <el-form ref="screenForm" :model="screenForm" label-width="80px">
                            <el-form-item label="项目区域" prop="place">
                                <el-row>
                                    <el-col :span="12" >
                                        <v-distpicker :province="screenForm.province" :city="screenForm.city"
                                        @province="selectProvince" 
                                        @city="selectCity"
                                        hide-area
                                        >
                                        </v-distpicker>
                                    </el-col>
                                
                                    <el-col  :span="12" >
                                    <el-input  v-model="screenForm.activityName" placeholder="活动名" class="handle-input mr10" @keydown.enter.native="seachEnter"></el-input><input v-show="false"/>
                                    <el-button type="primary" icon="el-icon-search" @click="handleSearch">搜索</el-button>
                                    <el-button type="primary" @click="reset">重置</el-button>
                                </el-col>
                                    
                                    
                                </el-row>
                                
                            </el-form-item>
                            
                        
                        </el-form>
                        
                    </div>
                </el-row>

                <!-- <el-row> -->
                    

                    <div class="form-box">
                        <el-col :span="8"  v-for="a in activities" v-bind:key="a.id">
                            <el-card shadow="hover" class="card" :body-style="{ padding: '10px' }" v-cloak @click.native="info(a.activity.id)" >
                                <el-image    
                                    :src="a.picUrl" 
                                    >
                                </el-image>
                                <!-- style="width: 390px; height: 100%" -->
                                <!-- <img src= a.picUrl class="image"> -->
                                <div style="padding: 14px;">
                                    <el-lebal>{{a.activity.name}}</el-lebal>

                                    <div class="bottom clearfix">
                                        <time class="time">{{"报名时间："+ a.recruitTimeRange }}</time>
                                    </div>
                                    <div class="bottom clearfix">
                                        <el-lebal>{{"地址："+ a.activity.province +" "+ a.activity.city}}</el-lebal>
                                    </div>
                                    <div class="bottom clearfix">
                                        <el-lebal>{{"计划招募："+ a.activity.recruitNumber +"人"}}</el-lebal>
                                    </div>
                                    <div class="bottom clearfix">
                                        <el-lebal>{{"已报名："+ a.hasRecruitedNumber +"人"}}</el-lebal>
                                    </div>
                                    <div class="bottom clearfix">
                                        <el-lebal>活动状态：</el-lebal>
                                        <el-lebal v-if="a.activityStatus==='招募中'" style="color: green">招募中</el-lebal>
                                        <el-lebal v-else style="color: red">{{a.activityStatus}}</el-lebal>
                                    </div>
                                    
                                </div>
                            </el-card>
                        </el-col>
                    </div>

                    
                     
                <!-- </el-row> -->


                
            </el-main> 
            
        
    </el-container>
</template>

<script>
import VDistpicker from 'v-distpicker'

export default {
     components: { VDistpicker },

    data(){
        return{
            collapse: '',
            
            // screenForm: { 
            //     province: '省', 
            //     city: '市',
            //     area: '区' ,
            //     activityName:''
            
            // },
            screenForm: { 
                province: '', 
                city: '',
                area: '区' ,
                activityName:''
            
            },
            // currentDate: new Date(),
            activities:[
                {
                    activity: {}
                }
            ],
            
            
        };
    },
    // 类似onload
    created() {
        this.getActivity();
        
    },
    methods:{
        reset(){
            this.screenForm.province = '';
            this.screenForm.city = '';
            this.screenForm.activityName = '';
            this.getActivity();
        },
        goLogin(){
            this.$router.push("/login");
        },

        async handleSearch(){
            if(this.screenForm.province === ''||this.screenForm.province == null) this.screenForm.province = "省";
            if(this.screenForm.city === ''||this.screenForm.city == null) this.screenForm.city = "市";
            if(this.screenForm.area === ''||this.screenForm.area == null) this.screenForm.area = "区";
            const {data:res} = await this.$http.get("volunteer/activity/search",{  
                params: {  
                    "province": this.screenForm.province,
                    "city": this.screenForm.city,
                    "area": this.screenForm.area,
                    "activityName": this.screenForm.activityName
                }  
            });
            this.activities = res.data;
        },

        goRegister(){
            this.$router.push("/register");
        },
        
        info(id){
            const { href } = this.$router.resolve({
                name: "活动详情",
                path: '/activityInfo',
                query: {
                    activityId: id,

                }
            });
            window.open(href, '_blank');
        },

        async getActivity(){
            const {data:res} = await this.$http.get("volunteer/activity");
            this.activities = res.data;
        },

        
        selectProvince(value) {
            this.screenForm.province = value.value
    
        },
        selectCity(value) {
            this.screenForm.city = value.value
           
        },
       
    



        

        
    }

}
</script>

<style lang="less" scoped>
@import "//at.alicdn.com/t/font_2416161_nazgwdqmnsi.css";


.el-header {
//   background-color: #EBF1F6;
  display: flex;
  justify-content: space-between;// 左右贴边


  padding-left: 0%;// 左边界
  align-items: center;// 水平
// //   color: rgb(37, 35, 35);
  font-size: 30px;
  div { //左侧div加布局
    display: flex;
    align-items: center;
    span {
      margin-left: 15px;
    }
  }
  
}

.el-menu-item{
    font-size: 20px;
}

.el-main{
     /* background-image: url(./assets/img/main.png); */
     background-color: #ffffff;

}
.mr10 {
    margin-right: 10px;
}
.card {
    display: flex-start;
    // margin-bottom: 20px;
    margin-left: 30px;
    margin-top: 30px;
    // height:250px; 
    width: 100%; 
    // margin: auto;
    background: #ffffff ;
    cursor: pointer;
}

.form-box{
    
    margin-bottom: 20px;
    height:10%; 
    width: 90%; 
    margin: auto;
}
.handle-input {
    width: 300px;
   
}

  .time {
    font-size: 13px;
    color: #999;
  }
  
  .bottom {
    margin-top: 13px;
    line-height: 12px;
  }



  .image {
    width: 100%;
    display: block;
  }

  .clearfix:before,
  .clearfix:after {
      display: table;
      content: "";
  }
  
  .clearfix:after {
      clear: both
  }
</style>



