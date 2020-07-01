<template>
<div class="shortcut-manage1" :class="{show: isCustomManage}" @click.stop>
    <div class="manage-header clr">
      <span class="iconfont icon-gengduo-guanbi-px" @click="hideShortcutManager"></span>
      
    </div>

    <div class="add-shortcut-box">
      <div class="add-shortcut-info">
        <div class="add-shortcut-input-box">
          <span class="icon-userText" :style="{backgroundColor: bgColor}">{{ (shortcutModel.t && shortcutModel.t.substr(0,2)) || '' }}</span>
          <input @keyup.enter="submitFn" v-model="shortcutModel.u" type="text" placeholder="网址：http://">
          <input @keyup.enter="submitFn" v-model="shortcutModel.t" type="text" placeholder="名称">
          <ul class="set-color">
            <li v-for="color in colors" @click="bgColor=color" :class="{'active': bgColor === color}" :style="{backgroundColor: color}" :key="color"></li>
          </ul>
        </div>
      </div>
      <div class="add-shortcut-btn-box">
        <button class="add-shortcut-btn" @click="submitFn">{{ getEditCustom.isCustom ? '保存' : '添加' }}</button>
        <button class="add-shortcut-btn remove" @click="hideShortcutManager"> 取消 </button>
      </div>
      <FuzzySearch :searchKey="shortcutModel.u" />
    </div>
  </div>
</template>

<script>
import { mapGetters, mapActions, mapMutations } from 'vuex';
import FuzzySearch from '_c/FuzzySearch/FuzzySearch';
export default {
  name: 'CustomManageBox',
  data() {
    return {
      shortcutModel: null,
      submitShake: false,
      colors: [
        '#0179fd',
        '#925afd',
        '#66d73b',
        '#ffcc53',
        '#ff9300',
        '#f31918'
      ],
      bgColor: '#0179fd'
    }
  },
  components: {
    FuzzySearch,
  },
  props:['isCustomManage'],
  created(){
    this.initShortcutModel();
  },
  computed: {
    ...mapGetters([
      'getShortcutListInfo',
      'getEditCustom'
    ])
  },
  watch:{
    getEditCustom(val){
      if(val.isCustom) {
        this.shortcutModel = {...val};
        this.bgColor = this.shortcutModel.bgColor;
      }
      else setTimeout(()=>{ this.initShortcutModel(); }, 500);
    }
  },
  methods:{
    ...mapMutations(['setShowErrorAnima', 'setErrorAnimaMsg']),
    ...mapActions(['setShortcutListInfo']),
    
    hideShortcutManager(){
      if(this.getEditCustom.isCustom){
        this.$store.commit('setShowManageType', '');
      }else{
        this.$emit('even_custom', false);
      }
      
    },
    usingShortcutFn(item){
      if(this.submitShake) return;
      this.submitShake = true;
      var list = [...this.getShortcutListInfo];
      item.edit = 'update';
      if(this.getEditCustom.isCustom){
        for(var i=0,len=list.length;len>i;i++){
          if(list[i]._id === this.getEditCustom._id){
            list[i] = {...item};
            break;
          }
        } 
      }else{
        item._id = item._id ? item._id : Date.now().toString(16) + Math.random().toString(16).substr(3);
        list.push(item);
      }
      setTimeout(()=>{ 
        this.initShortcutModel();
        this.submitShake = false;
        this.$store.commit('setShowManageType', '');
      }, 500);
  
      
      
      list.item = item;
      this.setShortcutListInfo(list);
      // this.recordShortcutEdit(item);
    },
    submitFn: function () {
      if(this.shortcutModel.u != '' && this.shortcutModel.t != ''){
        if(!/^((http|https)\:\/\/)/.test(this.shortcutModel.u)){
          this.shortcutModel.u = 'http://' + this.shortcutModel.u;
        }
        let reg = /(http|https):\/\/[\w\-_]+(\.[\w\-_]+)+([\w\-\.,@?^=%&:/~\+#]*[\w\-\@?^=%&/~\+#])?/;
        if(reg.test(this.shortcutModel.u)){
          this.shortcutModel.type = this.shortcutModel.ic != '' ? 'add-img' : 'add-text';
          this.shortcutModel.isCustom = true;
          this.shortcutModel.bgColor = this.bgColor;
          // 新增状态
          this.usingShortcutFn(this.shortcutModel);
        }else{
          this.runPopupInfo( '网址不正确');
        }
      }else if(this.shortcutModel.u === ''){
        this.runPopupInfo('请填写正确的网址');
      }else if(this.shortcutModel.t === ''){
        this.runPopupInfo('请填写网址名称');
      }

    },
    /**
   * 运行提示方法
   * @param {提示类型} type 
   * @param {提示信息} msg 
   */
    runPopupInfo: function (msg) {
      this.setErrorAnimaMsg(msg);
      this.setShowErrorAnima(true);
      setTimeout(() => {
        this.setShowErrorAnima(false);
      }, 3000)
    },
    shortcutFocusFn(){
      this.shortcutModel.u = !this.shortcutModel.u ? 'http://' : this.shortcutModel.u; 
    },
    shortcutBlurFn(){
      this.shortcutModel.u = /^(http\:\/\/)$ | ^(https\:\/\/)$/.test(this.shortcutModel.u) ? '' : this.shortcutModel.u;
      
    },
    initShortcutModel: function () {
      this.bgColor = '#0179fd';
      this.shortcutModel = {
        type: 'add-text',
        sort: 70,
        t: '',
        u: '',
        img: '',
        bgColor: this.bgColor,
        addani: true,
      }
    },
  },
  filters: {
    subtitle: function (val){
      if(val.length){
        return val.substring(0, 2);
      }
    }
  }
}
</script>

<style lang="less" scoped>
@lightgray: rgba( 240, 240, 240, 1);
@main: rgb(0, 126, 255);
@secondary: rgb(0, 192, 255);
.add-shortcut-box{ height: 164px; }
.add-shortcut-box .add-shortcut-info{ display: flex; margin:0 24px; }
.add-shortcut-box .add-shortcut-info .add-shortcut-img{ min-width: 80px; height: 80px; position: relative; cursor: pointer; text-align: center; margin-right: 20px; }
.add-shortcut-box .add-shortcut-info .add-shortcut-img .icon{ width: 80px; height: 80px; line-height: 80px; font-size:60px; color: #e2e2e2; border-radius: 50%; display: block; background: @lightgray; }
.add-shortcut-box .add-shortcut-info .add-shortcut-img .add-shortcut-img-box{ width: 80px; height: 80px; display: block; position: absolute; top: 0; left: 0; border-radius: 50%; background: #fff; }
.add-shortcut-box .add-shortcut-info .add-shortcut-img .add-shortcut-img-box img{ width: 80px; height: 80px; border-radius: 50%; border: 1px solid #eee; }
.add-shortcut-box .add-shortcut-info .add-shortcut-input-box{ flex-grow: 1; text-align: center; }
.add-shortcut-box .add-shortcut-info .add-shortcut-input-box input[type="text"], .set-color{ width: 100%; height: 42px; line-height: 36px; background: @lightgray; border: 0 none; border-radius: 100px; margin-bottom: 10px; text-indent: 20px; outline: none;border:1px solid transparent; }
.add-shortcut-box .add-shortcut-info .add-shortcut-input-box input[type="text"]:focus{ border:1px solid @main; box-shadow: 0 0 7px rgba(0,154,255,.2);  background: #fff; }
.add-shortcut-box .add-shortcut-btn-box{ margin: 18px 24px 0; }
.add-shortcut-box .add-shortcut-btn-box .add-shortcut-btn{ 
  width: 48%; height: 44px; line-height: 44px; text-align: center; color: #fff; background-image: -webkit-linear-gradient( 0deg, @main, @secondary); border: 0 none; border-radius: 100px; outline: none; cursor: pointer;box-shadow: 0 4px 6px 0 rgba(0,154,255,.2); 
  &:hover{
    background: -webkit-gradient(linear,left top,right top,from(#1490ff),to(#14bdff));
  }
}

.add-shortcut-box .add-shortcut-btn-box .add-shortcut-btn.remove{
  float: right;
  background: #eee;
  color: #222;
  box-shadow: unset;
  &:hover{
    background: #e0e0e0;
  }
}
.icon-userText{
  width: 100px; height: 100px;border-radius: 50%;margin-bottom: 16px;box-shadow: 0 4px 6px rgba(0,154,255,.2);
  line-height: 100px; font-size: 30px; display: inline-block; text-align: center; color: #fff; overflow: hidden;
}
.set-color{
  position: relative;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 22px 0 62px;
  &::before{
    position: absolute;
    left: 0;
    content: '颜色';
  }
  & > li{
    position: relative;
    width: 22px;
    height: 22px;
    border-radius: 50%;
    cursor: pointer;
    &.active:before{
      position: absolute;
      left: 2px;
      top: 2px;
      width: 14px;
      height: 14px;
      border-radius: 50%;
      border: 2px solid #fff;

      content: '';
    }
  }
}

.shortcut-manage1{
  // width: 0;
  width: 400px;
  height: 100%;
  position: absolute;
  top: 100%;
  right:  0;
  border-left: 1px solid rgba(0, 0, 0, 0.1);
  background-color: #fff;
  overflow: hidden;
  opacity: 0;
  box-shadow: 0 -6px 10px 0 rgba(0, 0, 0, 0.2);
  transition: all .5s;
  overflow: auto;
  z-index: 10;
  .official-manage-box{
    overflow-y: auto;
  }
  &.show{
    top: 0;
    opacity: 1;
  }
}
.manage-header{
    height: 50px;
    line-height: 50px;
    position: relative;
}    
.icon-gengduo-guanbi-px{
  display: block;
  position: absolute;
  width: 32px;
  height: 32px;
  right: 10px;
  top: 8px;
  line-height: 32px;
  text-align: center;
  cursor: pointer;
  &:hover{
    background-color: #f0f0f0;
  }
}
</style>