interface GroupType{
    _id: string,
    name: string,      // 标题
    description: string, // 简介
    owner: string,      // 拥有人
    members: any[], // 群成员列表
    avatar: string, // 头像
    banner: string, // 横幅
    isRecommended: boolean, // 是否推荐
    type: string, // 类型
    hasNew: boolean // 是否有新消息
}