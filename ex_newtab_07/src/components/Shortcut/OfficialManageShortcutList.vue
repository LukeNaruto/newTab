<template>
  <div class="shortcut-list">
    <div v-for="item in localShortcutList" :key="item._id" class="list-item" >
      <div v-if="!item.using" @click="trigger_evnet(item)" class="shortcut-img" :style="{ opacity: item.using ? '0.5' : '1' }">
        
        <img :src="item.ic" class="icon-img" alt="" v-if="item.ic">
        <div class="mask-box" v-if="item.ic" :data-item="item"></div>
        <!-- <span class="icon-userText" alt="" v-if="!item.ic">{{ item.t | subtitle }}</span> -->
      </div>
      <div class="shortcut-title" :title="item.t">{{ item.t }}</div>
      <!-- <span class="on-sign1" v-if="false"></span> -->
      
    </div>

    
  </div>
</template>
<script>
export default {
  name: 'OfficialManageShortcutList',
  data(){
    return{
      localShortcutList:[],
    }
  },
  props:{
    shortcutList:{
      type: Array,
      default(){
        return [];
      }
    },
  },
  watch: {
    shortcutList(val){
      this.localShortcutList = val;
    }
  },
  created(){
    this.localShortcutList = this.shortcutList;
  },
  methods:{
    trigger_evnet(item){
      this.$emit('accept_event', item);
    }
  },
}
</script>
<style lang="less" scoped>
  @main: rgb(0, 126, 255);
.shortcut-list{
  margin: 22px;
}
.shortcut-list .list-item{
  width: 64px; position: relative; margin: 10px 31px 20px 0; display: inline-block;
  &:nth-child(4n){ margin-right: 0;}
  .shortcut-title{
    font-size: 13px; text-align: center; margin-top: 6px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;
  }
  .on-sign .icon{
    width: 1.3em; height: 1.3em; fill: currentColor; overflow: hidden; position: absolute; top: 0; right:0;
  }
  .on-sign1{
    width: 18px; height: 18px; display: block; background-color: #22c30c; position: absolute; top: 0; right:0; border-radius: 50%;
    &:after{
      content: " "; width: 3px; height: 7px; border: 2px solid #fff; border-top: 0; border-left: 0; transform: rotate(45deg); position: absolute; top: 3px; left: 7px;
    }
  }
  .link-sign{
    width: 16px; height: 16px; line-height: 16px; background-color: @main; border: 1px solid #fff; border-radius: 50%; position: absolute; top: 44px; right: 0;
  }
}
.shortcut-list .shortcut-img{
  width: 64px; height: 64px; line-height: 64px; text-align: center; border-radius: 50%; position: relative; cursor: pointer;
  .icon{
    font-size: 30px; color: #fff;
  }
  .icon-img{
    width: 64px; height: 64px; border-radius: 50px;
  }
  .icon-userText{
    color: #fff; font-size: 20px; font-weight: 600;
  }
  .mask-box{
    width: 100%; height: 100%; background: rgba( 0, 0, 0, .05); position: absolute; top: 0; left: 0; border-radius: 50%;
  }
}
</style>