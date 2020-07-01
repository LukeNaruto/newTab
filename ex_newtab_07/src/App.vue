<template>
  <div
    id="app"
    @click="clearStateFn"
    @dblclick="dblclick"
    :class="{ allScreen: getUseSkinTypeId != 1 && getUseSkinTypeId != 4 }"
    :style="{
      '--main-color': getTheme === 'black' ? '#000' : '#fff',
      '--settings-border-color':
        getTheme === 'black'
          ? 'rgba(0, 0, 0, 0.06)'
          : 'rgba(112, 112, 112, 0.36)',
      '--settings-bg-color':
        getTheme === 'black'
          ? 'rgba(255, 255, 255, 0.36)'
          : 'rgba(102, 102, 102, 0.36)',
      '--settings-font-color': getTheme === 'black' ? '#4e4e4e' : '#ededed'
    }"
  >
    <Wallpaper v-if="getUseSkinTypeId === 1" />
    <div v-show="!isHideInWpaper && !getIsHiddenAll" class="main">
      <div v-show="!getIsShowSkinManage">
        <div v-if="!getIndividuation.isEmptyCon" @dblclick.stop class="btn-box">
          <!-- <span
            @click="deleteWallpaper(getUserData.user_id)"
            class="iconfont icon-gengduo-sousuo-px"
            title="删除"
          ></span> -->

          <span
            @click="setDBRhash({ rHash: 'home' })"
            :class="{
              active: getRhash === 'home',
              'text-shadow': getTheme != 'black'
            }"
            class="iconfont icon-complete-px"
            title="桌面模式"
          ></span>
          <span
            @click="setDBRhash({ rHash: 'portal' })"
            :class="{
              active: getRhash === 'portal',
              'text-shadow': getTheme != 'black'
            }"
            class="iconfont icon-gengduo-sousuo-px"
            title="极简模式"
          ></span>
        </div>
        <Menu />
        <Settings v-if="!getIndividuation.isEmptyCon" />
      </div>
      <ShortcutManage />
      <Individuation />
      <Home v-if="getRhash == 'home' && !getIndividuation.isEmptyCon" />
      <Portal v-if="getRhash == 'portal' && !getIndividuation.isEmptyCon" />
    </div>
    <Modal />
  </div>
</template>

<script>
import Individuation from "_c/Individuation/";
import Home from "./views/Home/";
import Portal from "./views/Portal/";

import Menu from "_c/Individuation/Menu.vue";
import ShortcutManage from "_c/Shortcut/ShortcutManage";
import Wallpaper from "_c/Wallpaper";
import Settings from "_c/Settings";
import Modal from "_c/Modal";
import { mapGetters, mapActions } from "vuex";

export default {
  name: "app",
  data() {
    return {
      textShadow: false,
      isHideInWpaper: false //dblclick in (getUseSkinTypeId == 1)
    };
  },
  components: {
    Menu,
    Individuation,
    Home,
    Portal,
    ShortcutManage,
    Wallpaper,
    Settings,
    Modal
  },
  computed: {
    ...mapGetters([
      "getRhash",
      "getShowManageType",
      "getUseSkinTypeId",
      "getUserData",
      "getIsHiddenAll",
      "getIndividuation",
      "getUseFontColor",
      "getIsShowSkinManage",
      "getWallpaper",
      "getTheme"
    ])
  },
  watch: {
    "getIndividuation.isShowWallpaper": {
      handler: "handleTheme",
      immediate: true
    },
    "getWallpaper.c": {
      handler: "handleTheme",
      immediate: true
    },
    getUseFontColor: {
      handler: "handleTheme",
      immediate: true
    }
  },
  beforeCreate() {
    //1、先获取数据
    this.$store.dispatch("getUserInfo");
  },
  created() {
    chrome.settingsPrivate.onPrefsChanged.addListener(res => {
      this.monitorPrefs(res);
    });
  },
  mounted() {
    // 启动自动同步循环
    this.setAutoSyncInterval();
    window.addEventListener("resize", () => {
      this.$store.commit("setShowManageType", "");
    });
    document.addEventListener("mousemove", e => {
      if (e.clientY > 50) return;
      if (this.getIsHiddenAll) {
        this.$store.commit("setIsHiddenAll", !this.getIsHiddenAll);
        chrome.xb.showNonClientAnimation(!this.getIsHiddenAll);
      }
      if (this.isHideInWpaper) this.isHideInWpaper = false;
    });
  },
  methods: {
    ...mapActions([
      "setApiSyncUserData",
      "setDBRhash",
      "testMergeData",
      "judgeIsResetUserData",
      "setTheme",
      "deleteWallpaper"
    ]),

    handleTheme() {
      const {
        getUseSkinTypeId,
        getIndividuation: { isShowWallpaper },
        getWallpaper: { c },
        getUseFontColor
      } = this;

      const theme =
        getUseSkinTypeId === 4 // 夜间模式，黑色
          ? "black"
          : getUseSkinTypeId === 1 && !isShowWallpaper // 经典皮肤 + 不显示壁纸，黑色
          ? "black"
          : getUseSkinTypeId === 1 && isShowWallpaper && c === 0 // 经典皮肤 + 壁纸 + 黑色字体
          ? "black"
          : getUseSkinTypeId === 1 && isShowWallpaper && c === 1 // 经典皮肤 + 壁纸 + 白色字体
          ? "white"
          : getUseFontColor === 0 // 其他情况根据皮肤中心颜色
          ? "white"
          : "black";

      this.setTheme(theme);
    },

    // 设置自动同步循环post
    setAutoSyncInterval() {
      setInterval(() => {
        const { user_id } = this.getUserData;

        if ( user_id === undefined || user_id === "" || user_id === "tourist" ) {
          return
        }

        chrome.xb.getAllSyncTypeSwitchState(res => {
          const newTabStatus = res.find(item => item.type === 7);

          if ( newTabStatus.status ) {
            // console.log("%c自动同步，定时器触发", "color: orange;");
            this.setApiSyncUserData();
          }
        });
      }, 180000);
      // }, 30000);
      // }, 6000);
    },

    clearStateFn() {
      this.$store.commit("setShowManageType", "");
      this.$store.commit("setIsShowSkinManage", false);
    },

    dblclick(e) {
      if (e.clientY < 60) return;
      if (this.getShowManageType || !this.getIndividuation.doubleClickIsShow)
        return;
      if (this.getUseSkinTypeId == 1) {
        this.isHideInWpaper = !this.isHideInWpaper;
      } else {
        this.$store.commit("setIsHiddenAll", !this.getIsHiddenAll);
        chrome.xb.showNonClientAnimation(!this.getIsHiddenAll);
      }
    },

    monitorPrefs(res) {
      res.forEach(i => {
        switch (i.key) {
          // 当登陆状态变化时
          case "browser.user_login_status":
            this.$store.dispatch("getUserInfo");
          // 当个人中心清空新标签页时
          case "browser.new_tab_clear_signal":
            chrome.settingsPrivate.setPref(
              "browser.new_tab_clear_signal",
              false,
              "",
              res => {
                if (i.value === true) {
                  this.judgeIsResetUserData();
                }
              }
            );
            break;
          case "browser.skin_label_type":
            // this.$store.commit('setUseTabShape', i.value)
            break;
          case "browser.skin_sidebar_type":
            // this.$store.commit('setSidebarTypeId', i.value)
            break;
          case "browser.skin_skin_type":
            this.$store.commit("setUseSkinTypeId", i.value);
            this.handleTheme();
            if (i.value == 4) {
              chrome.settingsPrivate.setPref(
                "browser.skin_sidebar_color_type",
                "#000000",
                "container",
                d => {
                  if (d) {
                    // this.$store.commit('setSidebarColors', '#000000')
                  }
                }
              );
            }
            break;
          case "browser.skin_id":
            this.$store.commit("setUseSkinId", i.value);
            break;
          case "browser.skin_font_type":
            this.$store.commit("setUseFontColor", i.value);
            break;
          case "browser.skin_loading_id":
            this.$store.commit("setLoadingSkinId", i.value);
            break;
          case "browser.newtab_quickly_sync":
            if (i.value === true) {
              this.setApiSyncUserData();
            }
            chrome.settingsPrivate.setPref("browser.newtab_quickly_sync", false, "", res => {});
            break;
          default:
            break;
        }
      });
    }
  }
};
</script>

<style lang="less" scope>
#app {
  position: relative;
  overflow-x: hidden;

  width: 100%;
  height: 100%;
  display: flex;
  background-repeat: no-repeat;
  background-position: center center;
  position: relative;
  overflow: hidden;
  transition: all 1s;
  /* background-color: rgba( 0, 0, 0, .3); */

  &.allScreen {
    background: none;
  }
}
.text-shadow {
  text-shadow: 0 3px 10px rgba(0, 0, 0, 0.4) !important;
}
.main {
  flex-grow: 1;

  height: 100%;
  background-repeat: no-repeat;
  background-position: center center;
  position: relative;
  overflow: hidden;
  transition: all 1s;
  /* background-color: rgba( 0, 0, 0, .3); */
}
.btn-box {
  position: absolute;
  right: 88px;
  top: 28px;
  z-index: 2;
  & > span {
    margin-right: 32px;
    opacity: 0.4;
    color: var(--main-color);
    transition: all 0.3s;
    &.active {
      opacity: 1;
      cursor: default;
    }
    &:hover {
      opacity: 1;
    }
    cursor: pointer;
  }
  &:after {
    content: "|";
    position: absolute;
    top: -4px;
    right: 8px;
    color: var(--main-color);
    opacity: 0.3;
    font-size: 18px;
  }
}
</style>
