import Vue from 'vue';
import VueAxios from 'vue-axios';
import axios from 'axios';
import VueWaypoint from 'vue-waypoint';
import VueSweetalert2 from 'vue-sweetalert2';
import App from './App.vue';
import router from './router';
import store from './store';

import 'sweetalert2/dist/sweetalert2.min.css';

Vue.use(VueAxios, axios);
Vue.use(VueWaypoint);
Vue.use(VueSweetalert2);

Vue.config.productionTip = false;

new Vue({
  router,
  store,
  render: (h) => h(App),
}).$mount('#app');
