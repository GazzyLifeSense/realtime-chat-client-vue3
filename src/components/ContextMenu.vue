<template>
    <div id="menu" class="flex-center" ref='menu' @mouseleave="config.display='none'" :style="{top: config.y+'px', left: config.x-70+'px', display: config.display}">
        <button class="delete flex-center" v-if="config.to?._id!==user._id" @click="showInfo(config.to._id)">查看资料</button>
        <button class="delete flex-center" v-if="config.type===1" @click="deleteFriend">删除好友</button>
        <button class="delete flex-center" v-if="config.type===2" @click="applyFriend">添加好友</button>
        <button class="delete flex-center" v-if="config.type===2&&config.from.owner===user._id" @click="transferGroup">转让群组</button>
        <button class="delete flex-center" v-if="config.type===2&&config.from.owner===user._id" @click="removeMember">移除成员</button>
    </div>
</template>

<script>
export default {
    name: 'contextMenu',
    props: ['config'],
    computed:{
        user(){
            return this.$store.getters['userAbout/getUser']
        },
        memberList(){
            return this.$store.getters['groupAbout/getMemberList']
        },
    },
    methods:{
        // 删除好友
        deleteFriend(){
            this.$confirm(`是否要删除好友-->昵称：${this.config.to.nickname}  用户名：${this.config.to.username}`, '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                this.$axios.post('/api/deleteFriend', {userId: this.user._id, to: this.config.to._id}).then((resp)=>{
                    if(resp.code === 200) {
                        this.$message.success(resp.msg)
                        this.$bus.$emit('refreshFriendList')
                    }
                    else{
                        this.$message.error(resp.msg)
                    }
                })
            })
        },
        // 申请好友
        applyFriend(){
            this.$axios.post('/api/applyFriend', {userId: this.user._id, username: this.config.to.username}).then((resp)=>{
                if(resp.code === 200) {
                    this.$message.success(resp.msg)
                }else{
                    this.$message.error(resp.msg)
                }
            })
        },
        // 移除成员
        removeMember(){
            this.$confirm(`是否要移除成员：${this.config.to.nickname}`, '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                this.$axios.post('/api/removeMember', {groupId: this.config.from._id, to: this.config.to._id}).then((resp)=>{
                    if(resp.code === 200) {
                        this.$message.success(resp.msg)
                        this.$bus.$emit('refreshMemberList')
                    }
                    else{
                        this.$message.error(resp.msg)
                    }
                })
            })
        },
        // 转让群组
        transferGroup(){
            this.$confirm(`是否要将群组转让给成员：${this.config.to.nickname}`, '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                this.$axios.post('/api/transferGroup', {groupId: this.config.from._id, to: this.config.to._id}).then((resp)=>{
                    if(resp.code === 200) {
                        this.$message.success(resp.msg)
                        this.$store.commit('groupAbout/Update_Owner',[this.config.from._id, this.config.to._id])
                        this.$bus.$emit('enterPage', {})
                    }
                    else{
                        this.$message.error(resp.msg)
                    }
                })
            })
        },
        showInfo(id){
            this.$bus.$emit('showInfo',id, this.config.type)
            this.config.display = 'none'
        }
    }
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