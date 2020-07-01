export default {
  state: {
    visible: false,
    show: false,
    message: {
      type: 'error',
      text: '网络异常，请稍后再试'
    }
  },
  getters: {
    getModalVisible(state) {
      return state.visible;
    },
    getModalShow(state) {
      return state.show;
    },
    getModalMessage(state) {
      return state.message;
    }
  },
  mutations: {
    setModalVisible(state, status) {
      state.visible = status;
    },
    setModalShow(state, status) {
      state.show = status;
    },
    setModalMessage(state, message) {
      state.message = message;
    }
  },
  actions: {
    // 根据user_id添加壁纸数据
    message({ commit }, message) {
      commit("setModalMessage", message);

      setTimeout(() => {
        commit("setModalShow", true);
        setTimeout(() => {
          // commit("setModalShow", false);
          commit("setModalVisible", true);
          setTimeout(() => {
            commit("setModalVisible", false);
            setTimeout(() => {
              commit("setModalShow", false);
            }, 500);
          }, 1500);
        }, 100);
      }, 500);
    }
  }
};
