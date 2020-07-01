import c_basic from "@/controller/c_basic";

export default {
  namespaced: false,
  state: {
    user: {
      user_id: "tourist",
      icon_url: "",
      user_name: "游客",
      user_token: ""
    },
    autoUpdateInterval: null
  },

  getters: {
    getUserData(state) {
      return state.user;
    }
  },

  mutations: {
    setUserData(state, data) {
      state.user = data;
    }
  },

  actions: {
    // 主入口
    main({ dispatch }) {
      dispatch("getUserInfo");
    },

    // 从C端获取用户数据
    getUserInfo({ dispatch }) {
      chrome.xb.getUserInfo(userData => {
        dispatch("initData", userData);
      });
    },

    // 当用户数据变化时，根据user_id来重置store数据
    initData({ commit, dispatch }, userData) {
      const defaultUserData = {
        user_id: "tourist",
        icon_url: "",
        user_name: "游客",
        user_token: ""
      };

      // 通过user_id，重置userData
      if (userData.user_id === "") {
        commit("setUserData", defaultUserData);
        userData = defaultUserData;
      } else if (
        userData.user_id.length > 0 &&
        typeof userData.user_id === "string"
      ) {
        commit("setUserData", userData);
      }

      // console.log(
      //   "%cuser_id 为 " + userData.user_id,
      //   "color: #fff; background-color: green; padding: 2px 10px; border-radius: 3px;"
      // );

      // 连接据库
      c_basic.connectData().then(db => {
        // console.log("%c成功连接数据库", "color: #fff; background-color: green; padding: 2px 10px; border-radius: 3px;" );

        // 检查，数据库中是否存在当前user_id的用户
        dispatch("checkUserDBById", userData);

        // 获取初始数据
        dispatch("getSkinSkinType");
        dispatch("getUseFontColor");
        dispatch("getLoadingSkinId");
      });
    },

    // 从数据库userDB表，查找当前user_id的数据
    async checkUserDBById({ dispatch }, userData) {
      const { user_id } = userData;

      const userDBData = await c_basic.getDataByIndexId("userDB", user_id);

      let v = 0;
      
      if (userDBData) {
        v = userDBData.v;
      }

      if (userDBData) {
        // console.log("%ccheckUserDBById，有数据", "color: orange; background-color: #eee; padding: 2px 10px; border-radius: 3px;" );

        // 获取初始数据
        dispatch("getAllData", user_id);
      } else {
        // 查询当前user_id无数据，初始化数据
        // console.log("%ccheckUserDBById，无数据", "color: orange; background-color: #eee; padding: 2px 10px; border-radius: 3px;" );

        c_basic.updateUserDB(user_id, {}, "unchangeAutoAsyncDB").then(() => {
          c_basic.updateAutoSyncList(user_id, "onlyAdd", {}).then(() => {
            // 获取初始数据
            dispatch("getAllData", user_id);
          });
        });
      }

      // 请求接口，获取服务端同步数据
      if (user_id !== "tourist") {
        dispatch("getApiSyncUserData", { ...userData, v });
      }
    }
  }
};
