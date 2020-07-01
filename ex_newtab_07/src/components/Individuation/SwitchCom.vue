<template>
  <div class="switch-box">
    <label :for="did">
      <input :id="did" type="checkbox" :checked="checked" @change="onChange" hidden>
      <div class="switch" :class="{ active : checked }">
        <span class="switch-ball"></span>
      </div>
    </label>
  </div>
</template>

<script>
  export default {
    name: 'SwitchCom',
    data() {
      return {
      }
    },
    model: {
      prop: 'checked',
      event: 'change'
    },
    props: {
      checked: Boolean,
      did: String
    },
    methods: {
      onChange (e) {
      // console.log('switchcon-----1',this.did, e)
        this.$emit('change',this.did, e.target.checked)
      }
    }
  }
</script>

<style lang="less" scoped>
  .switch-box{
    .switch{
      width: 28px;
      height: 18px;
      background-color: #ddd;
      border-radius: 13px;
      position: relative;
      cursor: pointer;
      .switch-ball{
        width: 14px;
        height: 14px;
        display: inline-block;
        background-color: #fff;
        border-radius: 50%;
        position: absolute;
        box-shadow: 0 3px 4px rgba(0,0,0,.04);
        top: 2px;
        left: 2px;
      }
      &.active{
        background: linear-gradient(to right, #007eff, #00c0ff);
        border-color: #007eff;
        .switch-ball{
          left: auto;
          right: 2px;
        }
      }
    }
  }
</style>