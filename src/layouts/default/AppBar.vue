<template>
  <v-app-bar
    id="default-app-bar"
    app
    absolute
    class="v-bar--underline"
    color="transparent"
    :clipped-left="$vuetify.rtl"
    :clipped-right="!$vuetify.rtl"
    height="45px"
    flat
  >
<!--    <v-app-bar-nav-icon-->
<!--      class="hidden-md-and-up"-->
<!--      @click="drawer = !drawer"-->
<!--    />-->

<!--    <default-drawer-toggle class="hidden-sm-and-down" />-->

    <v-toolbar-title
      class="font-weight-light text-h5"
    />

    <v-spacer />

    <default-search class="hidden-sm-and-down" />
    <default-notifications />
    <default-go-home />



    <default-account />
  </v-app-bar>
</template>

<script>
  // Utilities
  import { get, sync } from 'vuex-pathify'

  export default {
    name: 'DefaultBar',

    components: {
      DefaultAccount: () => import(
        /* webpackChunkName: "default.json-account" */
        './widgets/Account'
      ),
      // DefaultDrawerToggle: () => import(
      //   /* webpackChunkName: "default.json-drawer-toggle" */
      //   './widgets/DrawerToggle'
      // ),
      DefaultGoHome: () => import(
        /* webpackChunkName: "default.json-go-home" */
        './widgets/GoHome'
      ),
      DefaultNotifications: () => import(
        /* webpackChunkName: "default.json-notifications" */
        './widgets/Notifications'
      ),
      DefaultSearch: () => import(
        /* webpackChunkName: "default.json-search" */
        './widgets/Search'
      ),
    },

    computed: {
      ...sync('app', [
        'drawer',
        'mini',
      ]),
      name: get('route/name'),
    },
  }
</script>
