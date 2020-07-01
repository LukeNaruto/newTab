<template>
  <div class="search-tool" ref="search_tool" @dblclick.stop  @contextmenu.stop>
    <div class="search-logo" v-if="showSearchLogo">
      <img class="logo-img" :src="searchLogo" alt="" />
    </div>
    <div class="search-tool-box" :class="{ white: getUseSkinTypeId === 1 && !getIndividuation.isShowWallpaper }">
      <div class="search-input-box" :class="{ active: getIsSearchActive && getUseSkinTypeId === 1 && !getIndividuation.isShowWallpaper }">
        <search-engines />
        <search-input />
      </div>
      <div class="search-btn" @click.prevent="clickSearchBtn">
        <span class="iconfont icon-search-px"></span>
      </div>
      <search-association />
      <!-- <search-hot-words /> -->
    </div>
  </div>
</template>

<script>
import SearchEngines from "_c/SearchTool/SearchEngines";
import SearchInput from "_c/SearchTool/SearchInput";
import SearchAssociation from "_c/SearchTool/SearchAssociation";
import { mapGetters } from "vuex";
import { windowOpenUrl } from '@/libs/arrHandle';
export default {
  name: "SearchTool",
  components: {
    SearchEngines,
    SearchInput,
    SearchAssociation,
  },
  computed: {
    ...mapGetters([
      "getSearchEngine",
      "getUseSkinTypeId",
      "getIsSearchActive",
      "getSearchText",
      "getUseFontColor",
      'getRhash',
      'getTheme',
      'getIndividuation'
    ]),
    showSearchLogo() {
      /* return localStorage.getItem("router-hash")
        ? localStorage.getItem("router-hash") == "portal"
        : true; */
        return this.getRhash == "portal";
    },
    searchLogo() {
      // console.log(this);
      return this.getTheme === 'black'
        ? this.getSearchEngine.lo
        : this.getSearchEngine.lg;
    }
  },
  data() {
    return {};
  },
  mounted(){
    this.zoomInOut();
    window.addEventListener('resize',this.zoomInOut);
  },
  destroyed(){
    window.removeEventListener('resize',this.zoomInOut);
  },
  methods: {
    clickSearchBtn() {
      let u = this.getSearchEngine.m, w = this.getSearchText;
      windowOpenUrl({
        u,
        w,
        t: 2
      })
    },
    zoomInOut(){
      let areaWidth  = document.documentElement.offsetWidth,
          areaHeight = document.documentElement.offsetHeight,
          ratio_ = areaWidth / areaHeight,
          r = 3 / 2,
          areaW = ratio_ > r ? areaHeight * r : areaWidth;
      let scale = Math.floor((areaW / 1200 > 1 ? 1 : areaW / 1200) * 100) / 90;
      this.$refs.search_tool.style.setProperty('transform', 'scale('+ scale +')');
    }
  }
};
</script>

<style lang="less" scoped>
.search-tool {
  position: relative;
  max-width: 680px;
  width: 88%;
  min-height: 52px;
  display: flex;
  flex-direction: column;
  z-index: 9;
  .search-tool-box {
    height: 52px;
    display: flex;
    position: relative;
    border-radius: 5px;
    // box-shadow: 0 4px 4px 0 rgba(0, 0, 0, 0.04);
    line-height: 50px;
    z-index: 2;

    &.white {
      box-shadow: 0 6px 16px rgba(0, 0, 0, 0.1);
    }

    .search-input-box {
      border: 1px solid rgba(0, 0, 0, 0.1);
      border-right: 0 none;
      border-radius: 5px 0 0 5px;
      background-color: rgba(255, 255, 255, 0.96);
      display: flex;
      flex: 1;
      transition: all 0.15s linear;
      &.active {
        border-color: #009aff;
      }
    }
  }
  .search-logo {
    .logo-img {
      width: 320px;
      display: block;
      margin: 0 auto 36px;
    }
  }
}
.search-btn {
  width: 80px;
  min-width: 80px;
  height: 52px;
  background-color: #009aff;
  text-align: center;
  border-radius: 0 5px 5px 0;
  line-height: 52px;
  cursor: pointer;
  .icon-search-px {
    color: #fff;
    font-size: 20px;
  }
  &:hover {
    background-color: #14a3ff;
  }
}
.allScreen {
  .search-tool-box {
    box-shadow: none;
    &.white {
      box-shadow: 0 6px 16px rgba(0, 0, 0, 0.1);
    }
    // box-shadow: 0 4px 4px rgba(0, 0, 0, 0.04);
    .search-input-box {
      transition: all 0.3s linear;
      border-color: rgba(0, 0, 0, 0.1);
    }
    &.active {
      border-color: #009aff;
    }
  }
}
</style>
