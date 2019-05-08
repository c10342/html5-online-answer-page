<template>
  <div class="index">
    <HeadNav></HeadNav>
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
import { routes } from "../router.js";

export default {
  name: "index",
  components: {
    HeadNav,
    LeftMenu
  },
  created() {
    let jurisdiction = this.userInfo.jurisdiction;
    let arr = [];
    routes.forEach(element => {
      if (jurisdiction.includes(element.type)) {
        arr.push(element);
      }
    });
    Array.prototype.push.apply(this.$router.options.routes[2].children, arr);
    this.$router.addRoutes([this.$router.options.routes[2]]);
  },
  computed: {
    ...mapGetters(["userInfo"])
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

