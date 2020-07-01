import api from "@/api/api";
import c_basic from "@/controller/c_basic";
import c_search from "@/controller/c_search";
import { arrSort } from "@/libs/arrHandle";

export default {
  state: {
    // 搜索框
    searchEngine: {
      d: 1,
      hc: "",
      hl: "https://www.baidu.com/sugrec?pre=1&p=3&ie=utf-8&json=1&prod=pc&from=pc_web&sugsid=1434,21104,29579,29074,29519,28519,29098,29568,28839,29221&wd=",
      ic: "http://src3.minibai.com/static/uploads/searchengine/img/aff604d0b96dc07f5db100bb1be45f9e1566296308.png",
      id: "2f2quv44d86m",
      lg: "http://src3.minibai.com/static/uploads/searchengine/logo/f676a3d0ade5b0869c1b77d4248eb0d41568963327.png",
      lk: "https://www.baidu.com/",
      lo: "http://src3.minibai.com/static/uploads/searchengine/wlogo/1bd7067c5a9bc85a41bca3c690d1b5a81566296250.png",
      m: "https://www.baidu.com/s?ie=utf-8&wd=",
      p: 50,
      t: "百度",
      ut: 1574516762
    }, // 搜索引擎
    searchText: "", // 搜索内容
    isSearchActive: false, // 是否显示搜索框
    isShowWordAssociation: false, // 是否显示热词联想
    wordAssociationIndex: -1, // 热词联想层级
    wordAssociations: [], // 热词联想
    searchEngineList: [], // 搜索图标列表
    hotWordsList: [], // 热词列表
    isShowHotWordsList: true, // 是否显示热词推荐
  },
  getters: {
    //搜索部分
    getWordAssociation(state) {
      return state.wordAssociations;
    },
    getIsShowWordAssociation(state) {
      return state.isShowWordAssociation;
    },
    getWordAssociationIndex(state) {
      return state.wordAssociationIndex;
    },
    getSearchEngine(state) {
      return state.searchEngine;
    },
    getSearchText(state) {
      return state.searchText;
    },
    getIsSearchActive(state) {
      return state.isSearchActive;
    },
    getSearchEngineList(state) {
      return state.searchEngineList;
    },
    getHotWordsList(state) {
      return state.hotWordsList;
    },
    getIsShowHotWordsList(state) {
      return state.isShowHotWordsList;
    }
  },
  mutations: {
    //搜索部分
    setSearchEngine(state, engine) {
      state.searchEngine = engine;
    },
    setSearchText(state, str) {
      state.searchText = str;
    },
    setIsSearchActive(state, b) {
      state.isSearchActive = b;
    },
    setSearchEngineList(state, list) {
      state.searchEngineList = list;
    },
    setIsShowWordAssociation(state, b) {
      state.isShowWordAssociation = b;
    },
    setWordAssociationIndex(state, index) {
      state.wordAssociationIndex = index;
    },
    setWordAssociations(state, words) {
      state.wordAssociations = words;
    },
    setHotWordsList(state, words) {
      state.hotWordsList = words;
    },
    setIsShowHotWordsList(state, status) {
      state.isShowHotWordsList = status;
    }
  },
  actions: {
    // 设置热词推荐列表显示
    setIsShowSearch({ commit }, params) {
      commit('setIsSearchActive', params);
    },

    // 获取热词列表（服务端）
    async getApiHotWordsList ({ dispatch, rootState }, user_id) {
      const v =  Math.floor(new Date().getTime()/1000);
      const hotWordsList = await c_search.getDBHotWordsList();
      const userDB = await c_basic.getDataByIndexId("userDB", user_id);
      // 处理 hc
      let hc = "";
      // const { searchEngine: { hc = "" } } = userDB;
      const { searchEngine } = userDB;

      if(searchEngine && searchEngine.hc){
        hc = searchEngine.hc
      }
      
      if (hc.length === 0) {
        dispatch("setDBHotWordsList", { data: [], v: 0 });
      } else {
        c_search.getApiHotWordsList(hc).then(data => {
          dispatch("setDBHotWordsList", { data, v });
        }).catch(e => {
          dispatch("setDBHotWordsList", { data: [], v: 0 });
        })
      }
    },

    // 设置热词列表（本地数据库）
    setDBHotWordsList({ dispatch }, params) {
      const { data, v } = params;
      
      c_basic.updateHomeSysDB({ name: "hotWordsList", data, v }).then(() => {
        dispatch("getDBHotWordsList");
      });
    },

    // 设置热词列表（本地数据库）
    async getDBHotWordsList({ commit }) {
      const hotWordsListDB = await c_search.getDBHotWordsList();

      commit("setHotWordsList", hotWordsListDB.data);
    },

    //搜索部分
    getApiWordAssociation({ commit, state }, word) {
      if (state.searchEngine.hl != "") {
        api.getApiWordAssociation(word, state.searchEngine.hl).then(arr => {
          if(!word)commit("setWordAssociationIndex", -1);
          commit('setSearchText',word)
          commit("setIsShowHotWordsList", !word);
          commit("setWordAssociations", arr);
          commit("setIsShowWordAssociation", arr.length > 0);
        });
      }
    },

    // 拉取搜索引擎列表（服务端），http status为200时，做数据处理。
    // http status为304时，代表数据无变化，不做后续操作。
    async getApiSearchEngineList({ dispatch }, user_id) {
      const DBSearchEngineList = await c_search.getDBSearchEngineList();

      let version = 0;

      if (DBSearchEngineList && DBSearchEngineList.v) {
        version = DBSearchEngineList.v;
      }

      api.getApiSearchEngineList(version).then(res => {
        // 如果status是304，res是空字符串，如果status是200，res是object
        if (typeof res === "object") {
          const list = JSON.parse(res.bd.d);
          
          list.sort((a,b)=> b.p - a.p );

          res.bd.name = "searchEngine";
        
          dispatch("setDBSearchEngineList", { list, v: res.bd.v }).then(() => {
            // 写入数据后必须立马从数据库读取一次，并写入内存
            dispatch("getDBSearchEngineList");

            // 设置默认搜索引擎
            dispatch("setDefaultSearchEngineById", {user_id, list});
          });
        }
      })
      .catch(e => {
        // console.log("%c拉取搜索引擎列表（服务端）返回304", "color: green; background-color: #eee; padding: 2px 10px; border-radius: 3px;");
        
        // 如果没有搜索引擎数据，根据本地数据库初始化
        dispatch("getDBSearchEngineList");
      });
    },

    // 获取搜索引擎数据（本地），根据user_id
    getDBSearchEngine({ commit, dispatch }, user_id) {
      c_search.getDBSearchEngine(user_id).then(searchEngine => {
        commit("setSearchEngine", searchEngine);
        // c_basic.updateUserDB(user_id, { searchEngine }, "unchangeAutoAsyncDB").then(()=>{
        //   commit("setSearchEngine", searchEngine);
        // })
      }).catch(e => {
        // console.log("%c没查到user_id下的searchEngine，自动加载默认参数，并保存在userDB","color: orange;");
        
        dispatch("getDBSearchEngineList").then(res => {
          // 设置默认搜索引擎
          if (res) {
            dispatch("setDefaultSearchEngineById", {user_id, list: res.data});
          }
        })
      });
    },

    // 查本地数据库，加载到内存
    getDBSearchEngineList({ commit, dispatch }) {
      return new Promise((resolve, reject) => {
        c_search.getDBSearchEngineList().then(res => {
          if(res) {
            const newList = JSON.parse(JSON.stringify(res.data));

            newList.sort((a,b)=> b.p - a.p );
            
            commit("setSearchEngineList", newList);
          }
          resolve(res)
        }).catch(e => {
          reject(e)
        });;
      });
    },

    // 根据user_id添加引擎数据
    setDBSearchEngine({ commit, dispatch, rootState }, params) {
      const { user_id = rootState.main.user.user_id, searchEngine } = params;
      
      c_basic.updateUserDB(user_id, { searchEngine }, params.type).then(res => {
        commit("setSearchEngine", searchEngine);

        // 获取热词列表（服务端）
        dispatch('getApiHotWordsList', user_id);
      });
    },

    // 把搜索引擎列表写入DB
    // 前置条件：根据status是否为304判断
    setDBSearchEngineList({}, data) {
      return new Promise((resolve, reject) => {
        const { list, v } = data;

        c_basic.updateHomeSysDB({ id: "searchEngine", name: "searchEngine", data: list, v }, "name").then(() => {
          resolve();
        }).catch(e => {
          reject(e);
        });
      });
    },

    // 设置默认搜索引擎
    setDefaultSearchEngineById({ dispatch }, data){
      const { user_id, list } = data;
      // 遍历list，如果其中d==1，该条参数作为默认参数
      const defaultSearchEngine = list.filter(item => item.d == 1);

      const searchEngine = defaultSearchEngine[0];

      dispatch("setDBSearchEngine", {user_id, searchEngine, type: "unchangeAutoAsyncDB"}, );
    }
  }
};
