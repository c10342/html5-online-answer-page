<template>
  <div class="my-container">
    <div class="time">
      时间：
      <span style="color:red;">{{showTime}}</span>
    </div>
    <div class="flex-row flex-wrap">
      <div class="flex-row flex-center min-width mt10">
        <span class="text-nowrap pr10 pl10 font18">单选题数量 :</span>
        <el-input v-model="singleCount" placeholder="请输入单选题数量" clearable></el-input>
      </div>
      <div class="flex-row flex-center min-width mt10">
        <span class="text-nowrap pr10 pl10 font18">多选题数量 :</span>
        <el-input v-model="multipleCount" placeholder="请输入多选题数量" clearable></el-input>
      </div>
      <div class="flex-row flex-center min-width mt10">
        <span class="text-nowrap pr10 pl10 font18">判断题数量 :</span>
        <el-input v-model="judgementCount" placeholder="请输入判断题数量" clearable></el-input>
      </div>
    </div>
    <div class="flex-row flex-wrap">
      <div class="flex-row flex-center min-width mt10">
        <span class="text-nowrap pr10 pl10 font18">简答题数量 :</span>
        <el-input v-model="answerCount" placeholder="请输入简答题数量" clearable></el-input>
      </div>
      <div class="flex-row flex-center min-width mt10">
        <span class="text-nowrap pr10 pl10 font18">试题类型 :</span>
        <el-select clearable v-model="questionType" placeholder="请选择试卷类型">
          <el-option label="常识" value="常识"></el-option>
          <el-option label="交通安全" value="交通安全"></el-option>
          <el-option label="法律知识" value="法律知识"></el-option>
          <el-option label="问卷调查" value="问卷调查"></el-option>
          <el-option label="在线考试" value="在线考试"></el-option>
          <el-option label="练习题" value="练习题"></el-option>
        </el-select>
      </div>
      <div class="flex-row flex-center ml10 mt10">
        <el-button type="primary" @click="create">随机生成</el-button>
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
    <div class="mt20" v-if="showBtn">
      <el-button type="primary" @click="submit">提交</el-button>
    </div>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import { post, get } from "../util/http.js";
import { getDate } from "../util";
export default {
  data() {
    return {
      // 单选题
      singleQuestion: [],
      singleCount: 2,
      // 多选题
      multipleQuestion: [],
      multipleCount: 2,
      // 判断题
      judgementQuestion: [],
      judgementCount: 2,
      // 问答题
      answerQuestion: [],
      answerCount: 2,
      isAnswer: true,
      time: 0,
      questionType: "常识"
    };
  },
  methods: {
    async submit() {
      let flag = true;
      let answer = {};
      let singleAnswer = {};
      let multipleAnswer = {};
      let judgementAnswer = {};
      let answerAnswer = {};

      let s = []
      // 判断单选题是否已经完成
      this.singleQuestion.forEach(item => {
        singleAnswer[item.id] = item.a;
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
        s.push({
          ...item,
          answer:item.a
        })
      });

      let m = []
      // 判断多选题是否已经完成
      this.multipleQuestion.forEach(item => {
        multipleAnswer[item.id] = item.a.sort().toString();
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
        m.push({
          ...item,
          answer:item.a
        })
      });

      let j = []
      // 判断判断题是否已经完成
      this.judgementQuestion.forEach(item => {
        judgementAnswer[item.id] = item.a;
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
        j.push({
          ...item,
          answer:item.a
        })
      });

      let a = []
      // 判断简答题是否已经完成
      this.answerQuestion.forEach(item => {
        answerAnswer[item.id] = item.a;
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
        a.push({
          ...item,
          answer:item.a
        })
      });
      if (!flag) {
        this.$message({
          type: "warning",
          message: "请完善试题在提交",
          showClose: true
        });
      }
      if (flag) {
        let params = {};
        params.title = `练习题(${getDate()})`;
        params.answer = answer;
        // 答题者的用户名
        params.userName = this.userInfo.name;
        // 答题者id
        params.userId = this.userInfo._id;
        params.answerTime = this.showTime;
        params.questionType = this.questionType;
        params.singleQuestion = {
          question: s,
          answer: singleAnswer,
          count: s.length
        }
        params.multipleQuestion = {
          question: m,
          answer: multipleAnswer,
          count: m.length
        };
        params.judgementQuestion = {
          question: j,
          answer: judgementAnswer,
          count: j.length
        };
        params.answerQuestion = {
          question: a,
          answer: answerAnswer,
          count: a.length
        };
        params.flag = '2'
        try {
          const result = await post("/api/questions/submitQuestion", params);
          if (result.statusCode == 200) {
            this.$message({
              type: "success",
              message: result.message,
              showClose: true
            });
            this.$router.push({
                name:'answerDetail',
                params:{id:result.data.result._id}
            })
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
    initTime() {
      this.timer = setInterval(() => {
        this.time++;
      }, 1000);
    },
    async create() {
      try {
        let params = {
          userId: this.userInfo._id,
          singleCount: this.singleCount,
          multipleCount: this.multipleCount,
          judgementCount: this.judgementCount,
          answerCount: this.answerCount,
          questionType: this.questionType,
          checkList:this.userInfo.identity
        };
        const result = await get("/api/questions/createExercises", params);
        if (result.statusCode == 200) {
          this.singleQuestion = result.data.exercises.single;
          this.multipleQuestion = result.data.exercises.multiple;
          this.judgementQuestion = result.data.exercises.judgement;
          this.answerQuestion = result.data.exercises.answer;
          if (!this.showBtn) {
            this.$message({
              type: "warning",
              message: "试题库暂时不存在该类型试题",
              showClose: true
            });
            return;
          }
          if (this.timer) {
            clearInterval(this.timer);
          }
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
    }
  },
  beforeDestroy() {
    if (this.timer) {
      clearInterval(this.timer);
    }
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
    },
    showBtn() {
      return (
        this.singleQuestion.length ||
        this.multipleQuestion.length ||
        this.judgementQuestion.length ||
        this.answerQuestion.length
      );
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


