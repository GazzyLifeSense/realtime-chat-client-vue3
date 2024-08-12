interface MessageType{
    _id: string,
    content: string, // 内容
    create_time: number, // 创建时间
    from: string, // 发送者userId
    isPic: number, // 是否图片
    to: string, // 用户id 或 群id
    type: number // 私聊或群聊
}