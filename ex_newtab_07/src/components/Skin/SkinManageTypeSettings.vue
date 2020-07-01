<template>
  <div class="skin-manage-setting">
    <div class="manage-setting-item">
      <div class="setting-title">双击空白隐藏/显示页面内容</div>
      <SwitchCom v-model="individuation_.doubleClickIsShow" :did="'doubleClickIsShow'" v-on:change="onChange" />
    </div>
    <div class="manage-setting-item">
      <div class="setting-title">新标签页设置为空白页</div>
      <SwitchCom v-model="individuation_.isEmptyCon" :did="'isEmptyCon'" v-on:change="onChange" />
    </div>
    <div class="manage-setting-item" v-if="getUseSkinTypeId === 1 && ['home','portal'].includes(getRhash)">
      <div class="setting-title">新标签页显示背景壁纸</div>
      <SwitchCom v-model="individuation_.isShowWallpaper" :did="'isShowWallpaper'" v-on:change="onChange" />
    </div>
    
    <div class="manage-setting-item" v-if="getUseSkinTypeId === 3">
      <div class="setting-title">动态屏皮肤不间断播放</div>
      <SwitchCom v-model="individuation_.skin_play_mode" :did="'skin_play_mode'" v-on:change="onChange" />
    </div>
    <div class="manage-setting-item" v-if="false">
      <div class="setting-title">新标签页使用空白壁纸</div>
      <SwitchCom v-model="individuation_.isEmptyBg" :did="'isEmptyBg'" v-on:change="onChange" />
    </div>
    <div class="manage-setting-item" v-if="false">
      <div class="setting-title">隐藏新标签页壁纸功能按钮</div>
      <SwitchCom v-model="individuation_.isShowWallpaper" :did="'isShowWallpaper'"  v-on:change="onChange" />
    </div>
    <div class="manage-setting-item" v-if="false">
      <div class="setting-title">显示随身书签二维码按钮</div>
      <SwitchCom v-model="individuation_.isShowBookmarkBtn" :did="'isShowBookmarkBtn'" v-on:change="onChange" />
    </div>
  </div>
</template>

<script>
import SwitchCom from '_c/Individuation/SwitchCom'
import { mapGetters, mapActions } from 'vuex'
  export default {
    name: 'SkinManageTypeSettings',
    components: {
      SwitchCom
    },
    data() {
      return {
        individuation_: {
          isShowWallpaper: true,
        },
      }
    },
    computed: {
      ...mapGetters([
        'getUseSkinTypeId',
        'getIndividuation',
        'getRhash',
        "getUserData",
      ])
    },
    created () {
      /**
       * 1:  ' type_1'默认值 – 经典皮肤
          2：' type_2', - 全面屏皮肤
        3：‘type_3 -动态皮肤
        4：’type_4 – 夜间模式
        5：’type_5 –自定义皮肤}
        
       */
      this.individuation_ = this.getIndividuation;
    },
    methods: {
      ...mapActions(['setIndividuation','getDBWallpaper','getApiWallpaperList']),
      onChange (type, value) {
        // console.log('change----123-', type, value)
        this.individuation_[type] = value;
        this.setIndividuation(this.individuation_);
        
        // 切换壁纸时，从服务端获取数据
        if (type === 'isShowWallpaper' && value === true) {
          // 获取壁纸数据，通过user_id（本地数据库）
          this.getDBWallpaper(this.getUserData.user_id);
    
          // 获取壁纸列表（服务端）
          this.getApiWallpaperList(this.getUserData.user_id);
        }
      }
    }
  }
</script>

<style lang="less" scoped>
  .skin-manage-setting{
    padding: 20px;
    color: rgba(255,255,255,.6);
    .manage-setting-item{
      display: flex;
      justify-content: space-between;
      margin: 14px 0;
      .setting-title{
        color: rgba(255,255,255,.9);
      }
    }
  }
</style>