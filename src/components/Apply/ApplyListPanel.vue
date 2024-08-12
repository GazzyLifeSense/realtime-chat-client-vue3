<script lang="ts" setup>
import { watch } from 'vue';
import {
    getFriendAppliesAPI, getGroupAppliesAPI,
    acceptFriendApplyAPI, rejectFriendApplyAPI, acceptGroupApplyAPI, rejectGroupApplyAPI
} from '@/api/user'
import { ElMessage } from 'element-plus';
import { useUserStore } from '@/store/user'
import { useFriendStore } from '@/store/friend'
import { useGroupStore } from '@/store/group'
import { getUserAvatar } from '@/utils/pathResolver';

const props = defineProps({ show: null })
const emit = defineEmits(['update:show'])
const 
    userStore = useUserStore(),
    friendStore = useFriendStore(),
    groupStore = useGroupStore()

watch(()=>props.show, (newVal)=>{
    if(newVal){
        getFriendApplies()
        getGroupApplies()
    }
})

// 获取好友申请消息
function getFriendApplies(){
    getFriendAppliesAPI(userStore.user._id).then((resp)=>{
        if(resp.code === 200){
            friendStore.friendApplyList = resp.data
        }else{ ElMessage.error(resp.msg) }
    })
}

// 获取群组申请消息
function getGroupApplies(){
    getGroupAppliesAPI(userStore.user._id).then((resp)=>{
        if(resp.code === 200){
            groupStore.groupApplyList = resp.data
        }else{ ElMessage.error(resp.msg) }
    })
}

// 接受好友申请
function acceptFriendApply(user: { apply: {from: string, to: string}}){
    acceptFriendApplyAPI(user.apply.from, user.apply.to).then((resp)=>{
        if(resp.code === 200){
            ElMessage.success(resp.msg)
            getFriendApplies()
            friendStore.getFriendList()
            userStore.getAppliesCount()
        }else{ ElMessage.error(resp.msg) }
    })
}

// 拒绝好友申请
function rejectFriendApply(user: { apply: {from: string, to: string}}){
    rejectFriendApplyAPI(user.apply.from, user.apply.to).then((resp)=>{
        if(resp.code === 200){
            ElMessage.success(resp.msg)
            getFriendApplies()
            friendStore.getFriendList()
            userStore.getAppliesCount()
        }else{ ElMessage.error(resp.msg) }
    })
}

// 接受群组申请
function acceptGroupApply(apply: { from: string, to: string}){
    acceptGroupApplyAPI(apply.from, apply.to).then((resp)=>{
        if(resp.code === 200){
            ElMessage.success(resp.msg)
            getGroupApplies()
            userStore.getAppliesCount()
        }else{ ElMessage.error(resp.msg) }
    })
}

// 拒绝群组申请
function rejectGroupApply(apply: { from: string, to: string}){
    rejectGroupApplyAPI(apply.from, apply.to).then((resp)=>{
        if(resp.code === 200){
            ElMessage.success(resp.msg)
            getGroupApplies()
            userStore.getAppliesCount()
        }else{ ElMessage.error(resp.msg) }
    })
}
</script>

<template>
    <div class="backdrop flex-center" v-show="show" @click.self="emit('update:show', false)">
        <div class="apply-list-wrap">
            <div class="apply-friend-list">
                <h2 class="title">好友申请</h2>
                <div v-if="!Array.isArray(friendStore.friendApplyList) || !friendStore.friendApplyList.length">无</div>
                <div class="applyFriend bounceInRight" v-for="user of friendStore.friendApplyList" :key="user._id">
                    <img class="avatar" :src="getUserAvatar(user.avatar)" height="40" width="40" />
                    <div class="info line">
                        <div class="nickname line">昵称：{{user.nickname}}</div>
                        <div class="username line">用户名：{{user.username}}</div>
                    </div>
                    <button class="primary-btn" @click="acceptFriendApply(user)">接受</button>
                    <button class="danger-btn" @click="rejectFriendApply(user)">拒绝</button>
                </div>
            </div>
            <br/>
            <div class="apply-group-list">
                <h2 class="title">群组申请</h2>
                <div v-if="!Array.isArray(groupStore.groupApplyList) || !groupStore.groupApplyList.length">无</div>
                <div class="applyGroup bounceInRight" v-for="apply of groupStore.groupApplyList" :key="apply._id">
                    <img class="avatar" :src="getUserAvatar(apply.applyFrom.avatar)" height="40" width="40" />
                    <div class="info line">
                        <div class="line">{{apply.applyFrom.nickname}}</div>
                        <div class="line">{{apply.groupDetail.name}}</div>
                    </div>
                    <button class="primary-btn" @click="acceptGroupApply(apply)">接受</button>
                    <button class="danger-btn" @click="rejectGroupApply(apply)">拒绝</button>
                </div>
            </div>
        </div>
    </div>
</template>

<style lang="less" scoped>
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
        overflow-y: auto;
        .apply-friend-list,.apply-group-list{
            display: flex;
            flex-direction: column;
            align-items: flex-start;
            width: 100%;
            color: white;
            .applyFriend,.applyGroup{
                padding: .5em;
                width: 100%;
                display: flex;
                justify-content: space-between;
                align-items: center;
                gap: .5em;
                .info{
                    flex: 1;
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