import Vue from 'vue'
import axios from 'axios'

import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';

import './base.css'

Vue.use(ElementUI);

// get请求
const get = (url, params = {}, headers = {}) => {
    return new Promise((resolve, reject) => {
        axios.get(url, {
            params,
            headers
        }).then(res => {
            if (res.status == 200) {
                resolve(res.data)
            } else {
                reject(res.data)
            }
        }).catch(err => {
            reject(err)
        })
    })
}

// post请求
const post = (url, params = {}) => {
    return new Promise((resolve, reject) => {
        axios.post(url, params).then(res => {
            if (res.status == 200) {
                resolve(res.data)
            } else {
                reject(res.data)
            }
        }).catch(err => {
            reject(err)
        })
    })
}

new Vue({
    el: '#app',
    data() {
        return {
            // 试卷名称
            title: "",
            // 单选题
            singleQuestion: [],
            // 多选题
            multipleQuestion: [],
            // 判断题
            judgementQuestion: [],
            // 问答题
            answerQuestion: [],
            time: 0,
            id: null,
            questionType: '',
            flag: false
        }
    },
    async mounted() {
        try {
            const href = window.location.href
            const index = href.indexOf('=')
            if(index == -1){
                return
            }
            const id = href.substring(index + 1)
            if (!id) {
                this.$message({
                    type: "error",
                    message: '试题出错',
                    showClose: true
                });
                return
            }
            this.id = id
            const result = await get("/api/questions/getQuestionById/" + id);
            if (result.statusCode == 200) {
                this.title = result.data.questionList.title;
                this.singleQuestion = result.data.questionList.singleQuestion;
                this.multipleQuestion = result.data.questionList.multipleQuestion;
                this.judgementQuestion = result.data.questionList.judgementQuestion;
                this.answerQuestion = result.data.questionList.answerQuestion;
                this.questionType = result.data.questionList.questionType;
                this.initTime();
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
    },
    methods: {
        initTime() {
            this.timer = setInterval(() => {
                this.time++;
            }, 1000);
        },
        async submit() {
            let flag = true;
            let answer = {};
            // 判断单选题是否已经完成
            this.singleQuestion.forEach(item => {
                let message = null;
                if (!item.answer) {
                    message = "该题还没有完成";
                }
                if (message) {
                    flag = false;
                } else {
                    answer[item.id] = item.answer;
                }
                item.message = message;
            });
            // 判断多选题是否已经完成
            this.multipleQuestion.forEach(item => {
                let message = null;
                if (item.answer.length == 0) {
                    message = "该题还没有完成";
                }
                if (message) {
                    flag = false;
                } else {
                    answer[item.id] = item.answer;
                }
                item.message = message;
            });
            // 判断判断题是否已经完成
            this.judgementQuestion.forEach(item => {
                let message = null;
                if (!item.answer) {
                    message = "该题还没有完成";
                }
                if (message) {
                    flag = false;
                } else {
                    answer[item.id] = item.answer;
                }
                item.message = message;
            });
            // 判断简答题是否已经完成
            this.answerQuestion.forEach(item => {
                let message = null;
                if (!item.answer) {
                    message = "该题还没有完成";
                }
                if (message) {
                    flag = false;
                } else {
                    answer[item.id] = item.answer;
                }
                item.message = message;
            });
            if (flag) {
                let params = {};
                params.title = this.title;
                params.answer = answer;
                // 答题者的用户名
                params.userName = "匿名用户";
                // 答题者id
                params.userId = Date.now().toString();
                params.questionId = this.id;
                params.answerTime = this.showTime;
                params.questionType = this.questionType;
                try {
                    const result = await post("/api/questions/submitQuestion", params);
                    if (result.statusCode == 200) {
                        if (this.timer) {
                            clearInterval(this.timer);
                        }
                        this.flag = true
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
        }
    },
    beforeDestroy() {
        if (this.timer) {
            clearInterval(this.timer);
        }
    },
    computed: {
        showTime() {
            let s = this.time % 60;
            s = s < 10 ? `0${s}` : s;
            let m = parseInt(this.time / 60) % 60;
            m = m < 10 ? `0${m}` : m;
            let h = parseInt(this.time / 60 / 60) % 24;
            h = h < 10 ? `0${h}` : h;
            return `${h}：${m}：${s}`;
        }
    },
})