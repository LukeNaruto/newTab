<template>
  <div :class="{ show : showEdit }" class="shortcut-manage" @click.stop>
    <div class="manage-header clr">
      <span class="iconfont icon-gengduo-tianjia-px" @click="changeManageBoxFn(true)" :title="!isCustomManage ? '图标自定义' : '取消图标自定义'"></span>
      
      <span v-show="!isCustomManage" @click="handleShowSearch" :class="{active: isSearching}" class="iconfont icon-gengduo-sousuo-px" title="搜索图标"></span>
      <span @click="hideShortcutManager" class="iconfont icon-gengduo-guanbi-px" title="关闭图标管理"></span>
      <div class="title">图标管理</div>
    </div>
    <input ref="search_" @input="handleSearch" :value="searchText" :class="{active: isSearching}" class="search-box" type="text" placeholder="搜索图标" />
    <OfficialManageBox :style="{ height : boxH  + 'px' }"  />
    <CustomManageBox :style="{ height : (boxH + 50) + 'px', 'transition': getEditCustom.isCustom ? 'unset' : ''  }" @even_custom="changeManageBoxFn" :isCustomManage="isCustomManage" />
  </div>
</template>

<script>
import { mapGetters, mapMutations } from 'vuex'
import OfficialManageBox from '_c/Shortcut/OfficialManageBox'
import CustomManageBox from '_c/Shortcut/CustomManageBox'
  export default {
    name: 'ShortcutManage',
    data() {
      return {
        isCustomManage: false,
        boxH: 0,
        isSearching: false,
        searchText: '',
        noShakeTimer: null,
      }
    },
    created(){
      this.initStatus();
    },
    components: {
      CustomManageBox,
      OfficialManageBox
    },
    computed:{
      ...mapGetters([
        'getShowManageType',
        'getShortcutList',
        'getEditCustom',
        'getSearchShortcut',
      ]),
      showEdit(){
        return this.getShowManageType === 'shortcutManager';
      }
    },
    watch:{
      getSearchShortcut(){
        this.initStatus();
      },
      showEdit(val){
        if(!val){
          setTimeout(()=>{
            this.isCustomManage = false;
            this.setSearchShortcut({
              text: '',
              running: false,
            });
          },500);
        }else{
          this.isCustomManage = false;
        }
        
      },
      getEditCustom(val){
        if(val.isCustom){//右键编辑打开图标管理，跳到自定义图标编辑
          this.isCustomManage = true;
        }
      }
    },
    created () {
      this.getBoxH()
      window.addEventListener('resize', this.getBoxH)
    },
    methods: {
      ...mapMutations(['setEditCustom','setSearchShortcut']),
      initStatus(){
        const{ running: bool, text: str } = this.getSearchShortcut;
        this.isSearching = bool;
        this.searchText = str;
        if(bool){
          this.$refs.search_.focus();
        }
      },
      handleSearch(e){
        const val = e.target.value;
        clearTimeout(this.noShakeTimer);
        this.noShakeTimer = setTimeout(()=>{
          this.setSearchShortcut({
            ...this.getSearchShortcut,
            text: val,
          });
        },300);
      },
      handleShowSearch(){
        this.isSearching = !this.isSearching;
        this.setSearchShortcut({
          text: '',
          running: this.isSearching,
        });
      },
      hideShortcutManager(){
        this.$store.commit('setShowManageType', '');
      },
      changeManageBoxFn (bool) {
        this.isCustomManage = bool;
        this.setEditCustom({});//将编辑自定义图标重置为新增自定义
        clearTimeout(this.noShakeTimer);
        this.noShakeTimer = setTimeout(()=>{
          this.setSearchShortcut({
            running: false,
            text: '',
          });
        },500);
      },
      getBoxH () {
        this.boxH = (document.body.clientHeight - 50);
      }
    }
  }
</script>

<style lang="less" scoped>
  .shortcut-manage{
    // width: 0;
    width: 400px;
    height: 100%;
    position: absolute;
    top: 0;
    right:  -400px;
    border-left: 1px solid rgba(0, 0, 0, 0.1);
    background-color: #fff;
    overflow: hidden;
    opacity: 0;
    transition: right .5s, opacity .5s;
    z-index: 3;
    .official-manage-box{
      overflow-y: auto;
    }
    &.show{
      right: 0;
      opacity: 1;
    }
  }
  .manage-header{
    position: relative;
    line-height: 50px;
    background-color: #fff;
    z-index: 9;
    .title{
      height: 50px;
      border-bottom: 1px solid rgba(0, 0, 0, 0.1);
      text-align: center;
      box-sizing: border-box;
    }
    .iconfont{
      width: 32px;
      height: 32px;
      line-height: 32px;
      text-align: center;
      display: block;
      position: absolute;
      cursor: pointer;
      top: 8px;
      &:hover{
        background-color: #f0f0f0;
      }
    }
    .icon-gengduo-tianjia-px{
      left: 10px;
    }
    .icon-gengduo-sousuo-px{
      left: 42px;
      &.active{
        color: #009aff;
      }
    }
    .icon-gengduo-guanbi-px{
      right: 10px;
    }
  }
  .search-box{
    position: relative;
    display: block;
    width: calc(100% - 60px);
    height: 30px;
    margin: -30px auto 4px;
    padding: 0 24px;
    border-radius: 20px;
    border: 1px solid silver;
    transition: all .4s;
    outline: none;
    z-index: 8;
    &:focus{
      border-color: #009aff;
      box-shadow: 0 0 2px rgba(0,154,255,.75);
    }
    &.active{
      margin-top: 14px;
    }
  }
</style>