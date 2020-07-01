<template>
  <div class="skin-manage-header">
    <div class="close-box">
      <span @click="closeSkinManageFn" class="iconfont icon-gengduo-shuqian-quxiao-px"></span>
    </div>
    <div class="skin-manage-meun">
      <span v-for="item in meuns" @click="changeSkinManageType(item.id)" :key="item.id" :class="{ active : getIsShowSkinManageType == item.id }" class="skin-meun-item">{{ item.title }}</span>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
  export default {
    name: 'SkinManageHeader',
    data() {
      return {
        meuns: [
          { id: 1, title: '精选皮肤' },
          { id: 2, title: '个性化设置' },
        ]
      }
    },
    computed: {
      ...mapGetters([
        'getIsShowSkinManageType'
      ])
    },
    methods: {
      changeSkinManageType (id) {
        this.$store.commit('setIsShowSkinManageType', id)
      },
      closeSkinManageFn () {
        this.$store.commit('setIsShowSkinManage', false)
      }
    }
  }
</script>

<style lang="less" scoped>
  .skin-manage-header{
    color: rgba(255,255,255,.6);
    .close-box{
      text-align: right;
      padding: 20px 20px 0 0;
      .icon-gengduo-shuqian-quxiao-px{
        cursor: pointer;
        color: rgba(255,255,255,.6);
      }
    }
    .skin-manage-meun{
      height: 40px;
      text-align: center;
      border-bottom: 1px solid rgba(255,255,255,.3);
      .skin-meun-item{
        cursor: pointer;
        color: rgba(255,255,255,.6);
        margin: 0 10px;
        &.active{
          font-size: 16px;
          color: rgba(255,255,255,1);
        }
      }
    }
  }
</style>