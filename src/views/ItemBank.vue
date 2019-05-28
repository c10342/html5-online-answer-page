<template>
  <div id="fileContent" class="my-container">
    <p class="mb10" style="color:red;">可拖拽文件进行上传</p>
    <el-button type="primary" @click="openFile">上传试题</el-button>
    <el-button type="success" @click="downLoadTemplate">下载试题模板</el-button>
    <input
      ref="pathClear"
      type="file"
      style="display:none"
      id="file"
      @change="upload"
      accept="application/vnd.ms-excel, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
    >
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
    <Single :singleQuestion="singleQuestion" @addSingle="addSingle" @deleteItem="deleteItem"></Single>
    <!-- 多选题 -->
    <Multiple
      :multipleQuestion="multipleQuestion"
      @addMultiple="addMultiple"
      @deleteItem="deleteItem"
    ></Multiple>
    <!-- 判断题 -->
    <Judgement
      :judgementQuestion="judgementQuestion"
      @addJudgement="addJudgement"
      @deleteItem="deleteItem"
    ></Judgement>
    <!-- 简答题 -->
    <Answer :answerQuestion="answerQuestion" @addAnswer="addAnswer" @deleteItem="deleteItem"></Answer>
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
    <div class="mt20" v-if="!isShow">
      <el-button type="primary" @click="create">添加</el-button>
      <el-button type="warning" @click="resetData">重置</el-button>
    </div>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import { post, get } from "../util/http.js";
import { getRandomStr } from "../util/index.js";
import storage from "good-storage";
import img from '../assets/default.png'
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
      checkList: [],
      questionType: "常识",
      isSave: 0
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

        params.questionType = this.questionType;
        params.checkList = JSON.stringify(this.checkList);

        try {
          const result = await post("/api/questions/addItemBank", params);
          if (result.statusCode == 200) {
            this.checkList = [];
            this.$message({
              type: "success",
              message: result.message,
              showClose: true
            });
            this.resetData();
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
        let file = e.dataTransfer ? e.dataTransfer.files[0] : e.target.files[0];
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
      } finally {
        this.$refs.pathClear.value = "";
      }
    },
    resetData() {
      this.singleQuestion = [];
      this.multipleQuestion = [];
      this.judgementQuestion = [];
      this.answerQuestion = [];
      this.questionType = "常识";
      this.checkList = [];
      storage.remove("AddItemBank");
    },
    async downLoadTemplate() {
      try {
        let url = "/api/downLoad/downLoadTemplate";
        window.open(url);
      } catch (error) {
        this.$message({
          showClose: true,
          type: "error",
          message: error.toString()
        });
      }
    },
    back(cb) {
      if (
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
      this.$confirm("试题还没保存, 是否放弃提交并退出", "提示", {
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
    onDrop(e) {
      e.preventDefault();
      this.upload(e);
    }
  },
  beforeRouteLeave(to, from, next) {
    this.back(() => {
      if(this.singleQuestion.length == 0 &&
        this.multipleQuestion.length == 0 &&
        this.judgementQuestion.length == 0 &&
        this.answerQuestion.length == 0){
           storage.remove("AddItemBank");
        }
      const div = document.getElementById("fileContent");
      div.removeEventListener("drag", this.onDrop);
      next();
    });
  },
  created() {
    let obj = storage.get("AddItemBank");
    if (obj) {
      obj.singleQuestion && (this.singleQuestion = obj.singleQuestion);
      obj.multipleQuestion && (this.multipleQuestion = obj.multipleQuestion);
      obj.judgementQuestion && (this.judgementQuestion = obj.judgementQuestion);
      obj.answerQuestion && (this.answerQuestion = obj.answerQuestion);
      obj.questionType && (this.questionType = obj.questionType);
      obj.checkList && (this.checkList = obj.checkList);

      //消息推送
      var n = new Notification("提示", {
        body: "自动还原上次自动保存状态",
        tag: "avenstar", //代表通知的一个识别标签，相同tag时只会打开同一个通知窗口
        icon: img,
        requireInteraction: false //通知保持有效不自动关闭，默认为false
      });
    }
  },
  mounted() {
    // 实现拖拽文件上传
    const div = document.getElementById("fileContent");
    div.ondragenter = div.ondragover = div.ondragleave = function() {
      // 组织默认事件
      return false;
    };
    // 释放文件
    div.addEventListener("drop", this.onDrop);
  },
  computed: {
    ...mapGetters(["userInfo"]),
    isShow() {
      return (
        this.singleQuestion.length == 0 &&
        this.multipleQuestion.length == 0 &&
        this.judgementQuestion.length == 0 &&
        this.answerQuestion.length == 0
      );
    }
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
    checkList: {
      deep: true,
      handler: function(newVal) {
        this.isSave++;
      }
    },
    questionType() {
      this.isSave++;
    },
    isSave() {
      storage.set("AddItemBank", {
        singleQuestion: this.singleQuestion,
        multipleQuestion: this.multipleQuestion,
        judgementQuestion: this.judgementQuestion,
        answerQuestion: this.answerQuestion,
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


