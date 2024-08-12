interface FriendType extends UserType{
    hasNew: number // 新消息数量
}
interface FriendApplyType extends UserType{
    apply: { from: string, to: string}
}