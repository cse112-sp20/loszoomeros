import Vue from 'vue';
import App from './App';
import ToggleButton from 'vue-js-toggle-button';
import 'bootstrap'; 
//Bootstrap framework
import BootstrapVue from 'bootstrap-vue';
Vue.use(BootstrapVue);
import 'bootstrap/dist/css/bootstrap.css';
import 'bootstrap-vue/dist/bootstrap-vue.css';

//Font awesome
import 'vue-awesome/icons';
import Icon from 'vue-awesome/components/Icon';
Vue.component('icon', Icon);
Vue.use(ToggleButton);

/* eslint-disable no-new */
new Vue({
    el: '#app',

    render: h => h(App),
});