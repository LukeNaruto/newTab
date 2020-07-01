<template>
  <div
    class="wallpaper-container"
    :style="`background-color: ${transition ? '#333' : 'transparent'}`"
  >
    <div
      class="wallpaper"
      :style="[
        {
          'background-image': getIndividuation.isShowWallpaper
            ? `url(${getWallpaper.ic})`
            : 'none',
        },
        { opacity: getChangeWallpaper ? 0 : 1 },
      ]"
    />
  </div>
</template>

<script>
import { mapGetters } from "vuex";
export default {
  name: "wallpaper",
  components: {},
  computed: {
    ...mapGetters([
      "getWallpaper",
      "getIndividuation",
      "getChangeWallpaper",
      "getTheme",
    ]),
  },
  data() {
    return {
      // containerColor: this.getTheme === 'black' ? '#333' : 'transparent',
      transition: false,
    };
  },
  watch: {
    getChangeWallpaper: {
      handler: "handleBg",
      immediate: false,
    },
  },
  mounted() {},
  methods: {
    handleBg() {
      // console.log("handleBg", this.getChangeWallpaper);
      if (this.getChangeWallpaper && !this.transition) {
        // this.containerColor = "#333";
        this.transition = true;
      } else {
        setTimeout(() => {
          // this.containerColor = "transparent";
          this.transition = false;
        }, 500);
      }
    },
  },
};
</script>

<style lang="less" scoped>
.wallpaper-container {
  width: 100%;
  height: 100%;
  position: absolute;
  left: 0;
  top: 0;
  z-index: -1;
  .wallpaper {
    width: 100%;
    height: 100%;
    position: absolute;
    left: 0;
    top: 0;
    transition: "background" 0.5s linear;
    background: center no-repeat;
    background-size: cover;
    opacity: 1;
    transition: opacity 500ms ease;
  }
}
</style>
