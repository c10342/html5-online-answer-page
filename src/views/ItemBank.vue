<template>
    <div class="my-container">
        <el-button type="primary" @click="openFile">上传试题</el-button>
        <el-button type="success" @click="downLoadTemplate">下载试题模板</el-button>
        <input 
        ref="pathClear"
        type="file" 
        style="display:none" 
        id="file" 
        @change="upload"
        accept="application/vnd.ms-excel, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet">
        <div class="mt20 flex-row align-items">
          <h1 style="font-size:20px;">试题类型：</h1>
          <el-select v-model="questionType" placeholder="请选择试题类型">
          <el-option label="常识" value="常识"></el-option>
          <el-option label="交通安全" value="交通安全"></el-option>
          <el-option label="法律知识" value="法律知识"></el-option>
          <el-option label="问卷调查" value="问卷调查"></el-option>
          <el-option label="在线考试" value="在线考试"></el-option>
          <el-option label="练习题" value="练习题"></el-option>
          <el-option label="其他" value="其他"></el-option>
        </el-select>
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
        <div class="mt20" v-if="!isShow">
            <el-button type="primary" @click="create">添加</el-button>
        </div>
    </div>
</template>

<script>
import { mapGetters } from "vuex";
import { post,get } from "../util/http.js";
import {getRandomStr} from '../util/index.js'
export default {
  data() {
    return {
      // 单选题
      singleQuestion: [],
      // 多选题
      multipleQuestion: [],
      // 判断题
      judgementQuestion: [],
      // 问答题
      answerQuestion: [],
      checkList:['管理员','小学生','初中生','高中生','大学生','教师','游客','其他'],
      questionType:'常识'
    };
  },
  methods: {
    addSingle() {
      let id = getRandomStr();
      this.singleQuestion.push({
        id,
        title: "",
        options: { A: "", B: "", C: "", D: "" },
        answer: "",
        message: ""
      });
    },
    addMultiple() {
      let id = getRandomStr();
      this.multipleQuestion.push({
        id,
        title: "",
        options: { A: "", B: "", C: "", D: "" },
        answer: [],
        message: ""
      });
    },
    addJudgement() {
      let id = getRandomStr();
      this.judgementQuestion.push({
        id,
        title: "",
        answer: "",
        message: ""
      });
    },
    addAnswer() {
      let id = getRandomStr();
      this.answerQuestion.push({
        id,
        title: "",
        answer: "",
        message: ""
      });
    },
    async create() {
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

      if (flag) {
        let params = {};
        params.single = {
          question: this.singleQuestion,
          answer: singleAnswer,
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
        // 发布者id
        params.userId = this.userInfo._id;

        params.questionType = this.questionType

        try {
          const result = await post("/api/questions/addItemBank", params);
          if (result.statusCode == 200) {
            this.$message({
              type: "success",
              message: result.message,
              showClose: true
            });
            this.resetData()
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
          message: "请完善试题信息",
          showClose: true
        });
      }
    },
    deleteItem({ key: item, index }) {
      this[item].splice(index, 1);
    },
    openFile() {
      document.getElementById("file").click();
    },
    async upload(e) {
      try {
        let file = e.target.files[0];
        let name = file.name;
        let reg = /(\.(xls)|(xlsx))$/i;
        let titleName = name.replace(/(.*\/)*([^.]+).*/gi, "$2");
        if (reg.test(name)) {
          let formData = new FormData();
          formData.append("file", file);
          const result = await post("/api/upload/uploadFile", formData);
          if (result.statusCode == 200) {
            let data = result.data.question;
            for (let key in data) {
              data[key].forEach(item => {
                this[`${key}Question`].push(item);
              });
            }
            if (result.message) {
              this.$message({
                type: "error",
                message: result.message,
                showClose: true
              });
            } else {
              this.$message({
                type: "success",
                message: "试题解析成功",
                showClose: true
              });
            }
          } else {
            this.$message({
              type: "error",
              message: result.message,
              showClose: true
            });
          }
        } else {
          this.$message({
            type: "warning",
            message: "文件格式不正确,请选择后缀为xls或者xlsx的文件",
            showClose: true
          });
        }
      } catch (error) {
        this.$message({
          type: "error",
          message: error.toString(),
          showClose: true
        });
      }finally{
        this.$refs.pathClear.value =''
      }
    },
    resetData() {
      this.singleQuestion = [];
      this.multipleQuestion = [];
      this.judgementQuestion = [];
      this.answerQuestion = [];
    },
    async downLoadTemplate(){
      try {
        let url = '/api/downLoad/downLoadTemplate'
        window.open(url)
      } catch (error) {
        this.$message({
            showClose:true,
            type:'error',
            message:error.toString()
          })
      }
    }
  },
  computed: {
    ...mapGetters(["userInfo"]),
    isShow(){
        return this.singleQuestion.length == 0 &&
        this.multipleQuestion.length == 0 &&
        this.judgementQuestion.length == 0 &&
        this.answerQuestion.length == 0
    }
  },
}
</script>

<style lang="less" scoped>
.my-container {
  padding: 20px;
}
.min-width {
  min-width: 300px;
}
</style>


