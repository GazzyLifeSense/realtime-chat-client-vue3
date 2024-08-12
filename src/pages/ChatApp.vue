<template>
    <div id="chat-app" class="full">
        <!-- 侧边栏 -->
        <SideBar />

        <!-- 中置栏 -->
        <div class="chat-mid el-col-6" :class="{ 'fold': IsMidBarFold }" >
            <FriendList v-if="pageStore.page.position!=='group'"/>
            <MemberList v-if="pageStore.page.position=='group'"/>
            <UserBar />
        </div>

        <!-- 内容 -->
        <div class="chat-main">
            <Panel v-if="pageStore.page.position==='main'" />
            <Chat v-if="['private','group'].indexOf(pageStore.page.position) != -1" />
            <Discovery v-if="pageStore.page.position==='discovery'"/>
        </div>

        <!-- 用户信息卡片 -->
        <UserInfoCard />
    </div>
</template>

<script lang="ts" setup>
import { watch, onMounted, ref} from 'vue'
import { onBeforeRouteLeave, useRouter } from 'vue-router'
import { io } from "socket.io-client"
import { SocketIP } from '@/config/index.js'
import SideBar from '@/components/SideBar.vue'
import UserBar from '@/components/User/UserBar.vue'
import MemberList from '@/components/Group/MemberList.vue'
import FriendList from '@/components/FriendList.vue'
import Panel from '@/components/Panel.vue'
import Chat from '@/components/Chat.vue'
import Discovery from '@/components/Discovery.vue'
import UserInfoCard from '@/components/User/UserInfoCard.vue'
import { useUserStore } from '@/store/user'
import { usePageStore } from '@/store/page'
import { useFriendStore } from '@/store/friend'
import { useGroupStore } from '@/store/group'
import { useMessageStore } from '@/store/message'
import { ElMessage, ElNotification } from 'element-plus'
import { useSocketStore } from '@/store/socket'

const userStore = useUserStore(),
    pageStore = usePageStore(),
    friendStore = useFriendStore(),
    groupStore = useGroupStore(),
    messageStore = useMessageStore(),
    socketStore = useSocketStore(),
    router = useRouter()

const IsMidBarFold = ref(false)

// 内容切换
watch(()=>pageStore.page,(newVal, oldVal)=>{
    if(newVal.position == 'main' && oldVal && oldVal.position == 'group'){
        socketStore.instance.emit('leaveGroupChat', {token: sessionStorage.getItem('securityToken'), groupId: oldVal.to._id})
    }
}, {deep: true, immediate: true})

onMounted(async ()=>{
    // TODO pinia persist

    // 验证身份
    userStore.getUser().then(async (resp) => {
        if (resp.code === 200) {
            // 获取申请消息
            userStore.getAppliesCount()

            // 连接服务器
            socketStore.instance = io(SocketIP, {
                auth:{
                    token: sessionStorage.getItem('securityToken')
                }
            })
            
            socketStore.instance.on("connect", () => {
                ElNotification.success('连接服务器成功')
                if (pageStore.page.to._id) {
                    messageStore.recvMsg()
                    messageStore.getHistoryMsgs()
                }
                socketStore.instance.on(userStore.user._id, (resp) => {
                    if([1,2,3,4,5,6,7,8,10,11,12,999].indexOf(resp.code) != -1){
                        console.log('callback1:',resp, pageStore.page)
                        // 其它私聊消息提示 (发送者不是自己 且 (不在私聊窗口 或 私聊对象与该消息发送者不一致))
                        if(resp.code == 1 
                            && resp.data.from != userStore.user._id 
                            && (pageStore.page.position != 'private' 
                            || ( pageStore.page.position == 'private' && pageStore.page.to?._id != resp.data?.from)) 
                        ){
                            friendStore.setFriendNewStatus(resp.data.from, Date.now())
                            messageStore.newMsgQueue.push(resp.data)
                        }
                        // 其它群组消息提示 (发送者不是自己 且 (不在群聊窗口 或 群聊与该消息发送目标群聊不一致))
                        else if(resp.code === 2 
                            && resp.data.from != userStore.user._id 
                            && (pageStore.page.position != 'group' 
                            || ( pageStore.page.position == 'group' && pageStore.page.to?._id != resp.data?.to))
                        ){
                            groupStore.setGroupNewStatus(resp.data.to, Date.now())
                            messageStore.newMsgQueue.push(resp.data)
                        // 新好友申请提示
                        }else if(resp.code === 3){
                            userStore.getAppliesCount()
                            ElMessage.success(resp.msg)
                        // 好友列表更新
                        }else if(resp.code === 4){
                            friendStore.getFriendList()
                            ElMessage.success(resp.msg)
                        // 群组列表更新
                        }else if(resp.code === 5){
                            groupStore.getGroupList()
                            ElMessage.success(resp.msg)
                        }else if(resp.code === 6){
                            // 对方已不是好友
                            friendStore.getFriendList()
                            ElMessage.error(resp.msg)
                        }else if(resp.code === 7){
                            // 已被移出群组
                            groupStore.getGroupList()
                            ElMessage.error(resp.msg)
                        }else if(resp.code === 12){
                            // 成为群主
                            groupStore.updateOwner([resp.data, userStore.user._id])
                        }else if([0,8,10,11].indexOf(resp.code) != -1){
                            ElMessage.error(resp.msg)
                        }else if(resp.code === 999){
                            ElMessage.error(resp.msg)
                            router.replace("/")
                            sessionStorage.clearAll()
                        }
                    }
                
                });
                // 断线重连
                socketStore.instance.on("disconnect", () => {
                    ElNotification.error('已断开连接')
                });
                socketStore.instance.on('new',(resp)=>{
                    if(resp.code === 9){
                        ElMessage.success(resp.msg)
                        groupStore.getMemberList()
                    }
                })
            });
        }else{
            // 重定向至登录页
            ElMessage.error(resp.msg)
            router.replace("/")
        }
    })
})

onBeforeRouteLeave ((to, _from, next)=>{
    if(to.path == '/' && socketStore.instance?.connected) {
        socketStore.instance.disconnect();
    }
    next()
}) 
</script>

<style lang="less" scoped>
    #chat-app{
        height: 100vh;
        width: 100vw;
        display: flex;
        background: white;
    }
    .chat-mid{
        min-width: 0;
        width: 60vw;
        max-width: 260px;
        display: flex;
        flex-direction: column;
        background: #2E3237;
        position: relative;
    }
    .fold{
        width: 0 !important;
        overflow-x: hidden;
    }
    .chat-main{ flex: 1; overflow: auto; }
</style>