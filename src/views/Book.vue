<template>
  <div>
    <v-card
    style="border-radius: 0px">
      <v-data-table
            :headers="headers"
            :items="data"
            class="elevation-1"
        >
          <template v-slot:item.cancel="{ item }">
            <span style="font-weight:bold">
              <v-btn
                  depressed
                  color="error"
                  @click="cancelLoc(item.location)"
                  style="width: 8px; height: 30px; border-radius: 20px"
              >取消订阅</v-btn>
            </span>
          </template>
          <template v-slot:item.name="{ item }">
            <span style="font-weight:bold">{{item.location}}</span>
          </template>
          <template v-slot:item.calories="{ item }">
            <span style="color:red;font-weight:bold">{{item.today.confirm}}</span>
          </template>
        <template v-slot:item.fat="{ item }">
          <span style="color:red;font-weight:bold">{{item.today.wzz_add}}</span>
        </template>
        <template v-slot:item.sugar="{ item }">
          <span style="font-weight:bold">{{item.total.nowConfirm}}</span>
        </template>
          <template v-slot:item.carbs="{ item }">
            <span style="font-weight:bold">{{item.total.dead}}</span>
          </template>
          <template v-slot:item.protein="{ item }">
            <span style="font-weight:bold">{{item.total.heal}}</span>
          </template>
          <template v-slot:item.vitamin="{ item }">
            <span style="font-weight:bold">{{item.total.confirm}}</span>
          </template>
<!--          <template v-slot:item.grade="{ item }">-->
<!--            <span v-if="item.priority === 0" style="color:#e60000;font-weight:bold">-->
<!--              <v-icon color="#e60000">mdi-alert-circle</v-icon> {{item.grade}}-->
<!--            </span>-->
<!--            <span v-else-if="item.priority === 1" style="color:#ffc137;font-weight:bold">-->
<!--              <v-icon color="#ffc137">mdi-alert</v-icon> {{item.grade}}-->
<!--            </span>-->
<!--            <span v-else>{{item.grade}}</span>-->
<!--          </template>-->
        </v-data-table>
    </v-card>
  </div>
</template>

<script>
export default {
  data () {
  return {
      headers: [
          {text: '', value: 'cancel', align:'center'},
          {
            text: '地区',
            align: 'center',
            value: 'name',
          },
          { text: '新增确诊', value: 'calories', align: 'center'},
          { text: '新增无症状', value: 'fat', align: 'center'},
          { text: '现存确诊', value: 'sugar', align: 'center'},
          { text: '累计死亡', value: 'carbs', align: 'center'},
          { text: '累计治愈', value: 'protein', align: 'center'},
          { text: '累计确诊', value: 'vitamin', align: 'center'},
      ],
    data:[]
  }
  },
  methods: {
    getBookData(){
      this.$axios.get('/subscription/detail').then(res => {
        console.log(res);
        if (res.status !== 200) {
          return this.$message.error('获取失败');
        }
        this.data = res.data.data;
      })
    },
    cancelLoc(locale){
      var qs = require('qs')
      var jsondata={location: locale}
      this.$axios.post('http://10.251.254.107:8081/subscription/cancel',qs.stringify(jsondata),
          {headers:{'Content-Type':'application/x-www-form-urlencoded'}}).then(res=>{
        console.log("hhh"+res);
        if (res.status !== 200) {
          return this.$message.error('获取失败');
        }
        else{
          this.$message({
            type: 'success',
            message: "取消成功！",
          });
          this.getBookData()
        }
      })
    }
  },
  created() {
    this.$vuetify.theme.dark = false
    this.getBookData()
  }
}
</script>

<style scoped>
.el-message ,.el-message--success .el-message__content{
  color: white;
}
.el-message .el-icon-success {
  color: white;
}

.el-message__closeBtn.el-icon-close{
  color: white;
}
</style>
