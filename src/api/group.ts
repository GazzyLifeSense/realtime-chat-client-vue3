import request from '@/api'

const ApplyGroupUrl = '/api/applyGroup',
    GetGroupsByNameUrl = '/api/getGroupsByName',
    GetMemberListUrl = '/api/getMembers',
    GetGroupsUrl = '/api/getGroups',
    GetRecommendGroupsUrl = '/api/getRecommendGroups',
    CreateGroupUrl = '/api/createGroup',
    RemoveMemberUrl = '/api/removeMember',
    TransferGroupUrl = '/api/transferGroup',
    GetGroupMsgUrl = '/api/getGroupMsgs',
    UpdateGroupDescUrl = '/api/updateGroupDescription',
    ExitGroupUrl = '/api/exitGroup',
    DismissGroupUrl = '/api/dismissGroup',
    UploadGroupAvatarUrl = '/api/uploadGroupAvatar',
    UploadGroupBannerUrl = '/api/uploadGroupBanner'

function applyGroupAPI(targetId:string, groupId:string){
    return request.post(ApplyGroupUrl, {userId: targetId, groupId})
}

function getGroupsByNameAPI(groupName: string){
    return request.post(GetGroupsByNameUrl, {groupName})
}

function getGroupListAPI(userId: string){
    return request.post(GetGroupsUrl, { userId })
}

function getRecommendGroupListAPI(){
    return request.post(GetRecommendGroupsUrl)
}

function createGroupAPI(groupName: string, userId: string, type: number){
    return request.post(CreateGroupUrl,{ groupName, userId, type})
}

function getMemberListAPI(groupId: string){
    return request.post(GetMemberListUrl, {groupId})
}

// 移除成员
function removeMemberAPI(groupId: string, targetId: string){
    return request.post(RemoveMemberUrl, { groupId, to: targetId })
}

// 转让群聊
function transferGroupAPI(groupId: string, targetId: string){
    return request.post(TransferGroupUrl, {groupId, to: targetId})
}

// 获取群聊信息
function getGroupMsgAPI(groupId: string, size: number, time: number){
    return request.post(GetGroupMsgUrl, { groupId, size, time })
}

// 更改群聊名称
function updateGroupDescriptionAPI(groupId: string, description: string){
    return request.post(UpdateGroupDescUrl, { groupId, description })
}

// 退出群聊
function exitGroupAPI(groupId: string, userId: string){
    return request.post(ExitGroupUrl, { groupId, userId })
}

// 转让群聊
function dismissGroupAPI(groupId: string){
    return request.post(DismissGroupUrl, { groupId })
}

// 上传群聊头像
function uploadGroupAvatarAPI(formData: FormData){
    return request.post(UploadGroupAvatarUrl, formData, { headers:{ 'Content-Type': 'multipart/formdata'}})
}

// 上传群聊横幅
function uploadGroupBannerAPI(formData: FormData){
    return request.post(UploadGroupBannerUrl, formData, { headers:{ 'Content-Type': 'multipart/formdata'}})
}
export {
    applyGroupAPI,
    getGroupsByNameAPI,
    getGroupListAPI,
    getRecommendGroupListAPI,
    createGroupAPI,
    getMemberListAPI,
    removeMemberAPI,
    transferGroupAPI,
    getGroupMsgAPI,
    updateGroupDescriptionAPI,
    exitGroupAPI,
    dismissGroupAPI,
    uploadGroupAvatarAPI,
    uploadGroupBannerAPI
}