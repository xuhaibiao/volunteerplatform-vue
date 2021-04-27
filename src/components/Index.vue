<template>
    <el-container>
        <el-header height="100px">
           <div>
               <span> 社区志愿服务网</span>
           <!-- </div>
           <div> -->
                <el-menu :default-active="activeIndex"  mode="horizontal" @select="handleSelect" >
                    <el-menu-item index="1">活动</el-menu-item>
                    <el-menu-item index="2">社区</el-menu-item>
                </el-menu>  
           </div>
        
            <el-button type="info" @click="logout">安全退出</el-button>  
        </el-header>
<!-- <div class="line"></div> -->
            <el-main>   
               <el-row>
                    <div class="form-box">
                        <el-form ref="screenForm" :model="screenForm" label-width="80px">
                            <el-form-item label="项目区域" prop="place">
                                <el-row>
                                    <el-col :span="12">
                                        <v-distpicker :province="screenForm.province" 
                                        @province="selectProvince" 
                                        hide-area
                                        >
                                        </v-distpicker>
                                    </el-col>
                                
                                    <el-col :span="12">
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
                        <el-col :span="7"  v-for="l in list" v-bind:key="l.id">
                            <el-card shadow="hover" class="card" :body-style="{ padding: '0px' }" v-cloak>
                                <img src="https://picsum.photos/id/1/300/200" class="image">
                                <div style="padding: 14px;">
                                    <el-lebal v-model="l.title">{{l.title}}</el-lebal>
                                    <span><el-lebal v-model="l.value">{{l.value}}</el-lebal></span>
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
            screenForm: { 
                province: '省', 
                activityName:''
            
            },
            list:[
                {
                    id:1,
                    title:'aaa',
                    value:1
                },
                {
                    id:2,
                    title:'aaa',
                    value:2
                },
                {
                    id:3,
                    title:'aaa',
                    value:3
                },

                {
                    id:4,
                    title:'aaa',
                    value:4
                },
                {
                    id:5,
                    title:'aaa',
                    value:5
                },
                
               
            ],
            
        };
    },
    // 类似onload
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
    margin-left: 80px;
    margin-top: 30px;
    // height:250px; 
    width: 300px; 
    // margin: auto;
    background: #ffffff 
}

.form-box{
    
    margin-bottom: 20px;
    height:10%; 
    width: 60%; 
    margin: auto;
}
.handle-input {
    width: 300px;
   
}
</style>



