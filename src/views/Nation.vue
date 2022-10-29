<template>
  <div>
    <v-bottom-navigation
        v-model="value"
        :background-color="color"
        dark
        shift
    >
      <v-btn >
        <span style="font-weight: bold;font-size: 16px;letter-spacing: .6px">国内疫情</span>

        <v-icon>mdi-television-play</v-icon>
      </v-btn>

      <v-btn>
        <span style="font-weight: bold;font-size: 16px;letter-spacing: .6px">防控措施</span>

        <v-icon>mdi-music-note</v-icon>
      </v-btn>

      <v-btn>
        <span style="font-weight: bold;font-size: 16px;letter-spacing: .6px">国家政策</span>

        <v-icon>mdi-book</v-icon>
      </v-btn>

    </v-bottom-navigation>

    <!--    国内疫情-->
    <div
        v-if="value==0">

      <v-card
          class="d-flex flex-row flex-wrap justify-center"
          flat
          tile
      >
        <!--      数据部分-->
        <v-card
            margin="100px"
            max-width="280"
            v-for="n in 8"
            :key="n"
            class="pa-2"
            flat
            tile

        >
          <v-card-text>
            <div>现有确诊</div>
            <p class="text-h4 text--primary">
              4,416
            </p>
            <p>adjective</p>
            <div class="text--primary">
              relating to or dependent on charity; charitable.<br>
              "an eleemosynary educational institution."
            </div>
          </v-card-text>
        </v-card>
      </v-card>

      <!--      时间轴部分-->
          <v-card
              class="mx-auto rounded-0"
              max-width= 100%
          >
            <v-card-title
                class="blue-grey white--text"
            >
              <span class="text-h6" style="font-size: 20px;font-weight: bold;letter-spacing: 1px">实时播报</span>
            </v-card-title>

            <v-card-text class="py-0">
              <v-timeline dense>
                <v-slide-x-reverse-transition
                    group
                    hide-on-leave
                    max-width = 80%
                    max-height = "400px"
                >
                      <v-timeline-item
                          v-for="(item, index) in data.slice(0,20)"
                          :key="index"
                          color= '#FFCA28'
                          small
                          fill-dot
                      >
                        <v-alert
                            :value="true"
                            color= '#90A4AE'
                            class="white--text"
                            style="width: 94%"
                        >
                          <p style="font-weight: bold;font-size: 20px">{{item.time}}</p>
                          <p style="letter-spacing:1px;line-height: 25px;font-size: 17px;
                          display: -webkit-box;-webkit-box-orient: vertical;-webkit-line-clamp: 3;overflow: hidden;"
                          >{{item.content}}</p>
                          <div>
                            <a style="margin-left: 90%;" :href="item.pageurl">查看更多</a>
                          </div>
                        </v-alert>
                      </v-timeline-item>
                </v-slide-x-reverse-transition>
              </v-timeline>
            </v-card-text>
          </v-card>
    </div>



    <!--    防控措施-->
    <div
        v-if = 'value==1'>
      <v-card
          class = 'rounded-0'>
        <v-container>
          <v-row dense>
            <v-col cols="12">
              <v-card
                  color="#00695C"
                  dark
                  style="margin-bottom: 10px"
                  v-for="(locale, index) in localPolicyList"
                  :key="index"
              >
                <v-card-title class="text-h5">
                  {{ locale.province }}
                </v-card-title>

                <v-card-subtitle>
                  {{locale.content.slice(0,100)+"..."}}
                </v-card-subtitle>

                <v-card-actions>
                  <v-btn
                      @click="toLocalSheet(locale.id)"
                      text>
                    跳转至详情页
                  </v-btn>
                </v-card-actions>
              </v-card>
            </v-col>
          </v-row>
        </v-container>
      </v-card>
    </div>



    <!--    国家政策-->
    <div
        v-if="value==2">
      <!--    轮播图-->
      <v-carousel
      style="width: 75%; height: 400px;margin-left: 13%"
      >
        <v-carousel-item
            v-for="(slide,i) in slides"
            :key="i"
            :src="slide.src"
            reverse-transition="fade-transition"
            transition="fade-transition"
        ></v-carousel-item>
      </v-carousel>
      <!--    卡片-->
      <v-card
          class = 'rounded-0'>
        <v-container>
          <v-row dense>
            <v-col cols="12">
              <v-card
                  color="#385F73"
                  dark
                  v-for="(policy,index) in nationalPolicyList.slice(0,10)"
                  :key="index"
                  style="margin-bottom: 10px"
              >
                <v-card-title class="text-h5">
                  {{ policy.title }}
                </v-card-title>

                <v-card-subtitle>{{policy.content.slice(0,90)+"..."}}</v-card-subtitle>

                <v-card-actions>
                  <v-btn
                      text
                      @click="toNationalSheet(policy.id)"
                  >
                    跳转至详情页
                  </v-btn>
                </v-card-actions>
              </v-card>
            </v-col>
          </v-row>
        </v-container>
      </v-card>

    </div>
  </div>


</template>

<script>
const COLORS = [
  'info',
  'warning',
  'error',
  'success',
]
const ICONS = {
  info: 'mdi-information',
  warning: 'mdi-alert',
  error: 'mdi-alert-circle',
  success: 'mdi-check-circle',
}

export default {
  data(){

    return{
      value: 0,
      interval: null,
      // 时间轴
      data: [],
      //当地政策
      localPolicyList:[],
      //国家政策,
      nationalPolicyList:[],
      nonce: 2,
      items_1: [
        {
          color: '#1F7087',
          src: 'https://cdn.vuetifyjs.com/images/cards/foster.jpg',
          title: 'Supermodel',
          artist: 'Foster the People',
        },
      ],
      items_2: [
        {
          color: '#1F7087',
          src: 'https://cdn.vuetifyjs.com/images/cards/foster.jpg',
          title: 'Supermodel',
          artist: 'Foster the People',
        },
      ],
      colors: [
        'indigo',
        'warning',
        'pink darken-2',
        'red lighten-1',
        'deep-purple accent-4',
      ],
      slides: [
        {
          src: 'https://i.loli.net/2021/07/03/ljNXhfgCtidweZu.jpg',
        },
        {
          src: 'https://i.loli.net/2021/07/03/t8P4kEmNqjOvZas.jpg',
        },
        {
          src: 'https://i.loli.net/2021/07/03/M2uGtP5BNqwygoe.jpg',
        },
      ],
    }
  },

  beforeDestroy () {
    this.stop()
  },

  methods: {
    getNationalPolicy(){
      this.$axios.get('/data/latestPolicy').then(res => {
        console.log(res);
        if (res.status !== 200) {
          return this.$message.error('获取失败');
        }
        this.nationalPolicyList = res.data.data;
      })
    },
    getLocalPolicy(){
      this.$axios.get('/data/provincePolicy').then(res => {
        console.log(res);
        if (res.status !== 200) {
          return this.$message.error('获取失败');
        }
        this.localPolicyList = res.data.data;
      })
    },
    getTimeline(){
      this.$axios.get('/data/news').then(res => {
        console.log(res);
        if (res.status !== 200) {
          return this.$message.error('获取失败');
        }
        this.data = res.data.data;
      })
    },
    addEvent () {
      let { color, icon } = this.genAlert()

      const previousColor = this.items[0].color

      while (previousColor === color) {
        color = this.genColor()
      }

      this.items.unshift({
        id: this.nonce++,
        color,
        icon,
      })

      if (this.nonce > 6) {
        this.items.pop()
      }
    },
    genAlert () {
      const color = this.genColor()

      return {
        color,
        icon: this.genIcon(color),
      }
    },
    genColor () {
      return COLORS[Math.floor(Math.random() * 3)]
    },
    genIcon (color) {
      return ICONS[color]
    },
    start () {
      this.interval = setInterval(this.addEvent, 3000)
    },
    stop () {
      clearInterval(this.interval)
      this.interval = null
    },
    toLocalSheet(id){
      this.$store.state.localId = id
      this.$router.push({
        path:"/localSheet",
      })
    },
    toNationalSheet(id){
      this.$store.state.nationalId = id
      this.$router.push({
        path:"/nationalSheet",
      })
    },
  },

  computed: {
    color() {
      switch (this.value) {
        case 0:
          return 'blue-grey'
        case 1:
          return 'teal'
        case 2:
          return '#385F73'
        default:
          return 'blue-grey'
      }
    }
  },
  created() {
    this.$vuetify.theme.dark = false
    this.getTimeline()
    this.getLocalPolicy()
    this.getNationalPolicy()
  }
}
</script>

<style scoped>

</style>
