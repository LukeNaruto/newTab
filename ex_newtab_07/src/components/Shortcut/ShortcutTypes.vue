<template>
  <div class="shortcut-types-box">
    <span v-for="item in getShortcutType" @click="setShortcutTypeIdFn(item._id)" :class="{ active : getShortcutTypeId == item._id && !isSearching }" :key="item._id" class="shortcut-type">
      {{ item.t }}
    </span>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
  export default {
    name: 'ShortcutTypes',
    data() {
      return {
        isSearching: false,
      }
    },
    created(){
      this.isSearching = this.getSearchShortcut.running;
    },
    computed: {
      ...mapGetters([
        'getShortcutType',
        'getShortcutTypeId',
        'getSearchShortcut',
      ]),
    },
    watch:{
      'getSearchShortcut.running'(bool){
        this.isSearching = bool;
      }
    },
    methods: {
      setShortcutTypeIdFn (id) {
        this.$store.commit('setShortcutTypeId', id);
        this.$store.commit('setSearchShortcut', {
          text: '',
          running: false,
        });
        // this.$store.dispatch('getShortcutList')
      }
    }
  }
</script>

<style lang="less" scoped>
  .shortcut-types-box{
    margin: 10px;
  }
  .shortcut-type{
    display: inline-block;
    border: 1px solid #eee;
    padding: 5px 12px;
    border-radius: 150px;
    margin: 0 8px 8px 1px;
    background-color: #f9f9f9;
    cursor: pointer;
    &:nth-child(6n){
      margin-right: 0;
    }
    &.active, &:hover{
      background: linear-gradient(to right,rgb(0, 126, 255), rgb(0, 192, 255));
      color: #fff;
      border-color: rgb(0, 192, 255);
      box-shadow: 0 4px 6px rgba(0,154,255,.2);
    }
  }
</style>