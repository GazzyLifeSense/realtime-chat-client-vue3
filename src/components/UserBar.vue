<template>
    <div id="userbar">
        <div class="profile flex-center" @click="userDetailOpen = !userDetailOpen">
            <a class="avatar-wrap flex-center">
                <img :src="getUserAvatar(userStore.user.avatar)" class="avatar" alt="头">
                <div class="online"></div>
            </a>
            <div class="username line">{{userStore.user.nickname}}</div>
            <UserDetail :open=userDetailOpen />
        </div>
        <div class="func-btn-wrap flex-center">
            <div class="func-btn flex-center" @click="getApplies">
                <img src="@/assets/待处理申请.svg">
                <div class="pot flex-center" v-if="userStore.applyCount">{{userStore.applyCount}}</div>
            </div>

            <div class="func-btn flex-center">
                <svg t="1675490965530" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="13588" width="16" height="16"><path d="M925.312 449.728l-71.424-11.2a55.68 55.68 0 0 1-27.072-12.224 50.496 50.496 0 0 1-16.832-21.44 184.128 184.128 0 0 1-8.704-41.344 83.648 83.648 0 0 1 4.608-41.344l42.88-58.176a47.488 47.488 0 0 0 6.656-17.856 39.296 39.296 0 0 0-1.536-18.88 48.64 48.64 0 0 0-9.152-16.32l-31.616-31.616a38.848 38.848 0 0 0-26.048-11.2 39.808 39.808 0 0 0-27.008 7.168l-58.176 42.88a52.608 52.608 0 0 1-27.584 11.2 44.992 44.992 0 0 1-27.584-4.096 145.92 145.92 0 0 1-21.952-12.8 192.896 192.896 0 0 1-25.472-20.928c-8.512-8.128-13.12-15.296-13.76-21.376l-11.264-71.488a38.848 38.848 0 0 0-13.76-24.448 38.848 38.848 0 0 0-26.048-10.24H489.6a37.888 37.888 0 0 0-17.92 4.608 44.096 44.096 0 0 0-14.784 12.8 34.816 34.816 0 0 0-7.104 17.28l-11.264 71.488a47.616 47.616 0 0 1-6.144 18.368c-3.392 6.144-7.68 11.584-12.8 16.32s-9.984 7.808-14.72 9.152c-11.584 4.096-25.344 7.04-41.344 8.704-16 1.728-29.824 0.192-41.344-4.608l-58.176-42.88a40.32 40.32 0 0 0-27.008-7.168 39.04 39.04 0 0 0-26.048 11.264l-31.616 31.616a48.96 48.96 0 0 0-9.216 16.32 39.296 39.296 0 0 0-1.536 18.88c1.024 6.464 3.2 12.416 6.656 17.856l42.88 58.176a58.88 58.88 0 0 1 11.264 28.032 43.52 43.52 0 0 1-4.096 27.008c-2.752 6.144-7.04 13.504-12.8 22.016-5.824 8.512-12.8 16.96-20.928 25.472-8.192 8.512-15.296 13.056-21.44 13.76l-71.424 11.264a34.112 34.112 0 0 0-13.248 4.608 39.68 39.68 0 0 0-10.752 9.152 55.936 55.936 0 0 0-7.616 12.224 32.896 32.896 0 0 0-3.072 13.824v44.864c0 9.536 3.392 18.24 10.24 26.048a39.04 39.04 0 0 0 24.512 13.76l71.424 11.2a48.896 48.896 0 0 1 18.368 6.208c6.144 3.392 11.584 7.68 16.32 12.8a37.12 37.12 0 0 1 9.152 14.72l2.048 7.168a58.752 58.752 0 0 1 3.072 10.688l2.048 11.712a132.864 132.864 0 0 1 2.048 24.448v11.2a30.656 30.656 0 0 1-5.12 17.344l-42.88 58.176a40.32 40.32 0 0 0-7.168 27.008 39.04 39.04 0 0 0 11.264 26.048l31.616 31.616a38.848 38.848 0 0 0 26.048 11.2 39.936 39.936 0 0 0 27.008-7.168l58.176-42.88a57.6 57.6 0 0 1 37.76-11.712 37.952 37.952 0 0 1 17.344 4.608c10.88 4.8 23.488 13.12 37.76 25.024 14.272 11.904 22.08 21.952 23.488 30.08l11.264 71.424a35.136 35.136 0 0 0 7.168 17.344 44.8 44.8 0 0 0 14.784 12.8c5.76 3.2 11.712 4.736 17.856 4.736h44.928c2.688 0 5.76-0.512 9.152-1.536a58.048 58.048 0 0 0 9.152-3.584 35.328 35.328 0 0 0 7.616-5.12 44.8 44.8 0 0 0 6.656-7.168 57.408 57.408 0 0 0 5.12-8.192 20.288 20.288 0 0 0 2.048-9.152l11.2-71.424a55.168 55.168 0 0 1 12.224-27.008 50.496 50.496 0 0 1 21.44-16.832c11.584-4.096 25.536-6.976 41.856-8.704 16.32-1.728 29.952-0.192 40.832 4.608l58.176 42.88a37.888 37.888 0 0 0 13.248 5.632c4.736 1.024 9.536 1.344 14.272 1.024a45.312 45.312 0 0 0 13.76-3.072 32.768 32.768 0 0 0 11.712-7.616l31.616-31.616a39.232 39.232 0 0 0 11.264-26.048 40.256 40.256 0 0 0-7.168-27.008l-42.88-58.176a52.608 52.608 0 0 1-11.2-27.584 44.992 44.992 0 0 1 4.096-27.584 188.8 188.8 0 0 1 33.728-47.424c8.192-8.512 15.296-13.056 21.44-13.76l71.424-11.264a39.168 39.168 0 0 0 24.512-13.76 39.104 39.104 0 0 0 10.176-26.048V489.6a37.504 37.504 0 0 0-4.608-17.856 43.52 43.52 0 0 0-12.8-14.784 35.584 35.584 0 0 0-17.28-7.232z m-413.248 239.808a171.072 171.072 0 0 1-125.504-52.032C351.872 602.816 334.528 560.96 334.528 512s17.344-90.816 52.032-125.504a171.072 171.072 0 0 1 125.504-52.032c48.96 0 90.816 17.344 125.504 52.032 34.752 34.688 52.096 76.544 52.096 125.504s-17.344 90.816-52.032 125.504a171.328 171.328 0 0 1-125.568 52.032z" p-id="13589" fill="#8a8a8a"></path></svg>
            </div>
        </div>
        

        <div class="backdrop flex-center" :style="{display: showApplyList ? 'flex' : 'none'}" @click.self="showApplyList = !showApplyList">
            <div class="apply-list-wrap">
                <div class="apply-friend-list" ref="applyFriendList">
                    <h2 class="title">好友申请</h2>
                    <div v-if="!Array.isArray(applyFriendList) || !applyFriendList.length">无</div>
                    <div class="applyFriend bounceInRight" v-for="user of applyFriendList" :key="user._id">
                        <img class="avatar" :src="getUserAvatar(user.avatar)" height="40" width="40" />
                        <div class="info line">
                            <div class="nickname line">昵称：{{user.nickname}}</div>
                            <div class="username line">用户名：{{user.username}}</div>
                        </div>
                        <el-button type="primary" size="small" @click="acceptFriendApply(user)">接受</el-button>
                        <el-button type="danger" size="small" @click="rejectFriendApply(user)">拒绝</el-button>
                    </div>
                </div>
                <br/>
                <div class="apply-group-list">
                    <h2 class="title">群组申请</h2>
                    <div v-if="!Array.isArray(applyGroupList) || !applyGroupList.length">无</div>
                    <div class="applyGroup bounceInRight" v-for="apply of applyGroupList" :key="apply._id">
                        <img class="avatar" :src="getUserAvatar(apply.applyFrom.avatar)" height="40" width="40" />
                        <div class="info line">
                            <div class="line">{{apply.applyFrom.nickname}}</div>
                            <div class="line">{{apply.groupDetail.name}}</div>
                        </div>
                        <el-button type="primary" size="small" @click="acceptGroupApply(apply)">接受</el-button>
                        <el-button type="danger" size="small" @click="rejectGroupApply(apply)">拒绝</el-button>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>
<script setup>
import { ref, watch } from 'vue'
import UserDetail from '@/components/UserDetail.vue'
import { getUserAvatar } from '@/utils/pathResolver';
import { useUserStore } from '@/store/user';
import { useFriendStore } from '@/store/friend'
import {
    getFriendAppliesAPI, getGroupAppliesAPI,
    acceptFriendApplyAPI, rejectFriendApplyAPI, acceptGroupApplyAPI, rejectGroupApplyAPI
} from '@/api/user'

const userStore = useUserStore(),
    friendStore = useFriendStore()

const showApplyList = ref(false),
    applyFriendList = ref([]),
    applyGroupList = ref([]),
    userDetailOpen = ref(false)

watch(() => userStore.user, () => {
    userStore.getAppliesCount()
})

// 获取申请信息列表
function getApplies(){
    showApplyList.value = true;
    getFriendApplies()
    getGroupApplies()
}

function getFriendApplies(){
    getFriendAppliesAPI(userStore.user._id).then((resp)=>{
        if(resp.code === 200){
            applyFriendList.value = resp.data
        }else{
            (this?.$message || console).error('好友申请获取失败！')
        }
    })
}

function getGroupApplies(){
    getGroupAppliesAPI(userStore.user._id).then((resp)=>{
        if(resp.code === 200){
            applyGroupList.value = resp.data
        }else{
            (this?.$message || console).error('群组申请获取失败！')
        }
    })
}

// 接受好友申请
function acceptFriendApply(user){
    acceptFriendApplyAPI(user.apply.from, user.apply.to).then((resp)=>{
        if(resp.code === 200){
            (this?.$message || console).success(resp.msg)
            getFriendApplies()
            friendStore.getFriendList()
            userStore.getAppliesCount()
        }else{
            (this?.$message || console).error(resp.msg)
        }
    })
}

// 拒绝好友申请
function rejectFriendApply(user){
    rejectFriendApplyAPI(user.apply.from, user.apply.to).then((resp)=>{
        if(resp.code === 200){
            (this?.$message || console).success(resp.msg)
            getFriendApplies()
            friendStore.getFriendList()
            userStore.getAppliesCount()
        }else{
            (this?.$message || console).error(resp.msg)
        }
    })
}

// 接受群组申请
function acceptGroupApply(apply){
    acceptGroupApplyAPI(apply.from, apply.to).then((resp)=>{
        if(resp.code === 200){
            (this?.$message || console).success(resp.msg)
            getGroupApplies()
            userStore.getAppliesCount()
        }else{
            (this?.$message || console).error(resp.msg)
        }
    })
}

// 拒绝群组申请
function rejectGroupApply(apply){
    rejectGroupApplyAPI(apply.from, apply.to).then((resp)=>{
        if(resp.code === 200){
            (this?.$message || console).success(resp.msg)
            getGroupApplies()
            userStore.getAppliesCount()
        }else{
            (this?.$message || console).error(resp.msg)
        }
    })
}
</script>
<style lang="less" scoped>
#userbar{
    width: 100%;
    display: flex;
    justify-content: flex-start;
    color: white;
    background: #292A2E;
    padding: 6px 8px;
    position: absolute;
    bottom: 0;
    left: 0;
    .profile{
        display: flex;
        flex: 1;
        padding: .5em;
        justify-content: flex-start;
        align-items: center;
        gap: .3em;
        .avatar-wrap{
            padding: 0 .3em;
            position: relative;
            .avatar{
                width: 2em;
                height: 2em;
                border-radius: 50%;
            }
            .online{
                background-color: #21A65A;
                height: 1.125em;
                width: 1.125em;        
                bottom: -.25em;
                right: -.25em;
                position: absolute;
                border-radius: 50%;
                border: .3em solid  #292A2E;
            }
        }
    }
    .func-btn-wrap{
        .func-btn{
            position: relative;
            height: 2.1875em;
            width: 2.1875em;
            background: transparent;
            cursor: pointer;
            margin-left: 2px;
            svg{
                display: block;
            }
            .pot{
                position: absolute;
                right: 0;
                top: 0;
                background: red;
                font-size: .75em;
                border-radius: 50%;
                height: .8em;
                width: .8em;
            }
        }
    }
    .profile:hover, .func-btn:hover{
        background: #2E3237;
        border-radius: 6px;
        cursor: pointer;
    }
}

.backdrop{
    width: 100%;
    height: 100%;
    position: fixed;
    z-index: 1;
    left: 0;
    top: 0;
    background: rgba(0, 0, 0, 0.85);
    .apply-list-wrap{
        height: 480px;
        width: 440px;
        background: #212326;
        border-radius: 5px;
        display: flex;
        justify-content: flex-start;
        align-items: center;
        flex-direction: column;
        color: black;
        padding: 0 32px;
        overflow-y: scroll;
        .apply-friend-list,.apply-group-list{
            display: flex;
            flex-direction: column;
            align-items: flex-start;
            width: 100%;
            color: white;
            .applyFriend,.applyGroup{
                width: 100%;
                display: flex;
                justify-content: space-between;
                align-items: center;
                .avatar{
                    margin: 10px;
                }
                .info{
                    flex: 1;
                    padding-right: 10px;
                }
            }
        }
    } 
    .apply-list-wrap::-webkit-scrollbar{
        width: 10px;
        border-radius: 10px;
        background: #a9b1b8;
    }
    .apply-list-wrap::-webkit-scrollbar-thumb{
        border-radius: 10px;
        background: #98999b;
    }
}
</style>