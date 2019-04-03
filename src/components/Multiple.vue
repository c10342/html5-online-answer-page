<template>
    <div class="mt20">
        <h1 class="font20">二、多选题</h1>
        <div v-if="isAnswer&&multipleQuestion.length==0" class="mt20">暂无题目</div>
        <div class="mt30" v-for="(question,index) in multipleQuestion" :key="index">
        <div class="flex-row align-items">
            <span class="font18">{{index+1}}、</span>
            <span v-if='!isAnswer' class="font20 text-nowrap mr10">题目 : </span>
            <el-input v-if='!isAnswer' v-model.trim="question.title" placeholder="请输入题目"></el-input>
            <span v-if='isAnswer' class="font20">{{question.title}}</span>
        </div>
        <div class="mt20 ml20">
            <div class="mb10 flex-row align-items" v-for="(i,option) in question.options" :key="option">
                <el-checkbox v-model.trim="question.answer" :label="option" class="mr20">{{option}}</el-checkbox>
                <el-input v-if='!isAnswer' v-model.trim="question.options[option]" placeholder="请输入"></el-input>
                <span v-if='isAnswer' class="font18">{{question.options[option]}}</span>
            </div>
        </div>
        <div class="mt20 flex-row item">
            <span style="color:red;">{{question.message}}</span>
            <div v-if='!isAnswer' @click="deleteItem('multipleQuestion',index)" class="deleteItem">删除</div>
        </div>
    </div>
    <el-button v-if='!isAnswer' style="margin-top:20px;" type="danger" @click="addMultiple">添加多选题</el-button>
    </div>
</template>

<script>
export default {
    props:{
        multipleQuestion:{
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
        addMultiple(){
            this.$emit('addMultiple')
        }
    },
}
</script>
