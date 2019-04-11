<template>
    <div class="login">
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
                    <el-button type="primary"  @click="submitForm('loginForm')" class="submit_btn">登  录</el-button>
                </el-form-item>
                <div class="tiparea">
                    <p>还没有账号？现在<router-link to='/register'>注册</router-link></p>
                </div>
            </el-form>
        </section>
    </div>
</template>

<script>
import { mapMutations } from "vuex";
import { post } from "../util/http.js";
export default {
  name: "login",
  data() {
    return {
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
    },
  }
};
</script>

<style scoped>
.login {
  position: relative;
  width: 100%;
  height: 100%;
  background: url(../assets/bg.jpg) no-repeat center center;
  background-size: 100% 100%;
}
.form_container {
  width: 370px;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%,-50%);
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
  background-color: #fff;
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
  color: #333;
}
.tiparea p a {
  color: #409eff;
}
</style>


