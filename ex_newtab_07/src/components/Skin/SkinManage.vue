<template>
  <div class="skin-manage-box" :class="{ show : getIsShowSkinManage }" @click.stop @dblclick.stop>
    <SkinManageHeader />
    <SkinManageTypeList :style="{ height : boxH }" v-if="getIsShowSkinManageType == 1" />
    <SkinManageTypeSettings v-if="getIsShowSkinManageType == 2" />
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import SkinManageHeader from '_c/Skin/SkinManageHeader'
import SkinManageTypeList from '_c/Skin/SkinManageTypeList'
import SkinManageTypeSettings from '_c/Skin/SkinManageTypeSettings'
  export default {
    name: 'SkinManage',
    components: {
      SkinManageHeader,
      SkinManageTypeList,
      SkinManageTypeSettings
    },
    data() {
      return {
        boxH: 0
      }
    },
    computed: {
      ...mapGetters([
        'getIsShowSkinManage',
        'getIsShowSkinManageType'
      ])
    },
    created () {
      this.getBoxH()
      window.addEventListener('resize', this.getBoxH)
    },
    methods: {
      getBoxH () {
        this.boxH = (document.body.clientHeight - 120) + 'px'
      }
    }
  }
</script>

<style lang="less" scoped>
  .skin-manage-box{
    width: 410px;
    min-height: 100%;
    position: absolute;
    right: -420px;
    top: 0;
    background-color: rgba(0,0,0,.85);
    transition: right .5s;
    z-index: 99;
    &.show{
      right: 0;
    }
  }
</style>