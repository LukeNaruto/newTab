<template>
  <div class="fuzzy-search shortcut-list">
    <OfficialManageShortcutList :shortcutList="localShortcutList" @accept_event="usingShortcutFn" />
  </div>
</template>
<script>
import { mapGetters, mapActions } from 'vuex'
import {ruleOutSimilarArr, sysFormatSort, getDomainKey} from '@/libs/arrHandle'
import OfficialManageShortcutList from '_c/Shortcut/OfficialManageShortcutList'
export default {
  name: 'FuzzySearch',
  data(){
    return{
      localShortcutList:[],
      getShortcutList_: []
    }
  },
  props:{
    searchKey:{
      type: String,
      default: ''
    }
  },
  components: {
    OfficialManageShortcutList
  },
  computed: {
    ...mapGetters([
      'getShortcutListInfo',
      'getShortcutList',
    ])
  },
  watch:{
    'getShortcutList'(val, val_){
      this.initList(this.searchKey);
    },
    'getShortcutListInfo'(){
      this.initList(this.searchKey);
    },
    searchKey(val){
      this.initList(val);
    }
  },
  created(){
    this.initList(this.searchKey);
  },
  methods:{
    ...mapActions(['setShortcutListInfo']),
    initList(key){
      let searchKey = getDomainKey(key).toLocaleLowerCase();
      this.localShortcutList.splice(0);
      if(searchKey.length <= 1) return;
      this.getShortcutList_ = [...this.getShortcutList];
      ruleOutSimilarArr(this.getShortcutList_, this.getShortcutListInfo, '_id');
      this.getShortcutList_.forEach(item => {
        let itemKey = getDomainKey(item.u).toLocaleLowerCase();
        if(~itemKey.indexOf(searchKey)) this.localShortcutList.push(item);
      });
      this.localShortcutList.sort((a, b) => {
        return b.gp - a.gp;
      });
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
      this.setShortcutListInfo(list);
      // this.$store.commit('setShowManageType', '');
    },
  },
}
</script>
<style lang="less" scoped>
  
</style>