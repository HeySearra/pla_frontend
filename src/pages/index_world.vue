<template>
  <div class="index">
    <div class="index_header">
      <PointSlider ref="slider" @change="slider_change"></PointSlider>
    </div>
    <div class="index_main">
      <div class="index-left">
        <WorldMap ref="world_map" :rank_key="rank_key"></WorldMap>
      </div>
      <div class="index-right">
        <ChangeCard v-for="(item,index) in card_list"
                      :key="index"
                      :card_type="item.type"
                      :data="item.total"
                      :new_data="item.new"
                      :on_select="on_click_card">
          </ChangeCard>
        <RankTable ref="rank_table" :rank_key="rank_key"></RankTable>
      </div>
    </div>
    <DataFrom :info="data_from" />
  </div>
</template>

<script>
import moment from 'moment-timezone';
import ChangeCard from "@/components/change_card";
import WorldMap from "@/components/world_map";
import RankTable from "@/components/rank_table";
import PointSlider from '@/components/point_slider';

export default {
  name: "Index",

  components: {
    ChangeCard,
    WorldMap,
    RankTable,
    PointSlider
  },
  mounted() {
    this.init();
  },

  destroyed() {
  },

  props: {},

  data() {
    return {
      //当前选中的变化卡片类型
      rank_key: "confirmed",
      type_list: ['confirmed', 'died', 'cured'],
      //后端返回的世界疫情数据
      
      card_list: [{
        type: 'confirmed',
        total: '',
        new: ''
      }, {
        type: 'cured',
        total: '',
        new: ''
      }, {
        type: 'died',
        total: '',
        new: ''
      }],
      today: undefined,
      data_from: [{
        title: '国外数据',
        content: 'https://github.com/CSSEGISandData/COVID-19/tree/master/csse_covid_19_data/csse_covid_19_daily_reports'
      }]
    };
  },
  computed: {
  },

  watch: {},

  methods: {
    init() {
      this.apply_for_info();
      if (localStorage.getItem('map_type')) {
        this.rank_key = localStorage.getItem('map_type');
      }
    },
    apply_for_info() {
      this.ajax.get('/data/today/international_analyze', {}, this, {
        success(res) {
          this.data = res.data;
          // this.$refs.slider.init(res.data[0].date, res.data[res.data.length-1].date);
          this.today = res.today;
          this.change_card(this.data[0].countries, this.today);

          // this.$refs.slider.init(this.data[this.data.length-1].countries);
          this.$refs.rank_table.init(this.data[0].countries);
          this.$refs.world_map.init(this.data[0].countries);
        }
      });
      this.ajax.get('/data/international_analyze', {}, this, {
        success(res) {
          this.data = res.data;
          this.today = res.today;
          this.$refs.slider.init(res.data[0].date, res.data[res.data.length-1].date);
        }
      });
    },
    on_click_card(type) {
      this.rank_key = type;
    },
    change_card(states, today) {
      // cal chinese total and new
      var total = {
        confirmed: 0,
        cured: 0,
        died: 0
      };
      var n = {...total};
      if(!today) {
        for(let i=0; i<states.length; i++) {
          total.confirmed += states[i].total.confirmed;
          total.cured += states[i].total.cured;
          total.died += states[i].total.died;
          n.confirmed += states[i].new.confirmed;
          n.cured += states[i].new.cured;
          n.died += states[i].new.died;
        }
      }
      else {
        total = today.total;
        n = today.new;
      }
      this.card_list[0].total = total.confirmed;
      this.card_list[0].new = n.confirmed;
      this.card_list[1].total = total.cured;
      this.card_list[1].new = n.cured;
      this.card_list[2].total = total.died;
      this.card_list[2].new = n.died;
    },
    change_map(states) {
      this.$refs.world_map.set(states);
    },
    slider_change(date) {
      var states;
      for(let i=0; i<this.data.length; i++) {
        if(date.utc().format() == moment(this.data[i].date).utc().format()) {
          states = this.data[i].countries;
          break;
        }
      }
      if(moment(date).tz('Asia/Shanghai').format('YYYYMMDD') == moment(this.today.update).tz('Asia/Shanghai').format('YYYYMMDD')) {
        this.change_card(states, this.today);
      }
      else {
        this.change_card(states);
      }
      this.change_map(states);
      this.$refs.rank_table.init(states);
    }

  },
};
</script>

<style scoped>
.el-slider {
  margin: 0 100px;
}

.world_map, .china_map {
  margin-left: 3px;
  width: calc(100% - 3px);
  height: 100%;
  /* border: solid 1px #aaa; */
}

.rank_table {
  height: calc(100% - 240px);
  width: 100%;
  margin: 0 auto;
}

* {
  --index-right-width: 350px;
  --index-header-height: 60px;
}

.index {
  height: calc(100% - var(--nav-height) - 4px);
  position: relative;
  overflow: hidden;
  background-color: #fefefe;
  /* border: solid 1px #000; */
}

.index_header {
  margin: 0 auto;
  width: 90%;
  padding: 10px;
  /* height: var(--index-header-height); */
}

.index_main {
  width: 100%;
  height: calc(100% - var(--index-header-height));
  position: relative;
}

.index-left {
  position: absolute;
  top: 0;
  left: 0;
  width: calc(100% - var(--index-right-width) - 4px);
  height: 100%;
  /* border: solid 1px #000; */
}

.index-right {
  position: absolute;
  top: 0;
  right: 0;
  width: var(--index-right-width);
  height: 100%;
  /* border: solid 1px #000; */
}
</style>



// WEBPACK FOOTER //
// src/pages/index_world.vue