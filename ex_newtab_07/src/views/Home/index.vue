<template>
  <div @contextmenu.stop ref="home_body" class="home" :class="{ 'show-edit' : showEdit }" id="home_content">
    <div @contextmenu.prevent="showContextmenuFn" ref="homeContent" class="home-content">
      <SearchTool style="margin: 0 auto 0;" />
      <ShortcutListBox :position_="position" />
    </div>
    <!-- <button @click.stop="swtichShortcutManager" class="operation-shortcut-btn">快捷图标操作</button> -->
    
  </div>
</template>

<script>
import SearchTool from '_c/SearchTool/'
import ShortcutListBox from '_c/Shortcut/ShortcutListBox'
import { mapGetters } from 'vuex'
  export default {
    name: 'Home',
    components: {
      SearchTool,
      ShortcutListBox,
    },
    computed: {
      ...mapGetters([
        'getShowContextmenu',
        'getShowManageType'
      ]),
      showEdit(){
        return this.getShowManageType === 'shortcutManager';
      },
      showContext(){
        return this.getShowManageType === 'contextMenu';
      }
    },
    data() {
      return {
        contextMenu: false,
        position: {},
      }
    },
    mounted(){
      this.zoomInOut();
      window.addEventListener('resize',this.zoomInOut);
    },
    destroyed(){
      window.removeEventListener('resize',this.zoomInOut);
    },
    methods: {
      zoomInOut(){
        let areaHeight = document.documentElement.offsetHeight;
        this.$refs.homeContent.style.height = areaHeight - 200 + 'px';
      },
      swtichShortcutManager(){
        this.$store.commit('setShowManageType', 'shortcutManager');
      },
      showContextmenuFn(){
        let e = event || window.event;
        if(this.showEdit) return;
        this.position = {  
          x: e.x,
          y: e.y
        };
        this.$store.commit('setShowManageType', '');
        this.$nextTick(()=>{
          this.$store.commit('setShowManageType', 'contextMenu');
        })
      },
    }
  }
</script>

<style lang="less" scoped>
  .home{
    /* width: 100%;
    height: 100%;
    min-height: 100%;
    position: absolute;
    top: 0;
    left: 0;
    overflow: hidden; */
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    transition: all .5s;
    overflow: hidden;
    &.show-edit{
      width: calc(100% - 400px);
    }
    .home-content{
      /* width: 100%;
      height: 100%;
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      .shortcut-box{
        width: 600px;
        height: 300px;
        background-color: rgba(255,255,255, .3);
      } */
      position: absolute;
      left: 0;
      right: 0;
      top: 0;
      bottom: 0;
      margin: auto;
      max-height: 570px;
    }
    .operation-shortcut-btn{
      position: absolute;
      right: 20px;
      bottom: 20px
    }
  }
  .search-tool{
    margin-bottom: 150px;
  }
</style>