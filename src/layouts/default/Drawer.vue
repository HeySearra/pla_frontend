<template>
  <v-navigation-drawer
    id="default-drawer"
    v-model="drawer"
    :dark="dark"
    :right="$vuetify.rtl"
    src="https://i.loli.net/2021/07/09/fXsdULYQSgqZzHW.jpg"
    :mini-variant.sync="mini"
    mini-variant-width="80"
    app
    style="width: 13%"
  >
    <template
      v-if="drawerImage"
      #img="props"
    >
      <v-img
        :key="image"
        gradient="rgba(0, 0, 0, .3), rgba(0, 0, 0, .3)"
        v-bind="props"
      />
    </template>

    <div>
      <default-drawer-header />

      <v-divider class="mx-2 mb-1" />

      <default-list :items="items" />
<!--      <div v-for="(item,index) in items" :key="index">-->
<!--          {{item.title}}-->
<!--      </div>-->
    </div>

    <template #append>
      <div class="pa-4 text-center">
        <div class="text-body-1 font-weight-light pt-6 pt-md-0 text-center">
          &copy; {{ (new Date()).getFullYear() }}
        </div>
      </div>
    </template>

    <div class="pt-12" />
  </v-navigation-drawer>
</template>

<script>
  // Utilities
  import { get, sync } from 'vuex-pathify'

  export default {
    name: 'DefaultDrawer',

    components: {
      DefaultDrawerHeader: () => import(
        /* webpackChunkName: "default.json-drawer-header" */
        './widgets/DrawerHeader'
      ),
      DefaultList: () => import(
        /* webpackChunkName: "default.json-list" */
        './List'
      ),
    },

    computed: {
      ...get('user', [
        'dark',
        'gradient',
        'image',
      ]),
      ...get('app', [
        'items',
        'version',
      ]),
      ...sync('app', [
        'drawer',
        'drawerImage',
        'mini',
      ]),
    },
  }
</script>

<style lang="sass">
#default-drawer
  .v-list-item
    margin-bottom: 8px

  .v-list-item::before,
  .v-list-item::after
    display: none

  .v-list-group__header__prepend-icon,
  .v-list-item__icon
    margin-top: 12px
    margin-bottom: 12px
    margin-left: 4px
  .v-list-item__title
    font-size: 16px
    font-weight: bold
  &.v-navigation-drawer--mini-variant
    .v-list-item
      justify-content: flex-start !important

</style>
