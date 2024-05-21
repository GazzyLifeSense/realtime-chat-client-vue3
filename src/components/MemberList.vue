<template>
    <div id="member-list-wrap" @mouseleave="isScroller=true?false:false">
        <div class="group-header flex-between-center line" @click.stop="isScroller=!isScroller">
            {{page.to.name}}         
            <img src="@/assets/arrowDown.svg" v-if="!isScroller">
            <img src="@/assets/叉.svg" :class="{isScroller:isScroller}" v-if="isScroller">
        </div>
        <div class="group-banner">
            <img :src="getGroupBanner(page.to.banner)" alt="服务器图片" height="135">
        </div>
        <div class="title">成员 - {{ memberList.length }}</div>
        <div class="member-list miniscrollbar">
            <div class="list-item" v-for="member in memberList" :key="member._id" @click.stop="showMenu(page.to, member)" @contextmenu.prevent="showMenu(page.to, member)">
                <div class="avatar">
                    <img :src="getUserAvatar(user.avatar)" v-if="member._id == user._id" height='35' width='35' alt="">
                    <img :src="getUserAvatar(member.avatar)" v-if="member._id != user._id" height='35' width='35' alt="">
                </div>
                <div class="info">
                    <div class="username line">{{ member.nickname }}</div>
                </div>
                <img src="@/assets/arrowDown.svg" height="19" v-if="member._id != user._id" @click="showMenu(page.to, member)">
            </div>
        </div>
        <context-menu :config="contextMenuConfig"></context-menu>
        <div class="group-menu fadeIn" v-show="isScroller">
            <div>GID: {{page.to._id}}</div>

            <div class="separator"></div>

            <div>
                <div class="flex-start">群简介&nbsp;<a v-if="page.to.owner === user._id" @click="updateGroupDescription"><img src="@/assets/修改.svg"></a></div>
                <div class="multiline">{{page.to.description==''?'无':page.to.description}}</div>
            </div>

            <div class="separator"></div>

            <div class="item" @click="uploadGroupAvatar" v-if="page.to.owner === user._id">修改群组头像</div>
            <input type="file" class="upload-hide" @change="getFile($event,1)" ref="groupAvatar" accept=".jpg,.jpeg,.png,.webp,.ico,.svg">
            
            <div class="separator" v-if="page.to.owner === user._id"></div>
            
            <div class="item" @click="uploadGroupBanner" v-if="page.to.owner === user._id">修改群组横幅</div>
            <input type="file" class="upload-hide" @change="getFile($event,2)" ref="groupBanner" accept=".jpg,.jpeg,.png,.webp,.ico,.svg">
            
            <div class="separator" v-if="page.to.owner === user._id"></div>
            
            <div class="item exit flex-between-center" @click="exitGroup">离开群组<img src="@/assets/退出.svg"></div>

            <div class="separator" v-if="page.to.owner === user._id"></div>

            <div class="item exit flex-between-center" v-if="page.to.owner === user._id" @click="dismissGroup">解散群组<img src="@/assets/解散.svg" height="19"></div>
        </div>
    </div>
</template>

<script>
import ContextMenu from './ContextMenu.vue'
import mixin  from '@/mixin/imgMixin.js'
export default {
    components: {ContextMenu},
    mixins: [mixin],
    data(){
        return{
            memberList: [],
            contextMenuConfig:{
                x: null, y: null, display:'none'
            },
            isScroller: false,
        }
    },
    computed:{
        user(){
            return this.$store.getters['userAbout/getUser']
        },
        page(){
            return this.$store.getters['pageAbout/getPage']
        }
    },
    methods:{
        // 获取成员列表
        getMemberList(){
            // 此处为同步代码，防止事件重复触发
            this.$bus.$off('refreshMemberList')
            this.$axios.post('/api/getMembers', {groupId: this.page.to._id}).then((resp)=>{
                if(resp.code === 200) {
                    this.memberList = resp.data
                    this.$store.commit("groupAbout/Set_MemberList", resp.data)
                }else{
                    this.$message.error(resp.msg)
                }
                // 异步完成后再次监听事件
               this.$bus.$on('refreshMemberList', this.getMemberList)
            })
        },
        showMenu(from, to){
            if(to._id !== this.user._id) 
                this.contextMenuConfig = {x: event.clientX-5, y: event.clientY-5, display: 'flex', type: 2, from, to}
        },
        // 获取用户上传的图像
        getFile(e,mode){
            let api = {1: '/api/uploadGroupAvatar', 2: '/api/uploadGroupBanner'}
            let file = e.target.files[0]

            if(file.size/1024/1024 > 1){
                return this.$message.warning('文件大小超过5MB限制！')
            }

            // 封装formData 
            let formData = new FormData();
            formData.append('groupId', this.page.to._id)
            formData.append('filename', file.name)
            formData.append('fileType', file.type)
            // 获取用户上传图片
            var reader = new FileReader()
            reader.readAsDataURL(file)
            var that = this
            reader.onload = function(e){
                formData.append('file', this.result)
                that.$axios.post(api[mode], formData,{ headers:{ 'Content-Type': 'multipart/formdata'}}).then((resp)=>{
                    if(resp.code === 200){
                        that.$message.success(resp.msg)
                        // TODO 群组刷新
                        if(mode == 1)
                            that.$store.commit('groupAbout/Update_GroupAvatar', [that.page.to._id, resp.data])
                        else if(mode == 2){
                            that.$store.commit('groupAbout/Update_GroupBanner', [that.page.to._id, resp.data])
                        }
                    }else{
                        that.$message.error(resp.msg)
                    }
                })
            }
           
        },
        // 修改群组简介
        updateGroupDescription(){
            this.$prompt('长度<=40',"输入群简介",{
                confirmButtonText: '提交',
                cancelButtonText: '取消',
                inputValidator: (data)=>{
                    if(data.length <= 40) return true
                    return false
                },
                inputErrorMessage: '格式不正确'
            }).then(({value})=>{
                let description = value.trim()
                if(description.length == 0 || description.length > 40){
                    return this.$message.warning('超出长度(40)!'); 
                }
                this.$axios.post('/api/updateGroupDescription', {groupId: this.page.to._id, description: value}).then((resp)=>{
                    if(resp.code === 200){
                        this.$message.success(resp.msg)
                        this.$store.commit('groupAbout/Update_Description', [this.page.to._id,resp.data])
                    }else{
                        this.$message.error('修改失败！')
                    }
                })
            }).catch(()=>{
                this.$message.info('取消操作');   
            })
        },
        // 上传群组头像
        uploadGroupAvatar(){
            this.$refs.groupAvatar.click()
        },
        // 上传群组横幅
        uploadGroupBanner(){
            this.$refs.groupBanner.click()
        },
        // 退出群组
        exitGroup(){
            this.$confirm(`是否要退出群组：${this.page.to.name}`, '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                this.$axios.post('/api/exitGroup', {groupId:this.page.to._id, userId:this.user._id}).then((resp)=>{
                    if(resp.code === 200){
                        this.$message.success(resp.msg)
                        // TODO 群组刷新
                        this.$bus.$emit('refreshGroupList')
                        this.$bus.$emit('enterPage',{})
                    }else{
                        this.$message.error(resp.msg)
                    }
                })
            })
        },
        // 解散群组
        dismissGroup(){
            this.$confirm(`是否要解散群组：${this.page.to.name}`, '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                this.$axios.post('/api/dismissGroup', {groupId:this.page.to._id}).then((resp)=>{
                    if(resp.code === 200){
                        this.$message.success(resp.msg)
                        // 群组刷新
                        this.$bus.$emit('refreshGroupList')
                        this.$bus.$emit('enterPage',{})
                            
                    }else{
                        this.$message.error(resp.msg)
                    }
                })
            })
        }
    },
    watch:{
        page:{
            immediate: true,
            deep: true,
            handler(newV, oldV){
                this.getMemberList()
            }
        }
    },
    created(){
        this.$bus.$on('refreshMemberList', this.getMemberList)
    },
    destroyed(){
        this.$bus.$off('refreshMemberList')
    }
}
</script>
<style lang="less" scoped>
#member-list-wrap{
    width: 100%;
    color: white;
    position: relative;
    height: calc(100% - 47px);
    .group-header{
        padding-bottom: 12px;
        font-weight: 600;
        position: absolute;
        top: 16px;
        left: 12px;
        width: calc(100% - 24px);
        cursor: pointer;
        .isScroller{
            transition: transform 0.2s;
            transform-origin: center;
            transform: rotate(360deg);
        }
    }
    .group-banner{
        height: 135px;
        img{
            width:100%;
        }
    }
    .title{
            font-weight: 600;
            padding-bottom: 10px;
            white-space: nowrap;
            padding: 10px 16px 0 16px;
        }
    .member-list{
        display: flex;
        flex-direction: column;
        padding: 10px 16px;
        overflow-x: hidden;
        overflow-y: scroll;
        max-height: calc(100% - 135px - 34px);
        .list-item{
            display: flex;
            justify-content: flex-start;
            align-items: center;
            margin: 5px 0;
            height: 40px;
            width: 100%;
            cursor: pointer;
            .avatar{
                height: 35px;
                width: 35px;
                flex-shrink: 0;
                overflow: hidden;
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
    .group-menu{
        background: #101316;
        padding: 6px 8px;
        width: 226px;
        border-radius: 5px;
        position: absolute;
        top: 50px;
        left: 12px;
        font-size: 14px;
        >*:not([class='separator']){
            padding: 6px 8px;
            margin: 2px 0;
        }
        .item{
            cursor: pointer;
            padding: 6px 8px;
            margin: 2px 0;
            border-radius: 2px;
            font-size: 14px;
        }
        .item:hover{
            background: #4753C3;
        }
        .exit{
            color: #EF3C42;
        }
        .exit:hover{
            color: white;
            background: #DB373C;
        }
    }
}
</style>