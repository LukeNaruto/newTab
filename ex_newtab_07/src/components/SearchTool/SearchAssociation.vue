<template>
  <div
    class="word-association" :class="{ white: getUseSkinTypeId === 1 && !getIndividuation.isShowWallpaper }"
    @mouseout="changeWordAssociationIndex(-1)"
    v-show="getIsSearchActive && (getWordAssociation.length > 0 || getHotWordsList.length > 0 )"
  >
    <div v-if="getWordAssociation.length > 0">
      <div
        class="word-item"
        :class="{ active : getWordAssociationIndex == index }"  
        :key="index"
        @mousedown="searchFn(word)"
        @mouseover="changeWordAssociationIndex(index)"
        v-for="(word, index) in getWordAssociation"
      >
        <span class="iconfont icon-gengduo-sousuo-px"></span>{{ word }}
      </div>
    </div>

    <div v-if="getWordAssociation.length === 0 && getIsShowHotWordsList">
      <div 
        v-for="(item, index) in getHotWordsList"
        class="word-item"
        :class="{ active : getWordAssociationIndex == index }"  
        :key="index"
        @mousedown="searchFn(item.keyword)"
        @mouseover="changeWordAssociationIndex(index)"
        ref="hot"
      >
        <span :class="`index ${ index + 1 <= 3 ? 'red' : 'gray'}`">{{ index+1 }}</span>
        <span class="content">{{ item.keyword }}</span>
        <span class="icon">{{ item.iconnew === 1 ? "NEW": "" }}</span>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import { windowOpenUrl } from '@/libs/arrHandle';
  export default {
    name: 'SearchAssociation',
    data() {
      return {
        
      }
    },
    computed: {
      ...mapGetters([
        'getWordAssociation',
        'getSearchEngine',
        'getWordAssociationIndex',
        'getIsShowWordAssociation',
        'getHotWordsList',
        'getIsSearchActive',
        'getIsShowHotWordsList',
        'getIndividuation',
        'getUseSkinTypeId'
      ])
    },
    methods: {
      searchFn (w) {
        // this.$store.commit('setIsHiddenAll', true)
        // location.href = this.getSearchEngine.m + w
        let u = this.getSearchEngine.m;
        windowOpenUrl({
          u,
          w,
          t: 2
        });
      },
      changeWordAssociationIndex (i) {
        this.$store.commit('setWordAssociationIndex', i)
      },
    },
  }
</script>

<style lang="less" scoped>
  .word-association{
    width: calc(100% - 80px);
    position: absolute;
    top: 54px;
    left: 0;
    border-radius: 3px;
    background-color: rgba(255, 255, 255, .96);
    // border: 1px solid rgba(0, 0, 0, .1);
    border: none;
    // padding: 1px;
    &.white {
      // padding: 0;
      border: 1px solid rgba(0, 0, 0, 0.1);
      box-shadow: 0 6px 16px rgba(0, 0, 0, 0.1);
    }
    .word-item{
      height: 40px;
      line-height: 40px;
      cursor: pointer;
      .iconfont{
        margin: 0 20px;
      }
      .index{
        display: inline-block;
        width: 58px;
        font-size: 14px;
        text-align: center;
        font-style: italic;
        color: #666;
      }
      .content{
        font-size: 14px;
        color: #222;
      }
      .icon{
        display: inline-block;
        margin-left: 3px;
        font-size: 10px;
        color: #ff0000;
        font-style: italic;
        text-align: left;
        -webkit-transform:scale(0.8);
        transform:scale(0.8);
      }
      .red{
        color: #ff0000;
      }
      .gray{
        color: #666;
      }
      &.active{
        background-color: rgba(0, 0, 0, .04);
      }
    }
  }
</style>