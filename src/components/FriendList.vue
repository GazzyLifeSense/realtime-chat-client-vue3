<template>
<div id="friend-list-wrap">
        <div class="title">好友 - {{ friendList.length }}</div>
        <div class="friend-list miniscrollbar">
            <div class="list-item" v-for="friend of friendList" :key="friend._id" ref="friend" @contextmenu.prevent="showMenu(friend)">
                <div class="avatar"  @click="enterPrivateChat(friend)">
                    <img :src="getUserAvatar(friend.avatar)" height='35' width='35'>
                    <div class="newMsg" v-if="friend.hasNew">{{friend.hasNew}}</div>
                </div>
                <div class="info"  @click="enterPrivateChat(friend)">
                    <div class="username line">{{friend.nickname}}</div>
                </div>
                <img src="@/assets/解散.svg" height="19"  @click="showMenu(friend)">
            </div>
        </div>
        <context-menu :config="contextMenuConfig"></context-menu>
    </div>
</template>

<script setup>
import { onBeforeMount, reactive, watch, computed } from 'vue'
import ContextMenu from './ContextMenu.vue'
import { getUserAvatar } from '@/utils/pathResolver'
import { useUserStore } from '@/store/user'
import { usePageStore } from '@/store/page'
import { useFriendStore } from '@/store/friend'
import { getFriendListAPI } from '@/api/friend'
import { useMessageStore } from '@/store/message'

const userStore = useUserStore(),
    pageStore = usePageStore(),
    friendStore = useFriendStore(),
    messageStore = useMessageStore()

const contextMenuConfig = reactive({
    x: null, y: null, display:'none'
})

// 按新消息时间排序
const friendList = computed(()=>friendStore.friendList.sort((a,b)=>a.hasNew > b.hasNew))

watch(() => userStore.user._id, () => {
    // 刷新好友列表
    friendStore.getFriendList()
})

// 进入私聊
function enterPrivateChat(to){
    pageStore.enterPage({type:1, to})
    friendStore.setFriendNewStatus(to._id)
}

function showMenu(to){
    contextMenuConfig = {x: event.clientX-5, y: event.clientY-5, display: 'flex', type: 1, to}
}

onBeforeMount(()=>{
    if(userStore.user._id != null){ friendStore.getFriendList() }
})
</script>

<style lang="less" scoped>
#friend-list-wrap{
    width: 100%;
    color: white;
    max-height: calc(100% - 58px);
    .title{
        padding: 20px 20px 0 20px;
        font-weight: 600;
        white-space: nowrap;
    }
    .friend-list{
        padding: 10px 20px 0 20px;
        display: flex;
        flex-direction: column;
        overflow-x: hidden;
        overflow-y: auto;
        max-height: calc(100% - 44px);
        .list-item{
            display: flex;
            justify-content: flex-start;
            align-items: center;
            margin: 5px 0;
            height: 40px;
            width: 100%;
            cursor: pointer;
            position: relative;
            .avatar{
                height: 35px;
                width: 35px;
                flex-shrink: 0;
                overflow: hidden;
                .newMsg{
                    background-color: #F74142;
                    height: auto;
                    width: auto;
                    padding: 0 4px;
                    bottom: -6px;
                    left: 12px;

                    position: absolute;
                    border-radius: 12px;
                    border: solid 4px #1E1F23;

                    text-align: center;
                    font-size: 12px;
                    font-weight: bold;
                    color: #FFFFEF;

                    pointer-events: none;
                }
            }
            .info{
                flex: 1;
                padding: 15px;
                overflow: hidden;
                .username{
                    width: 100%;
                }
            }
        }
    }
    
}

.menu{
    background: #181A1B;
    position: absolute;
    right: 0;
    transform: translateX(80%);
    height: 40px;
    border-radius: 5px;
    .delete{
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