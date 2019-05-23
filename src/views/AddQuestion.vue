<template>
    <div class="my-container">
        <el-button type="primary" @click="openFile">上传试卷</el-button>
        <el-button type="success" @click="downLoadTemplate">下载试卷模板</el-button>
        <input 
        ref="pathClear"
        type="file" 
        style="display:none" 
        id="file" 
        @change="upload"
        accept="application/vnd.ms-excel, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet">
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
                <span class="text-nowrap mr10 font20">试题名称 :</span>
                <el-input v-model.trim="questionTitle.name" clearable placeholder="请输入试题名称"></el-input>
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
          <h1 style="font-size:20px;margin-bottom:20px;">指定人群：</h1>
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
            <el-button type="primary" @click="create">创建</el-button>
            <el-button type="warning" @click="resetData">重置</el-button>
        </div>
    </div>
</template>

<script>
import { mapGetters } from "vuex";
import { post,get } from "../util/http.js";
import {getRandomStr} from '../util/index.js'
import storage from "good-storage";
export default {
  data() {
    return {
      // 试题名称
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
      checkList:['管理员','小学生','初中生','高中生','大学生','教师','游客','其他'],
      questionType:'常识',
      isSave: 0
    };
  },
  created(){
    let params = this.$route.params
    if(params.flag){
      this.singleQuestion = params.single
      this.multipleQuestion = params.multiple
      this.judgementQuestion = params.judgement
      this.answerQuestion = params.answer
    }else{
      let obj = storage.get('AddQuestion')
      if(obj){
        obj.singleQuestion && (this.singleQuestion = obj.singleQuestion)
      obj.multipleQuestion && (this.multipleQuestion = obj.multipleQuestion)
      obj.judgementQuestion && (this.judgementQuestion = obj.judgementQuestion)
      obj.answerQuestion && (this.answerQuestion = obj.answerQuestion)
      obj.questionTitle&& (this.questionTitle = obj.questionTitle)
      obj.questionType && (this.questionType = obj.questionType)
      obj.checkList && (this.checkList = obj.checkList)
      }
    }
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
      if (
        this.singleQuestion.length == 0 ||
        this.multipleQuestion.length == 0 ||
        this.judgementQuestion.length == 0 ||
        this.answerQuestion.length == 0
      ) {
        this.$message({
          showClose: true,
          message: "试卷每个类型必须有一道试题",
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
        this.questionTitle.message = "试题名称不能为空";
        flag = false;
      } else {
        this.questionTitle.message = "";
      }
      if (flag) {
        let params = {};
        params.title = this.questionTitle.name;
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
        if(this.$route.params.flag){
          params.flag = '1'
        }
        // 发布者的用户名
        params.userName = this.userInfo.name;
        // 发布者id
        params.userId = this.userInfo._id;

        if(this.checkList.includes('管理员')){
          params.checkList = JSON.stringify(this.checkList)
        }else{
          params.checkList = JSON.stringify([...this.checkList,'管理员'])
        }

        params.questionType = this.questionType

        try {
          const result = await post("/api/questions/addQuestion", params);
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
    // 返回上一级路由
    goBack() {
      this.$router.push({ name: "consultQuestions" });
    },
    back(cb) {
      if (
        !this.questionTitle.name &&
        this.singleQuestion.length == 0 &&
        this.multipleQuestion.length == 0 &&
        this.judgementQuestion.length == 0 &&
        this.answerQuestion.length == 0
      ) {
        if (cb && typeof cb == "function") {
          cb();
        }
      } else {
        this.openMessageBox(cb);
      }
    },
    openMessageBox(cb) {
      this.$confirm("试卷还没保存, 是否放弃提交并退出", "提示", {
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
            if (!this.questionTitle.name) {
              this.questionTitle.name = titleName;
            }
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
                message: "试卷解析成功",
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
      this.questionTitle = {
        name: "",
        message: ""
      };
      this.singleQuestion = [];
      this.multipleQuestion = [];
      this.judgementQuestion = [];
      this.answerQuestion = [];
      this.questionType  = '常识'
      this.checkList = ['管理员','小学生','初中生','高中生','大学生','教师','游客','其他']
      storage.remove('AddQuestion')
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
    ...mapGetters(["userInfo"])
  },
  beforeRouteLeave(to, from, next) {
    this.back(() => {
        next();
      });
  },
  watch: {
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
    questionTitle:{
      deep: true,
      handler: function(newVal) {
        this.isSave++;
      }
    },
    checkList:{
      deep: true,
      handler: function(newVal) {
        this.isSave++;
      }
    },
    questionType(){
      this.isSave++
    },
    isSave() {
      storage.set('AddQuestion', {
        singleQuestion: this.singleQuestion,
        multipleQuestion: this.multipleQuestion,
        judgementQuestion: this.judgementQuestion,
        answerQuestion: this.answerQuestion,
        questionTitle: this.questionTitle,
        questionType: this.questionType,
        checkList: this.checkList
      });
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
</style>


