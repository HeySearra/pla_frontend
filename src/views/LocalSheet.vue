<template>
  <div>

    <v-card
        color="basil"
        style="width: 90%; margin: auto;padding: 10px">
      <v-btn
          class="ma-2"
          style="margin-left: 5px;display: inline-block"
          color="grey darken-1"
          dark
          @click="toKnowledge()"
      >
        <v-icon
            dark
            left
        >
          mdi-arrow-left
        </v-icon>Back
      </v-btn>
      <v-card-title
          class="text-center justify-center py-6"
          style="margin: -20px auto 0px;max-width: 80%;">
        <h1 class="font-weight-bold text-h2 basil--text">
          {{ page.province }}
        </h1>
      </v-card-title>
      <v-divider></v-divider>
      <v-card-content
          class="d-flex justify-center">
        <p
            style="width: 80%;margin: 30px 0px;line-height: 30px; text-indent:50px">
          {{ page.content }}
        </p>
      </v-card-content>
    </v-card>
  </div>
</template>

<script>
import mapState from 'vuex'
export default {
  data(){
    return{
      id: this.$store.state.localId,
      page:{}
    }
  },
  computed:{
    ...mapState['localId']
  },
  methods:{
    getPage(){
      console.log(this.$store.state.localId)
      console.log("2222"+this.id)
      var jsondata={id: this.id}
      this.$axios.post('http://10.251.254.107:8081/data/getProvincePolicyById',jsondata).then(res=>{
        console.log(res);
        this.page = res.data.data
      })
    },
    toKnowledge(){
      this.$router.push({
        path:"/nation",
      })
    }
  },
  created(){
    this.$vuetify.theme.dark = false
    this.getPage()
  },
}
</script>

<style scoped>
/* Helper classes */
.basil {
  background-color: #BDBDBD !important;
}
.basil--text {
  color: white !important;
}
</style>
