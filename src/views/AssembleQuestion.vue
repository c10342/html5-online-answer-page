<template>
    <div style="height:87%;" class="my-container" ref="container">
        <div class="flex-row flex-wrap" ref="top">
            <div class="flex-row flex-center min-width mt10">
            <span class="text-nowrap pr10 font18">试题名称 : </span>
            <el-input
                v-model="title"
                placeholder="请输入试卷名称"
                clearable>
            </el-input>
            </div>
            <div class="flex-row flex-center min-width mt10">
            <span class="text-nowrap pr10 pl10 font18">试卷类型 : </span>
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
                <el-button type="primary" @click="search">查询</el-button>
            </div>
        </div>
        <div class="mt20 flex-row">
           <div style="width:65%;">
              <el-table
                @row-click='rowClick'
                :data="questionsList"
                :height='height'
                style="width: 100%;">
                <el-table-column
                type="index"
                width="50">
                </el-table-column>
                <el-table-column
                    align='center'
                    prop="title"
                    :show-overflow-tooltip='true'
                    label="试题名称">
                </el-table-column>
                <el-table-column
                    align='center'
                    prop="type"
                    label="题型">
                    <template slot-scope="scope">
                        <div>{{scope.row.type==0?'单选题':scope.row.type==1?'多选题':scope.row.type==2?'判断题':'简答题'}}</div>
                    </template>
                </el-table-column>
                <el-table-column
                    prop="questionType"
                    align='center'
                    label="试题类型">
                </el-table-column>
                <el-table-column
                    align='center'
                    prop="createTime"
                    label="创建时间">
                    <template slot-scope="scope">
                        <div>{{scope.row.createTime | formatDate}}</div>
                    </template>
                </el-table-column>
            </el-table>
            <div ref="pagination" v-if="total>pageSize" class="text-center my-pagination">
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
           <div style="width:35%;" class="ml10">
             <div :style="{'overflow-y': 'scroll','height':`${height}px`}">
               <div class="mt20">
               <p>一、单选题</p>
               <div v-if="single.length==0" class="mt10">暂无</div>
               <div @click="handelQuestion(item,'single')" :title="item.title" v-for="(item,index) in single" :key="index" class="flex-row mt10">
                 <span>{{index+1}}、</span>
                 <span class="text-hiden">{{item.title}}</span>
               </div>
             </div>
             <div class="mt20">
               <p>二、多选题</p>
               <div v-if="multiple.length==0" class="mt10">暂无</div>
               <div @click="handelQuestion(item,'multiple')" :title="item.title" v-for="(item,index) in multiple" :key="index" class="flex-row mt10">
                 <span>{{index+1}}、</span>
                 <span class="text-hiden">{{item.title}}</span>
               </div>
             </div>
             <div class="mt20">
               <p>三、判断题</p>
               <div v-if="judgement.length==0" class="mt10">暂无</div>
               <div  @click="handelQuestion(item,'judgement')" :title="item.title" v-for="(item,index) in judgement" :key="index" class="flex-row mt10">
                 <span>{{index+1}}、</span>
                 <span class="text-hiden">{{item.title}}</span>
               </div>
             </div>
             <div class="mt20">
               <p>四、简答题</p>
               <div v-if="answer.length==0" class="mt10">暂无</div>
               <div  @click="handelQuestion(item,'answer')" :title="item.title" v-for="(item,index) in answer" :key="index" class="flex-row mt10">
                 <span>{{index+1}}、</span>
                 <span class="text-hiden">{{item.title}}</span>
               </div>
             </div>
             </div>
             <div class="text-center mt20">
               <el-button @click="addQuestion" type='primary'>确定</el-button>
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
      height:0,
      // 单选题
      single: [],
      // 多选题
      multiple: [],
      // 判断题
      judgement: [],
      // 问答题
      answer: [],
    };
  },
  created() {
    this.getQuestionList();
  },
  mounted(){
    this.$nextTick(()=>{
      this.onResize()
      window.addEventListener('resize',this.onResize)
    })
  },
  methods: {
    onResize(){
      let h1 = this.$refs.container.offsetHeight
      let h2 = this.$refs.top.offsetHeight
      let h3 = 0
      if(this.$refs.pagination){
        h3 = this.$refs.pagination.offsetHeight
      }
      this.height = h1-h2-h3-90
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
        params.pageSize = this.pageSize;
        params.currentPage = this.currentPage;
        params.userId = this.userInfo._id;
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
    rowClick(e){
      if(e.type==0){
        this.handelQuestion(e,'single')
      }else if(e.type == 1){
        this.handelQuestion(e,'multiple')
      }else if(e.type == 2){
        this.handelQuestion(e,'judgement')
      }else if(e.type == 3){
        this.handelQuestion(e,'answer')
      }
    },
    handelQuestion(e,type){
      if(e.question){
        let index = this[type].findIndex(item=>item.id==e.question.id)
        if(index == -1){
          this[type].push(e.question)
        }else{
          this[type].splice(index, 1);
        }
      }else{
        let index = this[type].findIndex(item=>item.id==e.id)
        if(index == -1){
          this[type].push(e)
        }else{
          this[type].splice(index, 1);
        }
      }
    },
    addQuestion(){
      this.$router.push({
        name:'addQuestion',
        params:{
          flag:'1',
          single:this.single,
          multiple:this.multiple,
          judgement:this.judgement,
          answer:this.answer
        }
      })
    }
  },
  beforeDestroy(){
    window.removeEventListener('resize',this.onResize)
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
  margin-top: 30px;
  margin-bottom: 20px;
}
</style>


