<template>
  <div class="skin-manage-list">
    <div class="skin-group-list" v-if="!getApiError">
      <span class="skin-group-item" :class="{ active : item.id == getSkinGroupId }" v-for="item in getSkinGroups" :key="item.id" @click="changeSkinGroupId(item.id)">{{ item.t }}</span>
      <span class="skin-group-item iconfont icon-more-px" @click="gotoSkinCenter"></span>
    </div>

    <div class="skin-list" v-if="!getApiError">
      <SkinItem v-for="skin in getSkinList" :key="skin.id" :skin="skin" />
    </div>

    <div class="skin-empty" v-if="getSkinList.length == 0 && !getApiError">
      <span class="iconfont icon-ss_fond"></span>
      <div class="empty-text">暂无数据</div>
    </div>

    <div class="api-error" v-if="getApiError">
      <span class="iconfont icon-qs_internet"></span>
      <div class="empty-text">网络加载异常</div>
      <div class="onload">
        <span class="onload-btn" @click="onload" @dblclick.stop>重新加载</span>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import SkinItem from '_c/Skin/SkinItem'
  export default {
    name: 'SkinManageTypeList',
    components: {
      SkinItem
    },
    data() {
      return {
        timelock: true
      }
    },
    computed: {
      ...mapGetters([
        'getSkinGroups',
        'getSkinGroupId',
        'getSkinList',
        'getApiError'
      ])
    },
    created () {
      this.$store.dispatch('getSkinGroups')
      this.$store.dispatch('getUseSkinId')
    },
    methods: {
      changeSkinGroupId (id) {
        this.$store.commit('setSkinGroupId', id)
        this.$store.dispatch('getSkinsByGroupId', id)
      },
      gotoSkinCenter () {
        if(chrome.xb && chrome.xb.switchToExtensionManager){
          chrome.xb.switchToExtensionManager('http://skin.minibai.com', -1)
        }else{
          window.open('http://skin.minibai.com')
        }
      },
      onload () {
        if(this.timelock){
          this.timelock = false
          this.$store.dispatch('getSkinGroups')
          setTimeout(() => {
            this.timelock = true
          }, 5000)
        }
      }
    }
  }
</script>

<style lang="less" scoped>
  .skin-manage-list{
    padding: 20px 14px 20px 20px;
    color: rgba(255,255,255,.8);
    overflow-y: auto;
    .skin-group-list{
      display: flex;
      flex-wrap: wrap;
      .skin-group-item{
        display: inline-block;
        margin: 0 10px 10px 0;
        color: rgba(255,255,255,.8);
        padding: 6px 10px;
        background-color: rgba(255,255,255,.1);
        border-radius: 15px;
        cursor: pointer;
        &:hover{
          color: rgba(255,255,255,1);
          background-color: rgba(255,255,255,.3);
        }
        &.active{
          background: linear-gradient(to right, #007eff, #00c0ff);
          color: rgba(255,255,255,1);
        }
      }
      .icon-more-px:before{
        vertical-align: middle;
      }
    }
    .skin-empty{
      text-align: center;
      margin-top: 30%;
      .iconfont{
        font-size: 188px;
        color: rgba(255,255,255,.2);
      }
      .empty-text{
        font-size: 24px;
        color: rgba(255,255,255,.2);
      }
    }
    .api-error{
      text-align: center;
      margin-top: 30%;
      .iconfont{
        font-size: 108px;
        color: rgba(255,255,255,.2);
      }
      .empty-text{
        font-size: 20px;
        color: rgba(255,255,255,.2);
        margin-top: 40px;
      }
      .onload{
        display: inline-block;
        background-color: #747474;
        padding: 12px 40px;
        margin-top: 50px;
        cursor: pointer;
        border-radius: 30px;
        .onload-btn{
          color: #fff;
          font-size: 16px;
        }
      }
      // :hover{
      //   background-color: #656565;
      // }
    }
    .skin-list{
      display: flex;
      flex-wrap: wrap;
      margin-top: 20px;
    }
  }
</style>