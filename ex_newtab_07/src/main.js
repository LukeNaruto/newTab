import Vue from 'vue'
import App from './App.vue'
import store from './store/'
import '@/assets/css/main.less'
import '@/assets/css/font/iconfont.css'
import '@/assets/css/font/iconfont.js'

Vue.config.productionTip = false

new Vue({
  store,
  render: h => h(App)
}).$mount('#app');
function KeyPress(e){
  var {keyCode,key} = e;
  if(keyCode == 9 || key == 'Tab'){
    window.event.returnValue = false;
  }
}
document.onkeydown = KeyPress;
