import request from '@/api'
import { ResponseType } from '@/types/request'

const UserLoginUrl = '/api/login',
    UserRegisterUrl = '/api/register',
    GetUserUrl = '/api/verifyAndGetUser',
    GetAppliesCountUrl = '/api/hasApplies',
    GetFriendAppliesUrl = '/api/getFriendApplies',
    GetGroupAppliesUrl = '/api/getGroupApplies',
    AcceptFriendApplyUrl = '/api/acceptFriendApply',
    RejectFriendApplyUrl = '/api/rejectFriendApply',
    AcceptGroupApplyUrl ='/api/acceptGroupApply',
    RejectGroupApplyUrl = '/api/rejectGroupApply',
    UpdatePasswordUrl = '/api/updatePassword',
    UpdateIntroductionUrl = '/api/updateIntroduction',
    UpdateNicknameUrl = '/api/updateNickname',
    UploadAvatarUrl = 'api/uploadAvatar'


// TODO 密码加密传输
// 登录
function userLogin(user: {username: string, password: string}){
    return new Promise(resolve=>{
        request.post(UserLoginUrl, user).then((resp: ResponseType)=>{
            if(resp.code === 200) {
                // 存储token
                sessionStorage.setItem("securityToken", JSON.stringify(resp.data).replaceAll("\"", ""))
            }
            resolve(resp)
        })
    })
}

// 注册
function userRegister(user: {nickname: string, username: string, password: string}){
    return request.post(UserRegisterUrl, user)
}

// 获取用户信息
function getUserAPI(){
    return request.post(GetUserUrl)
}

// 获取申请信息数量
function getAppliesCountAPI(userId: string){
    return request.post(GetAppliesCountUrl, {userId})
}

// 获取好友申请信息
function getFriendAppliesAPI(userId: string){
    return request.post(GetFriendAppliesUrl, {userId})
}

// 获取群组申请信息
function getGroupAppliesAPI(userId: string){
    return request.post(GetGroupAppliesUrl, {userId})
}

// 接受好友申请
function acceptFriendApplyAPI(from: string, userId: string){
    return request.post(AcceptFriendApplyUrl, {from, userId})
}

// 拒绝好友申请
function rejectFriendApplyAPI(from: string, userId: string){
    return request.post(RejectFriendApplyUrl, {from, userId})
}

// 接收群组申请
function acceptGroupApplyAPI(from: string, userId: string){
    return request.post(AcceptGroupApplyUrl, {from, userId})
}

// 拒绝群组申请
function rejectGroupApplyAPI(from: string, userId: string){
    return request.post(RejectGroupApplyUrl, {from, userId})
}

// 更改密码
function updatePasswordAPI(userId: string, password: string, newPassword: string){
    return request.post(UpdatePasswordUrl, { userId, password, newPassword})
}

// 更改个人简介
function updateIntroductionAPI(userId: string, introduction: string){
    return request.post(UpdateIntroductionUrl, { userId, introduction })
}

// 更改昵称
function updateNicknameAPI(userId: string, nickname: string){
    return request.post(UpdateNicknameUrl, { userId, nickname})
}

// 更改昵称
function uploadAvatarAPI(formData: FormData){
    return request.post(UploadAvatarUrl, formData, { headers:{ 'Content-Type': 'multipart/formdata'} })
}

export { 
    userLogin, 
    userRegister, 
    getUserAPI, 
    getAppliesCountAPI, 
    getFriendAppliesAPI, 
    getGroupAppliesAPI,
    acceptFriendApplyAPI,
    acceptGroupApplyAPI,
    rejectFriendApplyAPI,
    rejectGroupApplyAPI,
    updatePasswordAPI,
    updateIntroductionAPI,
    updateNicknameAPI,
    uploadAvatarAPI
}