import c_basic from '@/controller/c_basic';
import c_wallpaper from "@/controller/c_wallpaper";

export default {
  state: {
    wallpaper: {
      ic: ''
    },
    wallpaperList: [],
    changeWallpaper: false
  },
  getters: {
    getWallpaper(state) {
      return state.wallpaper;
    },
    getWallpaperList(state) {
      return state.wallpaperList;
    },
    getChangeWallpaper(state) {
      return state.changeWallpaper;
    },
  },
  mutations: {
    setWallpaper(state, data) {
      state.wallpaper = data;
    },
    setWallpaperList(state, list) {
      state.wallpaperList = list;
    },
    setChangeWallpaper(state, status) {
      state.changeWallpaper = status;
    },
  },
  actions: {
    
    // // 设置壁纸列表（本地数据库）
    // deleteWallpaper ({ commit, dispatch }, user_id) {
    //   // 查询当前用户数据
    //   c_basic.getDataByIndexId("userDB", user_id).then(async userData => {
    //     delete userData.wallpaper;
    //     console.log(userData);

    //     await c_basic.clearUserDBByID(user_id);

    //     c_basic.updateUserDB(user_id, userData).then(data => {
    //       console.log(data);
    //     }).catch(e => {
    //       console.log(e);
    //     })
    //   });
    // },
    
    // 加载壁纸初始数据
    getDefaultWallpaperData ({ dispatch }, user_id) {
      // 查询当前用户数据
      c_basic.getDataByIndexId("userDB", user_id).then(userData => {
        const { individuation } = userData;

        let isShowWallpaper = false;

        if (individuation && individuation.isShowWallpaper !== undefined) {
          isShowWallpaper = individuation.isShowWallpaper;
        }
        
        // if (isShowWallpaper) {
          // 获取壁纸数据，通过user_id（本地数据库）
          dispatch("getDBWallpaper", user_id);

          // 获取壁纸列表（服务端）
          dispatch("getApiWallpaperList", user_id);
        // }
      });
    },

    // 获取壁纸列表（服务端）
    async getApiWallpaperList ({ dispatch }, user_id) {
      const DBwallpaperList = await c_basic.getDataByIndexName('homeSysDB', 'wallpaperList');

      const v = DBwallpaperList ? DBwallpaperList.v : 0;

      c_wallpaper.getApiWallpaperList(v).then(data => {
        dispatch("setDBWallpaperList", {data, user_id});
      }).catch(e => {
        if(e.response.status === 304){
          dispatch("getDBWallpaperList", user_id);
        }
      })
    },
    // 获取壁纸列表（服务端）
    async getApiWallpaperList ({ dispatch }, user_id) {
      const DBwallpaperList = await c_basic.getDataByIndexName('homeSysDB', 'wallpaperList');

      const v = DBwallpaperList ? DBwallpaperList.v : 0;

      c_wallpaper.getApiWallpaperList(v).then(data => {
        dispatch("setDBWallpaperList", {data, user_id});
      }).catch(e => {
        if(e.response.status === 304){
          dispatch("getDBWallpaperList", user_id);
        }
      })
    },
    
    // 设置壁纸列表（本地数据库）
    setDBWallpaperList ({ dispatch }, params) {
      const { user_id } = params;
      const { v } = params.data.bd;
      const list = JSON.parse(params.data.bd.d).sgf[0].cf;
      const newList = list.filter(item => item.s === 1).sort((a, b) => b.p - a.p);

      c_basic.updateHomeSysDB({ name: "wallpaperList", data: newList, v }).then(res => {
        dispatch("getDBWallpaperList", user_id);
        // 需要对比，设置默认壁纸
        dispatch("setDefaultWallpaper", { user_id, list: newList });
      }).catch(e => {
        // dispatch("setDBHotWordsList", { data: [], v: 0 });
      })
    },

    // 获取壁纸列表（本地数据库），加载到内存
    getDBWallpaperList ({ commit, dispatch }, user_id) {
      return new Promise((resolve, reject) => {
        c_wallpaper.getDBWallpaperList().then(res => {
          commit("setWallpaperList", res.data);
          resolve(res);
        }).catch(e => {
          // 如果找不到壁纸列表，拉取服务端列表数据
          dispatch("getApiWallpaperList", user_id);
          reject(e);
        });
      });
    },

    // 获取壁纸数据（本地），根据user_id
    getDBWallpaper({ commit, dispatch }, user_id) {
      return new Promise((resolve, reject) => {
        c_wallpaper.getDBWallpaper(user_id).then(wallpaper => {
          if (wallpaper) {
            dispatch('judgeImage', wallpaper.ic).then(res => {
              commit("setWallpaper", wallpaper);
            }).catch(e => {
              dispatch('message', { type: 'error', text: '网络异常，请稍后再试' });
            });

            resolve(wallpaper);
          } else {
            dispatch("getDBWallpaperList", user_id);

            reject(wallpaper);
          }
        }).catch(async e => {
          const DBWallpaperList = await dispatch("getDBWallpaperList", user_id);
          // 需要对比，设置默认壁纸
          dispatch("setDefaultWallpaper", { user_id, list: DBWallpaperList.data });
          reject(e);
        });
      });
    },

    // 根据user_id添加壁纸数据
    setDBWallpaper({ dispatch }, params) {
      const { user_id, wallpaper } = params;

      c_basic.updateUserDB(user_id, { wallpaper }).then(res => {
        dispatch('getDBWallpaper', user_id);
      });
    },

    // 设置默认壁纸
    setDefaultWallpaper({ dispatch }, data){
      const { user_id, list } = data;
      console.log(user_id, list);
      c_basic.getDataByIndexId('userDB', user_id).then(useData => {
        
        const result = list.filter(item => item.id === useData.wallpaper.id)
        
        dispatch("setDBWallpaper", { user_id, wallpaper: result[0] });
      }).catch(e => {
        dispatch("setDBWallpaper", { user_id, wallpaper: list[0] });
      });
    },

    // 切换壁纸
    async changeWallpaper({ dispatch, commit }, user_id) {
      const { data: DBWallpaperList } = JSON.parse(JSON.stringify(await dispatch('getDBWallpaperList', user_id)));
      
      const DBWallpaper = JSON.parse(JSON.stringify(await c_wallpaper.getDBWallpaper(user_id)));

      const positionList = [];

      DBWallpaperList.forEach(item => {
        positionList.push(item.p)
      });

      const nowPositionIndex = positionList.indexOf(DBWallpaper.p);

      const nextWallpaper = DBWallpaperList[nowPositionIndex + 1] || DBWallpaperList[0];

      dispatch('judgeImage', nextWallpaper.ic).then(res => {
        commit('setChangeWallpaper', true);

        setTimeout(() => {
          dispatch('setDBWallpaper', {user_id, wallpaper: nextWallpaper});
          commit('setChangeWallpaper', false);
        }, 500);

      }).catch(e => {
        dispatch('message', { type: 'error', text: '网络异常，请稍后再试' });
      })
    },

    // 判断图片是否加载
    judgeImage ({}, src) {
      return new Promise((resolve, reject) => {
        let imgNode = new Image();

        imgNode.src = src;

        imgNode.onload = () => {
          resolve(true);
        }

        imgNode.onerror = () => {
          reject(false);
        };
      });
    },
  }
};
