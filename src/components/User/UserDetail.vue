<template>
    <div id="userDetail" class="flex-center" ref='menu' v-if="show">
        <div class="banner"></div>
        <img class="cancel" src="@/assets/arrowDown.svg" @click.stop="hideUserDetail">
        <div class="avatar-wrap">
            <div class="mask">
                <img :src="getUserAvatar(userStore.user.avatar)" class="avatar" title="上传头像" @click.stop="fileInputRef.click">
            </div>
            <input type="file" hidden @change="uploadAvatar" ref="fileInputRef" accept=".jpg,.jpeg,.png,.webp,.ico,.svg">
            <div class="online"></div>
        </div>
        <div class="detail-wrap flex-center">
            <div class="detail">
                <div class="nickname flex-start"><div class="label">昵称：</div>{{userStore.user.nickname}}&nbsp;<a @click="updateNickname"><img src="@/assets/修改.svg"></a></div>
                
                <div class="separator"></div>
                
                <div class="username">
                <h3>用户名</h3>
                <div class="text">{{userStore.user.username}}</div>
                </div>
                
                <div class="separator"></div>
                
                <div class="uid">
                <h3>UID</h3>
                <div class="text">{{userStore.user._id}}</div>
                </div>
            
                <div class="separator"></div>
                
                <div class="location">
                    <h3>归属地</h3>
                    <div class="text">{{userStore.user.location}}</div>
                </div>

                <div class="separator"></div>
                
                <div class="introduction">
                    <h3 class="flex-start">个人介绍&nbsp;<a @click="updateIntroduction"><img src="@/assets/修改.svg"></a></h3>
                    <div class="text">{{userStore.user.introduction || ''}}</div>
                </div>
                
                <div class="separator"></div>
                
                <div class="regDate">
                    <h3>注册时间</h3>
                    <div class="text">{{new Date(parseInt(userStore.user.regDate)).toLocaleString()}}</div>
                </div>

                <div class="separator"></div>

                <div class="logout flex-start" @click.stop="updatePassword"><img src="@/assets/修改密码.svg">&nbsp;修改密码</div>

            <div class="separator"></div>

                <div class="logout flex-start" @click.stop="logout"><img src="@/assets/logout.svg">&nbsp;退出登录</div>
            </div>
        </div>

    </div>
</template>

<script lang="ts" setup>
import { getUserAvatar } from '@/utils/pathResolver'
import { useUserStore } from '@/store/user'
import { updatePasswordAPI, updateIntroductionAPI, updateNicknameAPI, uploadAvatarAPI } from '@/api/user';
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { ElMessage, ElMessageBox } from 'element-plus';
import { ResponseType } from '@/types/request';
import { useSocketStore } from '@/store/socket';

defineProps({
    show: null
})
const emit = defineEmits(['update:show'])

const fileInputRef = ref()
const userStore = useUserStore(),
    socketStore = useSocketStore()
const router = useRouter()

function hideUserDetail(){
    emit('update:show', false)
}

// 头像上传
function uploadAvatar(e: any){
    console.log(e.target.files)
    let file = e?.target?.files?.[0] 
    if(file.size/1024/1024 > 1){
        return ElMessage.warning('文件大小超过1MB限制！')
    }
    let formData = new FormData();
    formData.append('userId', userStore.user._id)
    formData.append('filename', file.name)
    formData.append('fileType', file.type)
    var reader = new FileReader()
    reader.readAsDataURL(file)
    reader.onload = function(){
        formData.append('file', this.result as string)
        uploadAvatarAPI(formData).then((resp: ResponseType)=>{
            if(resp.code === 200){
                ElMessage.success(resp.msg)
                userStore.getUser()
            }else{ ElMessage.error(resp.msg) }
        })
    }
}

// 修改昵称
function updateNickname(){
    ElMessageBox.prompt('长度<8',"输入昵称",{
        confirmButtonText: '提交',
        cancelButtonText: '取消',
        inputValidator: (data: string)=>{
            if(data.trim().length <= 8) return true
            return '长度需小于等于8!'
        },
    }).then(({value})=>{
        updateNicknameAPI(userStore.user._id, value.trim()).then((resp: ResponseType)=>{
            if(resp.code === 200){
                ElMessage.success(resp.msg)
                userStore.getUser()
            }else{ ElMessage.error(resp.msg) }
        })
    })
}

// 修改个人介绍
function updateIntroduction(){
    ElMessageBox.prompt('长度<25',"输入个人介绍",{
        confirmButtonText: '提交',
        cancelButtonText: '取消',
        inputValidator: (data: string)=>{
            if(data.trim().length <= 25) return true
            return '长度需小于25!'
        },
    }).then(({value})=>{
        updateIntroductionAPI(userStore.user._id, value.trim()).then((resp: ResponseType)=>{
            if(resp.code === 200){
                ElMessage.success(resp.msg)
                userStore.getUser()
            }else{ ElMessage.error(resp.msg) }
        })
    })
}

// 修改密码
function updatePassword(){
    ElMessageBox.prompt('长度<15',"输入当前密码",{
        confirmButtonText: '提交',
        cancelButtonText: '取消',
        inputType: 'password',
        inputValidator: (data)=>{
            if(data.length <= 15) return true
            return '长度需小于15!'
        },
    }).then(({value})=>{
        let password = value
        ElMessageBox.prompt('长度<15',"输入新密码",{
            confirmButtonText: '提交',
            cancelButtonText: '取消',
            inputType: 'password',
            inputValidator: (data)=>{
                if(data.length <= 15) return true
                return '长度需小于15!'
            }}).then(({value})=>{
                let newPassword = value
                updatePasswordAPI(userStore.user._id, password, newPassword).then((resp: ResponseType)=>{
                    if(resp.code === 200){
                        ElMessage.success(resp.msg)
                        router.replace("/")
                    }else{ ElMessage.error(resp.msg) }
                })
            })
    })
}

// 退出登录
function logout(){
    sessionStorage.clear()
    socketStore.instance.emit('logout')
    router.push('/')
}
</script>

<style lang="less">
#userDetail{
    background: #232429;
    position: absolute;
    left: 50%;
    transform: translateX(-50%);
    bottom: 3.125em;
    border-radius: 1em;
    flex-direction: column;
    justify-content: flex-start;
    align-items: center;
    cursor: default;
    z-index: 1;
    .banner{
        border-radius: 1em 1em 0 0;
        width: 100%;
        height: 3.75em;
        background: linear-gradient(to right,rgb(12, 162, 182),rgb(21, 240, 167));
    }
    .cancel{
        position: absolute;
        right: 15px;
        top: 15px;
        cursor: pointer;
        z-index: 1;
    }
    .avatar-wrap{
        position: absolute;
        left: 1em;
        top: 1em;
        border: 6px solid #232429;
        border-radius: 50%;
        background-color: #232429;
        .mask{
            border-radius: 50%;
        }
        .mask:hover{
            opacity: 0.7;
            cursor: pointer;
        }
        .mask:hover:after{
            content: '上传头像';
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translateX(-50%) translateY(-50%);
            white-space: nowrap;
            pointer-events: none;
        }
        .avatar{
            height: 5em;
            width: 5em;
            position: relative;
            overflow: hidden;
            border-radius: 50%;
        }
        .online{
            background-color: #21A65A;
            height: 1.625em;
            width: 1.625em;        
            top: 3.4375em;
            right: -5px;
            z-index: 1;
            position: absolute;
            border-radius: 50%;
            border: solid 6px #292A2E;
        }   

    }
    .detail-wrap{
        width: 100%;
        padding: 3.7em 1em 1em;
        
        .detail{
            font-size: 20px;
            border-radius: 15px;
            padding: 7px 12px 7px;
            background: #101316;
            width: 100%;
        }
        .nickname{
            font-size: 20px;
        }
        .username,.uid{
            font-size: 14px;
            .label{
                font-size: 14px;
            }
        }
        .nickname, .username, .uid, .location, .introduction, .regDate, .logout{
            padding: 5px 0;
        }
        h3{
            font-size: 12px;
            margin: 0;
        }
        .label{
            font-size: 16px;
        }
        .text,.logout{
            font-size: 14px;
            color: #BDBEC6;
        }
        .logout:hover{
            background: #2E3237;
            border-radius: 6px;
            cursor: pointer;
        }
    }
}
</style>