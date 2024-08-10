import request from '@/api'
import { ResponseType } from '@/types/request'

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

function applyGroupAPI(targetId:string, groupId:string): Promise<ResponseType>{
    return request.post(ApplyGroupUrl, {userId: targetId, groupId})
}

function getGroupsByNameAPI(groupName: string): Promise<ResponseType>{
    return request.post(GetGroupsByNameUrl, {groupName})
}

function getGroupListAPI(userId: string): Promise<ResponseType>{
    return request.post(GetGroupsUrl, { userId })
}

function getRecommendGroupListAPI(): Promise<ResponseType>{
    return request.get(GetRecommendGroupsUrl)
}

function createGroupAPI(groupName: string, userId: string, type: string): Promise<ResponseType>{
    return request.post(CreateGroupUrl,{ groupName, userId, type})
}

function getMemberListAPI(groupId: string): Promise<ResponseType>{
    return request.post(GetMemberListUrl, {groupId})
}

// 移除成员
function removeMemberAPI(groupId: string, targetId: string): Promise<ResponseType>{
    return request.post(RemoveMemberUrl, { groupId, to: targetId })
}

// 转让群聊
function transferGroupAPI(groupId: string, targetId: string): Promise<ResponseType>{
    return request.post(TransferGroupUrl, {groupId, to: targetId})
}

// 获取群聊信息
function getGroupMsgAPI(groupId: string, size: number, time: number): Promise<ResponseType>{
    return request.post(GetGroupMsgUrl, { groupId, size, time })
}

// 更改群聊名称
function updateGroupDescriptionAPI(groupId: string, description: string): Promise<ResponseType>{
    return request.post(UpdateGroupDescUrl, { groupId, description })
}

// 退出群聊
function exitGroupAPI(groupId: string, userId: string): Promise<ResponseType>{
    return request.post(ExitGroupUrl, { groupId, userId })
}

// 转让群聊
function dismissGroupAPI(groupId: string): Promise<ResponseType>{
    return request.post(DismissGroupUrl, { groupId })
}

// 上传群聊头像
function uploadGroupAvatarAPI(formData: FormData): Promise<ResponseType>{
    return request.post(UploadGroupAvatarUrl, formData, { headers:{ 'Content-Type': 'multipart/formdata'}})
}

// 上传群聊横幅
function uploadGroupBannerAPI(formData: FormData): Promise<ResponseType>{
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