<template>
    <div class="my-container">
        <div class="flex-row flex-wrap">
            <div class="flex-row flex-center min-width mt10">
            <span class="text-nowrap pr10 font18">题目 : </span>
            <el-input
                v-model="title"
                placeholder="请输入试卷名称"
                clearable>
            </el-input>
            </div>
            <div class="flex-row flex-center min-width mt10">
            <span class="text-nowrap pr10 pl10 font18">试题类型 : </span>
                <el-select v-model="types" placeholder="请选择试卷类型">
                <el-option label="单选题" :value="{label:'单选题',value:0}"></el-option>
                <el-option label="多选题" :value="{label:'多选题',value:1}"></el-option>
                <el-option label="判断题" :value="{label:'判断题',value:2}"></el-option>
                <el-option label="简答题" :value="{label:'简答题',value:3}"></el-option>
                </el-select>
            </div>
            <div class="flex-row flex-center min-width mt10">
                <span class="text-nowrap pr10 pl10 font18">时间 : </span>
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
        <div class="mt20" v-show="selectTypes==0 || selectTypes==1">
            <el-table
                :data="mistakeList"
                style="width: 100%">
                <el-table-column
                    type="index"
                    width="20">
                </el-table-column>
                <el-table-column
                    prop="title"
                    align='center'
                    :show-overflow-tooltip='true'
                    label="题目">
                </el-table-column>
                <el-table-column
                    prop="A"
                    align='center'
                    :show-overflow-tooltip='true'
                    label="A">
                </el-table-column>
                <el-table-column
                    prop="B"
                    align='center'
                    :show-overflow-tooltip='true'
                    label="B">
                </el-table-column>
                <el-table-column
                    prop="C"
                    align='center'
                    :show-overflow-tooltip='true'
                    label="C">
                </el-table-column>
                <el-table-column
                    prop="D"
                    align='center'
                    :show-overflow-tooltip='true'
                    label="D">
                </el-table-column>
                <el-table-column
                    prop="count"
                    align='center'
                    :show-overflow-tooltip='true'
                    label="错误次数">
                </el-table-column>
                <el-table-column
                    prop="myAnswer"
                    align='center'
                    :show-overflow-tooltip='true'
                    label="你的答案">
                </el-table-column>
                <el-table-column
                    prop="answer"
                    align='center'
                    :show-overflow-tooltip='true'
                    label="正确答案">
                </el-table-column>
                <el-table-column
                    prop="createTime"
                    align='center'
                    :show-overflow-tooltip='true'
                    label="时间">
                    <template slot-scope="scope">
                        <div>{{scope.row.createTime | formatDate}}</div>
                    </template>
                </el-table-column>
                <el-table-column
                    align='center'
                    label="操作">
                    <template slot-scope="scope">
                        <el-button type="warning" @click="deleteMistake(scope.$index, scope.row)">删除</el-button>
                    </template>
                </el-table-column>
            </el-table>
        </div>
        <div class="mt20" v-show="selectTypes==2 || selectTypes==3">
            <el-table
                :data="mistakeList"
                style="width: 100%">
                <el-table-column
                    type="index"
                    width="20">
                </el-table-column>
                <el-table-column
                    prop="title"
                    align='center'
                    :show-overflow-tooltip='true'
                    label="题目">
                </el-table-column>
                <el-table-column
                    prop="count"
                    align='center'
                    :show-overflow-tooltip='true'
                    label="错误次数">
                </el-table-column>
                <el-table-column
                    prop="myAnswer"
                    align='center'
                    :show-overflow-tooltip='true'
                    label="你的答案">
                </el-table-column>
                <el-table-column
                    prop="answer"
                    align='center'
                    :show-overflow-tooltip='true'
                    label="正确答案">
                </el-table-column>
                <el-table-column
                    prop="createTime"
                    align='center'
                    :show-overflow-tooltip='true'
                    label="时间">
                    <template slot-scope="scope">
                        <div>{{scope.row.createTime | formatDate}}</div>
                    </template>
                </el-table-column>
                <el-table-column
                    align='center'
                    label="操作">
                    <template slot-scope="scope">
                        <el-button type="warning"  @click="deleteMistake(scope.$index, scope.row)">删除</el-button>
                    </template>
                </el-table-column>
            </el-table>
        </div>
        <div v-if="total>pageSize" class="text-center my-pagination">
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
      mistakeList: [],
      pageSize: 10,
      currentPage: 1,
      total: 0,
      layout: "total, prev, pager, next,jumper",
      title: "",
      beginTime: "",
      endTime: "",
      types: { label: "单选题", value: 0 },
      selectTypes: 0
    };
  },
  created() {
    this.getMistakeList();
  },
  methods: {
    async getMistakeList() {
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
        params.types = this.types.value;
        params.pageSize = this.pageSize;
        params.currentPage = this.currentPage;
        params.userId = this.userInfo._id;
        const result = await get("/api/questions/getMistake", params);
        if (result.statusCode == 200) {
          let mistakeList = result.data.mistakeList;
          let arr = [];
          let val = this.types.value;
          this.selectTypes = val;
          if (val == 0 || val == 1) {
            mistakeList.forEach(item => {
              arr.push({
                title: item.question.title,
                A: item.question.options.A,
                B: item.question.options.B,
                C: item.question.options.C,
                D: item.question.options.D,
                myAnswer: item.question.answer.toString(),
                answer: item.question.message.toString(),
                createTime: item.createTime,
                count: item.count,
                _id: item._id
              });
            });
          }
          if (val == 2 || val == 3) {
            mistakeList.forEach(item => {
              arr.push({
                title: item.question.title,
                myAnswer: item.question.answer,
                answer: item.question.message,
                createTime: item.createTime,
                count: item.count
              });
            });
          }
          this.mistakeList = arr;
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

    handleCurrentChange(e) {
      this.currentPage = e;
      this.getMistakeList();
    },
    search() {
      this.currentPage = 1;
      this.getMistakeList();
    },
    deleteMistake(index, row) {
      this.$confirm("确定删除?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(async () => {
          try {
            const result = await get("/api/questions/deleteMistake", {
              id: row._id
            });
            if (result.statusCode == 200) {
              this.$message({
                showClose: true,
                message: result.message,
                type: "success"
              });
              this.getMistakeList()
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
              type: "error",
              message: error.toString()
            });
          }
        })
        .catch(() => {});
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


