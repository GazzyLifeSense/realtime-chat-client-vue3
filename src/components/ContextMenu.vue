<template>
    <div id="menu" class="flex-center" ref='menu' @mouseleave="config.display='none'" :style="{top: config.y+'px', left: config.x-70+'px', display: config.display}">
        <button class="delete flex-center" v-if="config.to?._id!==userStore.user._id" @click="showInfo(config.to._id)">查看资料</button>
        <button class="delete flex-center" v-if="config.type===1" @click="deleteFriend">删除好友</button>
        <button class="delete flex-center" v-if="config.type===2" @click="applyFriend">添加好友</button>
        <button class="delete flex-center" v-if="config.type===2&&config.from.owner===userStore.user._id" @click="transferGroup">转让群组</button>
        <button class="delete flex-center" v-if="config.type===2&&config.from.owner===userStore.user._id" @click="removeMember">移除成员</button>
    </div>
</template>

<script setup>
import { useUserStore } from '@/store/user'
import { usePageStore } from '@/store/page'
import { useFriendStore } from '@/store/friend'
import { useGroupStore } from '@/store/group'
import { applyFriendAPI, deleteFriendAPI } from '@/api/friend';
import { removeMemberAPI, transferGroupAPI } from '@/api/group';

const props = defineProps({
    config: {}
})

const userStore = useUserStore(),
    pageStore = usePageStore(),
    friendStore = useFriendStore(),
    groupStore = useGroupStore()

// 删除好友
function deleteFriend(){
    this.$confirm(`是否要删除好友-->昵称：${props.config.to.nickname}  用户名：${props.config.to.username}`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
    }).then(() => {
        deleteFriendAPI(userStore.user._id, props.config.to._id).then((resp)=>{
            if(resp.code === 200) {
                (this?.$message || console).success(resp.msg)
                friendStore.getFriendList()
            }
            else{
                (this?.$message || console).error(resp.msg)
            }
        })
    })
}

// 申请好友
function applyFriend(){
    applyFriendAPI(userStore.user._id, props.config.to.username).then((resp)=>{
        if(resp.code === 200) {
            (this?.$message || console).success(resp.msg)
        }else{
            (this?.$message || console).error(resp.msg)
        }
    })
}

// 移除成员
function removeMember(){
    this.$confirm(`是否要移除成员：${props.config.to.nickname}`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
    }).then(() => {
        removeMemberAPI(props.config.from._id, props.config.to._id).then((resp)=>{
            if(resp.code === 200) {
                (this?.$message || console).success(resp.msg)
                groupStore.getMemberList()
            }
            else{
                (this?.$message || console).error(resp.msg)
            }
        })
    })
}

// 转让群组
function transferGroup(){
    this.$confirm(`是否要将群组转让给成员：${props.config.to.nickname}`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
    }).then(() => {
        transferGroupAPI(props.config.from._id, props.config.to._id).then((resp)=>{
            if(resp.code === 200) {
                (this?.$message || console).success(resp.msg)
                this.$store.commit('groupAbout/Update_Owner',[props.config.from._id, props.config.to._id])
                pageStore.enterPage()
            }
            else{
                (this?.$message || console).error(resp.msg)
            }
        })
    })
}

function showInfo(id){
    this.$bus.$emit('showInfo',id, props.config.type)
    props.config.display = 'none'
}
</script>

<style lang="less">
#menu{
    flex-direction: column;
    background: #101316;
    padding: 6px 8px;
    border-radius: 5px;
    position: absolute;
    width: 150px;
    display: none;
    .delete{
        width: 100%;
        padding: 5px;
        border-radius: 0;
        height: 30px;
        color: #949694;
        background: transparent;
    }
    .delete:hover{
        color: white;
        background: #4752C3;
    }
}
</style>