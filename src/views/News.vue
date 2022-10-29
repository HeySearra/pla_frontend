<template>
  <div>

<!--    政策-->
    <v-container
    style="background-color: white;border-radius:6px;width: 93%;padding: 0px;">

    <!--    图片-->
    <v-card
            style="border-radius: 6px 6px 0px 0px;width: 100%;margin: 0 auto">
        <v-img
                src="https://i.loli.net/2021/07/09/Js5XrHB3DVehd8Q.png" style="width: 100%">
        </v-img>
    </v-card>

    <v-row
    :align="start"
    no-gutters
    style="padding:20px"
    >
      <v-col
      md="8"
      class="d-flex flex-row flex-wrap justify-start"
      no-gutters
      >
<!--        国家政策-->
        <p class="text-h4 font-weight-bold"
        style="height: 40px; width: 640px; margin-top: 15px">
          <v-icon
              large
              color="blue darken-2"
          >
            mdi-message-text
          </v-icon>
          国家政策
        </p>
        <div
            class="mx-auto"
            v-for="(n,index) in nationalNews"
            :key="index"
            style="margin-bottom: 10px; border-radius: 0px; height: 123px; width: 320px;cursor: pointer"
            @click="toPolicy(n.pageUrl)"
        >
          <div
          style="height: 110px">
            <p class="font-weight-regular" >
              {{n.title}}
            </p>
            <p style="color: #a2a2a2">
              {{n.time}}
            </p>
          </div>
          <v-divider></v-divider>
        </div>
<!--        各地政策-->
        <p class="text-h4 font-weight-bold"
           style="height: 40px; width: 740px">
          <v-icon
              large
              color="blue darken-2"
          >
            mdi-message-text
          </v-icon>
          各地防控
        </p>
        <div
        v-for="(n,index) in localNews"
        :key="index"
        @click="toLocale(n.src)"
        style="margin-left: 10px;margin-right: 10px">
          <p class="font-weight-regular;"
             style="cursor:pointer;"
          >
              | &nbsp;<span style="font-weight: bold;" class="name">{{n.name}}</span>
          </p>
        </div>
        <div></div>
      </v-col>

<!--      时间轴-->
      <v-col
      cols="4">
        <div
        style="margin-top: 15px">
          <p class="text-h4 font-weight-bold"
                style="height: 40px; width: 740px">
          <v-icon
              large
              color="blue darken-2"
          >
            mdi-message-text
          </v-icon>
          实时播报
        </p></div>
      <div
      style="background-color: #FFF; border-radius: 0px; max-height: 730px">
        <v-timeline
            align-top
            dense
            v-for="(n,index) in timeline.slice(0,6)"
            :key="index"
        >
          <v-timeline-item
              color="#64B5F6"
              small
          >
            <v-row class="pt-1">
              <v-col cols="3">
                <strong>{{n.tranTime}}</strong>
              </v-col>
              <v-col>
                <strong>{{n.title}}</strong>
              </v-col>
            </v-row>
          </v-timeline-item>
        </v-timeline>
      </div>
      </v-col>
    </v-row>
    </v-container>
  </div>
</template>

<script>
export default {
  data(){
    return{
      reveal:false,
      nationalNews:[
      
      ],
      timeline:[],
      localNews:[
        {
          name:"北京",
          src:"http://www.beijing.gov.cn/ywdt/zwzt/yqfk/"
        },
        {
          name:"天津",
          src:"http://www.tj.gov.cn/sy/ztzl/tjsfyyqfkzt/"
        },
        {
          name:"河北",
          src:"http://www.hbzwfw.gov.cn/col/col22108/index.html"
        },
        {
          name:"山西",
          src:"http://www.shanxi.gov.cn/ztjj/fyyqfk/"
        },
        {
          name:"内蒙古",
          src:"http://www.nmg.gov.cn/ztzl/qlfkxxgzbdfynmgzxd/index.html"
        },
        {
          name:"辽宁",
          src:"http://www.ln.gov.cn/qmzx/xxgzbd/"
        },
        {
          name:"吉林",
          src:"http://www.jl.gov.cn/szfzt/jlzxd/"
        },
        {
          name:"黑龙江",
          src:"http://testhlj.zwfw.hlj.gov.cn/yswz/static/common/fkzt/indexyd.html"
        },
        {
          name:"上海",
          src:"https://www.shanghai.gov.cn/nw48614/index.html"
        },
        {
          name:"江苏",
          src:"http://www.jiangsu.gov.cn/col/col76916/index.html"
        },
        {
          name:"浙江",
          src:"http://www.zj.gov.cn/col/col1228996600/index.html"
        },
        {
          name:"安徽",
          src:"https://www.ah.gov.cn/content/column/6792991"
        },
        {
          name:"福建",
          src:"http://www.fujian.gov.cn/zwgk/ztzl/ydxxfy/"
        },
        {
          name:"江西",
          src:"http://www.jiangxi.gov.cn/col/col33242/index.html"
        },
        {
          name:"山东",
          src:"http://www.sd.gov.cn/col/col119814/index.html"
        },
        {
          name:"河南",
          src:"https://www.henan.gov.cn/zt/2020/431381/index.html"
        },
        {
          name:"湖北",
          src:"http://www.hubei.gov.cn/zhuanti/2020/gzxxgzbd/index.shtml"
        },
        {
          name:"湖南",
          src:"http://www.hunan.gov.cn/topic/fkxxgzbd/index.html"
        },
        {
          name:"广东",
          src:"http://www.gd.gov.cn/gdywdt/zwzt/yqfk/"
        },
        {
          name:"广西",
          src:"http://www.gxzf.gov.cn/kangjiyiqing.shtml"
        },
        {
          name:"海南",
          src:"http://www.hainan.gov.cn/hainan/jjdyyqfkzzz/jjdyyqfkzzz.shtml"
        },
        {
          name:"重庆",
          src:"http://www.cq.gov.cn/zt/yqfk/"
        },
        {
          name:"四川",
          src:"http://www.sc.gov.cn/10462/c102241/fkxxhzbd.shtml"
        },
        {
          name:"贵州",
          src:"http://www.guizhou.gov.cn/ztzl/fkxxgzbdgrdfy/index.html"
        },
        {
          name:"云南",
          src:"http://www.yn.gov.cn/ztgg/yqfk/index.html"
        },
        {
          name:"西藏",
          src:"http://www.xizang.gov.cn/xwzx_406/ztzl_416/cxzt/zjz/"
        },
        {
          name:"甘肃",
          src:"http://www.gansu.gov.cn/gsszf/c103735/common_list_zt.shtml"
        },
        {
          name:"宁夏",
          src:"http://www.nx.gov.cn/hzonproxy/http/wsjkw.nx.gov.cn/sy_279/yqfkdt/yqsd/"
        },
        {
          name:"新疆",
          src:"http://www.xinjiang.gov.cn/xinjiang/c100223/fkxxgzbdgz.shtml"
        },
        {
          name:"陕西",
          src:"http://sxwjw.shaanxi.gov.cn/sy/ztzl/fyfkzt/gzdt_2232/"
        },
        {
          name:"青海",
          src:"http://www.qhnews.com/2020zt/fy/"
        },
        {
          name:"台湾",//
          src:"http://www.taiwan.cn/taiwan/"
        },
        {
          name:"香港",
          src:"https://www.covidvaccine.gov.hk/zh-CN/programme"
        },
        {
          name:"澳门",
          src:"https://eservice.ssm.gov.mo/rnatestbook/V21/"
        },
      ]
    }
  },
  created() {
    // this.getNationalPolicy()
    this.getNationalPolicy()
    this.getTimeline()
    
  },
  methods:{
    getTimeline(){
      this.$axios.get('/data/news').then(res => {
        console.log(res);
        if (res.status !== 200) {
          return this.$message.error('获取失败');
        }
        this.timeline = res.data.data;
      })
    },
    async getNationalPolicy(){
      await this.$axios.get('/data/latestPolicy').then(res => {
        console.log(res);
        if (res.status !== 200) {
          return this.$message.error('获取失败');
        }
        else{
          this.nationalNews = res.data.data;
          console.log(this.nationalNews)
        }
      })
    },
    toLocale(link){
      // window.location.href = link
      window.open(link)
    },
    toPolicy(link){
      window.open(link)
    }
  }
}
</script>

<style scoped>
    .name:hover
    {
        color: #0078d4;
    }
    .font-weight-regular:hover{
        color: #0078d4;
        /*font-weight: bolder !important;*/
    }
    .v-card v-sheet theme--light{
        border-radius: 4px !important;
    }
</style>