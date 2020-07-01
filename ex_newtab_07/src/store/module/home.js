import ctrlHome from '@/controller/home'
import api from '@/api/api'
import ctrlBasic from '@/controller/c_basic'
import DB from '@/model/common'
import {
  windowOpenUrl
} from '@/libs/arrHandle'

export default {
  state: {
    showContextmenu: false,
    shortcutTypeId: '',
    shortcutList: [],
    listSp: [], //特殊位置
    shortcutListInfo: [],
    shortcutType: [],
    individuation: {
      doubleClickIsShow: true, // 开启鼠标双击切换
      isShowWallpaper: true, // 是否显示壁纸
      isShowBookmarkBtn: false, // 是否显示书签按钮
      isEmptyCon: false, // 是否空图标
      isEmptyBg: false, // 是否空背景
      skin_play_mode: false // 动态屏皮肤不间断播放
    },
    editCustom: {},

    showManageType: '', // 展示管理类型,
    searchShortcut: {// 图标编辑搜索
      text: '',
      running: false,
    }, 

    apiError: true

  },
  getters: {
    getSearchShortcut (state) {
      return state.searchShortcut;
    },
    getEditCustom(state) {
      return state.editCustom
    },
    getShowContextmenu(state) {
      return state.showContextmenu
    },

    getShowManageType(state) {
      return state.showManageType
    },
    getShortcutList(state) {
      return state.shortcutList
    },
    getShortcutType(state) {
      let obj = {
        t: '精选',
        _id: ''
      }
      state.shortcutType.unshift(obj)
      return state.shortcutType
    },
    getShortcutTypeId(state) {
      return state.shortcutTypeId
    },
    getShortcutListInfo(state) {
      return state.shortcutListInfo
    },

    getIndividuation(state) {
      return state.individuation;
    },
    getApiError(state) {
      return state.apiError
    },
  },
  mutations: {
    setSearchShortcut (state,payload) {
      state.searchShortcut = payload;
    },
    setShowManageType(state, type) {
      if (type === '' && state.showManageType !== '') {
        state.editCustom = {};
      }
      state.showManageType = type;
    },
    setEditCustom(state, item) {
      state.editCustom = item;
    },
    // 控制显示部分
    setShowContextmenu(state, b) {
      state.showContextmenu = b
    },

    setShortcutTypeId(state, id) {
      state.shortcutTypeId = id
    },
    setShortcutListInfo(state, list) {
      state.shortcutListInfo = list;
    },
    setShortcutList(state, list) {
      state.shortcutList = list
    },
    setShortcutType(state, list) {
      state.shortcutType = list
    },

    setIndividuation(state, info) {
      state.individuation = info;
      const {skin_play_mode:value} = info;
      chrome.settingsPrivate.setPref("browser.dynamic_skin_play_mode",value,'',(res)=>{});
    },
    setListSp(state, item) {
      state.listSp.push(item);
    },
    clearListSp(state) {
      state.listSp.splice(0);
    },
    setApiError(state, b) {
      if (!b) {
        localStorage.setItem('firstNoNet', 'firstGetNet');
      } else {
        state.showManageType = '';
      }
      state.apiError = b
    },
  },
  actions: {
    getHomeData({ dispatch }) {
      // console.log('getHomeData---123')

      dispatch('getApiShortcutList')

      dispatch('getShortcutList')
      dispatch('getShortcutType')

      dispatch('getIndividuation')


    },

    removeShortcutFn({
      dispatch,
      commit,
      state
    }, item) { //删除已选图标
      if (item._id === state.editCustom._id) {
        commit('setShowManageType', '');
      }
      let list = [...state.shortcutListInfo];
      for (let i = 0, len = list.length; len > i; i++) {
        list[i].addani = false;
      }
      let index = list.findIndex(i => {
        return item._id === i._id;
      });
      item.edit = 'delete';
      if (~index) {
        list.splice(index, 1);
        list.item = item;
        dispatch('setShortcutListInfo', list);

      }
    },

    clickShortcutFn: function ({
      dispatch,
      commit,
      state
    }, item) { //图标点击打开链接
      if (state.showManageType !== 'shortcutManager') {
        commit('setShowManageType', '');
        if (item.is == 1) {
          // 调用c端接口
          if (chrome.xb && chrome.xb.showRightSidePanel) {
            chrome.xb.showRightSidePanel(item.u);
          }
        } else {
          // location.href = item.u;
          let u = item.u;
          windowOpenUrl({
            u,
            t: 1
          })
        }
      }
    },

    getIndividuation({
      dispatch,
      commit,
      state
    }) {
      ctrlHome.getIndividuation().then((res_) => {
        // console.log('getIndividuation--1',res_)
        if (!res_.individuation) { // undefined 初始化
          const initIndividuation = {
            doubleClickIsShow: true,
            isShowWallpaper: true,
            isShowBookmarkBtn: false,
            isEmptyCon: false,
            isEmptyBg: false,
            skin_play_mode: false,
          };
          chrome.settingsPrivate.setPref("browser.dynamic_skin_play_mode",false,'',(res)=>{console.log('set play_mode');})
          dispatch('setIndividuation', initIndividuation);
        } else {
          commit('setIndividuation', res_.individuation);
        }
      }).catch((e) => {

      });
    },
    setIndividuation({
      commit
    }, info) {
      ctrlHome.setIndividuation(info).then((res_) => {
        commit('setIndividuation', info);
        // console.log('getIndividuation--2',res_.id,res_, info)

        let storeName = 'autoSyncDB';
        ctrlHome.setIndividuation(info, storeName).then((res_) => {
          // console.log('getIndividuation--3',res_.id,res_, info)
          ctrlBasic.updateAutoSyncDB(res_.id, "update");
        }).catch(e => {
          // console.log(e)
        });
      }).catch((e) => {
        // console.log(e);
      });
    },




    getShortcutListInfo({
      dispatch,
      commit,
      state
    }) {
      ctrlHome.getShortcutListInfo().then((res_) => {
        let data_ = state.shortcutList,
          user_data = res_.shortcutList;
        if (!user_data) { //undefined 初始化
          let listInfo = [];
          for (let i = 0, len = data_.length; len > i; i++) {
            if (data_[i].ir && data_[i].s) {
              listInfo.push(data_[i]);
            }
          }
          listInfo.sort((a, b) => {
            return b.pp - a.pp;
          })
          dispatch('setShortcutListInfo', listInfo);
        } else {
          for (var i = user_data.length - 1; i >= 0; i--) {
            if (!user_data[i].isCustom) {
              let include_id = data_.some(item => {
                if (item._id === user_data[i]._id) {
                  user_data[i] = item;
                }
                return item._id === user_data[i]._id;
              });
              if (!include_id) {
                user_data[i].edit = 'delete';
                dispatch('recordShortcutEdit', user_data[i]);
                user_data.splice(i, 1);
              }
            }
          }
          dispatch('setShortcutListInfo', user_data);
        }
      }).catch(() => {
        // console.log('getShortcutListInfo is error');
      });
    },
    setShortcutListInfo({
      commit,
      state,
      dispatch
    }, list) {
      let listSp = state.listSp,
        store_ = [...list];
      for (let i = 0, len = listSp.length; len > i; i++) {
        let add = list.some(item => { //官方图标特殊位置添加，用户没有则添加至指定位置，反之不操作
          return item._id === listSp[i]._id;
        });
        if (!add) {
          // console.log(listSp[i].sp)
          switch (listSp[i].sp) {
            case 1:
              for (let k = 0, len1 = store_.length; len1 > k; k++) {
                if (!store_[k].is) {
                  store_.splice(k, 0, listSp[i]);
                  break;
                }
              }
              break;
            default: //2
              store_.push(listSp[i]);
              break;
          }

        }
      }
      store_.sys = list.sys;
      ctrlHome.setShortcutListInfo(store_).then(res => {
        // console.log('module-home-setShortcutListInfo',store_,store_.sys);
        commit('setShortcutListInfo', store_)
        commit('clearListSp');
        if (list.item) dispatch('recordShortcutEdit', list.item);
        resolve()
      }).catch(() => {
        // reject()
      })
    },

    getShortcutList({
      commit,
      dispatch,
      state
    }) {
      ctrlHome.getShortcutList(state.shortcutTypeId).then(res => {
        // console.log('获取快捷列表1', res);
        commit('setShortcutList', res)
        dispatch('getShortcutListInfo')
      }).catch(e => {
        // console.log(e);
      })
    },

    getShortcutType({
      commit
    }) {
      ctrlHome.getShortcutType().then(res => {
        commit('setShortcutType', res)
      }).catch(e => {
        // console.log(e);
      })
    },

    getApiShortcutList({
      dispatch,
      commit
    }) {
      // console.log(111,'getApiShortcutList')
      api.getShortcutList().then((res) => {
        let obj = JSON.parse(res.bd.d);
        let shortcutTypes = obj.gcf;
        let shortcurList = obj.cf;
        commit('clearListSp');
        shortcurList.map(item => {
          return item.using = false;
        });
        for (let i = shortcurList.length - 1; i >= 0; i--) {

          if (shortcurList[i].s != 0 && shortcurList[i].sp != 0) {
            let spItem = {
              ...shortcurList[i]
            }
            commit('setListSp', spItem);
            shortcurList[i].sp = 0;
          }
          if (shortcurList[i].s == 0) {
            shortcurList.splice(i, 1);
          }
        }
        // console.log(1112,'getApiShortcutList',obj)
        Promise.all([
          dispatch('setShortcutTypes', shortcutTypes),
          dispatch('setShortcutList', shortcurList)
        ]).then(() => {
          dispatch('getShortcutList')
          dispatch('getShortcutType')
          localStorage.setItem('shortcut-version', res.bd.v)
        }).catch(e => {
          console.warn(e)
        });

        commit('setApiError', false)
      }).catch(e => {
        console.warn('数据无更新', e);
        if (~e.toString().indexOf('Error: timeout of 5000ms') || ~e.toString().indexOf('Error: Request aborted')) {
          commit('setApiError', true)
        } else {
          commit('setApiError', false)
        }
      })
    },

    setShortcutTypes({
      commit
    }, list) {
      ctrlHome.setShortcutTypes(list).then(() => {
        // console.log('module-home-setShortcutTypes',list)
        commit('setShortcutType', list)
      }).catch(() => {
        // reject()
      })
    },
    setShortcutList({
      commit,
      dispatch
    }, list) {
      ctrlHome.setShortcutList(list).then(res => {
        // console.log('module-home-setShortcutList',list)
        commit('setShortcutList', list)


      }).catch((e) => {
        // reject()
      })
    },
    recordShortcutEdit({}, item_) {
      // console.log('item_-----------------------------',item_)
      ctrlHome.recordShortcutEdit().then(res_ => {
        if (!res_) return;
        var shortcutEdit = res_.shortcutEdit || [];
        // console.log(78229,shortcutEdit, res_, shortcutEdit && shortcutEdit.length > 0)
        if (shortcutEdit && shortcutEdit.length > 0) {
          let index_ = shortcutEdit.findIndex(i => {
            return item_._id === i._id;
          });
          // console.log(index_,shortcutEdit)
          if (~index_) {
            shortcutEdit.splice(index_, 1);
          }
          // console.log(87,shortcutEdit, res_ ,item_)
        }
        shortcutEdit.push(item_);

        // console.log(78229001,shortcutEdit, res_, item_)
        let storeName = 'autoSyncDB';
        DB.updataByStore({
          ...res_,
          shortcutEdit: shortcutEdit
        }, storeName).then(response => {
          ctrlBasic.updateAutoSyncDB(res_.id, "update");
        }).catch(e => {
          // console.log(e)
        })
      }).catch((e) => {
        // console.log(e)
      })
    }
  },
}