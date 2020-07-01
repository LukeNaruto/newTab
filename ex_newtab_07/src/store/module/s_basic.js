import c_basic from "@/controller/c_basic";
import _ from "lodash";

export default {
  state: {
    rhash: /* localStorage.getItem('router-hash') || */ "", // 改变？
    menuList: [
      //
      { id: "menu1", name: "home", icon: "icon-complete-px" },
      { id: "menu2", name: "portal", icon: "icon-gengduo-sousuo-px" }
    ],
    // 背景状态，0 代表本地背景， 1，代表全面屏， 2： 代表白色背景
    screenState: 0, // 屏幕状态

    backgroundModel: {}, // 背景模式
    isShowSkinManage: false, // 是否显示皮肤管理
    isHiddenAll: false, // 是否隐藏全部
    theme: "white" // 主题色调
  },
  getters: {
    getRhash(state) {
      return state.rhash;
    },
    getMenuList(state) {
      return state.menuList;
    },
    getIsHiddenAll(state) {
      return state.isHiddenAll;
    },
    getTheme(state) {
      return state.theme;
    }
  },
  computed: {
    
  },
  mutations: {
    setRhash(state, hash) {
      // localStorage.setItem('router-hash', hash)
      state.rhash = hash;
    },

    setIsHiddenAll(state, b) {
      state.isHiddenAll = b;
    },

    setHot(state, opts) {
      for (let i in opts) {
        state[i] = opts[i];
      }
    },

    setTheme(state, theme) {
      state.theme = theme;
    },
  },
  actions: {
    // 获取公共数据入口
    getAllData({ dispatch }, user_id) {
      // 获取个性化设置数据
      // dispatch('getIndividuation');

      // 获取桌面模式数据
      dispatch("getHomeData");

      // 获取当前模式
      dispatch("getDBRhash", user_id);

      // 获取搜索引擎数据，通过user_id（本地数据库）
      dispatch("getDBSearchEngine", user_id);

      // 获取搜索引擎列表（本地数据库）
      dispatch("getDBSearchEngineList");

      // 获取搜索引擎列表（服务端）
      dispatch("getApiSearchEngineList", user_id);

      // 获取热词列表（服务端）
      dispatch("getApiHotWordsList", user_id);

      // 加载壁纸初始数据
      dispatch("getDefaultWallpaperData", user_id);
    },

    setTheme ({ commit }, theme) {
      commit('setTheme', theme);
    },

    // 判断是否需要初始化
    async judgeIsResetUserData({ dispatch, rootState }) {
      dispatch("getApiSyncUserData", rootState.main.user);
    },

    // 初始化数据
    async resetUserData({ dispatch }, params) {
      const { v, user_id } = params;

      const userDB = await c_basic.getDataByIndexId("userDB", user_id);
      const individuation = userDB.individuation || {
        doubleClickIsShow: false,
        isEmptyBg: false,
        isEmptyCon: false,
        isShowBookmarkBtn: false,
        isShowWallpaper: true
      };

      // console.log("清除autoSyncDB数据");
      // 清除autoSyncDB数据
      await c_basic.clearAutoSyncDBByID(user_id);

      // console.log("清除userDB数据");
      c_basic.clearUserDBByID(user_id).then(async (res) => {
        await c_basic.updateUserDB(user_id, { individuation }, "unchangeAutoAsyncDB");

        // localStorage.removeItem("searchEngine-version");
        dispatch("setDBSearchEngineList", { list: [], v: 0 })
        localStorage.removeItem("shortcut-version");
        await dispatch("setUserVersion", { user_id, v });
        dispatch("getAllData", user_id);

        setTimeout(() => {
          dispatch("setApiSyncUserData");
        }, 1000);
      });
    },

    // 获取服务端数据
    getApiSyncUserData({ dispatch }, userData) {
      const { user_id, user_token, v: version } = userData;

      const requestData = {
        u: user_id,
        v: version || 0,
        tk: user_token
      };
      // 只有需要拉去数据时，返回数据。如果版本号无变化，返回304
      c_basic
        .getApiSyncUserData(requestData)
        .then(res => {
          const {
            code,
            bd: { data, v }
          } = res;

          // 1.数据被清空，前端特殊处理
          if (code === 2) {
            // console.log("1.数据被清空，前端特殊处理", { user_id, v });
            dispatch("resetUserData", { v, user_id });
            // dispatch("setUserVersion", { user_id, v });
          }

          // 2.用户同步数据不存在
          else if (code === 3) {
            // console.log("2.用户同步数据不存在", { user_id, v });

            dispatch("setApiSyncUserData");
          }

          // 3.服务端版本 > 前端版本
          else if (code === 0) {
            // console.log("3.服务端版本 > 前端版本", { user_id, v }, data);

            c_basic
              .updateUserDB(user_id, data, "unchangeAutoAsyncDB")
              .then(async () => {
                dispatch("setUserVersion", { user_id, v });
                
                // 数据合并
                await dispatch("mergeData", { user_id, data, v });

                // 清除autoSyncDB数据
                await c_basic.clearAutoSyncDBByID(user_id);

                // 获取初始数据
                dispatch("getAllData", user_id);
              });
          }
        })
        .catch(() => {
          // console.log('%c版本号相同，没有同步数据', "color: orange; background-color: #eee; padding: 2px 10px; border-radius: 3px;");
        });
    },

    // 调试数据合并
    async testMergeData({ rootState }) {
      const { user_id } = rootState.main.user;

      const restData = {
        // shortcutEdit: [{ addani: false, edit: "delete", gid: "2fjgw6el2w7g", gp: 140, gs: 1, gt: "生活", hp: 170, ic: "http://src3.minibai.com/static/uploads/newtab/iconimg/212f0ac2f5359200a27c04d030229a7f1567082599.png", id: "", ih: 1, ir: 1, is: 0, p: 200, pp: 5, s: 1, sp: 2, t: "新浪微博", u: "https://weibo.com", using: false, ut: 1574849382, _id: "2fjlkz7u5pxi" }],
        shortcutEdit: [
          {
            addani: false,
            edit: "update",
            gid: "2fjgw6el2w7g",
            gp: 140,
            gs: 1,
            gt: "生活",
            hp: 170,
            ic:
              "http://src3.minibai.com/static/uploads/newtab/iconimg/212f0ac2f5359200a27c04d030229a7f1567082599.png",
            id: "",
            ih: 1,
            ir: 1,
            is: 0,
            p: 200,
            pp: 5,
            s: 1,
            sp: 2,
            t: "新浪微博",
            u: "https://weibo.com",
            using: false,
            ut: 1574849382,
            _id: "2fjlkz7u5pxi"
          }
        ],
        searchEngine: {
          d: 0,
          hc: "",
          hl:
            "https://www.baidu.com/sugrec?pre=1&p=3&ie=utf-8&json=1&prod=pc&from=pc_web&sugsid=1434,21104,29579,29074,29519,28519,29098,29568,28839,29221&wd=",
          ic:
            "http://src3.minibai.com/static/uploads/searchengine/img/376b256db8a4d34a8fb55efbe3eb0bc51566977437.png",
          id: "2fhcg7jx6h9o",
          lg:
            "http://src3.minibai.com/static/uploads/searchengine/logo/6e1dbcd0cbd262221b86c6644d10046e1568963677.png",
          lk: "https://www.bing.com",
          lo:
            "http://src3.minibai.com/static/uploads/searchengine/wlogo/cd7fcd1ee8ff8406b5c5f76d5676d3ed1566977446.png",
          m: "https://cn.bing.com/search?q=",
          p: 10,
          t: "bing",
          ut: 1575011811
        },
        rHash: "portal",
        individuation: {
          doubleClickIsShow: false,
          isEmptyBg: false,
          isEmptyCon: false,
          isShowBookmarkBtn: false,
          isShowWallpaper: true
        }
      };

      await c_basic.updateAutoSyncDBByID(user_id, restData);
    },

    // 服务端与autoSyncDB数据，对比合并
    async mergeData({ dispatch }, params) {
      const { user_id, data: apiData, v } = params;

      // 调试数据合并
      // testMergeData();

      const userAutoSyncData = await c_basic.getDataByIndexId(
        "autoSyncDB",
        user_id
      );

      const {
        shortcutEdit,
        searchEngine,
        rHash,
        individuation,
        wallpaper
      } = userAutoSyncData;

      const mergedData = { ...apiData, id: user_id, v };

      // 判断替换对应项
      if (individuation) {
        // console.log("merge individuation");
        mergedData.individuation = {
          ...apiData.individuation,
          ...individuation
        };
      }
      if (rHash) {
        // console.log("merge rHash");
        mergedData.rHash = rHash;
      }
      if (searchEngine) {
        // console.log("merge searchEngine");
        mergedData.searchEngine = searchEngine;
      }
      if (shortcutEdit) {
        // 处理、合并shortcutList
        // console.log("merge shortcutEdit");
        const shortcutList = await dispatch("mergeShortcutList", {
          apiData,
          userAutoSyncData
        });
        mergedData.shortcutList = shortcutList;
      }
      if (wallpaper) {
        // console.log("merge searchEngine");
        mergedData.wallpaper = wallpaper;
      }

      return new Promise(resolve => {
        c_basic
          .updateUserDB(user_id, mergedData, "unchangeAutoAsyncDB")
          .then(() => {
            resolve();
          });
      });
    },

    // shortcutList，对比合并
    async mergeShortcutList({}, params) {
      const {
        apiData,
        userAutoSyncData: { shortcutEdit }
      } = params;

      // 处理、合并shortcutList
      const shortcutList = JSON.parse(
        JSON.stringify(apiData.shortcutList || [])
      );

      // 通过shortcutEdit判断，并增删改shortcutList
      if (shortcutEdit !== undefined) {
        shortcutEdit.forEach(item => {
          if (item.edit === "delete") {
            _.remove(shortcutList, shortcut => shortcut._id === item._id);
          } else if (item.edit === "update") {
            delete item.edit;
            const findIndex = _.findIndex(apiData.shortcutList, {
              _id: item._id
            });
            if (findIndex === -1) {
              // 没有查询到该项，添加该项
              shortcutList.push(item);
            } else {
              // 查询到该项，替换该项
              shortcutList[findIndex] = item;
            }
          } else if (item.edit === "drag") {
            delete item.edit;
            delete item.drag_index;
            let index = item.drag_index || 0,
              findIndex = _.findIndex(apiData.shortcutList, { _id: item._id });
            if (findIndex >= 0) {
              _.remove(shortcutList, shortcut => shortcut._id === item._id);
            }
            shortcutList.splice(index, 0, item);
          }
        });
      }

      return shortcutList;
    },

    async setApiSyncUserData({ dispatch, rootState }) {
      const { user_id, user_token } = rootState.main.user;

      // 判断autoSync表里有无该user_id的数据

      const autoSyncDB = await c_basic.getDataByIndexId("autoSyncDB", "autoSync");

      const { userIDList } = autoSyncDB;

      if (userIDList.length > 0) {
        let userDB = await c_basic.getDataByIndexId("userDB", user_id);

        // 如果，当前user_id的本地数据库没有数据，或者同步列表里没有当前user_id，则不同步！！！
        if (!userDB || !userIDList.includes(user_id)) return;

        const { v } = userDB;
        delete userDB.id;
        delete userDB.v;

        // 查询当前userid有数据，拉取数据
        const requestData = {
          u: user_id,
          v: v || 0,
          tk: user_token,
          bd: userDB
        };

        c_basic.setApiSyncUserData(requestData).then(async res => {
            const { code, bd: { v, data } } = res;

            // 1.服务端版本 > 前端版本
            if (code === 1) {
              // console.log("1.服务端版本 > 前端版本 ==> 直接返回最新版本号及其数据", { user_id, v });
              dispatch("setUserVersion", { user_id, v });

              // 数据合并
              await dispatch("mergeData", { user_id, data, v });

              // 清除autoSyncDB数据
              c_basic.clearAutoSyncDBByID(user_id);
            }

            // 2.服务端版本 = 前端版本
            else if (code === 0) {
              // console.log("2.服务端版本 = 前端版本 ==> update并返回最新版本号", v);
              dispatch("setUserVersion", { user_id, v });

              // 删除userIDList数组中的user_id
              c_basic.updateAutoSyncDB(user_id, "delete");

              // 清除autoSyncDB数据
              c_basic.clearAutoSyncDBByID(user_id);
            }
          })
          .catch(e => {
            // 这里可判断是否有数据，如无则可以从本地数据中添加
            // console.log('%c'+ e, 'color: green;')
          });
      }
    },

    setUserVersion(_, data) {
      const { user_id, v } = data;

      return new Promise((resolve, reject) => {
        c_basic
          .updateUserDB(user_id, { v }, "unchangeAutoAsyncDB")
          .then(res => {
            resolve(res);
          })
          .catch(e => {
            reject(e);
          });
      });
    },

    setDBRhash({ dispatch, rootState }, params) {
      const { rHash, type } = params;
      const { user_id } = rootState.main.user;
      // console.log(`Mode will be ${rHash}`);
      c_basic
        .updateUserDB(user_id, { rHash }, type)
        .then(() => {
          dispatch("getDBRhash", user_id);
          // console.log(`Mode has been ${rHash}`);
        })
        .catch(e => {
          console.log(e)
        });
    },

    getDBRhash({ commit, dispatch }, user_id) {
      c_basic
        .getDataByIndexId("userDB", user_id)
        .then(res => {
          if (res.rHash) {
            commit("setRhash", res.rHash);
          } else {
            dispatch("setDBRhash", {
              rHash: "home",
              type: "unchangeAutoAsyncDB"
            });
          }
        })
        .catch(e => {
          console.log(`Mode setups failed,${e}`)
        });
    }
  }
};
