<template>
    <section class="form_container" @keydown.enter="submitForm('registerForm')">
        <div class="manage_tip">
            <span class="title">在线答题系统</span>
        </div>
        <el-form :model="registerUser" :rules="rules" class="registerForm" ref="registerForm" label-width="80px">
            <el-form-item label="用户名" prop="name">
                <el-input v-model="registerUser.name" placeholder="请输入用户名"></el-input>
            </el-form-item>
            <el-form-item label="邮箱" prop="email">
                <el-input v-model="registerUser.email" placeholder="请输入邮箱"></el-input>
            </el-form-item>
            <el-form-item label="密码" prop="password">
                <el-input v-model="registerUser.password" placeholder="请输入密码" type="password"></el-input>
            </el-form-item>
            <el-form-item label="确认密码" prop="password2">
                <el-input v-model="registerUser.password2" placeholder="请确认密码" type="password"></el-input>
            </el-form-item>
            <el-form-item label="验证码" prop="code">
                <div class="flex-row">
                  <el-input v-model="registerUser.code" placeholder="请输入验证码"></el-input>
                <el-button :disabled="disabled" @click="getCode" type="primary" class="code_btn">{{!disabled?'获取':`${second}s`}}</el-button>
                </div>
            </el-form-item>
             <el-form-item label="身份" prop="identity">
              <el-select v-model="registerUser.identity" placeholder="请选择身份">
                <el-option label="小学生" value="小学生"></el-option>
                <el-option label="初中生" value="初中生"></el-option>
                <el-option label="高中生" value="高中生"></el-option>
                <el-option label="大学生" value="大学生"></el-option>
                <el-option label="教师" value="教师"></el-option>
                <el-option label="游客" value="游客"></el-option>
                <el-option label="其他" value="其他"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item>
                <el-button type="primary"  class="submit_btn" @click="submitForm('registerForm')">注 册</el-button>
            </el-form-item>
            <div class="tiparea">
                <p>已经有账号？现在<router-link to='/login'>登录</router-link></p>
            </div>
        </el-form>
    </section>
</template>

<script>
import { mapMutations } from "vuex";
import { checkEmail } from "../util/index.js";
import { post, get } from "../util/http.js";
export default {
  name: "register",
  data() {
    var validatePass2 = (rule, value, callback) => {
      if (value !== this.registerUser.password) {
        callback(new Error("两次输入密码不一致!"));
      } else {
        callback();
      }
    };
    return {
      registerUser: {
        name: "",
        email: "",
        password: "",
        password2: "",
        code: "",
        identity:''
      },
      disabled: false,
      second: 60,
      // 验证表单
      rules: {
        name: [
          {
            required: true,
            message: "用户名不能为空",
            // 失去焦点的时候验证
            trigger: "blur"
          },
          {
            min: 2,
            max: 30,
            message: "用户名长度应为2到30个字符",
            trigger: "blur"
          }
        ],
        email: [
          {
            type: "email",
            required: true,
            message: "邮箱格式不正确",
            trigger: "blur"
          }
        ],
        password: [
          {
            required: true,
            trigger: "blur",
            message: "密码不能为空"
          },
          {
            min: 6,
            max: 30,
            message: "密码长度应为6到30个字符",
            trigger: "blur"
          }
        ],
        password2: [
          {
            required: true,
            trigger: "blur",
            message: "密码不能为空"
          },
          {
            min: 6,
            max: 30,
            message: "密码长度应为6到30个字符",
            trigger: "blur"
          },
          {
            validator: validatePass2,
            trigger: "blur"
          }
        ],
        code: [
          {
            required: true,
            message: "验证码不能为空",
            // 失去焦点的时候验证
            trigger: "blur"
          },
          {
            min: 4,
            max: 4,
            message: "验证码长度应为4个字符",
            trigger: "blur"
          }
        ],
        identity: [
          {
            required: true,
            message: "身份不能为空",
            trigger: "change"
          }
        ]
      }
    };
  },
  methods: {
    ...mapMutations(["setUserInfo"]),
    // 点击注册
    submitForm(formName) {
      this.$refs[formName].validate(async valid => {
        if (valid) {
          try {
            const result = await post("/api/user/register", this.registerUser);
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
    // 获取验证码
    getCode() {
      if (this.registerUser.email == "") {
        this.$message({
          showClose: true,
          message: "邮箱不能为空",
          type: "warning"
        });
        return;
      }
      if (!checkEmail(this.registerUser.email)) {
        return;
      }
      this.disabled = true;
      this.timer = setInterval(() => {
        this.second = this.second - 1;
        if (this.second === 0) {
          this.disabled = false;
          this.second = 60;
          clearInterval(this.timer);
        }
      }, 1000);

      get("/api/user/sendCode", { email: this.registerUser.email })
        .then(res => {
          if (res.statusCode == 200) {
            this.$message({
              showClose: true,
              message: res.message,
              type: "success"
            });
          } else {
            this.$message({
              showClose: true,
              message: res.message,
              type: "warning"
            });
          }
        })
        .catch(error => {
          this.$message({
            showClose: true,
            message: error.toString(),
            type: "error"
          });
        });
    }
  },
  beforeDestroy() {
    if (this.timer) {
      clearInterval(this.timer);
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
.registerForm {
  margin-top: 20px;
  background-color: rgba(0, 0, 0, .3);
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
  color: #fff;
}
.tiparea p a {
  color: #409eff;
}
.code_btn {
  width: 130px;
  padding: 0;
  margin-left: 5px;
}
</style>



