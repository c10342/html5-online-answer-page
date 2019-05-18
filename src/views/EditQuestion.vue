<template>
    <div class="my-container">
      <div class="mt20 flex-row align-items">
          <h1 style="font-size:20px;">试卷类型：</h1>
          <el-select v-model="questionType" placeholder="请选择试卷类型">
          <el-option label="常识" value="常识"></el-option>
          <el-option label="交通安全" value="交通安全"></el-option>
          <el-option label="法律知识" value="法律知识"></el-option>
          <el-option label="问卷调查" value="问卷调查"></el-option>
          <el-option label="在线考试" value="在线考试"></el-option>
          <el-option label="练习题" value="练习题"></el-option>
          <el-option label="其他" value="其他"></el-option>
        </el-select>
        </div>
        <div class="mt20">
            <div class="flex-row flex-center">
                <span class="text-nowrap mr10 font20">试卷名称 :</span>
                <el-input v-model.trim="questionTitle.name" clearable placeholder="请输入试卷名称"></el-input>
            </div>
            <div style="margin:10px 0 0 100px;">
                <span style="color:red;">{{questionTitle.message}}</span>
            </div>
        </div>
        <!-- 单选题 -->
        <Single 
        :singleQuestion='singleQuestion'
        @addSingle='addSingle' 
        @deleteItem='deleteItem'></Single>
        <!-- 多选题 -->
        <Multiple 
        :multipleQuestion='multipleQuestion'
        @addMultiple='addMultiple' 
        @deleteItem='deleteItem'></Multiple>
        <!-- 判断题 -->
        <Judgement 
        :judgementQuestion='judgementQuestion'
        @addJudgement='addJudgement' 
        @deleteItem='deleteItem'></Judgement>
        <!-- 简答题 -->
        <Answer 
        :answerQuestion='answerQuestion'
        @addAnswer='addAnswer' 
        @deleteItem='deleteItem'></Answer>
        <div class="mt20">
          <h1 style="font-size:20px;margin-bottom:20px;">可见人员：</h1>
          <el-checkbox-group v-model="checkList">
          <el-checkbox label="小学生"></el-checkbox>
          <el-checkbox label="初中生"></el-checkbox>
          <el-checkbox label="高中生"></el-checkbox>
          <el-checkbox label="大学生"></el-checkbox>
          <el-checkbox label="教师"></el-checkbox>
          <el-checkbox label="游客"></el-checkbox>
          <el-checkbox label="其他"></el-checkbox>
        </el-checkbox-group>
        </div>
        <div class="mt20">
            <el-button type="primary" @click="save">保存</el-button>
            <el-button type="success" @click="goBack">返回</el-button>
        </div>
    </div>
</template>

<script>
import { mapGetters } from "vuex";
import { post, get } from "../util/http.js";
export default {
  data() {
    return {
      // 试卷名称
      questionTitle: {
        name: "",
        message: ""
      },
      // 单选题
      singleQuestion: [],
      // 多选题
      multipleQuestion: [],
      // 判断题
      judgementQuestion: [],
      // 问答题
      answerQuestion: [],
      _id: "",
      // 判断是否已经被修改过
      isEdit: false,
      // 是否已经保存
      isSave: false,
      questionType:[],
      checkList:[]
    };
  },
  created() {
    this.getQuestionDetail();
  },
  methods: {
    async getQuestionDetail() {
      try {
        let { id } = this.$route.params;
        const result = await get(
          "/api/questions/getPublishedQuestionById/" + id
        );
        if (result.statusCode == 200) {
          this.questionTitle.name = result.data.questionDetail.title;
          this.singleQuestion = result.data.questionDetail.single;
          this.multipleQuestion = result.data.questionDetail.multiple;
          this.judgementQuestion = result.data.questionDetail.judgement;
          this.answerQuestion = result.data.questionDetail.answer;
          this.checkList = JSON.parse(result.data.questionDetail.checkList)
          this.questionType = result.data.questionDetail.questionType
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
      } finally {
        this.$nextTick(() => {
          this.isEdit = false;
        });
      }
    },
    addSingle() {
      let id = Date.now().toString();
      this.singleQuestion.push({
        id,
        title: "",
        options: { A: "", B: "", C: "", D: "" },
        answer: "",
        message: ""
      });
    },
    addMultiple() {
      let id = Date.now().toString();
      this.multipleQuestion.push({
        id,
        title: "",
        options: { A: "", B: "", C: "", D: "" },
        answer: [],
        message: ""
      });
    },
    addJudgement() {
      let id = Date.now().toString();
      this.judgementQuestion.push({
        id,
        title: "",
        answer: "",
        message: ""
      });
    },
    addAnswer() {
      let id = Date.now().toString();
      this.answerQuestion.push({
        id,
        title: "",
        answer: "",
        message: ""
      });
    },
    async save() {
      if (
        this.singleQuestion.length == 0 &&
        this.multipleQuestion.length == 0 &&
        this.judgementQuestion.length == 0 &&
        this.answerQuestion == 0
      ) {
        this.$message({
          showClose: true,
          message: "试卷至少要有一道试卷",
          type: "warning"
        });
        return;
      }
      let flag = true;
      let singleAnswer = {};
      let multipleAnswer = {};
      let judgementAnswer = {};
      let answerAnswer = {};
      // 判断单选题信息是否齐全
      this.singleQuestion.forEach(item => {
        let message = null;
        if (!item.title) {
          message = "题目不能为空";
        } else if (
          !item.options["A"] ||
          !item.options["B"] ||
          !item.options["C"] ||
          !item.options["D"]
        ) {
          message = "选项不能为空";
        } else if (!item.answer) {
          message = "请选择一个正确答案";
        }
        if (message) {
          flag = false;
        } else {
          singleAnswer[item.id] = item.answer;
        }
        item.message = message;
      });
      // 判断多选题信息是否齐全
      this.multipleQuestion.forEach(item => {
        let message = null;
        if (!item.title) {
          message = "题目不能为空";
        } else if (
          !item.options["A"] ||
          !item.options["B"] ||
          !item.options["C"] ||
          !item.options["D"]
        ) {
          message = "选项不能为空";
        } else if (item.answer.length <= 1) {
          message = "请选择两个或两个以上正确答案";
        }
        if (message) {
          flag = false;
        } else {
          multipleAnswer[item.id] = item.answer.sort().toString();
        }
        item.message = message;
      });
      // 判断判断题信息是否齐全
      this.judgementQuestion.forEach(item => {
        let message = null;
        if (!item.title) {
          message = "题目不能为空";
        } else if (!item.answer) {
          message = "请选择一个正确答案";
        }
        if (message) {
          flag = false;
        } else {
          judgementAnswer[item.id] = item.answer;
        }
        item.message = message;
      });
      // 判断简答题信息是否齐全
      this.answerQuestion.forEach(item => {
        let message = null;
        if (!item.title) {
          message = "题目不能为空";
        } else if (!item.answer) {
          message = "请填写正确答案";
        }
        if (message) {
          flag = false;
        } else {
          answerAnswer[item.id] = item.answer;
        }
        item.message = message;
      });

      if (!this.questionTitle.name) {
        this.questionTitle.message = "试卷名称不能为空";
        flag = false;
      } else {
        this.questionTitle.message = "";
      }
      if (flag) {
        let params = {};
        params.title = this.questionTitle.name;
        params.single = {
          question: this.singleQuestion,
          answer:singleAnswer,
          count: this.singleQuestion.length
        };
        params.multiple = {
          question: this.multipleQuestion,
          answer: multipleAnswer,
          count: this.multipleQuestion.length
        };
        params.judgement = {
          question: this.judgementQuestion,
          answer: judgementAnswer,
          count: this.judgementQuestion.length
        };
        params.answer = {
          question: this.answerQuestion,
          answer: answerAnswer,
          count: this.answerQuestion.length
        };
        // 发布者的用户名
        params.userName = this.userInfo.name;
        // 发布者id
        params.userId = this.userInfo._id;
        // 试卷id
        params._id = this.$route.params.id;

        if(this.checkList.includes('管理员')){
          params.checkList = JSON.stringify(this.checkList)
        }else{
          params.checkList = JSON.stringify([...this.checkList,'管理员'])
        }

        params.questionType = this.questionType

        try {
          const result = await post("/api/questions/editQuestion", params);
          if (result.statusCode == 200) {
            this.$message({
              type: "success",
              message: result.message,
              showClose: true
            });
            this.isSave = true;
            this.$router.back();
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
      } else {
        this.$message({
          type: "warning",
          message: "请完善试卷信息",
          showClose: true
        });
      }
    },
    deleteItem({ key: item, index }) {
      this[item].splice(index, 1);
    },
    // 返回上一级路由
    goBack() {
      this.$router.push({ name: "publishedQuestions" });
    },
    back(cb) {
      if (
        !this.questionTitle.name &&
        this.singleQuestion.length == 0 &&
        this.multipleQuestion.length == 0 &&
        this.judgementQuestion.length == 0 &&
        this.answerQuestion == 0
      ) {
        if (cb && typeof cb == "function") {
          cb();
        }
      } else {
        if (this.isEdit) {
          this.openMessageBox(cb);
        } else {
          if (cb && typeof cb == "function") {
            cb();
          }
        }
      }
    },
    openMessageBox(cb) {
      this.$confirm("试卷还没保存, 是否放弃保存并退出", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          if (cb && typeof cb == "function") {
            cb();
          }
        })
        .catch(() => {});
    }
  },
  beforeRouteLeave(to, from, next) {
    if (this.isSave) {
      next();
    } else {
      this.back(() => {
        next();
      });
    }
  },
  watch: {
    questionTitle: {
      deep: true,
      handler: function() {
        this.isEdit = true;
      }
    },
    singleQuestion: {
      deep: true,
      handler: function() {
        this.isEdit = true;
      }
    },
    multipleQuestion: {
      deep: true,
      handler: function() {
        this.isEdit = true;
      }
    },
    judgementQuestion: {
      deep: true,
      handler: function() {
        this.isEdit = true;
      }
    },
    answerQuestion: {
      deep: true,
      handler: function() {
        this.isEdit = true;
      }
    }
  },
  computed: {
    ...mapGetters(["userInfo"])
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
</style>


