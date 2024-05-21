<template>
    <div id="mainwrap" class="full">
        <SideBar />
        <Base />
        <UserInfo :config=userInfoConfig />
    </div>
</template>

<script>
import Vue from 'vue'
import { io } from "socket.io-client"
import SideBar from './SideBar.vue'
import Base from './Base.vue'
import { SocketIP } from '../config'
import UserInfo from '@/components/UserInfo.vue'
export default {
    name: 'MainWrap',
    components: {SideBar, Base, UserInfo},
    data(){
        return{
            userInfoConfig:{
                display:'none', user: null
            }
        }
    },
    computed:{
        user(){
            return this.$store.getters['userAbout/getUser']
        },
        page(){
            return this.$store.getters['pageAbout/getPage']
        },
        friendList(){
            return this.$store.getters['friendAbout/getFriendList']
        },
        memberList(){
            return this.$store.getters['groupAbout/getMemberList']
        },
    },
    watch:{
        page:{
        immediate: true,
        deep: true,
        handler(newV, oldV){
          if(newV.position == 'main' && oldV && oldV.position == 'group'){
            this.$socket.emit('leaveGroupChat', {token: sessionStorage.getItem('securityToken'), groupId: oldV.to._id})
          }
        }
      }
    },  
    methods:{
        showInfo(id, type){
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
    },
    async created(){
        if (sessionStorage.getItem('store')) {
            this.$store.replaceState(Object.assign({}, this.$store.state, JSON.parse(sessionStorage.getItem('store'))))
            sessionStorage.removeItem('store')
        }
        
        // 在页面刷新时将vuex里的信息保存到sessionStorage里
        window.addEventListener('beforeunload', () => {
            sessionStorage.setItem('store', JSON.stringify(this.$store.state))
        })
        // 验证身份
        await this.$axios.post("/api/verifyAndGetUser").then(async(resp)=>{
            if(resp.code === 200){
                this.$store.commit("userAbout/Set_User", resp.data)
                // 连接socket
                Vue.prototype.$socket = await io(SocketIP, {
                    auth:{
                        token: sessionStorage.getItem('securityToken')
                    }
                })
                
                this.$socket.on("connect", () => {
                    this.$notify.success('连接服务器成功',100)
                    if(this.page.to){
                        this.$bus.$emit('recvMsg')
                        this.$bus.$emit('getMsg')
                    }
                    this.$socket.on(this.user._id, (resp) => {
                        if([1,2,3,4,5,6,7,8,10,11,12,999].indexOf(resp.code) != -1){
                            console.log('callback1:',resp, this.page)
                            if(resp.code == 1 && resp.data.from != this.user._id && (this.page.positon == 'main' || ( this.page.position != 'group' && this.page.to?._id != resp.data?.from) || ( this.page.position == 'group' && this.page.to?._id != resp.data?.to))){
                                // 私聊消息提示
                                this.$store.commit('friendAbout/Set_Friend_hasNew', resp.data.from)
                                this.$store.commit('messageAbout/Append_Message', resp.data)
                            }else if(resp.code === 2 && resp.data.from != this.user._id && (this.page.position != 'group' || ( this.page.position == 'group' && this.page.to?._id != resp.data?.to))){
                                // 群组消息提示
                                this.$store.commit('groupAbout/Set_Group_hasNew', resp.data.to)
                            // 新好友申请提示
                            }else if(resp.code === 3){
                                this.$bus.$emit('refreshApplies')
                                this.$message.success(resp.msg)
                            // 好友列表更新
                            }else if(resp.code === 4){
                                this.$bus.$emit('refreshFriendList')
                                this.$message.success(resp.msg)
                            // 群组列表更新
                            }else if(resp.code === 5){
                                this.$bus.$emit('refreshGroupList')
                                this.$message.success(resp.msg)
                            }else if(resp.code === 6){
                                // 对方已不是好友
                                this.$bus.$emit('refreshFriendList')
                                this.$message.error(resp.msg)
                            }else if(resp.code === 7){
                                // 已被移出群组
                                this.$bus.$emit('refreshGroupList')
                                this.$message.error(resp.msg)
                            }else if(resp.code === 12){
                                // 成为群主
                                this.$store.commit('groupAbout/Update_Owner', [resp.data, this.user._id])
                            }else if([0,8,10,11].indexOf(resp.code) != -1){
                                this.$message.error(resp.msg)
                            }else if(resp.code === 999){
                                this.$notify.error(resp.msg)
                                this.$router.replace("/")
                                sessionStorage.clearAll()
                            }
                        }
                    
                    });
                    // 断线重连
                    this.$socket.on("disconnect", () => {
                        this.$socket = null
                        this.$notify.error('已断开连接')
                    });
                    this.$socket.on('new',(resp)=>{
                        if(resp.code === 9){
                            this.$message.success(resp.msg)
                            this.$bus.$emit('refreshMemberList')
                        }
                    })
                });
                this.$bus.$on('showInfo', this.showInfo)
            }else{
                // 重定向至登录页
                this.$message.error(resp.msg)
                this.$router.replace("/")
            }
        })
    },
    destroyed(){
        this.$bus.$off('showInfo')
        sessionStorage.removeItem('store')
        Vue.prototype.$socket = null
        this.$destroy()
    },
    beforeRouteLeave (to, from, next) {
        if(to.path == '/' && this.$socket) {
            this.$socket.disconnect();
        }
        next()
    }
}
</script>

<style lang="less" scoped>
    #mainwrap{
        min-height: 100vh;
        width: 100vw;
        display: flex;
        background: white;
    }
</style>