<template>
    <header class="head-nav">
        <el-row>
            <el-col :span="6" class='logo-container'>
                <img src="../assets/logo.png" class='logo' alt="">
                <span class='title'>在线答题系统</span>
            </el-col>
            <el-col :span='6' class="user">
                <div class="userinfo">
                    <span class='username'>
                        <el-dropdown
                                trigger="click">
                            <div class="el-dropdown-link">
                              <div class='welcome'>
                                  <p class='name comename'>欢迎</p>
                                  <p class='name avatarname'>{{userInfo.name}}</p>
                              </div>
                                <i class="el-icon-caret-bottom el-icon--right"></i>
                            </div>
                            <el-dropdown-menu slot="dropdown">
                                <el-dropdown-item command='info'>
                                  <div @click="info">个人信息</div>
                                </el-dropdown-item>
                                <el-dropdown-item command='editpwd'>
                                  <div @click="updatePwd">修改密码</div>
                                </el-dropdown-item>
                                <el-dropdown-item command='editname'>
                                  <div @click="updateName">修改用户名</div>
                                </el-dropdown-item>
                                <el-dropdown-item  command='logout'>
                                  <div @click="logout">退出</div>
                                </el-dropdown-item>
                            </el-dropdown-menu>
                        </el-dropdown>
                     </span>
                </div>
            </el-col>
        </el-row>
    </header>
</template>
<script>
import { mapGetters, mapMutations } from "vuex";
import storage from "good-storage";
import { get } from "../util/http.js";
export default {
  name: "head-nav",
  methods: {
    ...mapMutations(["setUserInfo"]),
    info() {
      this.$router.push({ name: "userInfo" });
    },
    logout() {
      this.$confirm("确定要退出登录？", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {this.getOut()})
        .catch(() => {});
    },
    // 修改密码
    updatePwd() {
      this.$router.push({ name: "updatePwd" });
    },
    // 修改用户名
    updateName() {
      this.$router.push({ name: "updateName" });
    },
    // 退出登录
    async getOut() {
      try {
        const result = await get("api/user/logout");
        if (result.statusCode == 200) {
          storage.session.remove("userInfo");
          this.setUserInfo({});
          this.$router.push({ name: "login" });
        } else {
          this.$message({
            type: "warning",
            message: result.message,
            showClose: true
          });
        }
      } catch (error) {
        this.$message({
          type: "error",
          message: error.toString(),
          showClose: true
        });
      }
    }
  },
  computed: {
    ...mapGetters(["userInfo"])
  }
};
</script>

<style scoped>
.head-nav {
  width: 100%;
  height: 80px;
  min-width: 600px;
  /* padding: 5px; */
  background: #324057;
  color: #fff;
  border-bottom: 1px solid #1f2d3d;
}
.logo-container {
  line-height: 78px;
  min-width: 400px;
}
.logo {
  height: 50px;
  width: 50px;
  margin-right: 20px;
  vertical-align: middle;
  display: inline-block;
}
.title {
  vertical-align: middle;
  font-size: 22px;
  font-family: "Microsoft YaHei";
  letter-spacing: 3px;
}
.user {
  line-height: 79px;
  text-align: right;
  float: right;
  padding-right: 10px;
}
.avatar {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  vertical-align: middle;
  display: inline-block;
}
.welcome {
  display: inline-block;
  width: auto;
  vertical-align: middle;
  padding: 0 5px;
}
.name {
  line-height: 20px;
  text-align: center;
  font-size: 14px;
}
.comename {
  font-size: 12px;
}
.avatarname {
  color: #409eff;
  font-weight: bolder;
}
.username {
  cursor: pointer;
  margin-right: 5px;
}
.el-dropdown {
  color: #fff;
}
</style>
