<template>
    <div class="my-container">
        <div>
            <div class="flex-row align-items">
                <span class="text-nowrap mr10 font20">试题名称 :</span>
                <span class="font24">{{title}}</span>
            </div>
        </div>
        <!-- 单选题 -->
        <Single 
        :isAnswer='isAnswer'
        :singleQuestion='singleQuestion'></Single>
        <!-- 多选题 -->
        <Multiple 
        :isAnswer='isAnswer'
        :multipleQuestion='multipleQuestion'></Multiple>
        <!-- 判断题 -->
        <Judgement 
        :isAnswer='isAnswer'
        :judgementQuestion='judgementQuestion'></Judgement>
        <!-- 简答题 -->
        <Answer 
        :isAnswer='isAnswer'
        :answerQuestion='answerQuestion'></Answer>
        <div class="mt20">
            <el-button type="success" @click="goBack">返回</el-button>
        </div>
    </div>
</template>

<script>
import { mapGetters } from "vuex";
import { post, get } from "../util/http.js";
export default {
  data() {
    return {
      // 试题名称
      title: "",
      // 单选题
      singleQuestion: [],
      // 多选题
      multipleQuestion: [],
      // 判断题
      judgementQuestion: [],
      // 问答题
      answerQuestion: [],
      isAnswer: true
    };
  },
  methods: {
    // 返回上一级路由
    goBack() {
      this.$router.back();
    }
  },
  async created() {
    try {
      let { id } = this.$route.params;
      const result = await get("/api/questions/getAnswerQuestionById/" + id);
      if (result.statusCode == 200) {
        this.title = result.data.answerDetail.title;
        this.singleQuestion = result.data.answerDetail.single.question;
        this.multipleQuestion =
          result.data.answerDetail.multiple.question;
        this.judgementQuestion = result.data.answerDetail.judgement.question;
        this.answerQuestion = result.data.answerDetail.answer.question;
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
</style>


