import router from './router';
import store from './store';
import NProgress from 'nprogress'; // progress bar
import 'nprogress/nprogress.css'; // progress bar style
import { Message } from 'element-ui';
import { getToken } from '@/utils/auth'; // getToken from cookie
import lang from '@/lang';
import Vue from 'vue';
import { encode } from 'urlencode';

router.beforeEach((to, from, next) => {

  const userInfo = store.getters.userInfo || JSON.parse(sessionStorage.getItem('userInfo'));
  if (to.name) {
    // 自定义上报
    const event = {
      type: 'pageView',
      id: to.name,
      name: to.meta.cnName
    };
    Vue.$report({
      userId: userInfo && userInfo.userId,
      time: Date.now(),
      event: event
    });
  }


  NProgress.start();
  if (to.query && to.query.t) {
    store.dispatch('Login', to.query.t)
      .then(res => {
        delete to.query.t;
        delete to.query.f;
        next({
          path: to.path, replace: true, query: to.query
        });
      });
  } else {
    NProgress.start();
    if (getToken()) {
      // 如果跳转到旧的登录页则跳转home页
      if (to.path === '/login') {
        next('/home');
      }
      new Promise((resolve, reject) => {
        // 刷新页面初始化用户信息
        if (!store.getters.userInfo && to.path !== '/404') {
          store.dispatch('GetInfo')
            .then(res => {
              resolve();
            }).catch(() => {
              reject();
            });
        } else {
          resolve();
        }
        resolve();
      }).then(() => {
        // 刷新页面时先挂载路由
        if (store.getters.routers.length === 0) {
          store.dispatch('InitRouters', to.path)
            .then(res => {
              next(to.fullPath);
            }).catch(e => {
              console.error(e);
            });
        } else {
          if (!to.matched || to.matched.length === 0) {
            Message({
              type: 'warning',
              message: lang.t('code[404]'),
              center: true
            });
            NProgress.done();
          } else {
            next();
          }
        }
      });
    } else {
      window.location.href = process.env.ZEUS_PATH + '?from=' + encode(document.location.href);
    }
  }
});

router.afterEach(() => {
  NProgress.done(); // 结束Progress
});
