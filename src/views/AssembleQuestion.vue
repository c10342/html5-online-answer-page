<template>
    <div class="my-container">
       <div>123123</div>
    </div>
</template>

<script>
import { get, post } from "../util/http.js";
import { mapGetters } from "vuex";
export default {
  data() {
    return {
      questionsList: [],
      pageSize: 10,
      currentPage: 1,
      total: 0,
      layout: "total, prev, pager, next,jumper",
      title: "",
      beginTime: "",
      endTime: "",
      dialogVisible: false,
      questionId: "",
      commentInfo: "",
      questionType:'',
      questionTitle:''
    };
  },
  created() {
    // this.getQuestionList();
  },
  methods: {
    async getQuestionList() {
      try {
        let params = {};
        if (this.beginTime && this.endTime && this.beginTime > this.endTime) {
          this.$message({
            showClose: true,
            message: "结束时间不能小于开始时间",
            type: "warning"
          });
          return;
        }
        if (this.beginTime) {
          params.beginTime = this.beginTime;
        }
        if (this.endTime) {
          params.endTime = this.endTime;
        }
        if (this.title) {
          params.title = this.title;
        }
        if (this.questionType) {
          params.questionType = this.questionType;
        }
        params.pageSize = this.pageSize;
        params.currentPage = this.currentPage;
        params.userId = this.userInfo._id;
        const result = await get("/api/questions/getAnswerQuestion", params);
        if (result.statusCode == 200) {
          this.questionsList = result.data.answerList;
          this.total = result.data.total;
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
    },
    handleClick(index, row) {
      this.$router.push({ name: "answerDetail", params: {id:row.answerId} });
    },
    handleCurrentChange(e) {
      this.currentPage = e;
      this.getQuestionList();
    },
    comment(index, row) {
      this.questionId = row.questionId;
      this.dialogVisible = true;
      this.questionTitle = row.title
    },
    async ok() {
      try {
        if (!this.commentInfo) {
          this.$message({
            showClose: true,
            message: "评论内容不能为空",
            type: "warning"
          });
          return;
        } else {
          let params = {
            userName: this.userInfo.name,
            content: Xss(this.commentInfo),
            questionId: this.questionId,
            userId: this.userInfo._id,
            title:this.questionTitle
          };
          const result = await post("/api/comment/submitComment", params);
          if (result.statusCode == 200) {
            this.$message({
              showClose: true,
              message: result.message,
              type: "success"
            });
          } else {
            this.$message({
              showClose: true,
              message: result.message,
              type: "error"
            });
          }
          this.dialogVisible = false;
          this.commentInfo = "";
        }
      } catch (error) {
        this.$message({
          showClose: true,
          message: error.toString(),
          type: "error"
        });
        this.commentInfo = "";
        this.dialogVisible = false;
      }
    },
    cancel() {
      if (this.commentInfo) {
        this.$confirm("确认取消评论？")
          .then(_ => {
            this.questionId = "";
            this.commentInfo = "";
            this.dialogVisible = false;
          })
          .catch(_ => {});
      } else {
        this.questionId = "";
        this.dialogVisible = false;
      }
    },
    handleClose(done) {
      if (this.commentInfo) {
        this.$confirm("确认取消评论？")
          .then(_ => {
            this.questionId = "";
            this.commentInfo = "";
            done();
          })
          .catch(_ => {});
      } else {
        done();
      }
    },
    search(){
      this.currentPage = 1
      this.getQuestionList()
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
.text-nowrap {
  white-space: nowrap;
}
.my-pagination {
  margin: 30px 0;
}
</style>


