<template>
    <div class="my-container">
        <div class="flex-row flex-wrap">
            <div class="flex-row flex-center min-width mt10">
                <span class="text-nowrap pr10 pl10 font18">回复内容 : </span>
                <el-input
                    v-model="content"
                    placeholder="请输入回复内容"
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
                <el-button type="primary" @click="getReplyList">查询</el-button>
                <el-button type="warning" @click="goback">返回</el-button>
            </div>
        </div>
        <div class="mt20">
            <el-table
                :data="replyList"
                style="width: 100%">
                    <el-table-column
                    type="index">
                </el-table-column>
                <el-table-column
                    prop="userName"
                    :show-overflow-tooltip='true'
                    align='center'
                    label="回复人">
                </el-table-column>
                <el-table-column
                    prop="content"
                    :show-overflow-tooltip='true'
                    align='center'
                    label="回复内容">
                </el-table-column>
                <el-table-column
                    prop="createTime"
                    align='center'
                    label="回复时间">
                    <template slot-scope="scope">
                        <div>{{scope.row.createTime | formatDate}}</div>
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
      replyList: [],
      pageSize: 10,
      currentPage: 1,
      total: 0,
      layout: "total, prev, pager, next,jumper",
      content: "",
      beginTime: "",
      endTime: "",
    };
  },
  created() {
    this.getReplyList();
  },
  methods: {
    async getReplyList() {
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
        let { id } = this.$route.params
        params.pageSize = this.pageSize;
        params.currentPage = this.currentPage;
        params.commentId = id;
        const result = await get("/api/comment/getReplyList", params);
        if (result.statusCode == 200) {
          this.replyList = result.data.replyList;
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
      this.getReplyList();
    },
    goback(){
        this.$router.back()
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


