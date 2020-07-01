import api from '@/api/api'
import { arrSort } from '@/libs/arrHandle'

export default {
  state: {
    useSkinId: '',
    useSkinTypeId: 1,
    useFontColor: '',
    isShowSkinManage: false,
    isShowSkinManageType: 0,
    skinGroups: [],
    skinGroupId: '',
    skinList: [],
    loadingSkinId: '',
    bgStyle: {
      // backgroundImage: 'url(/img/2.webp)',
      // backgroundSize:  window.screen.width/document.body.clientWidth*100/window.devicePixelRatio + '%'
    },
    errorAnimaMsg: '',
    showErrorAniam: false
  },
  getters: {
    getUseSkinId (state) {
      return state.useSkinId
    },
    getUseSkinTypeId (state) {
      return state.useSkinTypeId
    },
    getUseFontColor (state) {
      return state.useFontColor
    },
    getIsShowSkinManage (state) {
      return state.isShowSkinManage
    },
    getIsShowSkinManageType (state) {
      return state.isShowSkinManageType
    },
    getSkinGroups (state) {
      return state.skinGroups
    },
    getSkinGroupId (state) {
      return state.skinGroupId
    },
    getSkinList (state) {
      return state.skinList
    },
    getLoadingSkinId (state) {
      return state.loadingSkinId
    },
    getBgStyle: state => {
      return state.bgStyle
    },
    getErrorAnimaMsg (state) {
      return state.errorAnimaMsg
    },
    getShowErrorAnima (state) {
      return state.showErrorAniam
    }
  },
  mutations: {
    setUseSkinId (state, id) {
      state.useSkinId = id
    },
    setUseSkinTypeId (state, id) {
      state.useSkinTypeId = id
    },
    setUseFontColor (state, color) {
      state.useFontColor = color
    },
    setIsShowSkinManage (state, b) {
      state.isShowSkinManage = b
    },
    setIsShowSkinManageType (state, type) {
      state.isShowSkinManageType = type
    },
    setSkinGroups (state, groups) {
      state.skinGroups = groups
    },
    setSkinGroupId (state, id) {
      state.skinGroupId = id
    },
    setSkinList (state, list) {
      state.skinList = list
    },
    setLoadingSkinId (state, id) {
      state.loadingSkinId = id
    },
    setBgStyle (state, obj) {
      state.bgStyle = obj
    },
    setBgSize (state, bgSize) {
      state.bgStyle.backgroundSize = bgSize
    },
    setErrorAnimaMsg (state, msg) {
      state.errorAnimaMsg = msg
    },
    setShowErrorAnima (state, b) {
      state.showErrorAniam = b
    }
  },
  actions: {
    getUseSkinId ({ commit }) {
      chrome.settingsPrivate.getPref("browser.skin_id", res => {
        commit('setUseSkinId', res.value)
      })
    },
    getSkinSkinType ({ commit }) {
      chrome.settingsPrivate.getPref("browser.skin_skin_type", res => {
        commit('setUseSkinTypeId', res.value)
        if(res.value == 2 || res.value == 3){
          commit('setBgStyle', { background : 'none' })
        }
      })
    },
    getUseFontColor ({ commit }) {
      chrome.settingsPrivate.getPref('browser.skin_font_type', res => {
        commit('setUseFontColor', res.value)
      })
    },
    getLoadingSkinId ({ commit }) {
      chrome.settingsPrivate.getPref('browser.skin_loading_id', res => {
        commit('setLoadingSkinId', res.value )
      })
    },
    getSkinGroups ({ commit, dispatch }) {
      api.getSkinGroups().then(res => {
        let groups = arrSort(res.bd, 'p')
        commit('setSkinGroups', groups)
        commit('setSkinGroupId', groups[0].id)
        dispatch('getSkinsByGroupId', groups[0].id)
      }).catch(e => {
      })
    },
    getSkinsByGroupId ({ commit }, id) {
      api.getSkinsByGroupId(id).then(res => {
        let skins = arrSort(res.bd, 'pp')
        commit('setSkinList', skins)
      }).catch(e => {
      })
    },

    setSkinFn ({ dispatch, commit }, skin) {
      let obj = {
        id: skin.id || '',
        icon: skin.io || '',
        icon_url: skin.il || '',
        icon_md5: skin.md || '',
        skin_md5: skin.sm || '',
        skin_url: skin.su || '',
        skin_skin_type: parseInt(skin.ti.substr(skin.ti.length - 1)),
        skin_sidebar_color_type: skin.sc,
        skin_font_type: skin.ic,
        skin_mask_color: skin.hc,
        skin_mask_img: skin.hi,
        skin_sidebar_type: 0
      }
      const setSkinCall = (res) => {
        commit('setLoadingSkinId', '')
        if(res.status){
          //
          // console.log('皮肤更新成功', res,obj)
          // dispatch('setSkinPrefs', skin)
        }else{
          commit('setShowErrorAnima', true)
          if(res.error_str && res.error_str == 'verchecking'){
            commit('setErrorAnimaMsg', '皮肤版本过低，请体验其他皮肤！')
          }else{
            commit('setErrorAnimaMsg', '皮肤更换失败！')
          }
          setTimeout(() => {
            commit('setShowErrorAnima', false)
          }, 3000)
        }
      }

      if(chrome.xb && chrome.xb.updateSkin){
        commit('setLoadingSkinId', skin.id)
        chrome.xb.updateSkin(obj, setSkinCall)
      }
    },

    setSkinPrefs ({ dispatch }, skin) {
      // console.log(skin)
      dispatch('setPrefSkinId', skin.id)
      dispatch('setPrefSkinTypeId', skin.ti)
      dispatch('setPrefSidebarColors', skin.sc)
      dispatch('setPrefFontColor', parseInt(skin.ic))
      dispatch('setPrefSidebarTypeId', 0)
    },
    setPrefSkinId ({ commit }, id) {
      chrome.settingsPrivate.setPref('browser.skin_id', id, 'container', d => {
        if(d){
          commit('setUseSkinId', id)
        }
      })
    },
    setPrefSkinTypeId ({ commit }, typeid) {
      let id = parseInt(typeid.substr(typeid.length - 1))
      chrome.settingsPrivate.setPref('browser.skin_skin_type', id, 'container', d => {
        if(d){
          commit('setUseSkinTypeId', id)
        }
      })
    },
    setPrefSidebarColors ({ commit }, color) {
      chrome.settingsPrivate.setPref('browser.skin_sidebar_color_type', color, 'container', d => {
        if(d){
          // commit('setSidebarColors', color)
        }
      })
    },
    setPrefFontColor ({ commit }, type) {
      chrome.settingsPrivate.setPref('browser.skin_font_type', type, 'container', d => {
        if(d){
          commit('setUseFontColor', type)
        }
      })
    },
    setPrefSidebarTypeId ({ commit }, id) {
      chrome.settingsPrivate.setPref('browser.skin_sidebar_type', id, 'container', d => {
        if(d){
          // commit('setSidebarTypeId', id)
        }
      })
    },
    // setPrefMaskColor ({ commit }, type) {
    //   chrome.settingsPrivate.setPref('browser.skin_mask_color', type, 'container', d => {
    //     if(d){
    //       commit('setUseMaskColor', type ? '#000000' : '#ffffff')
    //     }
    //   })
    // } 
  }
}