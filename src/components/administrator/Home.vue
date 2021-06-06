<template>
    <el-container>
        <el-header>
            <div>
               
                <span> 社区志愿服务网 </span>
            
            </div>
            <el-button type="info" @click="logout">安全退出</el-button>
        </el-header>
        <el-container>
            <el-aside :width="collapse ?'64px':'200px'">
                <!--侧边栏菜单区 unique-opened="true" 只保持一个菜单展开 router开启路由-->
                <el-menu default-active="home" background-color="#EBF1F6" text-color="rgb(37, 35, 35);" active-text-color="#409eff" 	unique-opened :collapse="isCollapse" :collapse-transition="false" :router="true">
                    <template v-for="item in items">
                        <template v-if="item.subs">
                            <el-submenu :index="item.index" :key="item.index" @open="open">
                                <template slot="title">
                                    <i :class="item.icon"></i>
                                    <span slot="title" v-if="!collapse">{{ item.title }}</span>
                                </template>
                                <template v-for="subItem in item.subs">
                                    <el-submenu
                                        v-if="subItem.subs"
                                        :index="subItem.index"
                                        :key="subItem.index"
                                    >
                                        <template slot="title">{{ subItem.title }}</template>
                                        <el-menu-item
                                            v-for="(threeItem,i) in subItem.subs"
                                            :key="i"
                                            :index="threeItem.index"
                                        >{{ threeItem.title }}</el-menu-item>
                                    </el-submenu>
                                    <el-menu-item
                                        v-else
                                        :index="subItem.index"
                                        :key="subItem.index"
                                    >{{ subItem.title }}</el-menu-item>
                                </template>
                            </el-submenu>
                        </template>

                        <template v-else>
                            <el-menu-item :index="item.index" :key="item.index">
                            <i :class="item.icon"></i>
                            <span v-if="!collapse" slot="title">{{ item.title }}</span>
                            </el-menu-item>
                        </template>
                        
                    </template>
                </el-menu>
            </el-aside>

            <el-main>
                <el-row :gutter="20">
                    <el-col :span="10">
                        <el-card shadow="hover"  class="mgb20" style="height:300px;  background: #EAEDF1 " >
                            <div id="fiveYearNumEchart" :style="{width: '100%', height: '300px'}" ></div>
                        </el-card>
                    </el-col>

                    <el-col :span="10">
                        <el-card shadow="hover" class="mgb20" style="height:300px;  background: #EAEDF1;" >
                            <div id="sexRatioEchart" :style="{width: '100%', height: '300px'}" ></div>
                        </el-card>
                    </el-col>

                </el-row>   
                <el-row :gutter="20" >
                    <el-col :span="20">
                        <el-card shadow="hover"  class="mgb20" style="height:600px;  background: #EAEDF1; text-align: center;" >
                            <div id="chinaMapEchart" :style="{width: '100%', height: '580px',margin: auto,}" ></div>
                        </el-card>
                    </el-col>
                </el-row>   
            </el-main>
            
        </el-container>
                
    </el-container>


</template>

<script>

import global from '../../components/Global'
import '../../assets/js/china'


export default {
    inject:['reload'], 

    
    data(){
        return{
            fiveYearNum : {
                title: {
                    text: '近五年数据',
                    // subtext: '模拟数据',
                    // x: 'center'
                },
                legend: {
                    // orient 设置布局方式，默认水平布局，可选值：'horizontal'（水平） ¦ 'vertical'（垂直）
                    orient: 'horizontal',
                    // x 设置水平安放位置，默认全图居中，可选值：'center' ¦ 'left' ¦ 'right' ¦ {number}（x坐标，单位px）
                    x: 'right',
                    // y 设置垂直安放位置，默认全图顶端，可选值：'top' ¦ 'bottom' ¦ 'center' ¦ {number}（y坐标，单位px）
                    y: 'top',
                    data: ['活动总数','志愿者总数']
                },

                color: ['red', 'blue'],

                xAxis: {
                    name: '年份',
                    type: 'category',
                    data: [2017, '2018', '2019', '2020', '2021']
                },
                yAxis: {
                    name: '数量/个',
                    type: 'value'
                },
                series: [
                    {
                        name: '活动总数',
                        data: [150, 230, 224, 218, 135],
                        type: 'line',
                        itemStyle:{
                            normal:{
                                // 拐点上显示数值
                                label : {
                                    show: true
                                },
                                // borderColor:'red',  // 拐点边框颜色
                                lineStyle:{                 
                                // width:5,  // 设置线宽
                                // type:'dotted'  //'dotted'虚线 'solid'实线
                                    color: 'rgba(255,0,0,1)'
                                }
                            }
                        }

                    },

                    {
                        name: '志愿者总数',
                        data: [150, 230, 224, 218, 135],
                        type: 'line',
                        itemStyle:{
                            normal:{
                                // 拐点上显示数值
                                label : {
                                    show: true
                                },
                                // borderColor:'red',  // 拐点边框颜色
                                lineStyle:{                 
                                // width:5,  // 设置线宽
                                // type:'dotted'  //'dotted'虚线 'solid'实线
                                    color: 'rgba(0,0,255,1)'
                                }
                            }
                        }

                    }
                
                ]
            },
            sexRatio : {
                title: {
                    text: '志愿者性别比例',
                   
                },
                tooltip: {
                    trigger: 'item'
                },
                legend: {
                   
                    left: 'right'
                },
                series: [
                    {
                        name: '性别',
                        type: 'pie',
                        radius: ['20%', '60%'],
                        avoidLabelOverlap: false,
                        itemStyle: {
                            borderRadius: 10,
                            borderColor: '#fff',
                            borderWidth: 2
                        },
                        label: {
                        
                            show: true,
                            // position: 'center',
                            formatter: '{b}: {c}({d}%)'
                        },
                        emphasis: {
                            label: {
                                show: true,
                                fontSize: '10',
                                fontWeight: 'bold'
                            }
                        },
                        labelLine: {
                            show: false
                        },
                        data: [
                            
                            {value: 735, name: '女'},
                            {value: 48, name: '男'},
                           
                        ]
                    }
                ]
            },
                
            chinaMap : {
                title: {
                    text: '全国志愿活动数量分布情况',
                   
                },
            
                tooltip: {
                        formatter:function(params,ticket, callback){
                            return params.seriesName+'<br />'+params.name+'：'+params.value
                        }
                    },
                visualMap: {
                    min: 0,
                    max: 1500,
                    left: 'left',
                    top: 'bottom',
                    text: ['高','低'],
                    inRange: {
                        color: ['#e0ffff', '#006edd']
                    },
                    show:true
                },
                geo: {
                    map: 'china',
                    roam: false,
                    zoom:1.23,
                    label: {
                        normal: {
                            show: true,
                            fontSize:'10',
                            color: 'rgba(0,0,0,0.7)'
                        }
                    },
                    itemStyle: {
                        normal:{
                            borderColor: 'rgba(0, 0, 0, 0.2)'
                        },
                        emphasis:{
                            areaColor: '#F3B329',
                            shadowOffsetX: 0,
                            shadowOffsetY: 0,
                            shadowBlur: 20,
                            borderWidth: 0,
                            shadowColor: 'rgba(0, 0, 0, 0.5)'
                        }
                    }
                },
                series : [
                    {
                        name: '信息量',
                        type: 'map',
                        geoIndex: 0,
                        data: [
                                // {name:"南海诸岛",value:3},
                                // {name: '北京', value: 3},
                                // {name: '天津', value: 300},
                                // {name: '上海', value: 3}
                            ]
                    }
                ],
            },
        

            user:{},
            currentPage:1, //初始页
            pagesize:10,    //    每页的数据
            collapse: '',
            info:{
                activity:{}
            },
            signUpInfo:{
                activity:{},
                user:{}
            },
            
            items: [
                {
                    index: 'home',
                    title: '    主页',
                    icon: 'iconfont icon-geren1'
                },
                {
                    index: 'communityReview',
                    title: '    新建社区审核',
                    icon: 'iconfont icon-icon-test'
                },
                {
                    index: 'message',
                    title: '    消息',
                    icon: 'iconfont icon-xiaoxi'
                },
                {
                    // icon: 'el-icon-s-home',
                    // index: 'authorityManagement',
                    index: '3',
                    title: '    权限管理',
                    icon: 'iconfont icon-quanxianguanli',
                    subs: [
                        {
                            index: 'activityAuthority',
                            title: '活动权限'
                        },
                        {
                            index: '3-2',
                            title: '用户权限',
                            subs: [
                                {
                                    index: 'volunteerAuthority',
                                    title: '志愿者权限'
                                },
                                {
                                    index: 'workerAuthority',
                                    title: '社区工作者权限'
                                }
                            ]
                        },
                        
                    ]
                },
                
                
            
            ],
            tableData:[{ 

            },
            
            ],
            options: [
                
              "女","男"
            
            ],
        
        };
    },
    // 类似onload
    created() {
        this.collapse = global.collapse;
        this.user = JSON.parse(window.sessionStorage.getItem("user"));

    },

    mounted() {
        this.drawChart();
    },

    methods:{
        async drawChart() {
          
            const {data:res} = await this.$http.get("statistics");
            this.fiveYearNum.xAxis.data =  res.data.fiveYearNumberVo.years;
            this.fiveYearNum.series[0].data =  res.data.fiveYearNumberVo.activityNums;
            this.fiveYearNum.series[1].data =  res.data.fiveYearNumberVo.volunteerNums;
            this.sexRatio.series[0].data[0].value = res.data.sexRatio[0];
            this.sexRatio.series[0].data[1].value = res.data.sexRatio[1];
            this.chinaMap.series[0].data = res.data.provinceActivityNum;

            let fiveYearNumEchart = this.$echarts.init(document.getElementById("fiveYearNumEchart"));
            let sexRatioEchart = this.$echarts.init(document.getElementById("sexRatioEchart"));
            let chinaMapEchart = this.$echarts.init(document.getElementById("chinaMapEchart"));
            
        
            fiveYearNumEchart.setOption(this.fiveYearNum);
            sexRatioEchart.setOption(this.sexRatio);
            chinaMapEchart.setOption(this.chinaMap);
            
        },


        logout(){
            window.sessionStorage.clear();
            this.$router.push("/login");
        },
        
        
        collapseChage() {
            this.collapse = !this.collapse;
            global.collapse = !global.collapse;
        },
        
      
        open(){
            alert("open");
            this.collapseChage();
        },
        

        // 初始页currentPage、初始每页数据数pagesize和数据data
        handleSizeChange(size) {
                this.pagesize = size;
                console.log(this.pagesize)  //每页下拉显示数据
        },
        handleCurrentChange(currentPage){
                this.currentPage = currentPage;
                console.log(this.currentPage)  //点击第几页
        },
        
        
    }

}
</script>

<style lang="less" scoped>
@import "//at.alicdn.com/t/font_2416161_9iovrknjytp.css";


.el-header {
  background-color: #EBF1F6;
  display: flex;
  justify-content: space-between;// 左右贴边
  padding-left: 0%;// 左边界
  align-items: center;// 水平
  color: rgb(37, 35, 35);
  font-size: 20px;
  div { //左侧div加布局
    display: flex;
    align-items: center;
    span {
      margin-left: 35px;
    }
  }
  
}
.el-aside{
    background-color: #EBF1F6;
}
.el-main{
     /* background-image: url(./assets/img/main.png); */
    background-color: #EBF1F6;
}

.handle-input {
    width: 300px;
   
}

.mgb20 {
    margin-bottom: 20px;
}
.distpicker-address-wrapper {
  select {
    padding: 0px 10px !important;
    height: 30px !important;
    font-size: 15px !important;
    line-height: 30px !important;
  }
}


</style>



