<template>
  <div ref="contextMenu_" :style="{'top': position_.y + 'px', 'left': position_.x + 'px'}" class="home-body-contextmenu">
    <div v-for="item in menuList" @click.stop="showManageFn(item.action)" :key="item.id" class="munu-item">{{ item.name }}</div>
  </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'
export default {
  name: 'HomeBodyContextMenu',
  props:['position','item'],
  data() {
    return {
      menuList: [
        { id: 1, name: '打开', action: 'skip' },
        { id: 3, name: '删除', action: 'delete' },
        { id: 4, name: '图标管理', action: 'shortcutManager' },
      ],
      position_:null
    }
  },
  computed: {
      ...mapGetters([
        'getShowManageType'
      ]),
      showContext(){
        return this.getShowManageType === 'contextMenu';
      }
    },
  watch:{
    position(val){
      if(val.x && val.y) this.formatPos(val);
    }
  },
  created(){
    this.$store.commit("setIsShowSkinManage", false);
    this.position_ = this.position;
    if(this.item.isCustom){
      let custom = { id: 2, name: '编辑', action: 'edit' };
      this.menuList.splice(1,0,custom);
    }
    if(!this.item._id){
      this.menuList = [{ id: 4, name: '图标管理', action: 'shortcutManager' }];
    }
  },
  mounted(){
    this.formatPos(this.position);
  },
  methods: {
    ...mapActions(['removeShortcutFn', 'clickShortcutFn']),
    showManageFn (ac) {
      switch(ac){
        case 'skip':
          this.clickShortcutFn(this.item);
          this.$store.commit('setShowManageType', '');
          break;
        case 'edit':
          this.$store.commit('setEditCustom', this.item);//右键编辑打开图标管理，跳到自定义图标编辑
          this.$store.commit('setShowManageType', 'shortcutManager');
          break;
        case 'delete':
          this.item.small = true;
          setTimeout(()=>{
            this.item.small = false;
            this.removeShortcutFn(this.item);
          },500);
          
          this.$store.commit('setShowManageType', '');
          break;
        default:
          this.$store.commit('setShowManageType', ac);
          break;
      }
      
    },
    formatPos(opts){
      let el = this.$refs.contextMenu_,
          w = 126,
          h = 156,
          screenX = document.documentElement.clientWidth,
          screenY = document.documentElement.clientHeight,
          maxL = screenX - w,
          maxT = screenY - h;
      this.position_.y = opts.y > maxT ? maxT : opts.y;
      this.position_.x = opts.x > maxL ? maxL : opts.x;
    },
  }
}
</script>

<style lang="less" scoped>
  .home-body-contextmenu{
    position: fixed;
    top: 0;
    background-color: #fff;
    border-radius: 3px;
    padding: 6px 0;
    border: 1px solid rgba(0, 0, 0, .1);
    box-shadow: 0 6px 16px rgba(0, 0, 0, .1);
    z-index: 9;
    .munu-item{
      padding: 8px 30px 8px 20px;
      cursor: pointer;
      &:hover{
        background-color: #f0f0f0;
      }
    }
  }
</style>