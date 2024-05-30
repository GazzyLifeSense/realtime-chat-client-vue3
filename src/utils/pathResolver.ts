const ASSETS_PATH = new URL('/src/assets', import.meta.url).href

function getUserAvatar(name: string){
    return name ? `${ASSETS_PATH}/avatar/${name}?${Date.now()}` : `${ASSETS_PATH}/girl-6.svg`
}

function getGroupAvatar(name: string){
    return name ? `${ASSETS_PATH}/groupAvatar/${name}?${Date.now()}` : `${ASSETS_PATH}/群组初始头像.svg`
}

function getGroupBanner(name: string){
    return name ? `${ASSETS_PATH}/groupBanner/${name}?${Date.now()}` : `${ASSETS_PATH}/设置Banner.jpg`
}

function getChatPic(name: string){
    return name ? `${ASSETS_PATH}/chatPic/${name}?${Date.now()}` : `${ASSETS_PATH}/加载失败.svg`
}

export {
    getUserAvatar, getGroupAvatar, getGroupBanner, getChatPic
}