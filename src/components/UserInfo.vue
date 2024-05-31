<template>
    <div id="userInfo" class="flex-center" ref='menu' v-if="pageStore.userInfoConfig.show">
         <div class="banner"></div>
         <img class="cancel" src="@/assets/arrowDown.svg" @click.stop="pageStore.userInfoConfig.show = false">
         <div class="avatar">
            <img :src="getUserAvatar(user.avatar)">
            <div class="online">
        </div>
         </div>
         <div class="detail-wrap flex-center">
             <div class="detail">
                 <div class="nickname flex-start"><div class="label">昵称：</div>{{user.nickname}}&nbsp;</div>
                 
                 <div class="separator"></div>
                 
                 <div class="username">
                    <h3>用户名</h3>
                    <div class="text">{{user.username}}</div>
                 </div>
                
                 <div class="separator"></div>
                 
                 <div class="location">
                     <h3>归属地</h3>
                     <div class="text">{{user.location}}</div>
                 </div>

                 <div class="separator"></div>
                 
                 <div class="introduction">
                     <h3 class="flex-start">个人介绍</h3>
                     <div class="text">{{user.introduction==''?'此人很懒,没有留下任何信息':user.introduction}}</div>
                 </div>
                 
                 <div class="separator"></div>
                 
                 <div class="regDate">
                     <h3>注册时间</h3>
                     <div class="text">{{new Date(parseInt(user.regDate)).toLocaleString()}}</div>
                 </div>

                <div class="separator"></div>

                <div class="opt flex-start" @click.stop="applyFriend" v-if="pageStore.userInfoConfig.type==2">申请好友</div>
                
                <div class="separator"></div>

                <div class="opt flex-start" @click.stop="enterPrivateChat(user)" v-if="pageStore.userInfoConfig.type==2">发送信息</div>
            </div>
         </div>
    </div>
</template>

<script setup>
import { ref, watch } from 'vue'
import { applyFriendAPI } from '@/api/friend'
import { getUserAvatar } from '@/utils/pathResolver'
import { useUserStore } from '@/store/user'
import { usePageStore } from '@/store/page'
import { getValue } from '@/utils'
import { useFriendStore } from '@/store/friend'
import { useGroupStore } from '@/store/group'

const userStore = useUserStore(),
    friendStore = useFriendStore(),
    groupStore = useGroupStore(),
    pageStore = usePageStore()

const user = ref({})
// 获取用户信息
watch(() => pageStore.userInfoConfig.id, (newVal) => {
    if(newVal)
        user.value = (pageStore.userInfoConfig.isFriend ? getValue(friendStore.friendList, '_id', newVal)
            : getValue(groupStore.memberList, '_id', newVal)) || {}
})

// 申请好友
function applyFriend(){
    applyFriendAPI({userId: userStore.user._id, username: props.user.username}).then((resp)=>{
        if(resp.code === 200){
            (this?.$message || console).log(resp.msg)
        }else{
            (this?.$message || console).error(resp.msg)
        }
    })
}

// 进入私聊
function enterPrivateChat(to){
    pageStore.enterPage({type:1, to})
    pageStore.userInfoConfig.show = false
}
</script>

<style lang="less" scoped>
#userInfo{
    background: #232429;
    position: fixed;
    max-width: 90vw;
    border: 6px solid;
    border-image: linear-gradient(#0a0701, #5c3cec) 20;
    flex-direction: column;
    justify-content: flex-start;
    align-items: center;
    cursor: default;
    z-index: 1;
    left: 50%;
    top: 50%;
    transform: translateX(-50%) translateY(-50%);
    color: white;
    .banner{
        width: 100%;
        height: 3.75em;
        background: linear-gradient(to right,rgb(70, 59, 95),rgb(32, 36, 34));
    }
    .cancel{
        position: absolute;
        right: 15px;
        top: 15px;
        cursor: pointer;
        z-index: 1;
    }
    .avatar{
        position: absolute;
        left: .9em;
        top: .9em;
        border: 5px solid #232429;
        border-radius: 50%;
        height: 5em;
        img{
            width: 100%;
            height: 100%;
            position: relative;
            overflow: hidden;
            border-radius: 50%;
        }
        .online{
            background-color: #21A65A;
            height: 1.625em;
            width: 1.625em;        
            top: 3.4325em;
            right: -5px;
            z-index: 1;
            position: absolute;
            border-radius: 50%;
            border: solid 6px #292A2E;
        }   
    }
    .detail-wrap{
        width: 100%;
        padding: 3em 1em 1em;
        background: linear-gradient(to bottom,rgb(17, 6, 17), 70%, rgb(39, 36, 192));
        font-size: .875em;
        .detail{
            font-size: 1.25em;
            border-radius: 15px;
            padding: 7px 12px 7px;
            background: #101316;
            width: 100%;
        }
        .nickname{
            font-size: 1.25em;
        }
        .nickname, .username, .uid, .location, .introduction, .regDate, .logout{
            padding: 5px 0;
        }
        h3{
            font-size: .75em;
            margin: 0;
        }
        .label{
            font-size: 1em;
        }
        .text,.opt{
            font-size: .875em;
            color: #BDBEC6;
        }
        .opt:hover{
            background: #2E3237;
            border-radius: 6px;
            cursor: pointer;
        }
    }
}
</style>