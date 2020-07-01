<template>
  <div class="basic" :class="{ allScreen: getUseSkinTypeId != 1 && getUseSkinTypeId != 4 }">
   <!--  <Menu /> -->
    <BackgroundCom />
    <SkinManage />
    <ErrorAnima />
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import SkinManage from '_c/Skin/SkinManage'
import ErrorAnima from '_c/Individuation/ErrorAnima' 
import BackgroundCom from'./BackgroundCom.vue'
  export default {
    name: 'Individuation',
    components: {
      BackgroundCom,
      SkinManage,
      ErrorAnima
    },
    computed: {
      ...mapGetters([
        'getIsShowSkinManage',
        'getUseSkinTypeId'
      ])
    }
  }
</script>

<style lang="less" scoped>
  .basic{
    width: 100%;
    height: 100%;
    .allScreen{
      background: none;
    }
  }
</style>