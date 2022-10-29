// Imports
import Vue from 'vue'
import Router from 'vue-router'
import {
  layout,
  route,
} from '@/util/routes'

Vue.use(Router)

const router = new Router({
  mode: 'history',
  base: process.env.BASE_URL,
  scrollBehavior: (to, from, savedPosition) => {
    if (to.hash) return { selector: to.hash }
    if (savedPosition) return savedPosition

    return { x: 0, y: 0 }
  },
  routes: [

    { path: '/', redirect: '/China' },
    layout('Default', [
      route('WorldMap', null, 'world'),
      route('ChinaMap', null, 'China'),
      route('HistoricalData', null, '/historicalData'),
      route('Pie', null, '/pie'),
      // Pages
      route('UserProfile', null, 'components/profile'),

      // Components
      route('Knowledge', null, 'knowledge'),
      route('News', null, 'news'),
      route('Book', null, 'book'),
      route('Sheet',null,'sheet'),
      route('QuestionList', null, 'question'),
      // route('Nation', null, 'nation' ),
      // route('LocalSheet',null,'localSheet'),
      // route('NationalSheet',null,'nationalSheet'),
      route('Icons', null, 'components/icons'),
      route('Typography', null, 'components/typography'),


      // Tables
      route('Regular Tables', null, 'tables/regular'),
      route('CrossAnalysis', null, '/crossanalysis'),

      // Maps
      route('Google Maps', null, 'maps/google'),
      route('Profile', null, '/profile'),
      route('ProvinceData', null, '/provinceData'),

    ]),
  ],
})

// router.beforeEach((to, from, next) => {
//   return to.path.endsWith('/') ? next() : next(trailingSlash(to.path))
// })

//路由卫士
router.beforeEach((to, from, next) =>{
  if(to.path != '/profile' && to.path != '/book'){
    return next();
  }
  //获取token
  const tokenStr = window.sessionStorage.getItem('token')
  if((!tokenStr && to.path === '/profile') || (!tokenStr && to.path === '/book')){
    return next('/China');
  }
  else{
    return next();
  }
  // next();
})

export default router


