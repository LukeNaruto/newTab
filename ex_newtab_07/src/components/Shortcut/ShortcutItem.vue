<template>
<transition name="ani">
  <div :class="{'scale-small': showEdit ? scale_small : item.small, opacity0: drag_id === item._id}" class="list-item">
    <div :class="{ addani : addani && showEdit }" :id="item._id" class="list-item-box">
      <div @mousedown.stop="clickShortcutFn_" @contextmenu.prevent.stop="showContextmenuFn(item)" :style="{ 'background-image': 'url('+ item.ic +')','background-color': item.bgColor ? item.bgColor : 'none' }" @dblclick.stop :class="{shake : showEdit}" class="shortcut-img">{{ !item.ic ? item.t.substr(0,2) : '' }}
        <span v-show="showEdit" @click.stop="removeShortcutFn_(item)" class="  remove-shortcut-btn"></span>
      </div>
      <div class="shortcut-title" :class="{'text-shadow': textShadow}" v-cloak :title="item.t || '-'">
        {{ item.t || '-' }} 
      </div>
    </div>
  </div>
</transition>
  
</template>

<script>
import { mapGetters, mapActions } from 'vuex'
export default {
  name: 'ShortcutItem',
  data() {
    return {
      position: {},
      scale_small: false,
      addani: false,
      textShadow: false,
      dragShake: 0,
    }
  },
  props: ['item','drag_id'],
  computed: {
    ...mapGetters([
      'getShortcutListInfo',
      'getShowManageType',
      'getUseSkinTypeId',
      'getUseFontColor',
      'getIsShowSkinManage'
    ]),
    showEdit(){
      return this.getShowManageType === 'shortcutManager';
    },
    showContext(){
      return this.getShowManageType === 'contextMenu';
    }
  },
  created(){
    this.addani = this.item.addani;
    this.textShadow = !this.getUseFontColor;
  },
  watch:{
    'getUseFontColor'(val){
      this.textShadow = !val;
    }
  },
  mounted(){
    setTimeout(()=>{
      this.addani = false;
    },500)
  },
  methods:{
    ...mapActions(['removeShortcutFn', 'clickShortcutFn']),
    removeShortcutFn_(item){
      this.scale_small = true;
      setTimeout(()=>{
        this.removeShortcutFn(item);
      },500);
    },
    clickShortcutFn_(ev){
      if(ev.button) return;
      let item = this.item;
      this.dragShake = 0;
      let even_finish = () => {
        if(this.dragShake < 3){
          this.clickShortcutFn(item);
        }
        this.$parent.$parent.dragXY(null);
        document.body.removeEventListener('mousemove',even_move);
        document.body.removeEventListener('mouseup',even_finish);
        document.body.removeEventListener('mouseleave',even_finish);
        setTimeout(()=>{
          this.dragShake = 0;
        },200);
      }
      let even_move = (e) => {
        // if(item.is === 1) return;
        ++this.dragShake;
        if(this.dragShake < 3)return;
        if(this.getShowManageType || this.getIsShowSkinManage) return;
        item.x = e.x;
        item.y = e.y;
        this.$parent.$parent.dragXY(item);
      }
      document.body.addEventListener('mousemove',even_move);
      document.body.addEventListener('mouseup',even_finish);
      document.body.addEventListener('mouseleave',even_finish);
    },
    showContextmenuFn(item){
      let e = event || window.event;
      if(this.showEdit) return;
      this.position = {
        x: e.x,
        y: e.y
      };
      this.$emit('even_context',this.position,item);
    },
    
  },
  filters: {
    subtitle: function (val){
      if(val.length){
        return val.substring(0, 2);
      }
    }
  }
}
</script>

<style lang="less" scoped>

  .list-item{
    width: var(--icon-box-size);
    height: var(--icon-box-size);
    display: inline-flex;
    vertical-align: top;
    justify-content: center;
    align-items: center; position: relative; 
    // box-shadow: 0 0 1px #fff;
    transition: all .5s, opacity 0s;  
    &:active{
      transform: scale( 1, 1 );
    }
    &.scale-small{
      width: 0;
      .list-item-box{
        position: relative;
        left: calc(var(--icon-box-size)/2 - 50%);
      }
      .shortcut-img, .shortcut-title{
        transform: scale(0)!important;
        animation: none!important;
      }
    }
    &.opacity0{
      opacity: 0;
    }
  }
  .list-item-box{
    // box-shadow: 0 0 1px #f1f1f1;
  }
  
  .addani{
    animation: addin .5s; 
  }

  .shortcut-title{
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    width: var(--icon-size);
    font-size: calc(var(--icon-box-size) * .073);
    color: var(--main-color);
    text-align: center; margin-top: 10%; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;
    &.text-shadow{
      text-shadow: 0 3px 10px rgba(0, 0, 0, 0.4);
    }
  }
  .shortcut-img{
    position: relative; 
    width: var(--icon-size);
    height: var(--icon-size);
    line-height: var(--icon-size); 
    margin: 6px 0;  
    font-size: calc(var(--icon-size) * .3); 
    color: #fff;
    background-repeat: no-repeat; 
    background-size: contain; 
    border-radius: 50%;
    text-align: center;
    transition: all .5s;
    cursor: pointer;
    &:hover{
      transform: scale( 1.1, 1.1 );
    }
    &.shake{
      animation: shake .32s infinite ease-in-out;
      &:hover{
        animation: none; transform: scale( 1, 1 );
      }
    }
  }
  .remove-shortcut-btn{
    position: absolute; 
    top: 0; 
    right: 0;
    max-width: 24px; 
    max-height: 24px; 
    width: 24%;
    height: 24%;
    background: #e81123 url('../../assets/img/close.png') no-repeat center;
    background-size: 35%;
    border-radius: 50%; 
    cursor: pointer;
    &:hover{
      background-color: #da1021;
    }
  }
  .link-sign{
    width: 20px; height: 20px; line-height: 20px; display: block; background-color: rgba( 0, 139, 230, 1); border: 1px solid rgba( 0, 0, 0, .1); border-radius: 50%; position: absolute; top: 76px; right: 12px; text-align: center;
  }
  






  .shortcut-item{
    width: 100%;
    img{
      width: 100%;
      overflow: hidden;
      border-radius: 50%;
    }
    .title{
      text-align: center;
    }
  }
  @keyframes shake{ 0%{ transform: rotate( 0deg ) }  25%{ transform: rotate( -2deg ) } 50%{ transform: rotate( 0deg ) } 75%{ transform: rotate( 2deg ) } 100%{ transform: rotate( 0deg ) } };
  @keyframes addin{ from { transform: scale( 0, 0 ); } to{ transform: scale( 1, 1 ); } }
</style>