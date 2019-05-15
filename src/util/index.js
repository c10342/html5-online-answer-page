// 校验邮箱
export const checkEmail = email => {
    let reg = /^([a-zA-Z0-9]+[_|\_|\.]?)*[a-zA-Z0-9]+@([a-zA-Z0-9]+[_|\_|\.]?)*[a-zA-Z0-9]+\.[a-zA-Z]{2,3}$/;
    return reg.test(email)
}

// 格式化时间
export const formatDate = date => {
    const time = new Date(date)
    let y = time.getFullYear()
    let m = time.getMonth()+1
    let d = time.getDate()
    m = m<10?`0${m}`:m
    d = d<10?`0${d}`:d
    return `${y}-${m}-${d}`
}

// 把小数转化为百分比
export const numToPercent = (num)=>{
    if(num &&num>0){
        num = (num*100).toFixed(2)
        num = `${num}%`
    }else{
        num = 0
    }
    return num
}


function strSimilarity2Number(s, t) {
    var n = s.length, m = t.length, d = [];
    var i, j, s_i, t_j, cost;
    if (n == 0) return m;
    if (m == 0) return n;
    for (i = 0; i <= n; i++) {
        d[i] = [];
        d[i][0] = i;
    }
    for (j = 0; j <= m; j++) {
        d[0][j] = j;
    }
    for (i = 1; i <= n; i++) {
        s_i = s.charAt(i - 1);
        for (j = 1; j <= m; j++) {
            t_j = t.charAt(j - 1);
            if (s_i == t_j) {
                cost = 0;
            } else {
                cost = 1;
            }
            d[i][j] = Minimum(d[i - 1][j] + 1, d[i][j - 1] + 1, d[i - 1][j - 1] + cost);
        }
    }
    return d[n][m];
}

function Minimum(a, b, c) {
    return a < b ? (a < c ? a : c) : (b < c ? b : c);
}

// 对比2个字符串的相似度
export function strSimilarity2Percent(s, t) {
    var l = s.length > t.length ? s.length : t.length;
    var d = strSimilarity2Number(s, t);
    return (1 - d / l).toFixed(4);
}

// 产生随机字符串
export const getRandomStr = () => {
    return Date.now().toString() + Math.random().toString(36).substr(2, 6)
}


const identity = ['管理员','小学生','初中生','高中生','大学生','教师','游客','其他']

const questionType = ['常识','交通安全','法律知识','问卷调查','在线考试','练习题']
