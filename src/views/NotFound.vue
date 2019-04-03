<template>
  <div @click="goToHome" class="not-found">
    <img src="@/assets/404.jpg" alt="">
  </div>
</template>

<script>
  export default {
    methods: {
      goToHome() {
        this.$router.replace({name:'home'})
      }
    }
  }
</script>


<style lang="less" scoped>
  .not-found {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    img {
      display: block;
      width: 100%;
      height: 100%;
    }
  }
</style>

