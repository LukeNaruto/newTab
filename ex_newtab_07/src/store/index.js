import Vue from 'vue'
import Vuex from 'vuex'

import s_basic from './module/s_basic'
import s_search from './module/s_search'
import home from './module/home'
import portal from './module/portal'
import skin from './module/skin'
import main from './module/main'
import s_wallpaper from './module/s_wallpaper'
import s_modal from './module/s_modal'

Vue.use(Vuex)

export default new Vuex.Store({
  modules: {
    s_basic,
    skin,
    home,
    portal,
    main,
    s_search,
    s_wallpaper,
    s_modal
  }
})