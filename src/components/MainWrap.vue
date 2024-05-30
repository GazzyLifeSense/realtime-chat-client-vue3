<template>
    <div id="mainwrap" class="full">
        <SideBar />
        <Base />
        <UserInfo :config=userInfoConfig />
    </div>
</template>

<script setup>
import { ref, reactive, computed, watch, onMounted, onBeforeUnmount, inject } from 'vue'
import { onBeforeRouteLeave } from 'vue-router'
import { io } from "socket.io-client"
import { SocketIP } from '@/config'
import SideBar from '@/components/SideBar.vue'
import Base from '@/components/Base.vue'
import UserInfo from '@/components/UserInfo.vue'
import { getUser } from '@/api/user'
import { useUserStore } from '@/store/user'
import { usePageStore } from '@/store/page'
import { useFriendStore } from '@/store/friend'
import { useGroupStore } from '@/store/group'
import { useMessageStore } from '@/store/message'

const userStore = useUserStore(),
    pageStore = usePageStore(),
    friendStore = useFriendStore(),
    groupStore = useGroupStore(),
    messageStore = useMessageStore()

const userInfoConfig = reactive({
    display:'none', user: null
})

const socketInstance = inject('socketInstance')
watch(page,(newVal, oldVal)=>{
    if(newVal.position == 'main' && oldVal && oldVal.position == 'group'){
        this.$socket.emit('leaveGroupChat', {token: sessionStorage.getItem('securityToken'), groupId: oldVal.to._id})
    }
}, {deep: true, immediate: true})

function showInfo(id, type){
    let user;
    if(type == 1){
        for(let i = 0; i < this.friendList.length; i++){
            if(this.friendList[i]._id == id){
                user = this.friendList[i]
            }
        }
    }else{
        for(let i = 0; i < this.memberList.length; i++){
            if(this.memberList[i]._id == id){
                user = this.memberList[i]
            }
        }
    }
    this.userInfoConfig = {display: 'flex', user, type}
}

onMounted(async ()=>{
    if (sessionStorage.getItem('store')) {
        this.$store.replaceState(Object.assign({}, this.$store.state, JSON.parse(sessionStorage.getItem('store'))))
        sessionStorage.removeItem('store')
    }
    
    // 在页面刷新时将vuex里的信息保存到sessionStorage里
    window.addEventListener('beforeunload', () => {
        sessionStorage.setItem('store', JSON.stringify(this.$store.state))
    })
    // 验证身份
    getUser.then(async(resp)=>{
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
                if(this.page.to){
                    this.$bus.$emit('recvMsg')
                    this.$bus.$emit('getMsg')
                }
                socketInstance.value.on(userStore.user._id, (resp) => {
                    if([1,2,3,4,5,6,7,8,10,11,12,999].indexOf(resp.code) != -1){
                        console.log('callback1:',resp, this.page)
                        if(resp.code == 1 && resp.data.from != userStore.user._id && (this.page.positon == 'main' || ( this.page.position != 'group' && this.page.to?._id != resp.data?.from) || ( this.page.position == 'group' && this.page.to?._id != resp.data?.to))){
                            // 私聊消息提示
                            friendStore.setFriendNewStatus(resp.data.from, Date.now())
                            messageStore.messageList.push(resp.data)
                        }else if(resp.code === 2 && resp.data.from != userStore.user._id && (this.page.position != 'group' || ( this.page.position == 'group' && this.page.to?._id != resp.data?.to))){
                            // 群组消息提示
                            groupStore.setGroupNewStatus(resp.data.to, Date.now())
                        // 新好友申请提示
                        }else if(resp.code === 3){
                            userStore.getAppliesCount()
                            (this?.$message || console).success(resp.msg)
                        // 好友列表更新
                        }else if(resp.code === 4){
                            friendStore.getFriendList()
                            (this?.$message || console).success(resp.msg)
                        // 群组列表更新
                        }else if(resp.code === 5){
                            groupStore.getGroupList()
                            (this?.$message || console).success(resp.msg)
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
                            this.$notify.error(resp.msg)
                            this.$router.replace("/")
                            sessionStorage.clearAll()
                        }
                    }
                
                });
                // 断线重连
                socketInstance.value.on("disconnect", () => {
                    socketInstance.value = null
                    this.$notify.error('已断开连接')
                });
                socketInstance.value.on('new',(resp)=>{
                    if(resp.code === 9){
                        (this?.$message || console).success(resp.msg)
                        groupStore.getMemberList()
                    }
                })
            });
            this.$bus.$on('showInfo', this.showInfo)
        }else{
            // 重定向至登录页
            (this?.$message || console).error(resp.msg)
            this.$router.replace("/")
        }
    })
})

onBeforeUnmount(()=>{
    this.$bus.$off('showInfo')
    sessionStorage.removeItem('store')
    socketInstance.value = null
    this.$destroy()
})
onBeforeRouteLeave ((to, from, next)=>{
    if(to.path == '/' && this.$socket) {
        this.$socket.disconnect();
    }
    next()
}) 

</script>

<style lang="less" scoped>
    #mainwrap{
        min-height: 100vh;
        width: 100vw;
        display: flex;
        background: white;
    }
</style>