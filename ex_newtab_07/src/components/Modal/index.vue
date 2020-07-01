<template>
  <div
    class="modal-root"
    :class="getModalVisible ? 'show' : 'hidden'"
    v-show="getModalShow"
  >
    <div class="modal-wrap" role="dialog">
      <div class="modal">
        <span
          class="iconfont"
          :class="
            getModalMessage.type === 'error'
              ? 'icon-fail-px1'
              : getModalMessage.type === 'success'
              ? 'icon-Success-px1'
              : getModalMessage.type === 'warning'
              ? 'icon-Prompt-px2'
              : ''
          "
        ></span>
        {{ getModalMessage.text }}
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters, mapActions } from "vuex";
export default {
  name: "Modal",
  components: {},
  computed: {
    ...mapGetters(["getModalVisible", "getModalShow", "getModalMessage"])
  },
  data() {
    return {
      visible: false
    };
  },
  mounted() {},
  methods: {}
};
</script>

<style lang="less">
.modal-root {
  position: relative;
  z-index: 1000;
  transition: all 0.3s linear;
  &.show {
    opacity: 1;
  }
  &.hidden {
    opacity: 0;
  }
  .modal-wrap {
    display: flex;
    justify-content: center;
    align-items: flex-start;
    position: fixed;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
    z-index: 1000;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.45);

    .modal {
      display: flex;
      justify-content: center;
      align-items: center;
      margin: 50px auto 0;
      padding: 14px 32px;
      border: 1px solid rgba(0, 0, 0, 0.1);
      border-radius: 5px;
      background: #fff;
      box-shadow: 0 6px 16px 0 rgba(0, 0, 0, 0.1);
      font-size: 14px;
      color: #222;
      z-index: 1;

      .iconfont {
        margin-right: 10px;
        font-size: 20px;

        &.icon-fail-px1 {
          color: #e81123;
        }
        &.icon-Success-px1 {
          color: #3dda70;
        }
        &.icon-Prompt-px2 {
          color: #009bf1;
        }
      }
    }
  }
}
</style>
