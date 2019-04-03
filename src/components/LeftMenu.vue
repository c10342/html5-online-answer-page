<template>
    <el-row class="menu_page">
         <el-col>
             <el-menu
                mode="vertical"
                background-color="#324057"
                text-color="#fff"
                active-text-color="#409eff" 
                class="el-menu-vertical-demo">
                <router-link to="/home">
                    <el-menu-item index="0">
                        <i class="fa fa-margin fa-server"></i>
                        <span slot="title">首页</span>
                    </el-menu-item>
                </router-link>
                <template  v-for="(item,index) in items"  >
                    <el-submenu v-if="item.children" :index="(index+1).toString()" :key="(index+1).toString()">
                        <template slot="title">
                            <i :class="'fa fa-margin '+item.icon"></i>
                            <span slot="title">{{item.name}}</span>
                        </template>
                        <router-link v-for="(citem,cindex) in item.children" 
                            :to="citem.path" :key="cindex">
                            <el-menu-item 
                                :index='citem.path'>
                                <i :class="'fa fa-margin '+citem.icon"></i>
                                <span slot="title">{{citem.name}}</span>
                            </el-menu-item> 
                        </router-link>
                    </el-submenu>
                    <router-link v-else :to="item.path" :key="item.path">
                      <el-menu-item :index="(index+1).toString()">
                            <i :class="'fa fa-margin '+item.icon"></i>
                            <span slot="title">{{item.name}}</span>
                        </el-menu-item>
                    </router-link>
                </template>
             </el-menu>
         </el-col>
    </el-row>
</template>
<script>
export default {
  name: "leftmenu",
  data() {
    return {
      items: [
        {
          icon: "fa-money",
          name: "试卷管理",
          children:[
            {
              icon:'fa-search-minus',
              name:'查阅试卷',
              path: "/consultQuestions",
            },
            {
              icon:'fa-file-code-o',
              name:'发布的试卷',
              path: "/publishedQuestions",
            },
            {
              icon:'fa-text-width',
              name:'填写的试卷',
              path: "/answeredList",
            }
          ]
        },
        {
          icon: "fa-asterisk",
          name: "试卷统计",
          path: "/questionsStatistics",
        },
      ]
    };
  }
};
</script>
<style scoped>
.menu_page {
  position: fixed;
  top: 81px;
  left: 0;
  min-height: 100%;
  background-color: #324057;
  z-index: 99;
}
.el-menu {
  border: none;
}
.fa-margin {
  margin-right: 9px;
}
.el-menu-vertical-demo:not(.el-menu--collapse) {
  width: 180px;
  min-height: 400px;
}
.el-menu-vertical-demo {
  width: 35px;
}
.el-submenu .el-menu-item {
  min-width: 180px;
}

.hiddenDropdown,
.hiddenDropname {
  display: none;
}
a {
  text-decoration: none;
}
</style>
