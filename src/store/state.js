import storage from 'good-storage'

const userInfo = storage.session.get('userInfo',{})

const state = {
    userInfo
}

export default state