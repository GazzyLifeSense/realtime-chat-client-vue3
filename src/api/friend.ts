import request from '@/api'

const ApplyFriendUrl = '/api/applyFriend',
    DeleteFriendUrl = '/api/deleteFriend',
    GetFriendListUrl = '/api/getFriends',
    GetPrivateMsgUrl = '/api/getPrivateMsgs'

function applyFriendAPI(targetId: string, username: string){
    return request.post(ApplyFriendUrl, {userId: targetId, username})
}

function deleteFriendAPI(userId: string, targetId: string){
    return request.post(DeleteFriendUrl, { userId, to: targetId })
}

function getFriendListAPI(userId: string){
    return request.post(GetFriendListUrl, { userId })
}

function getPrivateMsgAPI(targetId: string, userId: string, size: number, time: number){
    return request.post(GetPrivateMsgUrl, { to: targetId, userId, size, time })
}

export {
    applyFriendAPI,
    deleteFriendAPI,
    getFriendListAPI,
    getPrivateMsgAPI
}