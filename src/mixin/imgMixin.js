var imgMixin = {
    methods: {
        getUserAvatar(name){
            if(!name || name == '')
                return new URL('/src/assets/girl-6.svg', import.meta.url).href
            return new URL('/src/assets/avatar/' + name + `?${Date.now()}`, import.meta.url).href
        },
        getGroupAvatar(name){
            if(!name || name == '')
                return new URL('/src/assets/群组初始头像.svg', import.meta.url).href
            return new URL('/src/assets/groupAvatar/' + name + `?${Date.now()}`, import.meta.url).href
        },
        getGroupBanner(name){
            if(!name || name == '')
                return new URL('/src/assets/设置Banner.jpg', import.meta.url).href
            return new URL('/src/assets/groupBanner/' + name + `?${Date.now()}`, import.meta.url).href
        },
        getChatPic(name){
            if(!name || name == '')
                return new URL('/src/assets/加载失败.svg', import.meta.url).href
            return new URL('/src/assets/chatPic/' + name + `?${Date.now()}`, import.meta.url).href
        }
    },
}

export default imgMixin