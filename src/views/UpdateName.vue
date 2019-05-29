<template>
    <bg>
      <template>
        <div class="form_container">
          <el-form :model="form" :rules="rules" ref="Form" class="form" label-width="80px">
              <el-form-item label="新用户名" prop="name">
                  <el-input v-model="form.name" placeholder="请输入新用户名"></el-input>
              </el-form-item>
              <el-form-item>
                  <el-button type="primary"  class="submit_btn" @click="submitForm('Form')">修改用户名</el-button>
              </el-form-item>
          </el-form>
      </div>
      </template>
    </bg>
</template>

<script>
import { post } from "../util/http.js";
import { mapGetters, mapMutations } from "vuex";
import cookie from 'js-cookie'
export default {
  data() {
    return {
      form: {
        name: ""
      },
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
            const result = await post("/api/user/updateName", {
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
  // background-color: #fff;
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


