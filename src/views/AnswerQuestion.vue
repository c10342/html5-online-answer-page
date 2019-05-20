<template>
  <div class="my-container">
    <div class="time">
      时间：
      <span style="color:red;">{{showTime}}</span>
    </div>
    <div>
      <div class="flex-row align-items">
        <span class="text-nowrap mr10 font20">试卷名称 :</span>
        <span class="font24">{{title}}</span>
      </div>
    </div>
    <!-- 单选题 -->
    <Single v-if="singleQuestion.length" :isAnswer="isAnswer" :singleQuestion="singleQuestion"></Single>
    <!-- 多选题 -->
    <Multiple
      v-if="multipleQuestion.length"
      :isAnswer="isAnswer"
      :multipleQuestion="multipleQuestion"
    ></Multiple>
    <!-- 判断题 -->
    <Judgement
      v-if="judgementQuestion.length"
      :isAnswer="isAnswer"
      :judgementQuestion="judgementQuestion"
    ></Judgement>
    <!-- 简答题 -->
    <Answer v-if="answerQuestion.length" :isAnswer="isAnswer" :answerQuestion="answerQuestion"></Answer>
    <div class="mt20">
      <el-button type="primary" @click="submit">提交</el-button>
      <el-button type="success" @click="goBack">返回</el-button>
    </div>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import { post, get } from "../util/http.js";
import { strSimilarity2Percent } from "../util/index.js";
import storage from "good-storage";
export default {
  data() {
    return {
      // 试卷名称
      title: "",
      // 单选题
      singleQuestion: [],
      // 多选题
      multipleQuestion: [],
      // 判断题
      judgementQuestion: [],
      // 问答题
      answerQuestion: [],
      isAnswer: true,
      time: 0,
      isCanGoback: false,
      questionType: "",
      leaveCount: 0, //鼠标离开窗口次数
      isSave: 0
    };
  },
  methods: {
    async submit() {
      let flag = true;
      let answer = {};
      // 判断单选题是否已经完成
      this.singleQuestion.forEach(item => {
        let message = null;
        if (!item.answer) {
          message = "该题还没有完成";
        }
        if (message) {
          flag = false;
        } else {
          answer[item.id] = item.answer;
        }
        item.message = message;
      });
      // 判断多选题是否已经完成
      this.multipleQuestion.forEach(item => {
        let message = null;
        if (item.answer.length == 0) {
          message = "该题还没有完成";
        }
        if (message) {
          flag = false;
        } else {
          answer[item.id] = item.answer;
        }
        item.message = message;
      });
      // 判断判断题是否已经完成
      this.judgementQuestion.forEach(item => {
        let message = null;
        if (!item.answer) {
          message = "该题还没有完成";
        }
        if (message) {
          flag = false;
        } else {
          answer[item.id] = item.answer;
        }
        item.message = message;
      });
      // 判断简答题是否已经完成
      this.answerQuestion.forEach(item => {
        let message = null;
        if (!item.answer) {
          message = "该题还没有完成";
        }
        if (message) {
          flag = false;
        } else {
          answer[item.id] = item.answer;
        }
        item.message = message;
      });
      if (flag) {
        let params = {};
        params.title = this.title;
        params.answer = answer;
        // 答题者的用户名
        params.userName = this.userInfo.name;
        // 答题者id
        params.userId = this.userInfo._id;
        params.questionId = this.$route.params.id;
        params.answerTime = this.showTime;
        params.questionType = this.questionType;
        try {
          const result = await post("/api/questions/submitQuestion", params);
          if (result.statusCode == 200) {
            storage.remove(`questionId-${this.$route.params.id}`)
            this.$message({
              type: "success",
              message: result.message,
              showClose: true
            });
            this.isCanGoback = true;
            if (this.$route.query.isCollection) {
              this.$router.replace({ name: "collectionQuestion" });
            } else {
              this.$router.replace({ name: "consultQuestions" });
            }
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
    // 返回上一级路由
    goBack() {
      this.$nextTick(() => {
        if (this.$route.query.isCollection) {
          this.$router.push({ name: "collectionQuestion" });
        } else {
          this.$router.push({ name: "consultQuestions" });
        }
      });
    },
    initTime() {
      this.timer = setInterval(() => {
        this.time++;
      }, 1000);
    },
    mouseLeave() {
      this.leaveCount++;
    }
  },
  async created() {
    try {
      let { id } = this.$route.params;
      let q = storage.get(`questionId-${this.$route.params.id}`);
      const result = await get("/api/questions/getQuestionById/" + id);
      if (result.statusCode == 200) {
        this.title = result.data.questionList.title;
        let s = result.data.questionList.singleQuestion;
        let m = result.data.questionList.multipleQuestion;
        let j = result.data.questionList.judgementQuestion;
        let a = result.data.questionList.answerQuestion;
        if (q) {
          q.singleQuestion.forEach(item => {
            let index = s.findIndex(i => i.id == item.id);
            if (index != -1) {
              let str1 = JSON.stringify(Object.assign({},item,{message:'',answer:''}))
              let str2 = JSON.stringify(Object.assign({},s[index],{message:'',answer:''}))
              if(str1 == str2){
                s[index] = item;
              }else{
                s[index].answer = item.answer
              }
            }
          });
          q.multipleQuestion.forEach(item => {
            let index = m.findIndex(i => i.id == item.id);
            if (index != -1) {
              let str1 = JSON.stringify(Object.assign({},item,{message:'',answer:''}))
              let str2 = JSON.stringify(Object.assign({},m[index],{message:'',answer:''}))
              if(str1 == str2){
                m[index] = item;
              }else{
                m[index].answer = item.answer
              }
            }
          });
          q.judgementQuestion.forEach(item => {
            let index = j.findIndex(i => i.id == item.id);
            if (index != -1) {
              let str1 = JSON.stringify(Object.assign({},item,{message:'',answer:''}))
              let str2 = JSON.stringify(Object.assign({},j[index],{message:'',answer:''}))
              if(str1 == str2){
                j[index] = item;
              }else{
                j[index].answer = item.answer
              }
            }
          });
          q.answerQuestion.forEach(item => {
            let index = a.findIndex(i => i.id == item.id);
            if (index != -1) {
              let str1 = JSON.stringify(Object.assign({},item,{message:'',answer:''}))
              let str2 = JSON.stringify(Object.assign({},a[index],{message:'',answer:''}))
              if(str1 == str2){
                a[index] = item;
              }else{
                a[index].answer = item.answer
              }
            }
          });
          this.singleQuestion = s;
          this.judgementQuestion = j;
          this.multipleQuestion = m;
          this.answerQuestion = a;
          this.time = q.time;
        } else {
          this.singleQuestion = s;
          this.multipleQuestion = m;
          this.judgementQuestion = j;
          this.answerQuestion = a;
        }
        this.questionType = result.data.questionList.questionType;
        this.initTime();
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
  },
  beforeDestroy() {
    if (this.timer) {
      clearInterval(this.timer);
    }
    window.removeEventListener("mouseleave", this.mouseLeave);
  },
  computed: {
    ...mapGetters(["userInfo"]),
    showTime() {
      let s = this.time % 60;
      s = s < 10 ? `0${s}` : s;
      let m = parseInt(this.time / 60) % 60;
      m = m < 10 ? `0${m}` : m;
      let h = parseInt(this.time / 60 / 60) % 24;
      h = h < 10 ? `0${h}` : h;
      return `${h}：${m}：${s}`;
    }
  },
  beforeRouteLeave(to, from, next) {
    if (this.isCanGoback) {
      next();
      return;
    }
    let flag = true;
    // 判断单选题是否已经完成
    flag &&
      this.singleQuestion.forEach(item => {
        if (item.answer) {
          flag = false;
        }
      });
    // 判断多选题是否已经完成
    flag &&
      this.multipleQuestion.forEach(item => {
        if (item.answer.length != 0) {
          flag = false;
        }
      });
    // 判断判断题是否已经完成
    flag &&
      this.judgementQuestion.forEach(item => {
        if (item.answer) {
          flag = false;
        }
      });
    // 判断简答题是否已经完成
    flag &&
      this.answerQuestion.forEach(item => {
        if (item.answer) {
          flag = false;
        }
      });
    if (flag) {
      next();
    } else {
      this.$confirm("试卷还没提交, 是否放弃提交并退出", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          next();
        })
        .catch(() => {});
    }
  },
  watch: {
    async leaveCount(newVal) {
      if (this.questionType == "在线考试") {
        if (newVal <= 3) {
          this.$message({
            type: "warning",
            message: `您已经离开页面${newVal}次,第四次就会被强制交卷`,
            showClose: true
          });
        }
        if (newVal == 4) {
          let answer = {};
          this.singleQuestion.forEach(item => {
            answer[item.id] = item.answer || "未填写";
          });
          this.multipleQuestion.forEach(item => {
            answer[item.id] = item.answer || "未填写";
          });
          this.judgementQuestion.forEach(item => {
            answer[item.id] = item.answer || "未填写";
          });
          this.answerQuestion.forEach(item => {
            answer[item.id] = item.answer || "未填写";
          });
          let params = {};
          params.title = this.title;
          params.answer = answer;
          // 答题者的用户名
          params.userName = this.userInfo.name;
          // 答题者id
          params.userId = this.userInfo._id;
          params.questionId = this.$route.params.id;
          params.answerTime = this.showTime;
          params.questionType = this.questionType;
          try {
            const result = await post("/api/questions/submitQuestion", params);
            if (result.statusCode == 200) {
              this.$message({
                type: "success",
                message: result.message,
                showClose: true
              });
              this.isCanGoback = true;
              if (this.$route.query.isCollection) {
                this.$router.replace({ name: "collectionQuestion" });
              } else {
                this.$router.replace({ name: "consultQuestions" });
              }
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
      }
    },
    questionType(newVal) {
      if (newVal == "在线考试") {
        document.addEventListener("mouseleave", this.mouseLeave);
      }
    },
    singleQuestion: {
      deep: true,
      handler: function(newVal) {
        this.isSave++;
      }
    },
    multipleQuestion: {
      deep: true,
      handler: function(newVal) {
        this.isSave++;
      }
    },
    judgementQuestion: {
      deep: true,
      handler: function(newVal) {
        this.isSave++;
      }
    },
    answerQuestion: {
      deep: true,
      handler: function(newVal) {
        this.isSave++;
      }
    },
    isSave(newVal) {
      if (newVal > 4 && this.questionType != "在线考试") {
        this.isCanGoback = true;
        storage.set(`questionId-${this.$route.params.id}`, {
          singleQuestion: this.singleQuestion,
          multipleQuestion: this.multipleQuestion,
          judgementQuestion: this.judgementQuestion,
          answerQuestion: this.answerQuestion,
          title: this.title,
          questionType: this.questionType,
          time: this.time
        });
      }
    }
  }
};
</script>

<style lang="less" scoped>
.my-container {
  padding: 20px;
}
.min-width {
  min-width: 300px;
}
.time {
  position: fixed;
  right: 50px;
  top: 100px;
  font-size: 20px;
}
</style>


