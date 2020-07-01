<template>
  <div @contextmenu.prevent ref="shortcut_area" style="--icon-box-size: 220px;--icon-size: 100px;" class="con-shortcut">
    
    <div class="shortcut-list" v-if="shortcutPageArr.length > 0" v-cloak>
      <div v-if="dragItem && shortcutPageArr.length > 1" :class="{blink: this.blink === 'left'}" class="drag-page-turn left"></div>
      <transition-group name="list-page" tag="div" v-on:enter="shortcutEnterFn" v-on:leave="shortcutLeaveFn" v-on:before-enter="shortcutBeforeEnterFn">
        <div v-for="(page, index) in shortcutPageArr" v-show="index == pageIndex" :data-key="index" :key="index" :class="{ 'list-page-enter-to' : index == 0 }" class="list-page">
          <div class="list-box clr">
            <div v-for="item in page" :ref="item._id" :key="item._id" :style="{transition: 'transform .2s linear'}" class="floatL clr">
              <ShortcutItem @even_context="showContextmenuFn_" :item="item" :drag_id="dragItem_id" />
            </div>
          </div>
        </div> 
      </transition-group>
      <div v-if="dragItem && shortcutPageArr.length > 1" :class="{blink: this.blink === 'right'}" class="drag-page-turn right"></div>
    </div>
    <div :class="{'light': getTheme === 'black'}" class="shortcut-switch" v-show="shortcutPageArr.length > 1">
      <span v-for="(item, index) in shortcutPageArr" @click.stop="switchPageIndexFn(index)" :class="{ active: index == pageIndex }" class="shortcut-switch-item" :key="index"></span>
    </div>
    <div v-if="dragItem" ref="drag" class="drag">
      <div :style="{ transform: 'translate('+ x + ','+ y  +')', transition: dragTransition}">
        <div :style="{ 'background-image': 'url('+ dragItem.ic +')','background-color': dragItem.bgColor ? dragItem.bgColor : 'none' }" class="shortcut-img">
          {{ !dragItem.ic ? dragItem.t.substr(0,2) : '' }}
        </div>
        <div  class="shortcut-title" v-cloak :title="dragItem.t || '-'">
          {{ dragItem.t || '-' }} 
        </div>
      </div>
    </div>
    <HomeBodyContextMenu v-if="showContext && !getApiError" :position="position" :item="curItem" />
  </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'
import ShortcutItem from '_c/Shortcut/ShortcutItem'
import HomeBodyContextMenu from '_c/ContextMenu/HomeBodyContextMenu'
import defaultData from '@/api/defaultData';
import { getDomOffset, getIndexByPosition } from '@/libs/arrHandle'
export default {
  name: 'ShortcutListBox',
  data() {
    return {
      pageIndex: 0,
      oldPageIndex: 0,
      shortcutPageArr: [],
      pageCount: 1,
      pageCapacity: 10,
      islock: true,

      listInfo_: [],
      loading: true,
      position: {},
      curItem: {},

      aniTimer: null,// 翻页动画定时器
      iconSize: 0,

      dragItem: null,
      dragItem_id: '',
      dragItem_index: '',
      x:'0',
      y:'0',
      dragTransition: '',
      toTopOffset: null,
      homeOffset: null,

      insertTimer: null,//拖拽定时器
      dragAnimSecond: 190,
      blink: '',//css
      pageTurnTimer: null,//拖拽跨页，数据变动定时器
    }
  },
  props:['position_'],
  components: {
    ShortcutItem,
    HomeBodyContextMenu
  },
  computed: {
    ...mapGetters([
      'getShortcutListInfo',
      'getShowManageType',
      'getTheme',
      'getApiError'
    ]),
    showEdit(){
      return this.getShowManageType === 'shortcutManager';
    },
    showContext(){
      return this.getShowManageType === 'contextMenu';
    },
    curPageData(){
      return this.shortcutPageArr[this.pageIndex];
    }
  },
  created(){
    this.listInfo_ = [...this.getShortcutListInfo];
    let first = localStorage.getItem('firstNoNet');
    if(localStorage.getItem('firstNoNet') === null){
      this.listInfo_ = defaultData.shortcutArr;
    }
    
  },
  watch: {
    position_(val){
      if(val.x && val.y){
        this.position = val;
        this.curItem = {};
      }
    },
    getShortcutListInfo(val,val_){
      // console.log('home-watch-1111--',val,val_,this.showEdit);
      if(localStorage.getItem('firstNoNet') === null) return;
      this.listInfo_ = [...this.getShortcutListInfo];
      if(val.length > val_.length && val_.length > 0){
        if(this.showEdit){
          this.oldPageIndex = this.pageIndex;
          this.pageIndex = Math.ceil(val.length / 10) - 1;
        }
        clearTimeout(this.aniTimer);
        this.aniTimer = setTimeout(()=>{
          let list = [...val];
          for(let i=0,len=list.length;len>i;i++){
            list[i].addani = false;
          }
          this.setShortcutListInfo(list);
        },500);
        // // console.log('home-watch-2222--', this.pageIndex, Math.ceil(val.length / 10))
      }
      if(val.sys && val_.length > 0){
        this.oldPageIndex = this.pageIndex;
        this.pageIndex = 0;
      }

      this.toTopOffset = getDomOffset(this.$refs.shortcut_area);
      // // console.log('home-watch-3333--',val.length,val_.length,this.pageIndex);
      this.initShortcutPageArr();
    },
    showEdit(val){
      this.zoomInOut();
    }
  },
  mounted(){
    this.initShortcutPageArr();
    this.zoomInOut();
    window.addEventListener('resize',this.zoomInOut);
    document.getElementById('home_content').addEventListener('mousewheel', this.onmousewheelFn, false);
  },
  destroyed(){
    window.removeEventListener('resize',this.zoomInOut);
  },
  methods:{
    // 初始化快捷方式分页数组
    ...mapActions(['setShortcutListInfo']),
    dragXY(d){
      // console.log('dragXY',d,this.dragItem,d===this.dragItem)
      clearTimeout(this.insertTimer);
      this.dragTransition = '';
      if(d) {// 拖拽
        // console.log(d.t,d.x,d.y,this.dragItem_index)
        this.islock = false;
        let offset = this.iconSize/4 > 50 ? 50 : this.iconSize/4;
        this.x = d.x - offset +'px';
        this.y = d.y - offset +'px';
        // this.$refs.drag.onmouseMove
        this.dragItem = d;
        this.homeOffset = {
          x: d.x - this.toTopOffset.x,
          y: d.y - this.toTopOffset.y,
          size: this.iconSize
        };
        // console.log(this.homeOffset.x,this.homeOffset.y);
        
        if(this.dragItem_index === ''){
          this.dragItem_id = this.dragItem._id;
          this.dragItem_index = this.shortcutPageArr[this.pageIndex].findIndex(item =>{
            return item._id === this.dragItem._id;
          });
        }
        if(this.homeOffset.x<0 || this.homeOffset.x > this.iconSize * 5 || this.homeOffset.y < 0 || this.homeOffset.y > this.iconSize * 2){
          this.pageTurn(d.x);
        }else{
          this.animInsert();
        }
      } else if(this.dragItem) {//拖拽释放
        clearInterval(this.pageTurnTimer);
        this.pageTurnTimer = null;
        this.blink = '';
        this.islock = true;
        let index = this.dragItem_index;
        let o = getDomOffset(document.getElementById(this.dragItem._id), false);
        this.dragTransition = 'transform .2s linear';
        this.x = this.toTopOffset.x + this.iconSize * (index % 5) + o.x + 'px';
        this.y = this.toTopOffset.y + this.iconSize * Math.floor(index / 5) + o.y + 'px';
        setTimeout(()=>{
          let index_ = this.listInfo_.findIndex(item => {
            return item._id === this.dragItem._id;
          });
          let index = this.getShortcutListInfo.findIndex(item => {
            return item._id === this.dragItem._id;
          });
          if(index !== index_){
            let item = this.listInfo_[index_];
            item.edit = 'drag';
            item.drag_index = index_;
            this.listInfo_.item = item;
            this.setShortcutListInfo(this.listInfo_);
          }
          this.dragItem = null;
          this.dragItem_index = '';
          this.dragItem_id = '';
        },this.dragAnimSecond);
      }
    },
    turnRuning(increment=true){
      let len = this.shortcutPageArr.length,index = this.pageIndex;
      if(increment){
        ++index;
        index = index >= len ? 0 : index;
      }else{
        --index;
        index = index < 0 ? len - 1 : index;
      }
      this.pageIndex =  index;
      this.listInfoTurn();
    },
    pageTurn(x){
      let w = window.innerWidth;
      if(this.shortcutPageArr.length < 2) return;
      if(w - x <= 100){
        this.blink = 'right';
        if(!this.pageTurnTimer) {
          this.turnRuning();
          this.pageTurnTimer = setInterval(this.turnRuning, 1000);
        }
      }else if(x < 100){
        this.blink = 'left';
        if(!this.pageTurnTimer) {
          this.turnRuning();
          this.pageTurnTimer = setInterval(this.turnRuning, 1000, false);
        }
      }else{
        this.blink = '';
        clearInterval(this.pageTurnTimer);
        this.pageTurnTimer = null;
      }
    },
    listInfoTurn(){
      let i = this.listInfo_.findIndex(item => {
        return item._id === this.dragItem_id;
      });
      let count = this.curPageData.length - 1;
      let item  = this.listInfo_.splice(i,1);
      this.listInfo_.splice(this.pageIndex * 10 + count, 0, item[0]);
      this.dragItem_index = count;
      this.initShortcutPageArr();
    },
    animInsert(){
      let hover_i = getIndexByPosition(this.homeOffset);//鼠标途径的icon index
      let _hover_i = Math.round(hover_i);
      let leftSide = this.dragItem_index > _hover_i;
      if(_hover_i === this.dragItem_index || _hover_i > this.curPageData.length - 1)return;
      this.insertTimer = setTimeout(()=>{
        // console.log('--1--',hover_i, this.dragItem_index, this.curPageData.length);
        this.curPageData.forEach((item, index) =>{
          let transformStr;
          if(!leftSide && index > this.dragItem_index && index < hover_i){
            if(index === 5){
              transformStr = 'translate('+ 4 * this.iconSize +'px,'+ -this.iconSize +'px)';
            }else{
              transformStr = 'translate(-'+ this.iconSize +'px,0)';
            }
          }else if(leftSide && index < this.dragItem_index && index > hover_i){
            if(index === 4){
              transformStr = 'translate(-'+ 4 * this.iconSize +'px,'+ this.iconSize +'px)';
            }else{
              transformStr = 'translate('+ this.iconSize +'px,0)';
            }
          }
          this.$refs[item._id][0].style.transition = 'transform '+ this.dragAnimSecond/1000+'s ease-in';
          this.$refs[item._id][0].style.transform = transformStr;
        });
        
        let item = this.listInfo_.splice(this.dragItem_index + this.pageIndex *10, 1);
        let insert = leftSide ? _hover_i + 1 : _hover_i;
        this.listInfo_.splice(insert+ this.pageIndex *10, 0, item[0]);
        this.dragItem_index = insert;
        setTimeout(()=>{
          this.curPageData.forEach(item =>{
            this.$refs[item._id][0].style.transform = '';
            this.$refs[item._id][0].style.transition = '';
          });

          this.initShortcutPageArr();
        }, this.dragAnimSecond);
      }, 20);
    },
    zoomInOut(){
      let areaWidth  = document.documentElement.offsetWidth;
      let areaHeight = document.documentElement.offsetHeight;
      areaWidth = this.showEdit ? areaWidth - 140 : areaWidth;
      let ratio_ = areaWidth / areaHeight;
      let shortcutAreaW, iconSize;
      const r = 3 / 2, triggerWidth = 260;
      if(ratio_ > r){
        shortcutAreaW = areaHeight * r - triggerWidth;
      } else {
        shortcutAreaW = areaWidth - triggerWidth;
      }
      iconSize = shortcutAreaW / 5 > 220 ? 220 : shortcutAreaW / 5;
      iconSize = iconSize - (iconSize % 4);
      this.iconSize = iconSize;
      this.$refs.shortcut_area.style.setProperty('width', iconSize * 5 + 'px');
      this.$refs.shortcut_area.style.setProperty('height', iconSize * 2 + 'px');
      this.$refs.shortcut_area.style.setProperty('--icon-box-size', iconSize + 'px');
      this.$refs.shortcut_area.style.setProperty('--icon-size', (iconSize >= 200 ? 100 : iconSize/2) + 'px');
      clearTimeout(this.aniTimer);
      this.aniTimer = setTimeout(()=>{
        this.toTopOffset = getDomOffset(this.$refs.shortcut_area);
      },500);
    },
    showContextmenuFn_(p,item){
      this.position = p;
      this.curItem = item;
      this.$store.commit('setShowManageType', '');
      this.$nextTick(()=>{
        this.$store.commit('setShowManageType', 'contextMenu');
      })
    },
    initShortcutPageArr: function () {
      // console.log('initShortcutPageArr----11----',this.pageIndex,this.shortcutPageArr.length)
      this.isClickChangePage = true;
      let new_shortcutPageArr = [];
      let arr = [];
      let len = this.listInfo_.length;
      this.pageCount = Math.ceil(len/this.pageCapacity);
      for(let i = 0; i < len; i ++){
        arr.push(this.listInfo_[i]);
      };
      for(let i = 0, len = arr.length; i < len; i++){
        let j = Math.floor(i/10);
        new_shortcutPageArr[j] = new_shortcutPageArr[j] || [];
        new_shortcutPageArr[j].push(arr[i]);
      }
      this.shortcutPageArr.splice(0);
      this.shortcutPageArr.splice(0,0,...new_shortcutPageArr);
      this.pageIndex = this.pageCount == this.pageIndex ? this.pageIndex -1 : this.pageIndex;
      this.pageIndex = this.pageIndex == -1 ? 0 : this.pageIndex;
      // // console.log('initShortcutPageArr----22----',this.pageIndex,this.shortcutPageArr.length)
      
    },
    shortcutEnterFn: function (el) {
      setTimeout(() => {
        el.style.left = '0';
        el.style.opacity = 1;
      },300)
      
    },
    shortcutLeaveFn: function (el) {
      this.oldPageIndex = el.getAttribute('data-key');
      if(!this.isClickChangePage){
        el.style.left = this.isWheelUP ? '-1200px' : '1200px';
      }else{
        if(this.pageIndex > this.oldPageIndex){
          el.style.left =  '-1200px';
        }else{
          el.style.left = '1200px';
        }
      }
    },
    shortcutBeforeEnterFn: function (el){
      el.style.opacity = 0;
      if(!this.isClickChangePage){
        el.style.left =  this.isWheelUP ? '1200px' : '-1200px';
      }else{
        if(this.pageIndex > this.oldPageIndex){
          el.style.left = '1200px';
        }else{
          el.style.left = '-1200px';
        }
      }
    },
    onmousewheelFn: function (e){
      if(this.islock){
        this.islock = false;
        this.oldPageIndex = this.pageIndex;
        this.isClickChangePage = false;
        if(this.showContext)this.$store.commit('setShowManageType', '');
        if(e.wheelDelta > 0){
          this.pageIndex <= 0 ? this.pageIndex = this.pageCount -1 : this.pageIndex--;
          this.isWheelUP = false;
        }else{
          this.pageIndex >= (this.pageCount - 1) ? this.pageIndex = 0 : this.pageIndex++;
          this.isWheelUP = true;
        }
        setTimeout(() => {
          this.islock = true;
        }, 200);
      }
    },
    // 切换分页方法
    switchPageIndexFn: function (index) {
      this.oldPageIndex = this.pageIndex;
      this.isClickChangePage = true;
      this.pageIndex = index;
      if(this.showContext ){
        this.$store.commit('setShowManageType', '');
      }
    },
  }
}
</script>

<style lang="less" scoped>
  .con-shortcut{
    max-width: 1100px; 
    max-height: 440px;
    margin: calc(var(--icon-box-size) * .4) auto;
    transition: all .5s;
    .shortcut-list{
      position: relative; height: 100%; 
      .list-page{
        width: 100%; 
        height: 100%; 
        position: absolute; 
        top: 0; 
        left: 0px;
        transition: all .3s ease-in-out; 
      }
      .list-page-enter-to{
        left: 0; display: block; 
      }
      /* .list-box{
        display: flex; flex-wrap: wrap;
      } */
    }
  }
  .drag{
    position: fixed;
    left: 0;
    top: 0;
    width: var(--icon-size);
    height: var(--icon-size);
    border-radius: 50%;
    z-index: 9;
  }
  .shortcut-switch{ 
    display: flex; 
    margin-top: calc(var(--icon-box-size) * .4); 
    justify-content: center;
    &.light .shortcut-switch-item{
      background: #dbdbdb;
      box-shadow: unset;
      &.active{
        background: #7a7a7a;
      }
    }
    .shortcut-switch-item{ 
      width: 12px; height: 12px; display: inline-block; background: rgba( 255, 255, 255, .4); border-radius: 50%; margin: 0 12px; cursor: pointer; 
      box-shadow: 0 1px 10px rgba(0, 0, 0, 0.4);
      &.active{ 
        width: 14px; height: 14px; background: rgba( 255, 255, 255, .8); margin-top: -1px; 
      }
    }
  }
  .floatL{float: left;}

  
  .shortcut-list-box{
    margin: 12px 0 12px 12px;
    display: flex;
    flex-wrap: wrap;
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
    transition: all .5s;
    border-radius: 50%;
    text-align: center;
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
  .drag-page-turn{
    position: fixed;
    width: 100px;
    height: 100%;
    top: 0;
    background: #f1f1f1;
    opacity: 0;
    &.left{
      left: 0;
    }
    &.right{
      right: 0;
    }
  }
  .blink{
    animation: blink 1s infinite;
  }
  @keyframes blink {
    0%{
      opacity: 0;
    }
    50%{
      opacity: .6;
    }
    100%{
      opacity: 0;
    }
  }
</style>