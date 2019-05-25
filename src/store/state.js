import storage from 'good-storage'
import cookie from 'js-cookie'

let userInfo = cookie.getJSON('userInfo')
if(!userInfo){
    userInfo = storage.session.get('userInfo',{})
}

const state = {
    userInfo
}

export default state