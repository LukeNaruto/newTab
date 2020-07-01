<template>
  <transition name="error-anima">
    <div class="error-anima-box" :class="{ active : getShowErrorAnima }">
      <div class="error-msg">
        <span class="iconfont icon-fail-px"></span>
        <span class="msg">{{ getErrorAnimaMsg }}</span>
      </div>
    </div>
  </transition>
</template>

<script>
import { mapGetters } from 'vuex'
  export default {
    name: 'ErrorAnima',
    data() {
      return {
        
      }
    },
    computed: {
    ...mapGetters([
      'getShowErrorAnima',
      'getErrorAnimaMsg'
    ])
  },
  }
</script>

<style lang="less" scoped>
  .error-anima-box{
    width: 100%;
    position: fixed;
    top: -200px;
    left: 0;
    text-align: center;
    transition: all .8s;
    z-index: 9999999999999999;
    .error-msg{
      padding: 8px 20px;
      border: 1px solid rgba(0,0,0,.1);
      box-shadow: 0 6px 16px rgba(0,0,0,.1);
      border-radius: 5px;
      display: inline-block;
      background-color: #fff;
      .icon-fail-px{
        color: #e81123;
        font-size: 20px;
        vertical-align: -2px;
        margin-right: 8px;
      }
    }
    &.active{
      top: 160px;
    }
  }
</style>