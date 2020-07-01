<template>
  <div @dblclick.stop class="settings">
    <button v-if="getRhash === 'home'" @click.stop="showShortcutManager" class="settings-button" title="图标管理">
      <span class="iconfont icon-configure-px"></span>
    </button>

    <button
      v-if="getUseSkinTypeId === 1 && getIndividuation.isShowWallpaper && 
      getWallpaper.pn && getWallpaper.pa"
      class="settings-button settings-button-info"
    >
      <span class="iconfont icon-xinbiaoqian-banquantishi"></span>
      <span class="info">{{getWallpaper.pn}}(©{{getWallpaper.pa}})</span>
    </button>
    
    <button
      v-if="getUseSkinTypeId === 1 && getIndividuation.isShowWallpaper"
      class="settings-button settings-button-change"
      title="切换壁纸"
      :disabled="getModalShow || buttonStatus"
      @click="changeWallpaper(getUserData.user_id)"
    >
      <span class="iconfont icon-gengduo-shuaxin-px" :style="{'animation': buttonStatus ? 'turn 1s infinite' : 'none'}"></span>
    </button>
  </div>
</template>

<script>
import { mapGetters, mapActions } from "vuex";
export default {
  name: "settings",
  components: {},
  computed: {
    ...mapGetters([
      "getWallpaper",
      "getRhash",
      "getIndividuation",
      "getUserData",
      'getUseSkinTypeId',
      'getModalShow',
      'getChangeWallpaper'
    ]),
  },
  data() {
    return {
      buttonStatus: false,
    };
  },
  mounted() {
    
  },
  watch: {
    getChangeWallpaper: {
      handler: "handleBg",
      immediate: false,
    },
  },
  methods: {
    ...mapActions(['changeWallpaper']),
    showShortcutManager(){
      this.$store.commit('setShowManageType', 'shortcutManager');
    },
    handleBg() {
      if (this.getChangeWallpaper && !this.buttonStatus) {
        this.buttonStatus = true;
        setTimeout(() => {
          this.buttonStatus = false;
        }, 1000);
      }
    },
  },
};
</script>

<style lang="less">
.settings {
  position: absolute;
  right: 33px;
  bottom: 12px;
  z-index: 1;
  .settings-button {
    width: 40px;
    height: 40px;
    margin-left: 2px;
    box-sizing: border-box;
    border: 1px solid var(--settings-border-color);
    border-radius: 2px;
    background: var(--settings-bg-color);
    outline-color: transparent;
    cursor: pointer;
    transition: all 0.3s linear;
    .iconfont {
      color: var(--settings-font-color);
      transition: all 0.3s linear;
    }
  }
  .settings-button:hover {
    background: rgba(0, 0, 0, 0.06);
    .iconfont {
      color: var(--settings-font-color);
    }
  }
  .settings-button-info {
    position: relative;
    .info {
      min-width: 81px;
      height: 37px;
      display: none;
      position: absolute;
      right: -41px;
      bottom: 49px;
      padding: 0 10px;
      border-radius: 4px;
      background: rgba(112, 112, 112, 0.36);
      font-size: 12px;
      color: #fff;
      line-height: 37px;
      white-space: nowrap;
      text-align: center;
    }
  }
  .settings-button-info::before {
    content: "";
    width: 0;
    height: 0;
    display: none;
    position: absolute;
    box-sizing: border-box;
    top: -11px;
    left: 13px;
    border: 6px solid;
    border-color: rgba(112, 112, 112, 0.36) transparent transparent transparent;
    z-index: 1;
  }
  .settings-button-info:hover {
    .info {
      display: block;
    }
    &::before {
      display: block;
    }
  }
  .iconfont {
    font-size: 16px;
    color: var(--settings-font-color);
  }
  .iconfont:hover {
    color: var(--settings-font-color);
  }
  .settings-button-change {
    .iconfont{
      display: block;
    }
    @keyframes turn {
      0% { transform: rotate(0); }
      100% { transform: rotate(360deg); }
    }
  }
}
</style>
