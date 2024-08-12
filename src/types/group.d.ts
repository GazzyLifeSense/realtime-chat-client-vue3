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
    hasNew: number // 新消息数量
}

interface GroupApplyType{
    _id: string,
    applyFrom: UserType, // 用户信息
    from: string, // 用户id
    to: string, // 群id
    owner: string, // 群主
    groupDetail: GroupType // 群组信息
}