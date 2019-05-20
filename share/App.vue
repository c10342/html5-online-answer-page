<template>
  <div id="app">
    <div v-cloak v-if='flag' class="font20">感谢作答</div>
    <div v-cloak v-if='!flag'>
        <div class="time">时间：
            <span style="color:red;">{{showTime}}</span>
        </div>
        <div>
            <div class="flex-row align-items">
                <span class="text-nowrap mr10 font20">试卷名称 :</span>
                <span class="font24">{{title}}</span>
            </div>
        </div>

        <!-- 单选题 -->
        <div class="mt20">
            <h1 class="font20">一、单选题</h1>
            <div class="mt30" v-for="(question,index) in singleQuestion" :key="index">
                <div class="flex-row align-items">
                    <span class="font18">{{index+1}}、</span>
                    <span class="font20 text-nowrap mr10">题目 : </span>
                    <span class="font20">{{question.title}}</span>
                </div>
                <div class="mt20 ml20">
                    <div class="mb10 flex-row" v-for="(i,option) in question.options" :key="option">
                        <el-radio v-model.trim="question.answer" :label="option" class="mr20">{{option}}</el-radio>
                        <span class="font18">{{question.options[option]}}</span>
                    </div>
                </div>
                <div class="mt20 flex-row item">
                    <span style="color:red;">{{question.message}}</span>
                </div>
            </div>
        </div>
        <!-- 单选题 -->

        <!-- 多选题 -->
        <div class="mt20">
            <h1 class="font20">二、多选题</h1>
            <div class="mt30" v-for="(question,index) in multipleQuestion" :key="index">
                <div class="flex-row align-items">
                    <span class="font18">{{index+1}}、</span>
                    <span class="font20 text-nowrap mr10">题目 : </span>
                    <span class="font20">{{question.title}}</span>
                </div>
                <div class="mt20 ml20">
                    <div class="mb10 flex-row align-items" v-for="(i,option) in question.options" :key="option">
                        <el-checkbox v-model.trim="question.answer" :label="option" class="mr20">{{option}}</el-checkbox>
                        <span class="font18">{{question.options[option]}}</span>
                    </div>
                </div>
                <div class="mt20 flex-row item">
                    <span style="color:red;">{{question.message}}</span>
                </div>
            </div>
        </div>
        <!-- 多选题 -->

        <!-- 判断题 -->
        <div class="mt20">
            <h1 class="font20">三、判断题</h1>
            <div class="mt30" v-for="(question,index) in judgementQuestion" :key="index">
                <div class="flex-row align-items">
                    <span class="font18">{{index+1}}、</span>
                    <span class="font20 text-nowrap mr10">题目 : </span>
                    <span class="font20">{{question.title}}</span>
                </div>
                <div class="mt20 flex-row" style="margin-left:30px;">
                    <el-radio v-model.trim="question.answer" label="A" class="mr20">对</el-radio>
                    <el-radio v-model.trim="question.answer" label="B" class="mr20">错</el-radio>
                </div>
                <div class="mt20 flex-row item">
                    <span style="color:red;">{{question.message}}</span>
                </div>
            </div>
        </div>
        <!-- 判断题 -->

        <!-- 简答题 -->
        <div class="mt20">
            <h1 class="font20">四、问答题</h1>
            <div class="mt30" v-for="(question,index) in answerQuestion" :key="index">
                <div class="flex-row align-items">
                    <span class="font18">{{index+1}}、</span>
                    <span class="font20 text-nowrap mr10">题目 : </span>
                    <span class="font20">{{question.title}}</span>
                </div>
                <div class="mt20 flex-row" style="margin-left:30px;">
                    <el-input type="textarea" placeholder="请输入内容" v-model.trim="question.answer">
                    </el-input>
                </div>
                <div class="mt20 flex-row item">
                    <span style="color:red;">{{question.message}}</span>
                </div>
            </div>
        </div>
        <!-- 简答题 -->

        <div class="mt20" v-if="singleQuestion.length || multipleQuestion.length || judgementQuestion.length || answerQuestion.length">
            <el-button type="primary" @click="submit">提交</el-button>
        </div>
    </div>
  </div>
</template>

<script>
import axios from "axios";
// get请求
const get = (url, params = {}, headers = {}) => {
  return new Promise((resolve, reject) => {
    axios
      .get(url, {
        params,
        headers
      })
      .then(res => {
        if (res.status == 200) {
          resolve(res.data);
        } else {
          reject(res.data);
        }
      })
      .catch(err => {
        reject(err);
      });
  });
};

// post请求
const post = (url, params = {}) => {
  return new Promise((resolve, reject) => {
    axios
      .post(url, params)
      .then(res => {
        if (res.status == 200) {
          resolve(res.data);
        } else {
          reject(res.data);
        }
      })
      .catch(err => {
        reject(err);
      });
  });
};
export default {
  name: "app",
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
      time: 0,
      id: null,
      questionType: "",
      flag: false
    };
  },
  async mounted() {
    try {
      const href = window.location.href;
      const index = href.indexOf("=");
      if (index == -1) {
        return;
      }
      const id = href.substring(index + 1);
      if (!id) {
        this.$message({
          type: "error",
          message: "试题出错",
          showClose: true
        });
        return;
      }
      this.id = id;
      const result = await get("/api/questions/getQuestionById/" + id);
      if (result.statusCode == 200) {
        this.title = result.data.questionList.title;
        this.singleQuestion = result.data.questionList.singleQuestion;
        this.multipleQuestion = result.data.questionList.multipleQuestion;
        this.judgementQuestion = result.data.questionList.judgementQuestion;
        this.answerQuestion = result.data.questionList.answerQuestion;
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
  methods: {
    initTime() {
      this.timer = setInterval(() => {
        this.time++;
      }, 1000);
    },
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
        params.userName = "匿名用户";
        // 答题者id
        params.userId = Date.now().toString();
        params.questionId = this.id;
        params.answerTime = this.showTime;
        params.questionType = this.questionType;
        try {
          const result = await post("/api/questions/submitQuestion", params);
          if (result.statusCode == 200) {
            if (this.timer) {
              clearInterval(this.timer);
            }
            this.flag = true;
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
  beforeDestroy() {
    if (this.timer) {
      clearInterval(this.timer);
    }
  },
  computed: {
    showTime() {
      let s = this.time % 60;
      s = s < 10 ? `0${s}` : s;
      let m = parseInt(this.time / 60) % 60;
      m = m < 10 ? `0${m}` : m;
      let h = parseInt(this.time / 60 / 60) % 24;
      h = h < 10 ? `0${h}` : h;
      return `${h}：${m}：${s}`;
    }
  }
};
</script>

<style lang="less">
#app {
  font-family: "Avenir", Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}
</style>
