<template>
  <div class="search-engins">
    <div class="search-engine">
      <span class="engine-span" @click.stop="showSearchEnginesFn">
        <img class="engine-icon" :src="getSearchEngine.ic !== undefined ? getSearchEngine.ic : ''" alt="" />
      </span>
    </div>

    <!-- 搜索引擎选择列表 -- start -->
    <div class="search-engine-list" :class="{ white: getUseSkinTypeId === 1 && !getIndividuation.isShowWallpaper }" v-show="showSearchEngines" v-cloak>
      <div
        class="search-engine-item"
        :key="item.key"
        v-for="item in getSearchEngineList"
        @click.stop="changSearchEngineFn(item)"
      >
        <span class="engine-span">
          <img class="engine-icon" :src="item.ic" alt="" />
        </span>
        <span class="title">{{ item.t }}</span>
      </div>
    </div>
    <!-- 搜索引擎选择列表 -- end -->
  </div>
</template>

<script>
import { mapGetters, mapActions } from "vuex";
export default {
  name: "SearchEngines",
  data() {
    return {
      showSearchEngines: false
      // searchModel: {
      //   id: 1,
      //   title: '百度',
      //   name: 'searchModel',
      //   icon: '#icon-baidusousuoico',
      //   url: 'https://www.baidu.com/s?wd='
      // },
    };
  },
  computed: {
    ...mapGetters(["getSearchEngine", "getSearchEngineList", "getUseSkinTypeId", "getIndividuation"])
  },
  created() {
    document.body.addEventListener("click", () => {
      this.showSearchEngines = false;
    });
  },
  methods: {
    ...mapActions(["setDBSearchEngine"]),
    showSearchEnginesFn() {
      if (this.getSearchEngineList.length) {
        this.showSearchEngines = !this.showSearchEngines;
      }
    },
    changSearchEngineFn(item) {
      this.setDBSearchEngine({ searchEngine: item }).then(res => {
        // console.log(res)
      });
      this.showSearchEngines = false;
    }
  }
};
</script>

<style lang="less" scoped>
.search-engine {
  width: 28px;
  height: 28px;
  background-color: #fff;
  border-radius: 50%;
  margin: 11px 12px 0 18px;
  .engine-span {
    height: 100%;
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    // line-height: 28px;
    // display: block;
    // text-align: center;
    cursor: pointer;
    background-color: #eee;
    border-radius: 50%;
    // .engine-icon {
    //   width: 14px;
    //   // width: 100%;
    //   // height: 16px;
    //   // vertical-align: -4px;
    // }
  }
}
.search-engine-list {
  // min-width: 114px;
  width: 112px;
  background-color: rgba(255, 255, 255);
  position: absolute;
  top: 55px;
  border-radius: 3px;
  padding: 1px;
  &.white {
    padding: 0;
    border: 1px solid rgba(0, 0, 0, 0.1);
    box-shadow: 0 6px 16px rgba(0, 0, 0, 0.1);
  }

  .search-engine-item {
    height: 35px;
    display: flex;
    align-items: center;
    justify-content: flex-start;
    cursor: pointer;
    padding: 0 10px;
    line-height: 35px;

    .engine-span {
      height: 100%;
      display: flex;
      align-items: center;
      justify-content: center;
      margin: 0 8px 0 2px;

      // .engine-icon {
      //   width: 14px;
      //   height: 14px;
      //   // vertical-align: -4px;
      // }
    }
  }
  :hover {
    background-color: rgba(255, 255, 255, 0.8);
    .title {
      color: rgb(0, 126, 255);
    }
  }
}
</style>
