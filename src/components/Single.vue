<template>
    <div class="mt20">
        <h1 class="font20">一、单选题</h1>
        <div v-if="isAnswer&&singleQuestion.length==0" class="mt20">暂无题目</div>
        <div class="mt30" v-for="(question,index) in singleQuestion" :key="index">
            <div class="flex-row align-items">
                <span class="font18">{{index+1}}、</span>
                <span v-if='!isAnswer' class="font20 text-nowrap mr10">题目 : </span>
                <el-input v-if='!isAnswer' v-model.trim="question.title" placeholder="请输入题目"></el-input>
                <span v-if='isAnswer' class="font20">{{question.title}}</span>
            </div>
            <div class="mt20 ml20">
                <div class="mb10 flex-row" v-for="(i,option) in question.options" :key="option">
                    <el-radio v-model.trim="question.answer" :label="option" class="mr20">{{option}}</el-radio>
                    <el-input v-if='!isAnswer' v-model.trim="question.options[option]" placeholder="请输入"></el-input>
                    <span v-if='isAnswer' class="font18">{{question.options[option]}}</span>
                </div>
            </div>
            <div class="mt20 flex-row item">
                <span style="color:red;">{{question.message}}</span>
                <span v-if='!isAnswer' @click="deleteItem('singleQuestion',index)" class="deleteItem">删除</span>
            </div>
        </div>
        <el-button v-if='!isAnswer' style="margin-top:20px;" type="danger" @click="addSingle">添加单选题</el-button>
    </div>
</template>


<script>
export default {
    props:{
        singleQuestion:{
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
        addSingle(){
            this.$emit('addSingle')
        }
    }
}
</script>
