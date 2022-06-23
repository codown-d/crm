/*
 * @Author: your name
 * @Date: 2021-09-15 16:08:34
 * @LastEditTime: 2022-05-07 23:35:57
 * @LastEditors: Lone
 * @Description: In User Settings Edit
 * @FilePath: \pro-email\src\router\index.js
 */
import Vue from 'vue'
import VueRouter from 'vue-router'

import NProgress from 'nprogress'
import 'nprogress/nprogress.css';

NProgress.configure({
  easing: 'ease',
  speed: 500,
  showSpinner: false,
  trickleSpeed: 200,
  minimum: 0.3
})

//info: 以下几行代码，修复点击跳转到同一路由地址报错。
const originalPush = VueRouter.prototype.push
VueRouter.prototype.push = function push(location, onResolve, onReject) {
	if (onResolve || onReject) return originalPush.call(this, location, onResolve, onReject)
	return originalPush.call(this, location).catch(err => err)
}

import Auth from '@/views/Auth'

Vue.use(VueRouter)

const routes = [
	{
		path: '/',
		redirect: '/login', // 设置默认打开的页面
	},
	// 登陆注册页
	{
		path: '/login',
		name: 'Login',
		component: Auth,
	},
	{
		path: '/login/forget-password',
		name: 'ForgetPassword',// 忘记密码页面
		component: Auth,
	},
	{
		path: '/register',
		name: 'Register',
		component: Auth,
	},
	// main页面
	{
		path: '/main',
		name: 'Main',
		component: () => import('@/views/Main.vue'),
		children: [
			// 交易2.0 2022.01.13
			{
				path: '/deals',
				name: 'Deals',
				component: () => import('@/views/Deals/index'),
			},
			{
				path: '/salesline',
				name: 'Salesline',
				component: () => import('@/views/Deals/SalesLine/index'),
			},
			{
				path: '/process',
				name: 'Process',
				component: () => import('@/views/Deals/Process/index'),
			},
			//个人设定 // note: 重写的个人设定模块 2021.12.29
			// {
			// 	path: '/settings',
			// 	name: 'PersionalSetList',
			// 	redirect: '/settings/profile', // 设置默认打开的页面
			// 	component: () => import('@/views/Settings/index'),
			// 	children: [
			// 		{
			// 			path: '/settings/email-sync',
			// 			component: resolve => require(['@/views/Settings/EmailSync/index'], resolve),
			// 		},
			// 		{
			// 			path: '/settings/sns-sync',
			// 			component: resolve => require(['@/views/Settings/SnsSync/index'], resolve),
			// 		},
			// 		{
			// 			path: '/settings/calendar-sync',
			// 			component: resolve => require(['@/views/Settings/CalendarSync/index'], resolve),
			// 		},
			// 		{
			// 			path: '/settings/company-settings',
			// 			component: resolve => require(['@/views/Settings/CompanySettings/index'], resolve),
			// 		},
			// 		{
			// 			path: '/settings/contact-sync',
			// 			component: resolve => require(['@/views/Settings/ContactSync/index'], resolve),
			// 		},
			// 		{
			// 			path: '/settings/password',
			// 			component: resolve => require(['@/views/Settings/Password/index'], resolve),
			// 		},
			// 		{
			// 			path: '/settings/profile',
			// 			component: resolve => require(['@/views/Settings/Profile/index'], resolve),
			// 		},
			// 		// fix: 订阅的两个页面和路由需要深入研究如何回事。
			// 		{
			// 			path: '/settings/subscription',
			// 			component: resolve => require(['@/views/Settings/Subscription/index'], resolve),
			// 		},
			// 		{
			// 			path: '/settings/subscription/change',
			// 			component: resolve => require(['@/views/Settings/Subscription/Change/index'], resolve),
			// 		},
			// 		{
			// 			path: '/settings/users',
			// 			component: resolve => require(['@/views/Settings/Users/index'], resolve),
			// 		},
			// 	],
			// },
			//客户模块
			{
				path: '/persons', //info: 重写的联络人模块, 2021.12.27
				name: 'Persons',
				component: () => import('@/views/Persons/index'),
			},
            // 组织模块
			// {
			// 	path: '/lineMarketing', 
			// 	name: 'LineMarketing',
			// 	component: () => import('@/views/LineMarketing/index'),
			// },
			{
				path: '/company',
				name: 'Company',
				component: () => import('@/views/Company/index.vue'),
			},
			// 邮件模块
			// {
			// 	path: '/mail',
			// 	name: 'mail',
			// 	redirect: '/mail/inbox', // 设置默认打开的页面
			// 	component: () => import('@/views/Mail/index.vue'),
			// 	children: [
			// 		{
			// 			path: '/mail/detail/:id',
			// 			name: 'detail',
			// 			props: {
			// 				id: {
			// 					required: true,
			// 					default: 0,
			// 				},
			// 			},
			// 			component: resolve => require(['@/views/Mail/components/Detail'], resolve),
			// 		},
			// 		{
			// 			path: '/mail/compose',
			// 			component: resolve => require(['@/views/Mail/components/Compose'], resolve),
			// 		},
			// 		{
			// 			path: '/mail/inbox',
			// 			component: resolve => require(['@/views/Mail/components/Inbox'], resolve),
			// 		},
			// 		{
			// 			path: '/mail/drafts',
			// 			component: resolve => require(['@/views/Mail/components/Drafts'], resolve),
			// 		},
			// 		{
			// 			path: '/mail/outbox',
			// 			component: resolve => require(['@/views/Mail/components/Outbox'], resolve),
			// 		},
			// 		{
			// 			path: '/mail/sent',
			// 			component: resolve => require(['@/views/Mail/components/Sent'], resolve),
			// 		},
			// 		{
			// 			path: '/mail/archive',
			// 			component: resolve => require(['@/views/Mail/components/Archive'], resolve),
			// 		},
			// 	],
			// },
			// {
			// 	path: '/import',
			// 	component: resolve => require(['@/views/Settings/Import/index'], resolve),
			// },
			{
				path: '/activities',
				name: 'Activities',
				component: () => import('@/views/Activites/index.vue'),
			},
			{
				path: '/schedule',
				name: 'Schedule',
				component: () => import('@/views/Activites/Schedule/index.vue'),
			},
			// {
			// 	path: '/insights',
			// 	name: 'insights',
			// 	component: () => import('@/views/Insights/index.vue'),
			// },
			// {
			// 	path: '/sns',
			// 	name: 'SNS',
			// 	component: () => import('@/views/Sns/index.vue'),
			// },
		],
	},
]

const router = new VueRouter({
	mode: 'history',
	base: process.env.BASE_URL,
	routes,
	linkActiveClass: 'active-link',
	linkExactActiveClass: 'exact-active-link',
	scrollBehavior (to, from, savedPosition) {
		if (savedPosition) {
			return savedPosition
		} else {
			return { x: 0, y: 0 }
		}
	}
});


router.beforeEach((to, from, next) => {
	NProgress.start()
	// console.log('to, ===', to.meta)
	if (to.meta.title) {
		document.title = to.meta.title
	}
	next()
})

router.afterEach(() => {
	NProgress.done();
})

export default router
