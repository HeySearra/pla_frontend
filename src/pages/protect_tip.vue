<template>
  <div class="news">
    <div class="time_list">
      <div class="list_head">
        <h3>防疫小知识</h3>
        <div>
          <el-radio-group v-model="type" size="small" @change="$router.replace({name: 'protect_fake'})">
            <el-radio-button label="小知识"></el-radio-button>
            <el-radio-button label="辟谣"></el-radio-button>
          </el-radio-group>
        </div>
        <div class="clear_both"></div>
      </div>
      <div class="inner_time_list">
        <div class="inner_time_list_head"></div>
        <p
          v-for="(item, index) in list"
          :key="item.title">
          <a :href="`#n${item.rid}`" class="text_overflow_1">
            {{ index + 1 + '. ' }} {{ item.title }}
          </a>
        </p>
        <div style="height: 30px;"></div>
        <div v-if="loading" class="not_found" style="margin: 0 0 15px; padding-left: 25px"><i
          class="el-icon-loading"></i> 正在搜寻更多的小知识
        </div>
        <div v-if="!loading&&!finished" @click="apply_for_info" class="not_found more"
             style="margin: 0 0 15px; padding-left: 25px">更多的小知识
        </div>
        <div v-if="finished" class="not_found" style="margin: 0 0 15px; padding-left: 25px">小知识就只有这么多了啦</div>
      </div>
    </div>
    <div class="inner_news">
      <a id="top"></a>
      <div v-if="list" class="domestic">
        <div style="height: 50px;"></div>
        <!-- <el-row :gutter="36">
            <el-col v-for="item in list" :key="item.title" :span="span">
                <Tip :id="`n${item.rid}`" :info="item" />
            </el-col>
        </el-row> -->
        <div class="masonry">
          <div class="item" v-for="item in list" :key="item.title">
            <Tip :id="`n${item.rid}`" :info="item"/>
          </div>
        </div>
      </div>
      <div v-if="loading" class="not_found" style="margin: 0 0 15px; padding-left: 25px"><i class="el-icon-loading"></i>
        正在搜寻更多的小知识
      </div>
      <div v-if="!loading&&!finished" @click="apply_for_info" class="not_found more"
           style="margin: 0 0 15px; padding-left: 25px">更多的小知识
      </div>
      <div v-if="finished" class="not_found" style="margin: 0 0 15px; padding-left: 25px">小知识就只有这么多了啦</div>
      <div style="height: 30px;"></div>
      <div class="clear_both"></div>
    </div>
    <DataFrom :info="data_from" />
  </div>
</template>

<script>
import Tip from '@/components/tip';

export default {
  name: 'ProtectTip',

  components: {
    Tip
  },

  mounted() {
    var that = this;
    window.onresize = (function () {
      var a = function () {
        // console.log(document.getElementById('app').clientWidth)
        if (document.getElementById('app').clientWidth >= 1630) {
          that.span = 8;
        } else if (document.getElementById('app').clientWidth >= 1200) {
          that.span = 12;
        } else {
          that.span = 12;
        }
        return this;
      };
      a();
      return a;
    })();
    this.init();
  },

  destroyed() {
    window.onresize = function () {
    };
  },

  props: {},

  data() {
    return {
      list: [],
      type: '小知识',
      span: 6,
      rid: 0,
      loading: true,
      finished: false,
      start: 0,
      data_from: [{
          title: '各大网络资源',
          content: '略'
      }]
    }
  },

  watch: {},

  methods: {
    init() {
      this.apply_for_info();
    },

    apply_for_info() {
      this.loading = true;
      var r = {
        data: [{
          "title": "憋气 20 秒可以检测肺部是否健康？",
          "summary": "人憋气时间的长短只是粗略反映人体对于缺氧和高二氧化碳耐受的程度。",
          "body": "网传一个肺部健康测试，称「能憋住气就是健康的肺」，不同版本的测试要求的憋气时间不同。人憋气时间长短只是粗略反映人体对于缺氧和高二氧化碳耐受的程度，而对缺氧和高二氧化碳耐受程度并不仅仅体现在肺功能上。"
        }]
      };
      this.ajax.get('/tips/list', {
        start: this.start
      }, this, {
        success(res) {
          for (let i = 0; i < res.data.length; i++) {
            res.data[i].rid = this.rid++;
            this.list.push(res.data[i]);
          }
          this.start += 12;
          if (res.data.length < 10) {
            this.finished = true;
          }
          this.loading = false;
        }
      });
    },

    back_to_top() {
      let a = document.createElement('a');
      a.href = "#top";
      a.click();
    }
  }
}
</script>

<style scoped>
:local {
  --time-list-width: 325px;
}

.news {
  width: 100%;
  height: calc(100% - var(--nav-height));
  position: absolute;
  top: var(--nav-height);
  left: 0;
  /* border: solid 1px #000; */
  /* background-image: url('../assets/news_bc2.jpg'); */
  background-position: center;
  background-size: 1250px auto;
  overflow: overlay;
}

.time_list {
  width: var(--time-list-width);
  height: 100%;
  position: absolute;
  top: 0;
  left: 0;
  /* border: solid 1px #000; */
  border-right: solid 1px #ccc;
  background-color: #fff;
  overflow: hidden;
}

.time_list .list_head {
  margin: 0;
  z-index: 1;
}

.time_list .list_head > * {
  margin: 25px 23px 0 0;
  line-height: 50px;
  float: left;
}

.time_list .list_head >>> .el-radio-button__inner {
  font-size: 15px;
  padding: 7px 11px;
}

.time_list h3 {
  font-weight: normal;
  text-indent: 1em;
  /* text-align: center; */
  color: #555;
}

.time_list .inner_time_list {
  padding: 0 50px 29px 0;
  height: calc(100% - 79px);
  overflow: overlay;
}

.time_list .inner_time_list p {
  padding-left: 2em;
}

.time_list a {
  margin-top: 20px;
  margin-bottom: 15px;
  color: #777;
  font-size: 16px;
  text-decoration: none;
  display: block;
}

.time_list a:hover {
  color: var(--color-t);
}

.more {
  cursor: pointer;
}

.more:hover {
  color: var(--color-t);
}

.inner_news {
  width: calc(100% - var(--time-list-width));
  height: 100%;
  position: absolute;
  top: 0;
  left: var(--time-list-width);
  overflow: overlay;
}

.domestic {
  padding: 0 5%;
}

.masonry{
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
}

.item{
  width: 30%;
}
</style>



// WEBPACK FOOTER //
// src/pages/protect_tip.vue