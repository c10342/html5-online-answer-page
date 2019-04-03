<template>
    <div class="my-container">
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
                <span class="text-nowrap pr10 pl10 font18">出卷人名称 : </span>
                <el-input
                    v-model="userName"
                    placeholder="请输入出卷人名称"
                    clearable>
                </el-input>
            </div>
            <div class="flex-row flex-center min-width mt10">
                <span class="text-nowrap pr10 pl10 font18">发布时间 : </span>
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
                <el-button type="primary" @click="getQuestionList">查询</el-button>
                <el-button type="primary" @click="addQuestion">发布新试题</el-button>
            </div>
        </div>
        <div class="mt20">
            <el-table
                :data="questionsList"
                style="width: 100%">
                    <el-table-column
                    type="index"
                    width="50">
                </el-table-column>
                <el-table-column
                    prop="title"
                    label="试题名称">
                </el-table-column>
                <el-table-column
                    prop="single"
                    label="单选题数量">
                    <template slot-scope="scope">
                        <div>{{scope.row.single.count}}</div>
                    </template>
                </el-table-column>
                <el-table-column
                    prop="multiple"
                    label="多选题数量">
                    <template slot-scope="scope">
                        <div>{{scope.row.multiple.count}}</div>
                    </template>
                </el-table-column>
                <el-table-column
                    prop="judgement"
                    label="判断题数量">
                    <template slot-scope="scope">
                        <div>{{scope.row.judgement.count}}</div>
                    </template>
                </el-table-column>
                <el-table-column
                    prop="answer"
                    label="简答题数量">
                    <template slot-scope="scope">
                        <div>{{scope.row.answer.count}}</div>
                    </template>
                </el-table-column>
                    <el-table-column
                    prop="userName"
                    label="发布者">
                </el-table-column>
                <el-table-column
                    prop="createTime"
                    label="发布时间">
                    <template slot-scope="scope">
                        <div>{{scope.row.createTime | formatDate}}</div>
                    </template>
                </el-table-column>
                <el-table-column label="操作">
                    <template slot-scope="scope">
                        <el-button
                        :disabled="scope.row.userId==userInfo._id || answerArr.includes(scope.row._id)"
                        size="mini"
                        @click="handleClick(scope.$index, scope.row)">开始做题</el-button>
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
import { get } from "../util/http.js";
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
      userName: "",
      beginTime: "",
      endTime: "",
      answerArr: []
    };
  },
  created() {
    this.getQuestionList();
  },
  methods: {
    addQuestion() {
      this.$router.push({ name: "addQuestion" });
    },
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
        if (this.userName) {
          params.userName = this.userName;
        }
        params.pageSize = this.pageSize;
        params.currentPage = this.currentPage;
        params._id = this.userInfo._id;
        const result = await get("/api/questions/getQuestion", params);
        if (result.statusCode == 200) {
          this.questionsList = result.data.questionList;
          this.total = result.data.total;
          this.answerArr = result.data.answerArr;
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
      this.$router.push({ name: "answerQuestion", params: row });
    },
    handleCurrentChange(e) {
      this.currentPage = e;
      this.getQuestionList();
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
  position: relative;
  height: calc(100% - 71px);
}
.min-width {
  min-width: 300px;
}
.text-nowrap {
  white-space: nowrap;
}
.my-pagination {
  // position: absolute;
  // bottom: 50px;
  // left: 0;
  // width: 100%;
  margin: 30px 0;
}
</style>


