<template>
    <div id="mainwrap" class="full">
        <SideBar />
        <Base />

        <!-- 用户信息卡片 -->
        <UserInfo />
    </div>
</template>

<script setup>
import { ref, reactive, computed, watch, onMounted, onBeforeUnmount, inject } from 'vue'
import { onBeforeRouteLeave, useRouter } from 'vue-router'
import { io } from "socket.io-client"
import { SocketIP } from '@/config'
import SideBar from '@/components/SideBar.vue'
import Base from '@/components/Base.vue'
import UserInfo from '@/components/UserInfo.vue'
import { getUserAPI } from '@/api/user'
import { useUserStore } from '@/store/user'
import { usePageStore } from '@/store/page'
import { useFriendStore } from '@/store/friend'
import { useGroupStore } from '@/store/group'
import { useMessageStore } from '@/store/message'

const userStore = useUserStore(),
    pageStore = usePageStore(),
    friendStore = useFriendStore(),
    groupStore = useGroupStore(),
    messageStore = useMessageStore(),
    router = useRouter()

const userInfoConfig = reactive({
    display:'none', user: null
})

const socketInstance = inject('socketInstance')
watch(()=>pageStore.page,(newVal, oldVal)=>{
    if(newVal.position == 'main' && oldVal && oldVal.position == 'group'){
        this.$socket.emit('leaveGroupChat', {token: sessionStorage.getItem('securityToken'), groupId: oldVal.to._id})
    }
}, {deep: true, immediate: true})

onMounted(async ()=>{
    // TODO pinia persist
    
    // 验证身份
    getUserAPI().then(async(resp)=>{
        if (resp.code === 200) {
            userStore.user = resp.data

            // 连接socket
            socketInstance.value = io(SocketIP, {
                auth:{
                    token: sessionStorage.getItem('securityToken')
                }
            })
            
            socketInstance.value.on("connect", () => {
                console.log('连接服务器成功',100)
                if (pageStore.page.to._id) {
                    messageStore.recvMsg()
                    messageStore.getHistoryMsgs()
                }
                socketInstance.value.on(userStore.user._id, (resp) => {
                    if([1,2,3,4,5,6,7,8,10,11,12,999].indexOf(resp.code) != -1){
                        console.log('callback1:',resp, pageStore.page)
                        if(resp.code == 1 && resp.data.from != userStore.user._id && (pageStore.page.positon == 'main' || ( pageStore.page.position != 'group' && pageStore.page.to?._id != resp.data?.from) || ( pageStore.page.position == 'group' && pageStore.page.to?._id != resp.data?.to))){
                            // 其它私聊消息提示
                            friendStore.setFriendNewStatus(resp.data.from, Date.now())
                            messageStore.messageList.push(resp.data)
                        }else if(resp.code === 2 && resp.data.from != userStore.user._id && (pageStore.page.position != 'group' || ( pageStore.page.position == 'group' && pageStore.page.to?._id != resp.data?.to))){
                            // 其它群组消息提示
                            groupStore.setGroupNewStatus(resp.data.to, Date.now())
                        // 新好友申请提示
                        }else if(resp.code === 3){
                            userStore.getAppliesCount()
                            (this?.$message || console).log(resp.msg)
                        // 好友列表更新
                        }else if(resp.code === 4){
                            friendStore.getFriendList()
                            (this?.$message || console).log(resp.msg)
                        // 群组列表更新
                        }else if(resp.code === 5){
                            groupStore.getGroupList()
                            (this?.$message || console).log(resp.msg)
                        }else if(resp.code === 6){
                            // 对方已不是好友
                            friendStore.getFriendList()
                            (this?.$message || console).error(resp.msg)
                        }else if(resp.code === 7){
                            // 已被移出群组
                            groupStore.getGroupList()
                            (this?.$message || console).error(resp.msg)
                        }else if(resp.code === 12){
                            // 成为群主
                            this.$store.commit('groupAbout/Update_Owner', [resp.data, userStore.user._id])
                        }else if([0,8,10,11].indexOf(resp.code) != -1){
                            (this?.$message || console).error(resp.msg)
                        }else if(resp.code === 999){
                            console.error(resp.msg)
                            this.$router.replace("/")
                            sessionStorage.clearAll()
                        }
                    }
                
                });
                // 断线重连
                socketInstance.value.on("disconnect", () => {
                    socketInstance.value = null
                    console.error('已断开连接')
                });
                socketInstance.value.on('new',(resp)=>{
                    if(resp.code === 9){
                        (this?.$message || console).log(resp.msg)
                        groupStore.getMemberList()
                    }
                })
            });
        }else{
            // 重定向至登录页
            (this?.$message || console).error(resp.msg)
            router.replace("/")
        }
    })
})

onBeforeUnmount(()=>{
    sessionStorage.removeItem('store')
    socketInstance.value = null
})
onBeforeRouteLeave ((to, from, next)=>{
    if(to.path == '/' && socketInstance.value) {
        socketInstance.value.disconnect();
    }
    next()
}) 

</script>

<style lang="less" scoped>
    #mainwrap{
        height: 100vh;
        width: 100vw;
        display: flex;
        background: white;
    }
</style>