<template>
    <el-container>
        <el-header height="100px">
           <div>
               <span> 社区志愿服务网</span>
           <!-- </div>
           <div> -->
                <el-menu :default-active='1' class="el-menu-demo" mode="horizontal" @select="handleSelect" >
                    <el-menu-item index="1">活动</el-menu-item>
                    <el-menu-item index="2">社区</el-menu-item>
                </el-menu>  
           </div>
        
            <el-button type="info" @click="logout">安全退出</el-button>  
        </el-header>

            <el-main>  
                <el-row>
                    <el-col :span="8">
                        <div class="card-box">
                            <el-card shadow="hover" class="card" :body-style="{ padding: '0px' }" v-cloak>
                                <img src="https://picsum.photos/id/1/300/200" class="image">
                                <div style="padding: 14px;">
                                <el-lebal v-model="l.title">{{l.title}}</el-lebal>
                                    <div class="bottom clearfix">
                                        <time class="cardContent">{{"报名时间："+ currentDate }}</time>
                                        
                                    </div>
                                    <div class="bottom clearfix">
                                        <el-lebal class="cardContent" v-model="l.value">{{"地点："+ l.value}}</el-lebal>
                                    </div>
                                    <div class="bottom clearfix">
                                        <el-lebal class="cardContent"  v-model="l.value">{{"发起组织："+ l.value}}</el-lebal>
                                    </div>
                                    <div class="bottom clearfix">
                                        <el-lebal  class="cardContent" v-model="l.value">{{"联系人："+ l.value}}</el-lebal>
                                    </div>
                                    <div class="bottom clearfix">
                                        <el-lebal  class="cardContent" v-model="l.value">{{"联系方式："+ l.value}}</el-lebal>
                                    </div>
                                    
                                    
                                </div>
                            </el-card>
                            
                        </div>
                    </el-col>
                
                    
                    <el-col :span="16">
                        <div class = "info-box">
                            <span>活动详情</span>
                            <el-divider></el-divider>
                            <el-form  label-width="80px">
                                <el-form-item label="活动时间:">
                                    <el-label>2021.1.1-2021.1.1</el-label>
                                </el-form-item>

                            </el-form>
                        </div>
                    </el-col>
                </el-row>

            </el-main> 
            
        
    </el-container>
</template>

<script>


export default {

    data(){
        return{
           
    
            currentDate: new Date(),
            l:
                {
                    id:1,
                    title:'aaa',
                    value:1
                },
                
               
           
            
        };
    },
    // 类似onload
    created() {
        this.getActivity();
        
    },
    methods:{
        logout(){
            window.sessionStorage.clear();
            this.$router.push("/login");
        },
        
        getActivity(){
            var activityId = this.$route.query.activityId;
            
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

.card {
    display: flex-start;
    // margin-bottom: 20px;
  
    // width: 30%; 
    // margin: auto;
    background: #ffffff ;

}

.card-box{
  
    
    // width: 30%; 
    // margin: auto;
    margin-left: 20px;
}

.info-box{
    // width: 70%; 
    // margin: auto;
    margin-left: 20px;
}

  .cardContent {
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



