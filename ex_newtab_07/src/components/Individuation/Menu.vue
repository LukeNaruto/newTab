<template>
  <div class="menu" @dblclick.stop>
    <span :class="{'text-shadow': textShadow}" class="menu-item" @click.stop="changeShowManageFn" style="color: var(--main-color);" title="个性化">个性化</span>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
  export default {
    name: 'Menu',
    data() {
      return {
        textShadow: false
      }
    },
    computed: {
      ...mapGetters([
        'getUseFontColor'
      ])
    },
  watch:{
    'getUseFontColor'(val){
      this.textShadow = !val;
    }
  },
    methods: {
      changeShowManageFn () {
        this.$store.commit("setShowManageType", "");
        this.$store.commit('setIsShowSkinManage', true)
        this.$store.commit('setIsShowSkinManageType', 1)
      }
    }
  }
</script>

<style lang="less" scoped>
  .menu{ 
    position: absolute;
    right: 32px;
    top: 28px;
    z-index: 3;
   }
   .menu span{
     color: rgba(0, 0, 0, .4);
   }
  .text-shadow{
    text-shadow: 0 3px 10px rgba(0, 0, 0, .4)!important;
  }
   .menu .menu-item{
     cursor: pointer;
     color: rgb(0, 0, 0);
     transition: all .3s;
     opacity: 1;
     
     &.active{
       color: rgb(0, 0, 0);
       opacity: .8;
     }
     &:hover{
      opacity: .8;
    }
   }
   .allScreen{
     .menu .menu-item{
      color: rgb(255, 255, 255);
      opacity: 1;
      &.active{
        color: rgb(255, 255, 255);
        opacity: .8;
      }
      &:hover{
        opacity: .8;
      }
    }
  }
</style>