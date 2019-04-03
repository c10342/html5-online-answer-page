<template>
    <div class="container">
        <div class="solt">
            <slot></slot>
        </div>
    </div>
</template>

<style scoped>
.container {
  width: 100%;
  height: 100%;
  background: url(../assets/showcase.png) no-repeat;
  background-size: 100% 100%;
}
.solt {
  width: 100%;
  height: 100%;
  box-sizing: border-box;
  /* padding-top: 100px; */
  background-color: rgba(0, 0, 0, 0.7);
  /* text-align: center; */
  color: white;
}
</style>



