<template>
    <div class="my-container">
        <el-dialog
            title="图表分析"
            :visible.sync="dialogVisible">
            <div>
                <div id="echarts" style="width: 600px;height:500px;margin:0 auto;"></div>
            </div>
            <span slot="footer" class="dialog-footer">
                <el-button @click="dialogVisible = false">取 消</el-button>
                <el-button type="primary" @click="dialogVisible = false">确 定</el-button>
            </span>
        </el-dialog>
        <div v-if="single.length">
            <h3>单选题</h3>
            <el-table
                :data="single"
                style="width: 100%">
                <el-table-column
                    type="index"
                    width="50">
                </el-table-column>
                <el-table-column
                    align='center'
                    :show-overflow-tooltip='true'
                    prop="title"
                    label="试题名称">
                </el-table-column>
                <el-table-column
                    prop="A"
                    align='center'
                    label="A">
                </el-table-column>
                <el-table-column
                    align='center'
                    prop="B"
                    label="B">
                </el-table-column>
                <el-table-column
                    align='center'
                    prop="C"
                    label="C">
                </el-table-column>
                <el-table-column
                    align='center'
                    prop="D"
                    label="D">
                </el-table-column>
                <el-table-column
                    align='center'
                    prop="other"
                    label="其他">
                </el-table-column>
                 <el-table-column
                    align='center'
                    prop="correctAnswer"
                    label="正确答案">
                </el-table-column>
                 <el-table-column
                    align='center'
                    prop="correctCount"
                    label="正确人数">
                </el-table-column>
                 <el-table-column
                    align='center'
                    prop="totalNum"
                    label="作答人数">
                </el-table-column>
                 <el-table-column
                    align='center'
                    prop="unAnswer"
                    label="未作答人数">
                </el-table-column>
                <el-table-column label="统计" width="250" align='center'>
                    <template slot-scope="scope">
                        <el-button
                        size="small"
                        type="primary"
                        @click="handleClick(scope.$index, scope.row)">查看</el-button>
                    </template>
                </el-table-column>
            </el-table>
        </div>
        <div class="mt20" v-if="multiple.length">
            <h3>多选题</h3>
            <el-table
                :data="multiple"
                style="width: 100%">
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
                    prop="A"
                    align='center'
                    label="A">
                </el-table-column>
                <el-table-column
                    align='center'
                    prop="B"
                    label="B">
                </el-table-column>
                <el-table-column
                    align='center'
                    prop="C"
                    label="C">
                </el-table-column>
                <el-table-column
                    align='center'
                    prop="D"
                    label="D">
                </el-table-column>
                <el-table-column
                    align='center'
                    prop="other"
                    label="其他">
                </el-table-column>
                 <el-table-column
                    align='center'
                    prop="correctAnswer"
                    label="正确答案">
                </el-table-column>
                 <el-table-column
                    align='center'
                    prop="correctCount"
                    label="正确人数">
                </el-table-column>
                 <el-table-column
                    align='center'
                    prop="totalNum"
                    label="作答人数">
                </el-table-column>
                <el-table-column
                    align='center'
                    prop="unAnswer"
                    label="未作答人数">
                </el-table-column>
                <el-table-column label="统计" width="250" align='center'>
                    <template slot-scope="scope">
                        <el-button
                        size="small"
                        type="primary"
                        @click="handleClick(scope.$index, scope.row)">查看</el-button>
                    </template>
                </el-table-column>
            </el-table>
        </div>
        <div class="mt20" v-if="judgement.length">
            <h3>判断题</h3>
            <el-table
                :data="judgement"
                style="width: 100%">
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
                    prop="A"
                    align='center'
                    label="对">
                </el-table-column>
                <el-table-column
                    align='center'
                    prop="B"
                    label="错">
                </el-table-column>
                <el-table-column
                    align='center'
                    prop="other"
                    label="其他">
                </el-table-column>
                 <el-table-column
                    align='center'
                    prop="correctAnswer"
                    label="正确答案">
                    <template slot-scope="scope">
                        <div>{{scope.row.correctAnswer=='A'?'对':'错'}}</div>
                    </template>
                </el-table-column>
                 <el-table-column
                    align='center'
                    prop="correctCount"
                    label="正确人数">
                </el-table-column>
                 <el-table-column
                    align='center'
                    prop="totalNum"
                    label="作答人数">
                </el-table-column>
                <el-table-column
                    align='center'
                    prop="unAnswer"
                    label="未作答人数">
                </el-table-column>
                <el-table-column label="统计" width="250" align='center'>
                    <template slot-scope="scope">
                        <el-button
                        size="small"
                        type="primary"
                        @click="handleJudgement(scope.$index, scope.row)">查看</el-button>
                    </template>
                </el-table-column>
            </el-table>
        </div>
        <div class="mt20" v-if="answer.length">
            <h3>简答题</h3>
            <el-table
                :data="answer"
                style="width: 100%">
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
                    prop="other"
                    label="其他">
                </el-table-column>
                 <el-table-column
                    align='center'
                    prop="correctAnswer"
                    :show-overflow-tooltip='true'
                    label="正确答案">
                </el-table-column>
                 <el-table-column
                    align='center'
                    prop="correctCount"
                    label="正确人数">
                </el-table-column>
                 <el-table-column
                    align='center'
                    prop="totalNum"
                    label="作答人数">
                </el-table-column>
                <el-table-column
                    align='center'
                    prop="unAnswer"
                    label="未作答人数">
                </el-table-column>
                <el-table-column label="统计" width="250" align='center'>
                    <template slot-scope="scope">
                        <el-button
                        size="small"
                        type="primary"
                        @click="handleAnswer(scope.$index, scope.row)">查看</el-button>
                    </template>
                </el-table-column>
            </el-table>
        </div>
        <div class="mt30">
            <el-button type="success" @click="goBack">返回</el-button>
        </div>
    </div>
</template>

<script>
import { get } from "../util/http.js";
import echarts from "echarts";
export default {
  data() {
    return {
      answer: [],
      judgement: [],
      multiple: [],
      single: [],
      dialogVisible: false
    };
  },
  async created() {
    try {
      const { id } = this.$route.params;
      const result = await get("/api/statistics/statisticsQuestionsById/" + id);
      if (result.statusCode == 200) {
        this.answer = result.data.list.answer;
        this.judgement = result.data.list.judgement;
        this.multiple = result.data.list.multiple;
        this.single = result.data.list.single;
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
  methods: {
    goBack() {
      this.$router.back();
    },
    handleClick(index, row) {
      this.dialogVisible = true;
      this.$nextTick(() => {
        let p = echarts.init(document.getElementById("echarts"));
        p.clear()
        let obj = {
          title: {
            text: `试题名称：${row.title}`,
            subtext: `总人数${row.totalNum + row.unAnswer} 作答人数${
              row.totalNum
            } 未作答人数${row.unAnswer}`,
            left: "center",
          },
          tooltip: {
            trigger: "item"
          },
          toolbox: {
            show: true,
            left: "right",
            feature: {
              dataView: { readOnly: false },
              magicType: { type: ["line", "bar"] },
              restore: {},
              saveAsImage: {}
            },
            orient:'vertical',
            top:'40px'
          },
          xAxis: {
            type: "category",
            data: ["A", "B", "C", "D"]
          },
          yAxis: {
            type: "value"
          },
          series: [
            {
              data: [row.A, row.B, row.C, row.D],
              type: "bar",
              itemStyle: {
                emphasis: {
                  shadowBlur: 10,
                  shadowOffsetX: 0,
                  shadowColor: "rgba(0, 0, 0, 0.5)"
                }
              }
            }
          ]
        };
        p.setOption(obj);
      });
    },
    handleJudgement(index, row) {
      this.dialogVisible = true;
      this.$nextTick(() => {
        let p = echarts.init(document.getElementById("echarts"));
        p.clear()
        let obj = {
          title: {
            text: `试题名称：${row.title}`,
            subtext: `总人数${row.totalNum + row.unAnswer} 作答人数${
              row.totalNum
            } 未作答人数${row.unAnswer}`,
            left: "center"
          },
          tooltip: {
            trigger: "item"
          },
          toolbox: {
            show: true,
            left: "right",
            feature: {
              dataView: { readOnly: false },
              magicType: { type: ["line", "bar"] },
              restore: {},
              saveAsImage: {}
            },
            orient:'vertical',
            top:'40px'
          },
          xAxis: {
            type: "category",
            data: ["A", "B"]
          },
          yAxis: {
            type: "value"
          },
          series: [
            {
              data: [row.A, row.B],
              type: "bar",
              itemStyle: {
                emphasis: {
                  shadowBlur: 10,
                  shadowOffsetX: 0,
                  shadowColor: "rgba(0, 0, 0, 0.5)"
                }
              }
            }
          ]
        };
        p.setOption(obj);
      });
    },
    handleAnswer(index, row) {
        this.dialogVisible = true;
      this.$nextTick(() => {
        let p = echarts.init(document.getElementById("echarts"));
        p.clear()
        let obj = {
          title: {
            text: `试题名称：${row.title}`,
            subtext: `总人数${row.totalNum + row.unAnswer} 作答人数${
              row.totalNum
            } 未作答人数${row.unAnswer}`,
            left: "center"
          },
          tooltip: {
            trigger: "item"
          },
          toolbox: {
            show: true,
            left: "right",
            feature: {
              dataView: { readOnly: false },
              magicType: { type: ["line", "bar"] },
              restore: {},
              saveAsImage: {}
            },
            orient:'vertical',
            top:'40px'
          },
          xAxis: {
            type: "category",
            data: ["正确", "错误"]
          },
          yAxis: {
            type: "value"
          },
          series: [
            {
              data: [row.correctCount, row.totalNum - row.correctCount],
              type: "bar",
              itemStyle: {
                emphasis: {
                  shadowBlur: 10,
                  shadowOffsetX: 0,
                  shadowColor: "rgba(0, 0, 0, 0.5)"
                }
              }
            }
          ]
        };
        p.setOption(obj);
      });
    //   let obj = {
    //     title: {
    //       text: row.title,
    //       subtext: `总人数${row.totalNum + row.unAnswer} 作答人数${
    //         row.totalNum
    //       } 未作答人数${row.unAnswer}`,
    //       x: "60%"
    //     },
    //     tooltip: {
    //       trigger: "item",
    //       formatter: "{a} <br/>{b} : {c}人 ({d}%)"
    //     },
    //     legend: {
    //       orient: "vertical",
    //       left: "left",
    //       data: ["正确", "错误"]
    //     },
    //     series: [
    //       {
    //         name: "选项占比",
    //         type: "pie",
    //         radius: "55%",
    //         center: ["70%", "60%"],
    //         data: [
    //           { value: row.correctCount, name: "正确" },
    //           { value: row.totalNum - row.correctCount, name: "错误" }
    //         ],
    //         itemStyle: {
    //           emphasis: {
    //             shadowBlur: 10,
    //             shadowOffsetX: 0,
    //             shadowColor: "rgba(0, 0, 0, 0.5)"
    //           }
    //         }
    //       }
    //     ]
    //   };
    //   this.dialogVisible = true;
    }
  }
};
</script>

<style lang="less" scoped>
.my-container {
  padding: 20px;
}
h3 {
  margin: 0;
}
</style>


