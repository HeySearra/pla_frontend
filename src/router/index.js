import Vue from 'vue'
import Router from 'vue-router';

const originalPush = Router.prototype.push
Router.prototype.push = function push(location) {
  return originalPush.call(this, location).catch(err => err)
}

Vue.use(Router)

const router =  new Router({
	mode: 'history',//改成history模式
	routes: [
		{
			path: '/',
			redirect:'/index/china',
		},
		{
			path: '/index',
			redirect:'/index/world',
		},
		{
			path:'/index/world',
			name:'index_world',
			component: index_world => require(['@/pages/index_world.vue'], index_world),
			meta:{
				title: '世界疫情',
				roles: ['none', 'user']
			}
		},
		{
			path:'/index/china',
			name:'index',
			component: index_china => require(['@/pages/index_china.vue'], index_china),
			meta:{
				title: '国内疫情',
				roles: ['none', 'user']
			}
		},
		{
			path:'/cross/analysis',
			name:'cross_analysis',
			component: cross_analysis => require(['@/pages/cross-analysis.vue'], cross_analysis),
			meta:{
				title: '数据分析',
				roles: ['none', 'user']
			}
		},
		{
			path:'/cross/diy',
			name:'cross_diy',
			component: cross_diy => require(['@/pages/cross_diy.vue'], cross_diy),
			meta:{
				title: '交叉分析',
				roles: ['none', 'user']
			}
		},
		{
			path:'/travel/search/key',
			name:'travel_search',
			component: travel_search => require(['@/pages/travel_search.vue'], travel_search),
			meta:{
				title: '搜索列车航班号',
				roles: ['none', 'user']
			}
		},
		{
			path:'/travel/search/st',
			name:'travel_search_start_and_end',
			component: travel_search_st => require(['@/pages/travel_search_st.vue'], travel_search_st),
			meta:{
				title: '出发地与目的地情况',
				roles: ['none', 'user']
			}
		},
		{
			path:'/travel/train',
			name:'travel_train',
			component: travel_train => require(['@/pages/travel_train.vue'], travel_train),
			meta:{
				title: '列车',
				roles: ['none', 'user']
			}
		},
		{
			path:'/travel/plane',
			name:'travel_plane',
			component: travel_plane => require(['@/pages/travel_plane.vue'], travel_plane),
			meta:{
				title: '航班',
				roles: ['none', 'user']
			}
		},
		// {
		// 	path:'/travel/area',
		// 	name:'travel_area',
		// 	component: travel_area => require(['@/pages/travel_area.vue'], travel_area),
		// 	meta:{
		// 		title: '地区出行状况',
		// 		roles: ['none', 'user']
		// 	}
		// },
        {
			path:'/provincemap/:name',
			name:'province_map',
			component: province_map => require(['@/pages/province_map.vue'], province_map),
            meta:{
				title: '地区疫情',
				roles: ['none', 'user']
			}
		},
        {
			path:'/citymap/:province_name/:name',
			name:'city_map',
			component: city_map => require(['@/pages/city_map.vue'], city_map),
            meta:{
				title: 'marcov',
				roles: ['none', 'user']
			}
		},
        {
			path:'/countrylist',
			name:'countrylist',
			component: index => require(['@/pages/countries_list.vue'], index),
            meta:{
				title: 'marcov',
				roles: ['none', 'user']
			}
		},
        {
			path:'/news',
			name:'news',
			component: news => require(['@/pages/news.vue'], news),
            meta:{
				title: '疫情新闻',
				roles: ['none', 'user']
			}
		},
        {
			path:'/protect/policy',
			name:'protect_policy',
			component: p => require(['@/pages/protect_policy.vue'], p),
            meta:{
				title: '防疫政策',
				roles: ['none', 'user']
			}
		},
        {
			path:'/protect/tips',
			name:'protect_tips',
			component: p => require(['@/pages/protect_tip.vue'], p),
            meta:{
				title: '防疫小知识',
				roles: ['none', 'user']
			}
		},
        {
			path:'/protect/fake',
			name:'protect_fake',
			component: p => require(['@/pages/protect_fake.vue'], p),
            meta:{
				title: '辟谣专区',
				roles: ['none', 'user']
			}
		},
        {
			path:'/forum/index',
			name:'forum_index',
			component: p => require(['@/pages/forum_index.vue'], p),
            meta:{
				title: '问答平台',
				roles: ['none', 'user']
			}
		},
        {
			path:'/forum/q',
			name:'forum_q',
			component: p => require(['@/pages/forum_q.vue'], p),
            meta:{
				title: '问答平台',
				roles: ['none', 'user']
			}
		}
  	],
});

export default router;



// WEBPACK FOOTER //
// ./src/router/index.js