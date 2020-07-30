import Vue from 'vue';
import VueClipboard from 'vue-clipboard2';
import App from './App.vue';
import plugins from './plugin/index.js';
import router from './router/index.js';
import store from './store/index.js';
import components from './components/index.js';
import './style/index.scss';
import './style/formatUI.scss';

Vue.config.productionTip = false;

// plugins.install(Vue);
components.forEach(component => {
  Vue.component(component.name, component);
});
Vue.use(plugins);
Vue.use(VueClipboard);

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app');
