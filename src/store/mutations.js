import storage from 'good-storage'

export const setUserInfo = (state,userInfo={})=>{
    storage.session.set('userInfo',userInfo)
    state.userInfo = userInfo
}