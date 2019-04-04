<template>
    <div class="my-container">
        <el-dialog
            title="评论"
            :visible.sync="dialogVisible"
            width="30%"
            :before-close="handleClose">
            <div>
                <el-input
                v-model="commentInfo"
                type="textarea"
                placeholder="请输入内容"></el-input>
            </div>
            <span slot="footer" class="dialog-footer">
                <el-button @click="cancel">取 消</el-button>
                <el-button type="primary" @click="ok">确 定</el-button>
            </span>
        </el-dialog>
        <div class="flex-row flex-wrap">
            <div class="flex-row flex-center min-width mt10">
            <span class="text-nowrap pr10 font18">试题名称 : </span>
            <el-input
                v-model="title"
                placeholder="请输入试题名称"
                clearable>
            </el-input>
            </div>
            <div class="flex-row flex-center min-width mt10">
                <span class="text-nowrap pr10 pl10 font18">填写时间 : </span>
                <el-date-picker
                    v-model="beginTime"
                    type="date"
                    placeholder="选择日期">
                </el-date-picker>
                <span class="pl10 pr10 font18">--</span>
                <el-date-picker
                    v-model="endTime"
                    type="date"
                    placeholder="选择日期">
                </el-date-picker>
            </div>
            <div class="flex-row flex-center ml10 mt10">
                <el-button type="primary" @click="search">查询</el-button>
            </div>
        </div>
        <div class="mt20">
            <el-table
                :data="questionsList"
                style="width: 100%">
                <el-table-column
                    type="index"
                    width="20">
                </el-table-column>
                <el-table-column
                    prop="title"
                    align='center'
                    label="试题名称">
                </el-table-column>
                <el-table-column
                    prop="single"
                    align='center'
                    label="单选题(对/共计)">
                    <template slot-scope="scope">
                        <div>{{`${scope.row.single.singleCorrect} / ${scope.row.single.singleCount}`}}</div>
                    </template>
                </el-table-column>
                <el-table-column
                    prop="multiple"
                    align='center'
                    label="多选题(对/共计)">
                    <template slot-scope="scope">
                        <div>{{`${scope.row.multiple.multipleCorrect} / ${scope.row.multiple.multipleCount}`}}</div>
                    </template>
                </el-table-column>
                <el-table-column
                    prop="judgement"
                    align='center'
                    label="判断题(对/共计)">
                    <template slot-scope="scope">
                        <div>{{`${scope.row.judgement.judgementCorrect} / ${scope.row.judgement.judgementCount}`}}</div>
                    </template>
                </el-table-column>
                <el-table-column
                    prop="answer"
                    align='center'
                    label="简答题(对/共计)">
                    <template slot-scope="scope">
                        <div>{{`${scope.row.answer.answerCorrect} / ${scope.row.answer.answerCount}`}}</div>
                    </template>
                </el-table-column>
                <el-table-column
                    prop="correctCount"
                    align='center'
                    label="正确题数">
                </el-table-column>
                <el-table-column
                    prop="totalCount"
                    align='center'
                    label="总题数">
                </el-table-column>
                <el-table-column
                    prop="correctPercent"
                    align='center'
                    label="答对率">
                    <template slot-scope="scope">
                        <div>{{scope.row.correctPercent | numToPercent}}</div>
                    </template>
                </el-table-column>
                <el-table-column
                    prop="userName"
                    align='center'
                    label="发布者">
                </el-table-column>
                <el-table-column
                    prop="createTime"
                    align='center'
                    label="填写时间">
                    <template slot-scope="scope">
                        <div>{{scope.row.createTime | formatDate}}</div>
                    </template>
                </el-table-column>
                <el-table-column
                    prop="answerTime"
                    align='center'
                    label="完成时间">
                </el-table-column>
                <el-table-column label="操作" align='center' width="200">
                    <template slot-scope="scope">
                        <el-button
                        size="small"
                        type="success"
                        :disabled="scope.row.isComment"
                        @click="comment(scope.$index, scope.row)">{{scope.row.isComment?'已评论':'评论'}}</el-button>
                        <el-button
                        type="primary"
                        size="small"
                        @click="handleClick(scope.$index, scope.row)">查看详情</el-button>
                    </template>
                </el-table-column>
            </el-table>
        </div>
        <div v-if="total>10" class="text-center my-pagination">
            <el-pagination
                @current-change="handleCurrentChange"
                :current-page="currentPage"
                :page-size="pageSize"
                :layout='layout'
                :background='true'
                :total="total">
            </el-pagination>
        </div>
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
      commentInfo: ""
    };
  },
  created() {
    this.getQuestionList();
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
            content: this.commentInfo,
            questionId: this.questionId,
            userId: this.userInfo._id
          };
          const result = await post("/api/comment/submitComment", params);
          if (result.statusCode == 200) {
            this.$message({
              showClose: true,
              message: result.message,
              type: "success"
            });
            this.getQuestionList();
          } else {
            this.$message({
              showClose: true,
              message: "评论失败",
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
  // position: relative;
  // height: calc(100% - 71px);
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


