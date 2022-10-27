<template>
  <div ref="change_card" class="change_card" :class="card_style">
    <input v-if="card_type!='vaccinated'" type="radio" name="card_select" class="card_select" @click="on_card_click" />
    <div class="card-header">
      <span>{{ title }}<span v-if="card_type!='vaccinated'"><span style="display: inline-block; width: 1em"></span>{{ new_data }} <span :class="selected?'arrow':''"><i class="el-icon-caret-top"></i></span></span></span>
    </div>
    <div class="card-number" :class="move?'move':''">
      <!-- <span>{{ formatterData }}</span> -->
      <span ref="ccount" style="display: inline-block">
        <transition name="el-fade-in-linear">
          <countTo v-if="data!=='' && typeof(data)=='number'" class="item" :startVal='data*0.9' :endVal='data' :duration='3000'></countTo>
          <span v-if="data!=='' && typeof(data)=='string'">{{data}}</span>
        </transition>
      </span>
    </div>
    <div class="white_border"></div>
  </div>
</template>

<script>
import countTo from 'vue-count-to';

export default {
  name: 'ChangeCard',

  components: {
    countTo
  },
  mounted() {
    this.init();
    var that = this;
    this.move_show();
    this.listen = function() {
      that.move_show();
    };
    setTimeout(function() {
      that.move_show()
    }, 3000);
    window.addEventListener('resize', this.listen);
  },

  destroyed() {
    window.removeEventListener('resize', this.listen);
  },

  props: {
    card_type: {
      type: String,
      // ['confirmed' | 'died' | 'cured' | 'vaccinated'],
    },
    data: {
      type: Number|String,
      default: '未知'
    },
    new_data: {
      type: Number|String,
      default: 0
    },
    on_select: {
      type: Function,
      default: () => {
      }
    },
    on_cancel_select: {
      type: Function,
      default: () => {
      }
    }
  },
  computed: {
    formatterData() {
      return this.bigNumberTransform(this.data).toLocaleString().replace(/[\d|.]*/, (w)=>w+' ');
    },
    title() {
      if (this.card_type == 'confirmed') return '确诊';
      if (this.card_type == 'died') return '死亡';
      if (this.card_type == 'cured') return '治愈';
      if (this.card_type == 'vaccinated') return '疫苗接种剂次'
    }
  },
  data() {
    return {
      card_style: {
        'died': this.card_type == 'died',
        'confirmed': this.card_type == 'confirmed',
        'cured': this.card_type == 'cured',
        'vaccinated': this.card_type == 'vaccinated',
      },
      move: false,
      listen: '',
      selected: false
    }
  },

  watch: {},

  methods: {
    init(){
      let type = localStorage.getItem('map_type');
      if(!type) type = 'confirmed';
      if(type==this.card_type){
        let select_item = this.$refs.change_card.firstChild;
        select_item.checked =  true;
        this.selected = true;
        this.$refs.change_card.classList.add('card_checked');
      }
    },
    bigNumberTransform(value) {
      const newValue = ['', '', '']
      let fr = 1000
      let num = 3
      let text1 = ''
      let fm = 1
      while (value / fr >= 1) {
        fr *= 10
        num += 1
        // console.log('数字', value / fr, 'num:', num)
      }
      if (num <= 4) { // 千
        newValue[0] = parseInt(value / 1000) + ''
        newValue[1] = '千'
      } else if (num <= 8) { // 万
        text1 = parseInt(num - 4) / 3 > 1 ? '千万' : '万'
        // tslint:disable-next-line:no-shadowed-variable
        fm = text1 === '万' ? 10000 : 10000000
        if (value % fm === 0) {
          newValue[0] = parseInt(value / fm) + ''
        } else {
          newValue[0] = parseFloat(value / fm).toFixed(2) + ''
        }
        newValue[1] = text1
      } else if (num <= 16) { // 亿
        text1 = (num - 8) / 3 > 1 ? '千亿' : '亿'
        text1 = (num - 8) / 4 > 1 ? '万亿' : text1
        text1 = (num - 8) / 7 > 1 ? '千万亿' : text1
        // tslint:disable-next-line:no-shadowed-variable
        fm = 1
        if (text1 === '亿') {
          fm = 100000000
        } else if (text1 === '千亿') {
          fm = 100000000000
        } else if (text1 === '万亿') {
          fm = 1000000000000
        } else if (text1 === '千万亿') {
          fm = 1000000000000000
        }
        if (value % fm === 0) {
          newValue[0] = parseInt(value / fm) + ''
        } else {
          newValue[0] = parseFloat(value / fm).toFixed(2) + ''
        }
        newValue[1] = text1
      }
      if (value < 1000) {
        newValue[0] = value + ''
        newValue[1] = ''
      }
      return newValue.join('')
    },
    on_card_click(e) {
      // e.target.checked = !e.target.is_select;
      if (e.target.checked) {
        localStorage.setItem('map_type',this.card_type);
        this.on_select(this.card_type);
      }else{
        this.on_cancel_select();
      }
      let cards = document.getElementsByClassName('change_card');
      for (let i = 0; i < cards.length; i++) {
        if (cards[i].firstChild.checked) {
          cards[i].__vue__.selected = true;
          cards[i].classList.add('card_checked');
        } else {
          cards[i].__vue__.selected = false;
          cards[i].classList.remove('card_checked');
        }
      }
    },
    // on_card_mousedown(e) {
    //   e.target.is_select = e.target.checked;
    // },
    move_show() {
      if(this.$refs.change_card && this.$refs.change_card.clientWidth < this.$refs.ccount.clientWidth + 18) {
        this.move = true;
      }
      else {
        this.move = false;
      }
    }
  }
}
</script>

<style scoped>
.change_card {
  margin: 5px;
  padding: 10px;
  position: relative;
  color: #fff;
  width: calc(100% - 10px);
  height: 105px;
  box-sizing: border-box;
  font-weight: bold;
  transition: all 0.1s linear;
  background-color: hsla(0, 0%, 100%, 0.78);
  overflow: hidden;
}

.white_border {
  position: absolute;
  top: 0;
  left: 0;
  width: calc(100% - 2px);
  height: calc(100% - 2px);
  border: solid 1px #fff;
}

.change_card > .card-header {
  width: 100%;
  position: absolute;
  top: 0;
  left: 0;
  line-height: 47px;
  font-size: var(--font-size-big);
  text-align: center;
}

.change_card > .card-number {
  margin: 0 auto;
  width: 100%;
  height: 80px;
  position: absolute;
  top: 27px;
  left: 0;
  font-family: 'Arial';
  font-size: 50px;
  text-align: center;
  line-height: 80px;
}

.change_card > input {
  position: absolute;
  left: 0;
  top: 0;
  z-index: 999;
  opacity: 0;
  width: 100%;
  height: 100%;
  cursor: pointer;
}

.died {
  color: var(--color-died);
  border: solid 3px var(--color-died);
}

.confirmed {
  color: var(--color-high-risk);
  border: solid 3px var(--color-high-risk);
}

.cured {
  color: var(--color-safe);
  border: solid 3px var(--color-safe);
}

.vaccinated {
  color: var(--color-life);
  border: solid 3px var(--color-life);
}

.card_checked {
  color: #fff;
}

.died.card_checked {
  background-color: var(--color-died);
}

.confirmed.card_checked {
  background-color: var(--color-high-risk);
}

.cured.card_checked {
  background-color: var(--color-safe);
}

.vaccinated.card_checked {
  background-color: var(--color-life);
}

.move {
  position: absolute;
  width:100%;
  top: 0;
  left:100%;
  white-space:nowrap;
  animation:moveAni 15s infinite linear normal;
}

.item{
  float: left !important;
  width: 100%;
}

.arrow {
  height: 20px;
  overflow: hidden;
  display: inline-block;
}

.arrow i {
  vertical-align: middle;
  animation:up 1s infinite linear normal;
  display: inline-block;
}

@keyframes moveAni{
  0%{
    left: 110%;
  }
  100%{
    left: -100%;
  }
}

@keyframes up{
  0%{
    margin-top: 0;
  }
  100%{
    margin-top: -60px;
  }
}
</style>



// WEBPACK FOOTER //
// src/components/change_card.vue