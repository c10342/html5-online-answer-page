# 基于HTML5的在线答题系统前端


## 此项目为广东海洋大学软件工程系2019届毕业设计课题--基于HTML5的在线答题系统的设计与实现
## 基于HTML5的在线答题系统后端:[https://github.com/c10342/html5-online-answer-background](https://github.com/c10342/html5-online-answer-background)
## QQ好友或微信好友分享页面:[https://github.com/c10342/html5-online-answer-share](https://github.com/c10342/html5-online-answer-share)

### 有不明白的地方可添加微信(13427491053)或QQ(1376023740)进行咨询

## Project setup(安装步骤)
```
npm install
```

### Compiles and hot-reloads for development(运行开发环境)
```
npm run serve
```

### Compiles and minifies for production(打包代码)
```
npm run build
```

### Run your tests
```
npm run test
```

### Lints and fixes files
```
npm run lint
```

## 用例描述
<table style='width:100%' class="table table-bordered table-striped">
    <tr>
      <td>用例名称</td>
      <td>描述</td>
    </tr>
    <tr><td>登录</td><td>用户输入邮箱和密码登录在线答题系统</td></tr>
    <tr><td>第三方登录</td><td>用户点击github登录，输入github账号密码并同意授权后登录在线答题系统</td></tr>
    <tr><td>注册</td><td>用户输入姓名，邮箱，验证码，密码注册账号</td></tr>
    <tr><td>修改用户名</td><td>用户输入新的用户名修改用户名</td></tr>
    <tr><td>修改密码</td><td>用户输入旧的密码和新的密码修改密码</td></tr>
    <tr><td>查看用户信息</td><td>用户查看自己的信息</td></tr>
    <tr><td>添加试卷</td><td>用户添加一份试卷（包括试卷名称，试题，选项，答案），添加方式有上传文件和手动输入</td></tr>
    <tr><td>删除试卷</td><td>用户选中自己已经发布的试卷后删除试卷</td></tr>
    <tr><td>查询试卷</td><td>用户输入的查询条件查询试卷（包括发布时间，发布者用户名，试卷标题）</td></tr>
    <tr><td>填写试卷</td><td>用户选择试卷后填写试卷内容</td></tr>
    <tr><td>修改试卷</td><td>用户选中自己已经发布的试卷后修改试卷</td></tr>
    <tr><td>查询个人错题库</td><td>用户输入查询条件查询个人错题（查询条件包括错题标题，试题类型，创建时间）</td></tr>
    <tr><td>查询试题库</td><td>用户输入查询条件查询试题库（查询条件包括试题标题，试题类型，创建时间）</td></tr>
    <tr><td>添加试题</td><td>用户手动添加试题，添加方式包括2种，一是上传文件添加，二是手动添加</td></tr>
    <tr><td>删除试题</td><td>用户选中一道试题后，删除试题</td></tr>
    <tr><td>修改试题</td><td>用户选择一道试题后，输入修改内容，然后修改内容</td></tr>
    <tr><td>随机生成练习题</td><td>用户输入所需要生成的题数，然后生成练习题</td></tr>
    <tr><td>从试题库选择试题创建试卷</td><td>用户点击是题库中的试题，试题会自动添加到试卷中，用户点击确定后，生成试卷</td></tr>
    <tr><td>评论试题</td><td>用户选择一份已经完成了的试卷，然后输入评论内容进行评论</td></tr>
    <tr><td>查询评论</td><td>用户可以查询自己所发表的评论和其他人对自己发布的试卷的评论</td></tr>
    <tr><td>收藏试卷</td><td>用户选择一份试卷后，点击收藏，即可收藏试卷</td></tr>
    <tr><td>分享试卷给qq或者微信好友</td><td>用户选择一份自己已经发布的试卷，选择分享给qq好友或者微信好友</td></tr>
    <tr><td>查询试卷的整体统计分析</td><td>用户输入查询条件（包括试卷标题，发布时间）查询试卷的统计分析情况</td></tr>
    <tr><td>查询试卷每一道试题的统计分析</td><td>用户选择一份试卷后，查看每一道试题的统计分析情况</td></tr>
    <tr><td>查询答题者答题详情</td><td>用户查看自己已经发布的试卷每一个答题者的答题详情</td></tr>
    <tr><td>查询试题图表分析</td><td>用户选择一道试题后，查看该试题的图表分析情况</td></tr>
</table>

## 系统功能列表
<table style='width:100%' class="table table-bordered table-striped">
    <tr>
      <td>模块名称</td>
      <td>简要描述</td>
    </tr>
    <tr>
	    <td rowspan="6">用户管理模块</td>
	    <td>用户和管理员的登录</td>
    </tr>
    <tr>
	    <td>第三方登录</td>
    </tr>
    <tr>
	    <td>邮箱SMTP服务注册</td>
    </tr>
    <tr>
	    <td>修改密码</td>
    </tr>
    <tr>
	    <td>修改用户名</td>
    </tr>
    <tr>
	    <td>查看用户信息功能</td>
    </tr>
	<tr>
	    <td rowspan="5">试卷管理模块</td>
	    <td>试卷查询</td>
    </tr>
    <tr>
	    <td>试卷增加</td>
    </tr>
    <tr>
	    <td>试卷修改</td>
    </tr>
    <tr>
	    <td>试卷添加</td>
    </tr>
    <tr>
	    <td>试卷填写</td>
    </tr>
    <tr>
	    <td rowspan="7">试题管理模块</td>
	    <td>个人错题库</td>
    </tr>
    <tr>
	    <td>试题库查询</td>
    </tr>
    <tr>
	    <td>试题添加</td>
    </tr>
    <tr>
	    <td>试题删除</td>
    </tr>
    <tr>
	    <td>试题修改</td>
    </tr>
    <tr>
	    <td>随机生成练习题</td>
    </tr>
    <tr>
	    <td>从试题库选择试题创建试卷功能</td>
    </tr>
    <tr>
	    <td rowspan="2">反馈模块</td>
	    <td>用户对试题的评论</td>
    </tr>
    <tr>
	    <td>用户查询评论</td>
    </tr>
    <tr>
	    <td rowspan="3">账号权限管理模块</td>
	    <td>管理员对普通用户账号进行删除</td>
    </tr>
    <tr>
	    <td>管理员查询普通用户信息</td>
    </tr>
    <tr>
	    <td>分配权限</td>
    </tr>
    <tr>
	    <td rowspan="3">收藏分享模块</td>
	    <td>试卷的收藏</td>
    </tr>
    <tr>
	    <td>试卷分享给QQ好友</td>
    </tr>
    <tr>
	    <td>试卷分享给微信好友</td>
    </tr>
    <tr>
	    <td rowspan="5">试卷统计分析模块</td>
	    <td>试卷的整体统计分析</td>
    </tr>
    <tr>
	    <td>试卷每一道试题的统计分析</td>
    </tr>
    <tr>
	    <td>自动批改答案</td>
    </tr>
    <tr>
	    <td>查看答题者答题详情</td>
    </tr>
    <tr>
	    <td>图表分析</td>
    </tr>
    <tr>
	    <td rowspan="7">其他功能模块</td>
	    <td>试卷的离线缓存</td>
    </tr>
    <tr>
	    <td>在线考试防作弊功能</td>
    </tr>
    <tr>
	    <td>pwa单页面应用功能</td>
    </tr>
    <tr>
	    <td>数据网络优先缓存策略</td>
    </tr>
    <tr>
	    <td>骨架屏应用技术</td>
    </tr>
    <tr>
	    <td>预渲染页面</td>
    </tr>
    <tr>
	    <td>文本检测功能</td>
    </tr>
</table>

### Customize configuration
See [Configuration Reference](https://cli.vuejs.org/config/).
