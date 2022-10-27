<template>
    <div class="region_card">
        <div class="left_bar"></div>
        <div class="right_bar">
            <div class="danger_tip">
                <div v-if="level===0" class="iconfont icon-fengxian0" style="float:left"></div>
                <div v-if="level===1" class="iconfont icon-fengxian1" style="float:left"></div>
                <div v-if="level===2" class="iconfont icon-fengxian2" style="float:left"></div>
                <div v-if="level===3" class="iconfont icon-fengxian3" style="float:left"></div>
                <div v-if="level===4" class="iconfont icon-fengxian4" style="float:left"></div>
                <div v-if="level===5" class="iconfont icon-fengxian5" style="float:left"></div>
                <div  class="text">警告:风险等级{{level}}</div>
                <div  class="clear_both"></div>
            </div>
            <div class="danger_info">
                {{message}}
            </div>
        </div>
        <div class="clear_both"></div>
    </div>
</template>

<script>
export default {
  name: "RegionCard",
  props:{
    message:{
        type:String,
        default:'约翰霍普金斯大学 30 分钟 COVID-19 简报：关于：关于您现在需9 简报：关于您现在需：关于您现在需9 简报：关于您现在需：关于您现在需9 简报：关于您现在需您现在需9 简报：关于您现在需要了解的内容的专家见解要了解的内容的专家见解'
    },
    level:{
        type: Number,
        default:0
    }
  },
  data() {
    return {
      
    };
  },
  mounted() {
  },
  methods: {
    
  }
};
</script>

<style>

.region_card {
  width: 70%;
  height: auto;
  margin: 2% 15%;
  transition: background-color 0.1s linear;
}
.region_card:hover {
    transform: translateY(-3px);
    background-color: hsl(0, 10%, 94%);
}
.region_card .right_bar{
  width: 100%;
  float: left;
}
.region_card .right_bar .danger_tip{
  padding-left: 5%;
  text-align: center;
}
.region_card .right_bar .danger_tip .text{
  float: left;
  margin-top: 3px;
  font-size: 20px;
}
.region_card .right_bar .danger_info{
  padding-left: 5%;
  padding-right: 3%;
  padding-bottom: 3%;
  font-family: "Lucida Console", "Courier New", monospace;
  font-weight:bolder;
  color:rgb(3, 3, 119);
}
</style>



// WEBPACK FOOTER //
// src/components/region_card.vue