import Vue from 'vue'
import App from './App'
import ToggleButton from 'vue-js-toggle-button'
import 'bootstrap'; 
import 'bootstrap/dist/css/bootstrap.min.css';

Vue.use(ToggleButton)

/* eslint-disable no-new */
new Vue({
  el: '#app',

  render: h => h(App),
})

$(".rotate").click(function(){
  $(this).toggleClass("down")  ; 
 })