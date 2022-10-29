<template>
  <v-fade-transition >
    <router-view style="margin-left: -40px"/>
  </v-fade-transition>
</template>

<script>
  // Styles
  import '@/styles/overrides.sass'

  export default {
    name: 'App',
    metaInfo: {
      title: 'App',
      titleTemplate: '%s | Material Dashboard Free',
      htmlAttrs: { lang: 'en' },
      meta: [
        { charset: 'utf-8' },
        { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      ],
    },
    created() {
      // 在页面加载时读取localStorage里的状态信息
      if (localStorage.getItem("store") ) {
        this.$store.replaceState(Object.assign({}, this.$store.state,JSON.parse(localStorage.getItem("store"))))
      }

      //在页面刷新时将vuex里的信息保存到localStorage里
      window.addEventListener("beforeunload",()=>{
        localStorage.setItem("store",JSON.stringify(this.$store.state))
      })
    }
  }
</script>
