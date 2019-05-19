<template>
    <div class="mt20" style="border-bottom:1px solid #ccc;">
        <h1 class="font20">判断题</h1>
        <div v-if="isAnswer&&judgementQuestion.length==0" class="mt20">暂无题目</div>
        <div class="mt30" v-for="(question,index) in judgementQuestion" :key="index">
            <div class="flex-row align-items">
                <span class="font18">{{index+1}}、</span>
                <span v-if='!isAnswer' class="font20 text-nowrap mr10">题目 : </span>
                <el-input v-if='!isAnswer' v-model.trim="question.title" placeholder="请输入题目"></el-input>
                <span v-if='isAnswer' class="font20">{{question.title}}</span>
            </div>
            <div class="mt20 flex-row" :style="{'margin-left':isAnswer?'30px':'88px'}">
                <el-radio :disabled="disabled" v-model.trim="question.answer" label="A" class="mr20">对</el-radio>
                <el-radio :disabled="disabled" v-model.trim="question.answer" label="B" class="mr20">错</el-radio>
            </div>
            <div class="mt20 flex-row item">
                <span style="color:red;">{{question.message}}</span>
                <span v-if='!isAnswer' @click="deleteItem('judgementQuestion',index)" class="deleteItem">删除</span>
            </div>
        </div>
        <el-button v-if='!isAnswer' style="margin-top:20px;" type="danger" @click="addJudgement">添加判断题</el-button>
    </div>
</template>

<script>
export default {
  props: {
    judgementQuestion: {
      type: Array,
      default: function() {
        return [];
      }
    },
    isAnswer: {
      type: Boolean,
      default: false
    },
    disabled: {
      type: Boolean,
      default: false
    }
  },
  methods: {
    deleteItem(key, index) {
      this.$emit("deleteItem", { key, index });
    },
    addJudgement() {
      this.$emit("addJudgement");
    }
  }
};
</script>

