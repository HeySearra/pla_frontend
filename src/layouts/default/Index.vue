<template>
  <v-app>
    <default-bar />

    <default-drawer />

    <default-view />
  </v-app>
</template>

<script>
  export default {
    name: 'DefaultLayout',

    components: {
      DefaultBar: () => import(
        /* webpackChunkName: "default.json-app-bar" */
        './AppBar'
      ),
      DefaultDrawer: () => import(
        /* webpackChunkName: "default.json-drawer" */
        './Drawer'
      ),
      DefaultView: () => import(
        /* webpackChunkName: "default.json-view" */
        './View'
      ),
    },
  }
</script>
