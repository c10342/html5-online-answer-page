import axios from 'axios'
import {
    Loading
} from 'element-ui';

let loadingInstance = null

let startLoading = () => {
    loadingInstance = Loading.service({
        lock: true,
        text: '加载中...',
        background: 'rgba(0,0,0,0.7)'
    });
}

let endLoading = () => {
    loadingInstance.close()
    loadingInstance = null
}

// get请求
export const get = (url, params = {}, headers = {}) => {
    return new Promise((resolve, reject) => {
        startLoading()
        axios.get(url, {
            params,
            headers
        }).then(res => {
            if (res.status == 200) {
                resolve(res.data)
            } else {
                reject(res.data)
            }
            endLoading()
        }).catch(err => {
            reject(err)
            endLoading()
        })
    })
}

// post请求
export const post = (url, params = {}) => {
    return new Promise((resolve, reject) => {
        startLoading()
        axios.post(url, params).then(res => {
            if (res.status == 200) {
                resolve(res.data)
            } else {
                reject(res.data)
            }
            endLoading()
        }).catch(err => {
            reject(err)
            endLoading()
        })
    })
}
