<template>
  <div class="rank_table">
    <h3 class="title">{{ rank_name }}人数排名</h3>
    <el-divider></el-divider>
    <div class="table_items">
      <div class="cur_poi" v-for="(item,index) in show_list" :key="index">
        <el-divider v-if="index>0"></el-divider>
        <div>
          <div style="float:left; width: 3em; text-align:center; color: #acacac;">{{ index + 1 }}</div>
          <div style="float:left; margin-left: 1.5em">{{ item.name }}</div>
          <div style="float:right; margin-right: 1.5em; letter-spacing: 1px;">{{
              item.value.toLocaleString('en-us')
            }}
          </div>
        </div>
        <!-- <p style="padding: 0 10px;font-size: 20px;font-weight: bold;">
          {{ index + 1 }}.{{ item.name }}
          style="padding: 0 10px">确诊人数：{{ item.died }}
        </p> -->
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'RankTable',

  mounted() {

  },

  destroyed() {

  },

  props: {
    rank_key: {
      type: String,
      default: 'confirmed'
    }
  },

  data() {
    return {
      country_list: []
    }
  },

  watch: {},

  computed: {
    rank_name() {
      if (this.rank_key == 'confirmed') return '确诊';
      if (this.rank_key == 'died') return '死亡';
      if (this.rank_key == 'cured') return '治愈';
    },
    show_list(data) {
      let res = [];
      this.country_list.forEach(item => {
        res.push({name: item.name, value: item.total[this.rank_key]});
      })
      res.sort(function (a, b) {
        return b.value - a.value;
      })
      return res;
    }
  },

  methods: {
    init(country_list) {
      this.country_list = country_list;
    }
  }
}
</script>

<style scoped>
.rank_table {
  /* border: 1px solid #000; */
  height: calc(100% - 330px);
  display: flex;
  flex-direction: column;
  padding: 0;
}

.title {
  margin: 0;
  padding: 10px;
  font-size: var(--font-size-big);
  font-weight: bold;
  /* border-bottom: 1px solid gray; */
}

.table_items {
  height: calc(100% - 50px);
  overflow-y: scroll;
  padding-bottom: 0;
}

.el-divider {
  margin: 0;
}

.table_items > div {
  height: 50px;
  line-height: 50px;
  transition: all 0.1s linear;
}

.table_items > div:hover {
  background-color: #eee;
}

.table_items::-webkit-scrollbar {
  width: 6px;
}

.table_items::-webkit-scrollbar-thumb {
  background-color: hsla(0, 0%, 78%, 0.35);
}

.table_items:hover::-webkit-scrollbar-thumb {
  background-color: hsla(0, 0%, 78%, 0.69);
}

</style>



// WEBPACK FOOTER //
// src/components/rank_table.vue