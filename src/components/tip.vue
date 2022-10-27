<template>
  <div class="tip shadow" :class="`bc${rand}`" :style="show ? 'opacity:1' : 'opacity:0'">
    <div>
      <div class="text">
        <el-image
          :src="require(`@/assets/${card_type}_bc${rand}.png`)"
          fit="contain">
        </el-image>
        <h3 class="text_overflow_3">
          {{ info.title }}
        </h3>
        <div class="content">
          <p v-for="(item, index) in content" :key="index">{{ item }}</p>
        </div>
        <div style="height: 20px"></div>
        <transition name="el-fade-in-linear">
          <!-- <el-button v-show="!useful" @click="useful = true" type="primary" style="width: 100%; font-size: var(--font-size);">我感觉很有用</el-button> -->
        </transition>
      </div>
      <div class="append">
        <p>来源：辟谣中心</p>
        <!-- <p class="cur_poi" @click="to_tips" style="color: var(--color-safe)">跳转到新闻</p> -->
      </div>
      <div style="height: 10px;"></div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Tip',

  mounted() {
    this.url = this.info.url;
    this.rand = parseInt(Math.random() * 100) % this.color.length;
    if(this.card_type=='protect'){
      this.rand = parseInt(Math.random() * 100) % 1;
    }
    for(let i=0; i<this.info.summary.split('\n').length; i++) {
      if(this.info.summary.split('\n')[i].trim().length) {
        this.content.push(this.info.summary.split('\n')[i].trim());
      }
    }
    var that = this;
    setTimeout(function () {
      that.show = true;
    }, parseInt(Math.random() * 690));
  },

  destroyed() {

  },

  props: {
    info: {
      type: Object,
      default: {
        url: '',
        title: '11',
        body: '111111111111111111111111111111111111111111111111111111111111111111111111111'
      }
    },
    card_type: {
      type: String,
      default: 'tip',
    }
  },

  data() {
    return {
      url: '',
      show: false,
      color: ['#207ec2', '#d88846', '#e4b921', '#4aba53', '#925aba', '#e87083', '#23a686'],
      rand: 0,
      useful: false,
      content: []
    }
  },

  watch: {},

  methods: {}
}
</script>

<style scoped>
.tip {
  margin-bottom: 30px;
  padding: 0;
  position: relative;
  /* min-height: 300px; */
  transition: all 0.2s linear;
  opacity: 0;
}

.tip:hover .text h3 {
  /* color: var(--color-t); */
}

.el-skeleton {
  height: fit-content;
}

.tip .img {
  float: left;
}

.el-image {
  position: absolute;
  top: 18px;
  left: 25px;
  width: 56px;
  height: auto;
}

.tip .text {
  margin: 10px 0;
  padding: 0 23px;
  float: left;
}

.tip .text h3 {
  margin: 10px;
  line-height: 50px;
  vertical-align: middle;
  color: #565656;
  font-style: italic;
  text-indent: 63px;
  word-break: break-all;
  transition: color 0.1s linear;
}

.tip .text p {
  margin-bottom: 6px;
  height: fit-content;
  line-height: 23px;
  color: #787878;
  word-break: break-all;
  white-space: pre-line;
}

.tip .append p {
  text-align: right;
  margin: 3px 0;
  padding: 0 23px;
  color: #aaa;
  font-size: 15px;
}

.tip .el-button--primary {
  border: unset;
}

.tip .el-button--primary:hover {
  opacity: 0.78;
}

.bc0 .el-button--primary {
  background-color: #207ec2;
}

.bc1 .el-button--primary {
  background-color: #d88846;
}

.bc2 .el-button--primary {
  background-color: #e4b921;
}

.bc3 .el-button--primary {
  background-color: #4aba53;
}

.bc4 .el-button--primary {
  background-color: #925aba;
}

.bc5 .el-button--primary {
  background-color: #e87083;
}

.bc6 .el-button--primary {
  background-color: #23a686;
}
</style>



// WEBPACK FOOTER //
// src/components/tip.vue