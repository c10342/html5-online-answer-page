<template>
  <div class="index" ref="fullScreen" @fullscreenchange="fullscreenchange">
    <HeadNav 
    :message="message" 
    @fullScreen="fullScreen"></HeadNav>
    <LeftMenu></LeftMenu>
    <div class="rightContainer">
      <router-view></router-view>
    </div>
  </div>
</template>

<script>
import HeadNav from "../components/HeadNav";
import LeftMenu from "../components/LeftMenu";
import { mapGetters } from "vuex";
// import { routes } from "../router.js";

export default {
  name: "index",
  data() {
    return {
      isFullScreen: false,
      message: "全屏",
    };
  },
  components: {
    HeadNav,
    LeftMenu
  },
  methods: {
    fullScreen() {
      if (this.isFullScreen) {
        this.exitFullscreen()
      } else {
        this.launchFullScreen(this.$refs.fullScreen)
      }
    },
    exitFullscreen() {
      if (document.exitFullscreen) {
        document.exitFullscreen();
      } else if (document.mozExitFullScreen) {
        document.mozExitFullScreen();
      } else if (document.webkitExitFullscreen) {
        document.webkitExitFullscreen();
      }
    },
    launchFullScreen(element) { 
      if(element.requestFullscreen) { 
      element.requestFullscreen(); 
      } else if(element.mozRequestFullScreen) { 
      element.mozRequestFullScreen(); 
      } else if(element.webkitRequestFullscreen) { 
      element.webkitRequestFullscreen(); 
      } else if(element.msRequestFullscreen) { 
      element.msRequestFullscreen(); 
      } 
    },
    fullscreenchange(e) {
      this.$nextTick(()=>{
        let isFullscreen =
        document.webkitIsFullScreen ||
        document.mozFullScreen ||
        document.msFullScreen ||
        document.fullScreen ||
        window.fullScreen;
      this.isFullScreen = isFullscreen ? true : false;
      })
    },
  },
  // created() {
  //   let jurisdiction = this.userInfo.jurisdiction;
  //   let arr = [];
  //   routes.forEach(element => {
  //     if (jurisdiction.includes(element.type)) {
  //       arr.push(element);
  //     }
  //   });
  //   Array.prototype.push.apply(this.$router.options.routes[2].children, arr);
  //   this.$router.addRoutes([this.$router.options.routes[2]]);
  // },
  computed: {
    ...mapGetters(["userInfo"]),
  },
  watch: {
    isFullScreen(newVal) {
      if (newVal) {
        this.message = "退出全屏";
      } else {
        this.message = "全屏";
      }
    }
  }
};
</script>
<style scoped>
.index {
  width: 100%;
  height: 100%;
  overflow: hidden;
}
.rightContainer {
  position: relative;
  top: 0;
  left: 180px;
  width: calc(100% - 180px);
  height: calc(100% - 81px);
  overflow: auto;
  background-color: white;
}

</style>

