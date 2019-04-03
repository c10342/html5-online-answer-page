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
                    align='center'
                    prop="title"
                    label="试题名称">
                </el-table-column>
                <el-table-column
                    align='center'
                    prop="answerCount"
                    label="答题总人数">
                </el-table-column>
                <el-table-column
                    prop="percent"
                    align='center'
                    label="整体正确率">
                    <template slot-scope="scope">
                        <div>{{scope.row.percent | numToPercent}}</div>
                    </template>
                </el-table-column>
                <el-table-column
                    align='center'
                    prop="createTime"
                    label="发布时间">
                    <template slot-scope="scope">
                        <div>{{scope.row.createTime | formatDate}}</div>
                    </template>
                </el-table-column>
                <el-table-column label="操作" width="250" align='center'>
                    <template slot-scope="scope">
                        <el-button
                        size="small"
                        type="primary"
                        :disabled="scope.row.answerCount==0"
                        @click="handleEdit(scope.$index, scope.row)">查看统计</el-button>
                        <el-button
                        size="small"
                        type="success"
                        :disabled="scope.row.answerCount==0"
                        @click="handleClick(scope.$index, scope.row)">查看答题者</el-button>
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
      endTime: ""
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
        const result = await get("/api/statistics/statisticsQuestions", params);
        if (result.statusCode == 200) {
          this.questionsList = result.data.list;
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
    handleEdit(index, row) {
      this.$router.push({name:'statisticsDetail',params:{id:row.questionId}})
    },
    handleCurrentChange(e) {
      this.currentPage = e;
      this.getQuestionList();
    },
    handleClick(index,row){
      this.$router.push({name:'answerUserList',params:{id:row.questionId}})
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
  margin-top: 30px;
  margin-bottom: 20px;
}
</style>


