import Vue from 'vue';
import VueI18n from 'vue-i18n';
import Cookies from 'js-cookie';
import elementEnLocale from 'element-ui/lib/locale/lang/en'; // element-ui lang
import elementZhLocale from 'element-ui/lib/locale/lang/zh-CN'; // element-ui lang
import { en, zh, tw } from './languages';
Vue.use(VueI18n);

const messages = {
  en: {
    ...elementEnLocale,
    ...en
  },
  zh: {
    ...elementZhLocale,
    ...zh
  },
  tw: {
    ...elementZhLocale,
    ...tw
  }
};

const i18n = new VueI18n({
  // set locale
  locale: Cookies.get('language') || 'tw',
  // set locale messages
  messages
});

export default i18n;
