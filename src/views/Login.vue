<template>
  <section class="form_container" @keydown.enter="submitForm('loginForm')">
    <div class="manage_tip">
      <span class="title">在线答题系统</span>
    </div>
    <el-form :model="loginUser" :rules="rules" ref="loginForm" class="loginForm" label-width="60px">
      <el-form-item label="邮箱" prop="email">
        <el-input v-model="loginUser.email" placeholder="请输入邮箱"></el-input>
      </el-form-item>
      <el-form-item label="密码" prop="password">
        <el-input v-model="loginUser.password" placeholder="请输入密码" type="password"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="submitForm('loginForm')" class="submit_btn">登 录</el-button>
      </el-form-item>
      <div class="login-free flex-row">
        <el-checkbox v-model="checked">七天内免登录</el-checkbox>
      </div>
      <div class="login-type">
        <div class="github">
          <p>
            使用
            <a :href="href" target='_self'>github</a>登录
          </p>
        </div>
        <div class="tiparea">
          <p>
            还没有账号？现在
            <router-link to="/register">注册</router-link>
          </p>
        </div>
      </div>
    </el-form>
  </section>
</template>

<script>
import { mapMutations } from "vuex";
import { post, get } from "../util/http.js";
import { clientID, redirect_uri } from "../util/config.js";
import cookie from "js-cookie";
export default {
  name: "login",
  data() {
    return {
      checked: true,
      loginUser: {
        email: "",
        password: ""
      },
      rules: {
        email: [
          {
            type: "email",
            required: true,
            message: "邮箱格式不正确",
            trigger: "change"
          }
        ],
        password: [
          { required: true, message: "密码不能为空", trigger: "blur" },
          { min: 6, max: 30, message: "长度在 6 到 30 个字符", trigger: "blur" }
        ]
      }
    };
  },
  async mounted() {
    try {
      const code = this.$route.query.code;
      if (code) {
        const userInfo = await get("/api/user/getGithubInfo", { code });
        if (userInfo.statusCode == 200) {
          this.$message({
            showClose: true,
            message: userInfo.message,
            type: "success"
          });
          if (this.checked) {
            cookie.set("userInfo", userInfo.data.userInfo, { expires: 7 });
          }
          this.setUserInfo(userInfo.data.userInfo);
          this.$router.push({
            name: "home"
          });
        } else {
          this.$message({
            showClose: true,
            message: userInfo.message,
            type: "warning"
          });
        }
      }
    } catch (error) {
      this.$message({
        showClose: true,
        message: error.toString(),
        type: "error"
      });
    }
  },
  methods: {
    ...mapMutations(["setUserInfo"]),
    submitForm(formName) {
      this.$refs[formName].validate(async valid => {
        if (valid) {
          try {
            const result = await post("/api/user/login", this.loginUser);
            if (result.statusCode == 200) {
              this.$message({
                showClose: true,
                message: result.message,
                type: "success"
              });
              if (this.checked) {
                cookie.set("userInfo", result.data.userInfo, { expires: 7 });
              }
              this.setUserInfo(result.data.userInfo);
              this.$router.push({
                name: "home"
              });
            } else {
              this.$message({
                showClose: true,
                message: result.message,
                type: "warning"
              });
            }
          } catch (error) {
            this.$message({
              showClose: true,
              message: error.toString(),
              type: "error"
            });
          }
        }
      });
    }
  },
  computed: {
    href() {
      return `https://github.com/login/oauth/authorize?client_id=${clientID}&redirect_uri=${redirect_uri}`;
    }
  }
};
</script>

<style scoped>
.form_container {
  width: 370px;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  padding: 25px;
  border-radius: 5px;
  text-align: center;
}
.form_container .manage_tip .title {
  font-family: "Microsoft YaHei";
  font-weight: bold;
  font-size: 26px;
  color: #fff;
}
.loginForm {
  margin-top: 20px;
  /* background-color: #fff; */
  background-color: rgba(0, 0, 0, 0.3);
  padding: 20px 40px 20px 20px;
  border-radius: 5px;
  box-shadow: 0px 5px 10px #cccc;
}

.submit_btn {
  width: 100%;
}
.tiparea {
  text-align: right;
  font-size: 12px;
  /* color: #333; */
  color: #fff;
}
.tiparea p a {
  color: #409eff;
}

.github {
  text-align: left;
  font-size: 12px;
  /* color: #333; */
  color: #fff;
}

.github p a {
  color: #409eff;
}
.login-type {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
}

.login-free {
  margin-bottom: 10px;
  margin-left: 60px;
}
</style>


