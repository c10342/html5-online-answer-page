<template>
  <div style="height:87%;" class="my-container" ref="container">
    <el-dialog title="编辑" :visible.sync="dialogVisible" width="50%">
      <div class="mb20 flex-row align-items">
        <h1 style="font-size:20px;">试卷类型：</h1>
        <el-select v-model="selectQuestion.questionType" placeholder="请选择试卷类型">
          <el-option label="常识" value="常识"></el-option>
          <el-option label="交通安全" value="交通安全"></el-option>
          <el-option label="法律知识" value="法律知识"></el-option>
          <el-option label="问卷调查" value="问卷调查"></el-option>
          <el-option label="在线考试" value="在线考试"></el-option>
          <el-option label="练习题" value="练习题"></el-option>
          <el-option label="其他" value="其他"></el-option>
        </el-select>
      </div>
      <div v-if="selectQuestion.type == 0">
        <div class="flex-row align-items">
          <span class="font20 text-nowrap mr10">题目 :</span>
          <el-input v-model.trim="selectQuestion.question.title" placeholder="请输入题目"></el-input>
        </div>
        <div
          class="mb10 mt10 flex-row"
          v-for="(i,option) in selectQuestion.question.options"
          :key="option"
        >
          <el-radio
            v-model.trim="selectQuestion.question.answer"
            :label="option"
            class="mr20"
          >{{option}}</el-radio>
          <el-input v-model.trim="selectQuestion.question.options[option]" placeholder="请输入"></el-input>
        </div>
      </div>
      <div v-if="selectQuestion.type == 1">
        <div class="flex-row align-items">
          <span class="font20 text-nowrap mr10">题目 :</span>
          <el-input v-model.trim="selectQuestion.question.title" placeholder="请输入题目"></el-input>
        </div>
        <div
          class="mb10 mt10 flex-row align-items"
          v-for="(i,option) in selectQuestion.question.options"
          :key="option"
        >
          <el-checkbox
            v-model.trim="selectQuestion.question.answer"
            :label="option"
            class="mr20"
          >{{option}}</el-checkbox>
          <el-input v-model.trim="selectQuestion.question.options[option]" placeholder="请输入"></el-input>
        </div>
      </div>
      <div v-if="selectQuestion.type == 2">
        <div class="flex-row align-items">
          <span class="font20 text-nowrap mr10">题目 :</span>
          <el-input v-model.trim="selectQuestion.question.title" placeholder="请输入题目"></el-input>
        </div>
        <div class="mt20 mt10 flex-row">
          <el-radio v-model.trim="selectQuestion.question.answer" label="A" class="mr20">对</el-radio>
          <el-radio v-model.trim="selectQuestion.question.answer" label="B" class="mr20">错</el-radio>
        </div>
      </div>
      <div v-if="selectQuestion.type == 3">
        <div class="flex-row align-items">
          <span class="font20 text-nowrap mr10">题目 :</span>
          <el-input v-model.trim="selectQuestion.question.title" placeholder="请输入题目"></el-input>
        </div>
        <div class="mt20 mt10 flex-row">
          <el-input
            type="textarea"
            placeholder="请输入内容"
            :autosize="{ minRows: 5, maxRows: 8}"
            v-model.trim="selectQuestion.question.answer"
          ></el-input>
        </div>
      </div>
      <div class="mt20">
        <h1 style="font-size:20px;margin-bottom:20px;">指定人群：</h1>
        <el-checkbox-group v-model="selectQuestion.checkList">
          <el-checkbox label="小学生"></el-checkbox>
          <el-checkbox label="初中生"></el-checkbox>
          <el-checkbox label="高中生"></el-checkbox>
          <el-checkbox label="大学生"></el-checkbox>
          <el-checkbox label="教师"></el-checkbox>
          <el-checkbox label="游客"></el-checkbox>
          <el-checkbox label="其他"></el-checkbox>
        </el-checkbox-group>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="ok">确 定</el-button>
      </span>
    </el-dialog>
    <div class="flex-row flex-wrap" ref="top">
      <div class="flex-row flex-center min-width mt10">
        <span class="text-nowrap pr10 pl10 font18">试题名称 :</span>
        <el-input v-model="title" placeholder="请输入试卷名称" clearable></el-input>
      </div>
      <div class="flex-row flex-center min-width mt10">
        <span class="text-nowrap pr10 pl10 font18">试卷类型 :</span>
        <el-select clearable v-model="questionType" placeholder="请选择试卷类型">
          <el-option label="常识" value="常识"></el-option>
          <el-option label="交通安全" value="交通安全"></el-option>
          <el-option label="法律知识" value="法律知识"></el-option>
          <el-option label="问卷调查" value="问卷调查"></el-option>
          <el-option label="在线考试" value="在线考试"></el-option>
          <el-option label="练习题" value="练习题"></el-option>
        </el-select>
      </div>
      <div class="flex-row flex-center min-width mt10">
        <span class="text-nowrap pr10 pl10 font18">试卷题型 :</span>
        <el-select clearable v-model="type" placeholder="请选择试卷类型">
          <el-option label="单选题" :value="0"></el-option>
          <el-option label="多选题" :value="1"></el-option>
          <el-option label="判断题" :value="2"></el-option>
          <el-option label="简答题" :value="3"></el-option>
        </el-select>
      </div>
      <div class="flex-row flex-center min-width mt10">
        <span class="text-nowrap pr10 pl10 font18">发布时间 :</span>
        <el-date-picker v-model="beginTime" type="date" placeholder="选择日期"></el-date-picker>
        <span class="pl10 pr10 font18">--</span>
        <el-date-picker v-model="endTime" type="date" placeholder="选择日期"></el-date-picker>
      </div>
      <div class="flex-row flex-center ml10 mt10">
        <el-button type="primary" @click="search">查询</el-button>
      </div>
    </div>
    <div class="mt20 flex-row">
      <div style="width:65%;">
        <el-table @row-click="rowClick" :data="questionsList" :height="height" style="width: 100%;">
          <el-table-column type="index" width="50"></el-table-column>
          <el-table-column align="center" prop="title" :show-overflow-tooltip="true" label="试题名称"></el-table-column>
          <el-table-column align="center" prop="type" label="题型">
            <template slot-scope="scope">
              <div>{{scope.row.type==0?'单选题':scope.row.type==1?'多选题':scope.row.type==2?'判断题':'简答题'}}</div>
            </template>
          </el-table-column>
          <el-table-column prop="questionType" align="center" label="试题类型"></el-table-column>
          <el-table-column align="center" prop="createTime" label="创建时间">
            <template slot-scope="scope">
              <div>{{scope.row.createTime | formatDate}}</div>
            </template>
          </el-table-column>
          <el-table-column align="center" label="操作" width="200">
            <template slot-scope="scope">
              <el-button
                v-if="userInfo._id == scope.row.userId"
                type="success"
                @click.stop="editBank(scope.$index, scope.row)"
              >修改</el-button>
              <el-button
                v-if="userInfo._id == scope.row.userId"
                type="warning"
                @click.stop="deleteBank(scope.$index, scope.row)"
              >删除</el-button>
              <p v-if="userInfo._id != scope.row.userId">不可操作该试题</p>
            </template>
          </el-table-column>
        </el-table>
        <div ref="pagination" v-if="total>pageSize" class="text-center my-pagination">
          <el-pagination
            @current-change="handleCurrentChange"
            :current-page="currentPage"
            :page-size="pageSize"
            :layout="layout"
            :background="true"
            :total="total"
          ></el-pagination>
        </div>
      </div>
      <div style="width:35%;" class="ml10">
        <div :style="{'overflow-y': 'scroll','height':`${height}px`}">
          <div class="mt20">
            <p>一、单选题</p>
            <div v-if="single.length==0" class="mt10">暂无</div>
            <div
              @click="handelQuestion(item,'single')"
              :title="item.title"
              v-for="(item,index) in single"
              :key="index"
              class="flex-row mt10"
            >
              <span>{{index+1}}、</span>
              <span class="text-hiden">{{item.title}}</span>
            </div>
          </div>
          <div class="mt20">
            <p>二、多选题</p>
            <div v-if="multiple.length==0" class="mt10">暂无</div>
            <div
              @click="handelQuestion(item,'multiple')"
              :title="item.title"
              v-for="(item,index) in multiple"
              :key="index"
              class="flex-row mt10"
            >
              <span>{{index+1}}、</span>
              <span class="text-hiden">{{item.title}}</span>
            </div>
          </div>
          <div class="mt20">
            <p>三、判断题</p>
            <div v-if="judgement.length==0" class="mt10">暂无</div>
            <div
              @click="handelQuestion(item,'judgement')"
              :title="item.title"
              v-for="(item,index) in judgement"
              :key="index"
              class="flex-row mt10"
            >
              <span>{{index+1}}、</span>
              <span class="text-hiden">{{item.title}}</span>
            </div>
          </div>
          <div class="mt20">
            <p>四、简答题</p>
            <div v-if="answer.length==0" class="mt10">暂无</div>
            <div
              @click="handelQuestion(item,'answer')"
              :title="item.title"
              v-for="(item,index) in answer"
              :key="index"
              class="flex-row mt10"
            >
              <span>{{index+1}}、</span>
              <span class="text-hiden">{{item.title}}</span>
            </div>
          </div>
        </div>
        <div class="text-center mt20">
          <el-button v-if="!isShowSure" @click="addQuestion" type="primary">确定</el-button>
          <el-button @click="RandomAdd" type="warning">随机抽取</el-button>
        </div>
      </div>
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
      userName: "",
      beginTime: "",
      endTime: "",
      questionType: "",
      height: 0,
      // 单选题
      single: [],
      // 多选题
      multiple: [],
      // 判断题
      judgement: [],
      // 问答题
      answer: [],
      dialogVisible: false,
      selectQuestion: {},
      type: ""
    };
  },
  created() {
    this.getQuestionList();
  },
  mounted() {
    this.$nextTick(() => {
      this.onResize();
      window.addEventListener("resize", this.onResize);
    });
  },
  methods: {
    onResize() {
      let h1 = this.$refs.container.offsetHeight;
      let h2 = this.$refs.top.offsetHeight;
      let h3 = 0;
      if (this.$refs.pagination) {
        h3 = this.$refs.pagination.offsetHeight;
      }
      this.height = h1 - h2 - h3 - 90;
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
        if (this.questionType) {
          params.questionType = this.questionType;
        }
        if (this.type.toString()) {
          params.type = this.type;
        }
        params.pageSize = this.pageSize;
        params.currentPage = this.currentPage;
        params.userId = this.userInfo._id;
        params.checkList = this.userInfo.identity;
        const result = await get("/api/questions/getItemBank", params);
        if (result.statusCode == 200) {
          this.questionsList = result.data.itemList;
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
      this.getQuestionList();
    },
    search() {
      this.currentPage = 1;
      this.getQuestionList();
    },
    rowClick(e) {
      if (e.type == 0) {
        this.handelQuestion(e, "single");
      } else if (e.type == 1) {
        this.handelQuestion(e, "multiple");
      } else if (e.type == 2) {
        this.handelQuestion(e, "judgement");
      } else if (e.type == 3) {
        this.handelQuestion(e, "answer");
      }
    },
    handelQuestion(e, type) {
      if (e.question) {
        let index = this[type].findIndex(item => item.id == e.question.id);
        if (index == -1) {
          this[type].push(e.question);
        } else {
          this[type].splice(index, 1);
        }
      } else {
        let index = this[type].findIndex(item => item.id == e.id);
        if (index == -1) {
          this[type].push(e);
        } else {
          this[type].splice(index, 1);
        }
      }
    },
    addQuestion() {
      this.$router.push({
        name: "addQuestion",
        params: {
          flag: "1",
          single: this.single,
          multiple: this.multiple,
          judgement: this.judgement,
          answer: this.answer
        }
      });
    },
    deleteBank(index, row) {
      this.$confirm("确定删除试卷?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(async () => {
          try {
            const result = await get("/api/questions/deleteBank", {
              id: row._id
            });
            if (result.statusCode == 200) {
              this.$message({
                showClose: true,
                type: "success",
                message: result.message
              });
              this.getQuestionList();
            } else {
              this.$message({
                showClose: true,
                type: "warning",
                message: result.message
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
    },
    editBank(index, row) {
      this.selectQuestion = Object.assign({}, row, {
        checkList: JSON.parse(row.checkList)
      });
      this.dialogVisible = true;
    },
    async ok() {
      try {
        const result = await post("/api/questions/editBank", {
          question: Object.assign({}, this.selectQuestion, {
            checkList: JSON.stringify(this.selectQuestion.checkList),
            title: this.selectQuestion.question.title
          })
        });
        if (result.statusCode == 200) {
          this.dialogVisible = false;
          this.$message({
            showClose: true,
            type: "success",
            message: result.message
          });
          this.getQuestionList();
        } else {
          this.$message({
            showClose: true,
            type: "warning",
            message: result.message
          });
        }
      } catch (error) {
        this.$message({
          showClose: true,
          type: "error",
          message: error.toString()
        });
      }
    },
    async RandomAdd() {
      try {
        let params = {
          userId: this.userInfo._id,
          singleCount: 2,
          multipleCount: 2,
          judgementCount: 2,
          answerCount: 2,
          checkList: this.userInfo.identity
        };
        if (this.questionType) {
          params.this.questionType = this.this.questionType;
        }
        const result = await get("/api/questions/createExercises", params);
        if (result.statusCode == 200) {
          let s = result.data.exercises.single;
          let m = result.data.exercises.multiple;
          let j = result.data.exercises.judgement;
          let a = result.data.exercises.answer;

          s.forEach(element => {
            if (this.single.findIndex(i => i.id == element.id) == -1) {
              this.single.push(
                Object.assign({}, element, { answer: element.a })
              );
            }
          });
          m.forEach(element => {
            if (this.multiple.findIndex(i => i.id == element.id) == -1) {
              this.multiple.push(
                Object.assign({}, element, { answer: element.a })
              );
            }
          });
          j.forEach(element => {
            if (this.judgement.findIndex(i => i.id == element.id) == -1) {
              this.judgement.push(
                Object.assign({}, element, { answer: element.a })
              );
            }
          });
          a.forEach(element => {
            if (this.answer.findIndex(i => i.id == element.id) == -1) {
              this.answer.push(
                Object.assign({}, element, { answer: element.a })
              );
            }
          });
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
    window.removeEventListener("resize", this.onResize);
  },
  computed: {
    ...mapGetters(["userInfo"]),
    isShowSure() {
      return (
        this.single.length == 0 &&
        this.multiple.length == 0 &&
        this.judgement.length == 0 &&
        this.answer.length == 0
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
.text-nowrap {
  white-space: nowrap;
}
.my-pagination {
  margin-top: 30px;
  margin-bottom: 20px;
}
</style>


