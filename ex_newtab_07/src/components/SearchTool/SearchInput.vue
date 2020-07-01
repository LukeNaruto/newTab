<template>
  <div class="search-input-template">
    <input 
      type="text" 
      class="search-input" 
      @keyup="getWordAssociationFn" 
      @keydown="searchFn" 
      @blur="clearWordAssociations" 
      v-model="searchText"
      @focus="searchInputFocus" 
      :placeholder="placeholderText"
    >
    <span 
      class="iconfont icon-gengduo-shuqian-quxiao-px" 
      v-show="searchText" 
      @click="clearSearchText"
    >
    </span>
  </div>
</template>

<script>
import { mapGetters, mapMutations, mapActions } from 'vuex';
import { windowOpenUrl } from '@/libs/arrHandle';

export default {
  name: 'SearchInput',
  data() {
    return {
      searchText: '',
      placeholderText: '搜索'
    }
  },
  computed: {
    ...mapGetters([
      'getWordAssociation',
      'getWordAssociationIndex',
      'getSearchEngine',
      'getHotWordsList',
      'getIsShowHotWordsList',
    ]),
  },
  created() {
    
    window.a = this;
    window.addEventListener("blur", () => {
      document.getElementsByClassName("search-input")[0].blur();
    });
  },
  methods: {
    ...mapMutations([
      'setSearchText',
      'setWordAssociationIndex',
      'setIsShowHotWordsList'
    ]),

    ...mapActions([
      'setIsShowSearch',
    ]),

    clearSearchText() {
      this.searchText = '';
      this.setSearchText('');
      this.$store.commit('setIsSearchActive', false);
      this.setIsShowHotWordsList(true);
    },

    searchFn(e) {
      let length = this.getWordAssociation.length || this.getHotWordsList.length;
      let index = this.getWordAssociationIndex;
      let i = -1;
      
      if (e.key == 'Enter') {
        let u = this.getSearchEngine.m, w = this.searchText;
        windowOpenUrl({
          u,
          w,
          t: 2
        });
      } 
      else if (e.key == 'ArrowDown') {
        i = index == length - 1 ? 0 : index + 1
        this.chengeIndex(i)
        e.preventDefault()
      } 
      else if (e.key == 'ArrowUp') {
        i = index <= 0 ? length - 1 : index - 1
        this.chengeIndex(i)
        e.preventDefault()
      }
    },
    
    chengeIndex (i) {
      if (this.getWordAssociation.length > 0) {
        // console.log("chengeIndex---getWordAssociation");
        this.searchText = this.getWordAssociation[i];
        this.$store.commit('setWordAssociationIndex', i);
      } 
      // else {
      else if (this.getIsShowHotWordsList) {
        // console.log("chengeIndex---getHotWordsList");
        if(i !== -1) {
          this.searchText = this.getHotWordsList[i].keyword;
        }
        // 
        this.setWordAssociationIndex(i);
        this.$store.commit('setWordAssociationIndex', i);
      }
      this.setSearchText(this.searchText);
    },
    getWordAssociationFn(e) {
      if (
        e.key != 'Enter' && 
        e.key != 'ArrowDown' && 
        e.key != 'ArrowUp' && 
        e.key != 'ArrowLeft' && 
        e.key != 'ArrowRight'
      ){
        setTimeout(()=>{
          this.$store.dispatch('getApiWordAssociation', this.searchText || '');
        },10)
      }
    },

    clearWordAssociations () {
      this.placeholderText = '搜索';

      this.$store.commit('setWordAssociationIndex', -1);

      setTimeout(() => {
        this.$store.commit('setIsSearchActive', false);
        this.$store.commit('setWordAssociations', []);
      }, 200);
    },

    searchInputFocus () {
      this.placeholderText = '';

      if (this.searchText) {
        this.setIsShowHotWordsList(false);
        this.$store.dispatch('getApiWordAssociation', this.searchText || '');
      }
      this.$store.commit('setIsSearchActive', true);
    }
  }
}
</script>

<style lang="less" scoped>
  .search-input-template{
    width: calc(100% - 50px);
    min-width: 150px;
    height: 50px;
    // display: flex;
    // justify-content: space-between;
    // flex: 1;
  .search-input{
    width: calc(100% - 50px);
    min-width: 110px;
    height: 50px;
    display: block;
    float: left;
    line-height: 50px;
    border: 0 none;
    background: none;
    outline: 0;
    font-size: 16px;
    flex: 1;
  }
    .iconfont{
      width: 50px;
      height: 50px;
      display: block;
      float: left;
      position: relative;
      z-index: 10;
      cursor: pointer;
      // margin-left: 10px;
      text-align: center;
      &:hover{
        color: rgb(0, 126, 255);
      }
    }
  }
</style>