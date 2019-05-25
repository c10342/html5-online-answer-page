<template>
    <bg>
      <template>
        <div class="form_container">
          <el-form :model="form" :rules="rules" ref="Form" class="form" label-width="80px">
              <el-form-item label="原始密码" prop="oldPassword">
                  <el-input v-model="form.oldPassword" placeholder="请输入原始密码" type="password"></el-input>
              </el-form-item>
              <el-form-item label="新密码" prop="newPassword">
                  <el-input v-model="form.newPassword" placeholder="请输入新密码" type="password"></el-input>
              </el-form-item>
              <el-form-item label="确认密码" prop="surePassword">
                  <el-input v-model="form.surePassword" placeholder="请确认密码" type="password"></el-input>
              </el-form-item>
              <el-form-item>
                  <el-button type="primary"  class="submit_btn" @click="submitForm('Form')">修改密码</el-button>
              </el-form-item>
          </el-form>
      </div>
      </template>
    </bg>
</template>

<script>
import { post } from "../util/http.js";
import { mapGetters, mapMutations } from "vuex";
export default {
  data() {
    var validatePass2 = (rule, value, callback) => {
      if (value !== this.form.newPassword) {
        callback(new Error("两次输入密码不一致!"));
      } else {
        callback();
      }
    };
    return {
      form: {
        oldPassword: "",
        newPassword: "",
        surePassword: ""
      },
      // 验证表单
      rules: {
        oldPassword: [
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
        newPassword: [
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
        surePassword: [
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
            const result = await post("/api/user/updatePwd", {
              ...this.form,
              _id: this.userInfo._id
            });
            if (result.statusCode == 200) {
              this.$message({
                showClose: true,
                message: result.message,
                type: "success"
              });
              if(cookie.get('userInfo')){
                cookie.set('userInfo',result.data.userInfo,{ expires: 7 })
              }
              this.setUserInfo(result.data.userInfo);
              this.$router.push({ name: "home" });
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
    ...mapGetters(["userInfo"])
  }
};
</script>

<style lang="less" scoped>
.form {
  margin-top: 20px;
  background-color: #fff;
  padding: 20px 40px 20px 20px;
  border-radius: 5px;
  box-shadow: 0px 5px 10px #cccc;
}

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
.submit_btn {
  width: 100%;
}
</style>


