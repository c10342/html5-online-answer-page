<template>
    <div class="mt20">
        <h1 class="font20">四、问答题</h1>
        <div v-if="isAnswer&&answerQuestion.length==0" class="mt20">暂无题目</div>
        <div class="mt30" v-for="(question,index) in answerQuestion" :key="index">
            <div class="flex-row align-items">
                <span class="font18">{{index+1}}、</span>
                <span v-if='!isAnswer' class="font20 text-nowrap mr10">题目 : </span>
                <el-input v-if='!isAnswer' v-model.trim="question.title" placeholder="请输入题目"></el-input>
                <span v-if='isAnswer' class="font20">{{question.title}}</span>
            </div>
            <div class="mt20 flex-row" :style="{'margin-left':isAnswer?'30px':'88px'}">
                <el-input
                    type="textarea"
                    placeholder="请输入内容"
                    v-model.trim="question.answer">
                </el-input>
            </div>
            <div class="mt20 flex-row item">
                <span style="color:red;">{{question.message}}</span>
                <span v-if='!isAnswer' @click="deleteItem('answerQuestion',index)" class="deleteItem">删除</span>
            </div>
        </div>
        <el-button v-if='!isAnswer' style="margin-top:20px;" type="danger" @click="addAnswer">添加简答题</el-button>
    </div>
</template>

<script>
export default {
    props:{
        answerQuestion:{
            type:Array,
            default:function(){
                return []
            }
        },
        isAnswer:{
            type:Boolean,
            default:false
        }
    },
    methods:{
        deleteItem(key,index){
            this.$emit('deleteItem',{key,index})
        },
        addAnswer(){
            this.$emit('addAnswer')
        }
    }
}
</script>

