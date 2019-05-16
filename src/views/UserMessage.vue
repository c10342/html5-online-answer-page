<template>
  <div class="my-container">
    <el-dialog title="分配权限" :visible.sync="dialogVisible" width="30%">
      <div>
        <el-tree
          :default-checked-keys="defaultKey"
          node-key="type"
          :data="props"
          show-checkbox
          @check-change="handleCheckChange"
        ></el-tree>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="cancel">取 消</el-button>
        <el-button type="primary" @click="ok">确 定</el-button>
      </span>
    </el-dialog>
    <div class="flex-row flex-wrap">
      <div class="flex-row flex-center min-width mt10">
        <span class="text-nowrap pr10 font18">用户姓名 :</span>
        <el-input v-model="name" placeholder="请输入用户姓名" clearable></el-input>
      </div>
      <div class="flex-row flex-center min-width mt10">
        <span class="text-nowrap pr10 pl10 font18">邮箱 :</span>
        <el-input v-model="email" placeholder="请输入邮箱" clearable></el-input>
      </div>
      <div class="flex-row flex-center min-width mt10">
        <span class="text-nowrap pr10 pl10 font18">发布时间 :</span>
        <el-date-picker v-model="beginTime" type="date" placeholder="选择日期"></el-date-picker>
        <span class="pl10 pr10 font18">--</span>
        <el-date-picker v-model="endTime" type="date" placeholder="选择日期"></el-date-picker>
      </div>
      <div class="flex-row flex-center ml10 mt10">
        <el-button type="primary" @click="getUserList">查询</el-button>
      </div>
    </div>
    <div class="mt20">
      <el-table :data="userLIst" style="width: 100%">
        <el-table-column type="index"></el-table-column>
        <el-table-column prop="name" align="center" label="用户姓名"></el-table-column>
        <el-table-column prop="email" :show-overflow-tooltip="true" align="center" label="邮箱"></el-table-column>
        <el-table-column prop="createTime" align="center" label="创建时间">
          <template slot-scope="scope">
            <div>{{scope.row.createTime | formatDate}}</div>
          </template>
        </el-table-column>
        <el-table-column align="center" label="操作">
          <template slot-scope="scope">
            <el-button type="primary" @click="handleDelete(scope.row._id)">删除</el-button>
            <el-button type="success" @click="showDialog(scope.row)">分配权限</el-button>
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
      userLIst: [],
      pageSize: 10,
      currentPage: 1,
      total: 0,
      layout: "total, prev, pager, next,jumper",
      name: "",
      beginTime: "",
      endTime: "",
      email: "",
      dialogVisible: false,
      defaultKey:[],
      props: [
        {
          label: "试卷管理",
          children: [
            {
              label: "查阅试卷",
              type: "1-1"
            },
            {
              label: "发布新试卷",
              type: "1-2"
            },
            {
              label: "发布的试卷",
              type: "1-3"
            },
            {
              label: "填写的试卷",
              type: "1-4"
            }
          ]
        },
        {
          label: "试卷统计",
          type: "2"
        }
      ],
      selectProps: [],
      selectUserInfo: {}
    };
  },
  created() {
    this.getUserList();
  },
  methods: {
    async getUserList() {
      try {
        let params = { id: this.userInfo._id };
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
        if (this.name) {
          params.name = this.name;
        }
        if (this.email) {
          params.email = this.email;
        }
        params.pageSize = this.pageSize;
        params.currentPage = this.currentPage;
        const result = await get("/api/user/getUserList", params);
        if (result.statusCode == 200) {
          this.userLIst = result.data.userList;
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
    async handleDelete(id) {
      try {
        const result = await get("/api/user/deleteUser", { id });
        if (result.statusCode == 200) {
          this.$message({
            showClose: true,
            message: result.message,
            type: "success"
          });
          await this.getUserList();
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
      this.getUserList();
    },
    cancel() {
      this.dialogVisible = false;
    },
    async ok() {
      try {
        let flag = false;
        if (!this.selectProps.includes("1")) {
          this.selectProps.forEach(i => {
            if (i.startsWith("1")) {
              flag = true;
            }
          });
        }
        if (flag) {
          this.selectProps.push("1");
        }
        let params = {
          id:this.selectUserInfo._id,
          jurisdiction:JSON.stringify(this.selectProps)
        }
        const result = await post("/api/user/updateJurisdiction",params)
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
            type: "warning"
          });
        }
      } catch (error) {
        this.$message({
          showClose: true,
          message: error.toString(),
          type: "error"
        });
      }finally{
        this.dialogVisible = false
      }
    },
    showDialog(row) {
      this.selectUserInfo = row;
      this.defaultKey = row.jurisdiction;
      this.selectProps = row.jurisdiction
      this.dialogVisible = true;
    },
    handleCheckChange(data, checked) {
      if (checked) {
        if (!this.selectProps.includes(data.type || '1')) {
          this.selectProps.push(data.type || '1');
        }
      } else {
        if (this.selectProps.includes(data.type || '1')) {
          let index = this.selectProps.findIndex(i => i == data.type || '1');
          this.selectProps.splice(index, 1);
        }
      }
    }
  },
  computed: {
    ...mapGetters(["userInfo"])
  },
  watch:{
    dialogVisible(newVal){
      if(!newVal){
        this.selectProps = []
        this.defaultKey = []
      }
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
  margin: 30px 0;
}
</style>


