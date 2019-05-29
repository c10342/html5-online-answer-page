<template>
  <div class="my-container">
    <el-dialog title="回复" :visible.sync="dialogVisible" width="30%">
      <el-input v-model="content" placeholder="请输入回复" type="textarea" clearable></el-input>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="ok">确 定</el-button>
      </span>
    </el-dialog>
    <div class="flex-row flex-wrap">
      <div class="flex-row flex-center min-width mt10">
        <span class="text-nowrap pr10 pl10 font18">评论者 :</span>
        <el-input v-model="userName" placeholder="请输入评论者姓名" clearable></el-input>
      </div>
      <div class="flex-row flex-center min-width mt10">
        <span class="text-nowrap pr10 pl10 font18">评论内容 :</span>
        <el-input v-model="content" placeholder="请输入评论内容" clearable></el-input>
      </div>
      <div class="flex-row flex-center min-width mt10">
        <span class="text-nowrap pr10 pl10 font18">发布时间 :</span>
        <el-date-picker v-model="beginTime" type="date" placeholder="选择日期"></el-date-picker>
        <span class="pl10 pr10 font18">--</span>
        <el-date-picker v-model="endTime" type="date" placeholder="选择日期"></el-date-picker>
      </div>
      <div class="flex-row flex-center ml10 mt10">
        <el-button type="primary" @click="getCommentList">查询</el-button>
        <el-button type="warning" @click="goBack">返回</el-button>
      </div>
    </div>
    <div class="mt20">
      <el-table :data="commentList" style="width: 100%">
        <el-table-column type="index"></el-table-column>
        <el-table-column prop="userName" align="center" label="评论者"></el-table-column>
        <el-table-column prop="content" :show-overflow-tooltip="true" align="center" label="评论内容"></el-table-column>
        <el-table-column prop="createTime" align="center" label="评论时间">
          <template slot-scope="scope">
            <div>{{scope.row.createTime | formatDate}}</div>
          </template>
        </el-table-column>
        <el-table-column align="center" label="操作">
          <template slot-scope="scope">
            <el-button size="small" type="success" @click="handleReply(scope.$index, scope.row)">回复</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <div v-if="total>pageSize" class="text-center my-pagination">
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
</template>

<script>
import { get, post } from "../util/http.js";
import { mapGetters } from "vuex";
export default {
  data() {
    return {
      commentList: [],
      pageSize: 10,
      currentPage: 1,
      total: 0,
      layout: "total, prev, pager, next,jumper",
      content: "",
      userName: "",
      beginTime: "",
      endTime: "",
      dialogVisible: false,
      content: "",
      commentDetail: null
    };
  },
  created() {
    this.getCommentList();
  },
  methods: {
    async getCommentList() {
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
        if (this.content) {
          params.content = this.content;
        }
        if (this.userName) {
          params.userName = this.userName;
        }
        params.pageSize = this.pageSize;
        params.currentPage = this.currentPage;
        const result = await get(
          "/api/comment/getCommentList/" + this.$route.params.id,
          params
        );
        if (result.statusCode == 200) {
          this.commentList = result.data.commentList;
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
      this.$router.push({ name: "answerQuestion", params: row });
    },
    handleCurrentChange(e) {
      this.currentPage = e;
      this.getCommentList();
    },
    goBack() {
      this.$router.back();
    },
    handleReply(index, row) {
      this.commentDetail = row;
      this.dialogVisible = true;
    },
    async ok() {
      try {
        if (!this.content) {
          this.$message({
            showClose: true,
            message: "回复内容不能为空",
            type: "warning"
          });
          return;
        }
        const result = await post("/api/comment/submitReply", {
          userName: this.userInfo.name,
          commentId: this.commentDetail._id,
          userId: this.commentDetail.userId,
          replyId: this.userInfo._id,
          content: this.content
        });
        if (result.statusCode == 200) {
          this.$message({
            showClose: true,
            type: "success",
            message: result.message
          });
          this.dialogVisible = false;
          this.content = "";
          this.commentDetail = null;
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
  // position: absolute;
  // bottom: 50px;
  // left: 0;
  // width: 100%;
  margin: 30px 0;
}
</style>


