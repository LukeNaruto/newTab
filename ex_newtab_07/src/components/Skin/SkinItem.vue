<template>
  <div class="skin-item" @mouseover="playVideo" @mouseout="pauseVideo" @click="changeSkin(skin)" @mousemove="videoMove">
    <div class="skin-item-box" :style="{ backgroundImage: 'url('+ skin.im +')' }">
      <video class="slider-video" height="136" v-if="skin.ti == 'type_3'" :src="skin.pv" preload="none" :ref="'video' + skin.id" loop muted></video>
    </div>
    <span class="iconfont icon-videopx" v-if="skin.ti == 'type_3'"></span>
    <span class="iconfont icon-Selection-px" v-if="skin.id == getUseSkinId"></span>
    
    <div class="loader" v-if="skin.id == getLoadingSkinId"></div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
  export default {
    name: 'SkinItem',
    data() {
      return {
        
      }
    },
    computed: {
      ...mapGetters([
        'getUseSkinId',
        'getLoadingSkinId'
      ])
    },
    props: ['skin'],
    methods: {
      changeSkin (skin) {
        this.$store.dispatch('setSkinFn', skin)
      },
      playVideo () {
        if(this.skin.ti == 'type_3'){
          let dom = this.$refs['video' + this.skin.id]
          if(dom.readyState < 2){
            dom.load()
          }else{
            dom.play()
          }
        }
      },
      videoMove () {
        if(this.skin.ti == 'type_3'){
          let dom = this.$refs['video' + this.skin.id]
          if(dom.readyState > 2){
            dom.play()
          }
        }
      },
      pauseVideo () {
        if(this.skin.ti == 'type_3'){
          this.$refs['video' + this.skin.id].pause()
        }
      }
    }
  }
</script>

<style lang="less" scoped>
  .skin-item{
    width: 176px;
    height: 136px;
    border-radius: 3px;
    position: relative;
    overflow: hidden;
    cursor: pointer;
    background-color: rgba(255,255,255,.04);
    margin-bottom: 18px;
    .skin-item-box{
      width: 100%;
      height: 100%;
      position: absolute;
      top: 0;
      left: 0;
      background-size: auto 136px;
      background-position: center center;
      border-radius: 3px;
      z-index: -1;
      .slider-video{
        position: absolute;
        left: -33px;
      }
    }
    .icon-videopx{
      position: absolute;
      top: 10px;
      right: 16px;
      color: rgba(255,255,255,.6);
      font-size: 22px;
    }
    .icon-Selection-px{
      position: absolute;
      bottom: 10px;
      right: 16px;
      color: rgba(255,255,255,.6);
      font-size: 22px;
      background-color: rgba(0,0,0,.3);
      border-radius: 50%;
    }
    .loader{
      width: 78px;
      height: 78px;
      background: url('../../assets/img/loading.png') no-repeat center center;
      animation: loading 1.3s linear infinite;
      position: absolute;
      top: calc( 50% - 39px );
      left: calc( 50% - 39px );
      margin: 0;
    }
  }:nth-child(even){
    margin-left: 18px;
  }
</style>