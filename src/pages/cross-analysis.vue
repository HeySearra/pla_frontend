<template>
  <div class="outer">
    <CrossAnalysisHeader ref="cah" @change_pre="change_predict" />
    <CrossAnalysisSimple ref="cas" @change_head="change_head" />
    <DataFrom :info="data_from" />
  </div>
</template>

<script>
import CrossAnalysisSimple from '@/components/cross-analysis-simple';
import CrossAnalysisHeader from '@/components/cross-analysis-header';

export default {
  name: "CrossAnalysis",
  components: {
    CrossAnalysisHeader,
    CrossAnalysisSimple
  },
  mounted() {
  
  },
  data() {
    return {
      data_from: [{
        title: '疫情国际数据',
        content: 'https://news.qq.com/zt2020/page/feiyan.htm#/'
      }, {
        title: '疫苗国际数据',
        content: 'https://github.com/owid/covid-19-data/tree/master/public/data/vaccinations'
      }, {
        title: '全球疫苗接种明细',
        content: 'http://wx.wind.com.cn/unitedweb/cmsapp/Sites/sariInfo/message.html?from=timeline&isappinstalled=0'
      }, {
        title: '国内数据（丁香园）',
        content: 'https://github.com/BlankerL/DXY-COVID-19-Data/releases/tag/2021.07.05'
      }, {
        title: '疫情国内数据',
        content: 'https://github.com/BlankerL/DXY-COVID-19-Data'
      }, {
        title: '疫情预测数据',
        content: 'http://covid19.whalemed.cn/#/home'
      }, {
        "title": "海南疫苗数据",
        "content": "https: //baijiahao.baidu.com/s?id=1704722373499727253&wfr=spider&for=pc"
      },
      {
          "title": "宁夏疫苗数据",
          "content": "https://www.thepaper.cn/newsDetail_forward_13468978"
      },
      {
          "title": "湖南疫苗数据",
          "content": "https://www.hnmsw.com/show_article.php?articleID=158356.html"
      },
      {
          "title": "青海疫苗数据",
          "content": "http://www.qh.gov.cn/zwgk/system/2021/06/11/010385277.shtml"
      },
      {
          "title": "上海疫苗数据",
          "content": "http://www.wandaclub.cc/thread-259382-1-1.html?continueFlag=9aa6f5f8cf33d5e4e7d77595b84f1b6e"
      },
      {
          "title": "广西疫苗数据",
          "content": "http://www.wandaclub.cc/thread-259382-1-1.html?continueFlag=9aa6f5f8cf33d5e4e7d77595b84f1b6e"
      },
      {
          "title": "河南疫苗数据",
          "content": "http://www.wandaclub.cc/thread-259382-1-1.html?continueFlag=9aa6f5f8cf33d5e4e7d77595b84f1b6e"
      },
      {
          "title": "山东疫苗数据",
          "content": "http://news.sdchina.com/show/4630234.html"
      },
      {
          "title": "江苏疫苗数据",
          "content": "https://baijiahao.baidu.com/s?id=1704722373499727253&wfr=spider&for=pc"
      },
      {
          "title": "港疫苗数据",
          "content": "https://www.news.gov.hk/chi/2021/06/20210625/20210625_223106_983.html"
      },
      {
          "title": "重庆疫苗数据",
          "content": "https://www.chinanews.com/gn/2021/06-30/9510541.shtml"
      },
      {
          "title": "安徽疫苗数据",
          "content": "http://wjw.ah.gov.cn/xwzx/tpxw/55745221.html"
      },
      {
          "title": "内蒙古疫苗数据",
          "content": "http://m.hu.bendibao.com/mip/44323.shtm"
      },
      {
          "title": "西藏疫苗数据",
          "content": "http://news.cctv.com/2021/06/27/VIDEBlMxAuwCl8g5TspMzkPf210627.shtml"
      },
      {
          "title": "吉林疫苗数据",
          "content": "https://baijiahao.baidu.com/s?id=1700105386793643852&wfr=spider&for=pc"
      },
      {
          "title": "湖北疫苗数据",
          "content": "http://bj.bendibao.com/news/202175/295490.shtm"
      },
      {
          "title": "辽宁疫苗数据",
          "content": "https://www.sohu.com/a/474800306_121106822"
      },
      {
          "title": "贵州疫苗数据",
          "content": "http://www.gz.chinanews.com/dcsj/2021-05-20/doc-ihamqrhv6862248.shtml"
      },
      {
          "title": "广东疫苗数据",
          "content": "https://ourworldindata.org/covid-vaccinations?country=TWN"
      },
      {
          "title": "江西疫苗数据",
          "content": "http://hc.jiangxi.gov.cn/art/2021/6/30/art_38255_3459697.html"
      },
      {
          "title": "四川疫苗数据",
          "content": "http://www.sc.gov.cn/10462/12771/2021/6/24/2b50646dd9704b698d7c3331e41185e0.shtml"
      },
      {
          "title": "北京疫苗数据",
          "content": "https://www.jiemian.com/article/6339840.html"
      },
      {
          "title": "澳门疫苗数据",
          "content": "https://www.163.com/dy/article/GCFSBCPE053469RG.html"
      },
      {
          "title": "黑龙江疫苗数据",
          "content": "https://www.thepaper.cn/newsDetail_forward_13354824"
      },
      {
          "title": "云南疫苗数据",
          "content": "http://www.yn.xinhuanet.com/original/2021-06/16/c_1310010614.htm"
      },
      {
          "title": "浙江疫苗数据",
          "content": "http://www.chinanews.com/gn/2021/06-04/9492777.shtml"
      },
      {
          "title": "甘肃疫苗数据",
          "content": "http://wsjk.gansu.gov.cn/single/11067/90081.html"
      },
      {
          "title": "天津疫苗数据",
          "content": "http://www.tj.gov.cn/sy/xwfbh/202106/t20210629_5489304.html"
      },
      {
          "title": "新疆疫苗数据",
          "content": "http://wjw.xizang.gov.cn/xwzx/wsjkdt/202106/t20210624_247900.html"
      }]
    }
  },
  methods: {
    change_head(data) {
      this.$refs.cah.change(data);
      // console.log(data);
    },

    change_predict(op, data) {
      this.$refs.cas.change_predict(op, data);
    }
  }

}
</script>

<style scoped>

  * {

  }
  
  .outer {
    width: 100%;
    min-width: 1200px;
    height: calc(100% - var(--nav-height));
    margin: 0 auto;
    overflow: hidden;
    background-color: #fff;
  }

  .cah {
    margin-top: 6px;
    margin-bottom: -6px;
  }


</style>



// WEBPACK FOOTER //
// src/pages/cross-analysis.vue