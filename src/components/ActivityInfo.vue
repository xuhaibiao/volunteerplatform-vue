<template>
    <el-container>
        <el-header height="100px">
           <div>
               <span> 社区志愿服务网</span>
           <!-- </div>
           <div> -->
                <el-menu :default-active='1' class="el-menu-demo" mode="horizontal" @select="handleSelect" >
                    <el-menu-item index="1">活动</el-menu-item>
                    <!-- <el-menu-item index="2">社区</el-menu-item> -->
                </el-menu>  
           </div>

        </el-header>

            <el-main>  
                <el-row>
                    <el-col :span="10">
                        <div class="card-box">
                            <el-card shadow="hover" class="card" :body-style="{ padding: '0px' }" v-cloak>
                                <el-image    
                                    :src="activityInfo.picUrl" 
                                    >
                                </el-image>
                                <div style="padding: 14px;">
                                <el-lebal>{{this.activityInfo.activity.name}}</el-lebal>
                                    <div class="bottom clearfix">
                                        <time class="cardContent">{{"招募时间："+ activityInfo.recruitTimeRange}}</time>
                                    </div>
                                    <div class="bottom clearfix">
                                        <time class="cardContent">{{"活动时间："+ activityInfo.activityTimeRange}}</time>
                                    </div>
                                    <div class="bottom clearfix">
                                        <el-lebal class="cardContent">{{"地点："+ activityInfo.activity.province +" "+ activityInfo.activity.city+" "+ activityInfo.activity.area+" "+ activityInfo.activity.detailAddress}}</el-lebal>
                                    </div>
                                    <div class="bottom clearfix">
                                        <el-lebal class="cardContent" >{{"发起社区："+ activityInfo.communityName}}</el-lebal>
                                    </div>
                                    <div class="bottom clearfix">
                                        <el-lebal  class="cardContent">{{"联系人："+ activityInfo.sponsor}}</el-lebal>
                                    </div>
                                    <div class="bottom clearfix">
                                        <el-lebal  class="cardContent" >{{"联系方式："+ activityInfo.sponsorPhoneNumber}}</el-lebal>
                                    </div>
                                    <div class="bottom clearfix">
                                        <el-lebal  class="cardContent">活动状态：</el-lebal>
                                        <el-lebal v-if="activityInfo.activityStatus==='招募中'" style="color: green">招募中</el-lebal>
                                        <el-lebal v-else style="color: red">{{activityInfo.activityStatus}}</el-lebal>
                                    </div>
                                    
                                </div>
                            </el-card>
                            
                        </div>
                    </el-col>
                
                    
                    <el-col :span="14">
                        <div class = "info-box">
                            <span>活动详情</span>
                            <el-divider></el-divider>
                            
                            <el-form  >
                                <el-form-item label="招募面向人群:">
                                    <el-label>{{recruitType[activityInfo.activity.recruitRange]}}</el-label>
                                </el-form-item>
                            </el-form>
                            <el-form  >
                                <el-form-item label="活动计划招募人数:">
                                    <el-label>{{activityInfo.activity.recruitNumber+"人"}}</el-label>
                                </el-form-item>
                            </el-form>
                            <el-form  >
                                <el-form-item label="活动已报名人数:">
                                    <el-label>{{activityInfo.hasRecruitedNumber+"人"}}</el-label>
                                </el-form-item>
                            </el-form>
                            <el-form >
                                <el-form-item label="活动报名已通过人数:">
                                    <el-label>{{activityInfo.hasAgreeNumber+"人"}}</el-label>
                                </el-form-item>
                            </el-form>
                            <el-form >
                                <el-form-item label="活动名:">
                                    <el-label>{{activityInfo.activity.name}}</el-label>
                                </el-form-item>
                            </el-form>
                            <el-form  >
                                <el-form-item label="活动内容:">
                                    <el-label>{{activityInfo.activity.content}}</el-label>
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
           recruitType: ["社区内部志愿者","全国志愿者"],
    
            currentDate: new Date(),
            l:
                {
                    id:1,
                    title:'aaa',
                    value:1
                },
                
            activityInfo:{
                activity:{}
            }
           
            
        };
    },
    // 类似onload
    created() {
        this.getActivity();
        
    },
    methods:{
        
        async getActivity(){
            var activityId = this.$route.query.activityId;
            const {data:res} = await this.$http.get("volunteer/activityInfo",{
                params: {  
                    "activityId": activityId,
                }  
            });
            this.activityInfo = res.data;
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



