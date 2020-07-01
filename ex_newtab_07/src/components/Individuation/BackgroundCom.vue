<template>
  <div class="background-box" :style="getBgStyle">
    <!-- <div class="background-mask"></div> -->
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
  export default {
    name: 'BackgroundCom',
    computed: {
      ...mapGetters([
        'getBgStyle'
      ])
    },
    created(){
      window.addEventListener('resize', this.setBgSize)
    },
    methods: {
      setBgSize() {
        this.$store.commit('setBgSize', window.screen.width/document.body.clientWidth*100/window.devicePixelRatio + '%')
      }
    }
  }
</script>

<style lang="less" scoped>
  .background-box{
    width: 100%;
    height: 100%;
    z-index: -1;
    background-position: center center;
    .background-mask{
      width: 100%;
      height: 100%;
      background-color: rgba(0,0,0,.2);
    }
  }
</style>