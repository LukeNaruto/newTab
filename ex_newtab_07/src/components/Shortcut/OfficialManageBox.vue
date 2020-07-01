<template>
<transition name="fade">
  <div class="official-manage-box">
    <ShortcutTypes />
    <OfficialManageShortcutList :shortcutList="isSearching ? searchList : localShortcutList" @accept_event="usingShortcutFn" />
    
    <div class="shortcut-empty" v-if="isSearching ? (!searchList.length && searchText) : !localShortcutList.length">
      <svg class="icon" aria-hidden="true">
        <use xlink:href="#icon-weikongtishituxing"></use>
      </svg>
      <div class="empty-text">暂无数据</div>
    </div>
  </div>
  </transition>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'
import {ruleOutSimilarArr, sysFormatSort, getDomainKey} from '@/libs/arrHandle'
import ShortcutTypes from '_c/Shortcut/ShortcutTypes'
import OfficialManageShortcutList from '_c/Shortcut/OfficialManageShortcutList'
  export default {
    name: 'OfficialManageBox',
    data() {
      return {
        localShortcutList:[],
        searchList:[],
        getShortcutList_: [],
        isSearching: false,
        searchText: '',
      }
    },
    components: {
      ShortcutTypes,
      OfficialManageShortcutList
    },
    computed: {
      ...mapGetters([
        'getShortcutListInfo',
        'getShortcutList',
        'getShortcutTypeId',
        'getSearchShortcut',
      ])
    },
    created(){
      this.initStatus();
    },
    mounted(){
      // console.log(9999,this.getShortcutTypeId,this.getShortcutList)
      this.initList(this.getShortcutTypeId);
    },
    watch:{
      'getSearchShortcut'({running: bool}){
        this.initStatus();
        if(bool) this.initList();
      },
      'getShortcutTypeId'(val, val_){
        // console.log('watch---officia', val);
        this.initList(val);
      },
      'getShortcutList'(val, val_){
        this.initList(this.getShortcutTypeId);
      },
      'getShortcutListInfo'(){
        this.initList(this.getShortcutTypeId);
      }
    },
    methods:{
      ...mapActions(['setShortcutListInfo']),
      initStatus(){
        const{ running: bool, text: str } = this.getSearchShortcut;
        this.isSearching = bool;
        this.searchText = str;
      },
      initList(key=''){
        let store = [];
        let choice = this.isSearching ? 'searchList' : 'localShortcutList';
        this.getShortcutList_ = [...this.getShortcutList];
        ruleOutSimilarArr(this.getShortcutList_, this.getShortcutListInfo, '_id');
        this.getShortcutList_.forEach(item => {
          switch(this.isSearching){
            case true:
              if(!this.searchText) return;
              this.handleSearchItem(store, item);
              break;
            default:
              if(key === '' && item.ih == 1){
                store.push(item);
              }else if(item.gid === key){
                store.push(item);
              }
              break;
          }
        });
        store.sort((a, b) => {
          return b.gp - a.gp;
        });
        this[choice] = store;
      },
      handleSearchItem(store, item){
        const key = getDomainKey(item.u);
        const t = item.t.toLocaleUpperCase(), s = this.searchText.toLocaleUpperCase();
        if(~t.indexOf(s)){
          store.push(item);
        }
      },
      usingShortcutFn(item){
        let sys = false, list = [...this.getShortcutListInfo];
        item.addani = true;
        list.push(item);
        if(item.is == 1){
          sys = true;
          list = sysFormatSort(list);
        }
        list.sys = sys;
        item.edit = 'update';
        list.item = item;
        // this.recordShortcutEdit(item);
        // console.log('usingShortcutFn---', list, item)
        this.setShortcutListInfo(list);
        
      },

    }
  }
</script>

<style  lang="less">
  @main: rgb(0, 126, 255);
  .shortcut-empty{
    text-align: center;
    .empty-text{
      font-size: 18px;
      color: #e6e6e6;
      margin-top: -30px;
    }
  }
  .official-manage-box{
    .shortcut-toolbar{
      position: absolute; background: #fff; border: 1px solid #e2e2e2; border-radius: 3px; padding: 4px 0; box-shadow: 3px 3px 5px rgba( 0, 0, 0, .1);
    }
    .shortcut-toolbar-item{
      padding: 6px 70px 6px 20px; cursor: pointer; font-size: 12px;
      &:hover{
        background: rgba( 0, 0, 0, .05);
      }
    }
  }
  
</style>