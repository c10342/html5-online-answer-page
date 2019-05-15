<template>
    <bg>
      <template>
        <div class="form_container">
        <h1 class="title">个人信息</h1>
          <div class="flex-row font24">
              <span class="w100 mr10">用户名 :</span>
              <p>{{userInfo.name}}</p>
          </div>
          <div class="flex-row font24" style="margin-top:50px;">
              <span class="w100 mr10">邮&nbsp;&nbsp;&nbsp;箱 :</span>
              <p>{{userInfo.email}}</p>
          </div>
          <div class="flex-row font24" style="margin-top:50px;">
              <span class="w100 mr10">身&nbsp;&nbsp;&nbsp;份 :</span>
              <p>{{userInfo.identity}}</p>
          </div>
        </div>
      </template>
    </bg>
</template>

<script>
import { mapGetters } from "vuex";
export default {
  computed: {
    ...mapGetters(["userInfo"])
  }
};
</script>

<style lang="less" scoped>
.form_container {
  width: 370px;
  height: 210px;
  position: absolute;
  top: 10%;
  left: 34%;
  padding: 25px;
  border-radius: 5px;
  text-align: center;
}
.title {
  font-size: 30px;
  font-weight: bold;
  margin-bottom: 40px;
}
</style>


