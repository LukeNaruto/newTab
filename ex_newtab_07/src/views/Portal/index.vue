<template>
  <div class="portal" v-show="!getIndividuation.isEmptyCon">
    <SearchTool />
  </div>
</template>

<script>
import SearchTool from "_c/SearchTool/";
import { mapGetters } from "vuex";
export default {
  name: "Portal",
  components: {
    SearchTool
  },
  computed: {
    ...mapGetters(["getIndividuation"])
  }
};
</script>

<style lang="less" scoped>
.portal {
  width: 100%;
  height: 100%;
  min-height: 100%;
  position: absolute;
  top: 0;
  left: 0;
  display: flex;
  justify-content: center;
  align-items: center;
  overflow: hidden;
}
.search-tool {
  margin-top: -200px;
}
</style>
