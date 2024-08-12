<template>
    <div id="member-list-wrap" @mouseleave="isScroller=true?false:false">
        <div class="group-header flex-between-center line" @click.stop="isScroller=!isScroller">
            {{pageStore.page.to.name}}         
            <img src="@/assets/arrowDown.svg" v-if="!isScroller">
            <img src="@/assets/叉.svg" :class="{isScroller:isScroller}" v-if="isScroller">
        </div>
        <div class="group-banner">
            <img :src="getGroupBanner(pageStore.page.to.banner)" alt="服务器图片" height="135">
        </div>
        <div class="title">成员 - {{ groupStore.memberList.length }}</div>
        <div class="member-list mini-scrollbar">
            <div class="list-item" v-for="member in groupStore.memberList" :key="member._id" @click.stop="showMenu($event, pageStore.page.to, member)" @contextmenu.prevent="showMenu($event, pageStore.page.to, member)">
                <div class="avatar">
                    <img :src="getUserAvatar(userStore.user.avatar)" v-if="member._id == userStore.user._id" height='35' width='35' alt="">
                    <img :src="getUserAvatar(member.avatar)" v-if="member._id != userStore.user._id" height='35' width='35' alt="">
                </div>
                <div class="info">
                    <div class="username line">{{ member.nickname }}</div>
                </div>
                <img src="@/assets/arrowDown.svg" height="19" v-if="member._id != userStore.user._id" @click="showMenu($event, pageStore.page.to, member)">
            </div>
        </div>
        <context-menu :config="contextMenuConfig"></context-menu>
        <div class="group-menu" v-show="isScroller">
            <div style="word-break: break-all;">GID: {{pageStore.page.to._id}}</div>

            <div class="separator"></div>

            <div>
                <div class="flex-start">群简介&nbsp;<a v-if="pageStore.page.to.owner === userStore.user._id" @click="updateGroupDescription"><img src="@/assets/修改.svg"></a></div>
                <div class="multiline">{{pageStore.page.to.description || ''}}</div>
            </div>

            <div class="separator"></div>

            <div class="item" @click="groupAvatarRef.click" v-if="pageStore.page.to.owner === userStore.user._id">修改群组头像</div>
            <input type="file" hidden @change="uploadFile($event,1)" ref="groupAvatarRef" accept=".jpg,.jpeg,.png,.webp,.ico,.svg">
            
            <div class="separator" v-if="pageStore.page.to.owner === userStore.user._id"></div>
            
            <div class="item" @click="groupBannerRef.click" v-if="pageStore.page.to.owner === userStore.user._id">修改群组横幅</div>
            <input type="file" hidden @change="uploadFile($event,2)" ref="groupBannerRef" accept=".jpg,.jpeg,.png,.webp,.ico,.svg">
            
            <div class="separator" v-if="pageStore.page.to.owner === userStore.user._id"></div>
            
            <div class="item exit flex-between-center" @click="exitGroup">离开群组<img src="@/assets/退出.svg"></div>

            <div class="separator" v-if="pageStore.page.to.owner === userStore.user._id"></div>

            <div class="item exit flex-between-center" v-if="pageStore.page.to.owner === userStore.user._id" @click="dismissGroup">解散群组<img src="@/assets/解散.svg" height="19"></div>
        </div>
    </div>
</template>

<script lang="ts" setup>
import { reactive, ref, watch } from 'vue';
import ContextMenu from '@/components/ContextMenu.vue'
import { getUserAvatar, getGroupBanner } from '@/utils/pathResolver';
import { useUserStore } from '@/store/user'
import { usePageStore } from '@/store/page'
import { useGroupStore } from '@/store/group'
import { getMemberListAPI, updateGroupDescriptionAPI, exitGroupAPI, dismissGroupAPI, uploadGroupAvatarAPI, uploadGroupBannerAPI } from '@/api/group'
import { ElMessage, ElMessageBox } from 'element-plus';

const userStore = useUserStore(),
    pageStore = usePageStore(),
    groupStore = useGroupStore()

const contextMenuConfig = reactive({
    x: null, y: null, display:'none'
})
const isScroller = ref(false),
    groupAvatarRef = ref(),
    groupBannerRef = ref()

watch(() => pageStore.page, () => { getMemberList() }, { immediate: true })

// 获取成员列表
function getMemberList(){
    getMemberListAPI(pageStore.page.to._id).then((resp)=>{
        if(resp.code === 200) {
            groupStore.memberList = resp.data
        }else{ ElMessage.error(resp.msg) }
    })
}

// 群组菜单
function showMenu($event: MouseEvent, from: any, to: any){
    if(to._id !== userStore.user._id) 
        Object.assign(contextMenuConfig, {x: $event.clientX-5, y: $event.clientY-5, display: 'flex', type: 2, from, to})
}

// 获取用户上传的图像
function uploadFile(e: any, mode: number){
    let file = e.target.files[0]

    if(file.size/1024/1024 > 1){
        return console.info('文件大小超过1MB限制！')
    }

    // 封装formData 
    let formData = new FormData();
    formData.append('groupId', pageStore.page.to._id)
    formData.append('filename', file.name)
    formData.append('fileType', file.type)
    
    // 获取用户上传图片
    var reader = new FileReader()
    reader.readAsDataURL(file)
    reader.onload = function(){
        formData.append('file', this.result as string);
        (mode == 1 ? uploadGroupAvatarAPI : uploadGroupBannerAPI)(formData).then((resp)=>{
            if(resp.code === 200){
                ElMessage.success(resp.msg)
                // TODO 群组刷新
                if(mode == 1)
                    groupStore.updateGroupAvatar([pageStore.page.to._id, resp.data])
                else if(mode == 2){
                    groupStore.updateGroupBanner([pageStore.page.to._id, resp.data])
                }
            }else{ ElMessage.error(resp.msg) }
        })
    }
    
}

// 修改群组简介
function updateGroupDescription(){
    ElMessageBox.prompt('长度<=40',"输入群简介",{
        confirmButtonText: '提交',
        cancelButtonText: '取消',
        inputValidator: (data)=>{
            if(data.length <= 40) return true
            return '长度需小于等于40！'
        },
    }).then(({value})=>{
        updateGroupDescriptionAPI(pageStore.page.to._id, value.trim()).then((resp)=>{
            if(resp.code === 200){
                ElMessage.success(resp.msg)
                groupStore.updateDescription([pageStore.page.to._id,resp.data])
            }else{ ElMessage.error('修改失败！') }
        })
    })
}

// 退出群组
function exitGroup(){
    ElMessageBox.confirm(`是否要退出群组：${pageStore.page.to.name}`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
    }).then(() => {
        exitGroupAPI(pageStore.page.to._id, userStore.user._id).then((resp)=>{
            if(resp.code === 200){
                ElMessage.success(resp.msg)
                groupStore.getGroupList()
                pageStore.enterPage()
            }else{ ElMessage.error(resp.msg) }
        })
    })
}
// 解散群组
function dismissGroup(){
    ElMessageBox.confirm(`是否要解散群组：${pageStore.page.to.name}`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
    }).then(() => {
        dismissGroupAPI(pageStore.page.to._id).then((resp)=>{
            if(resp.code === 200){
                ElMessage.success(resp.msg)
                // 群组刷新
                groupStore.getGroupList()
                pageStore.enterPage()
                    
            }else{ ElMessage.error(resp.msg) }
        })
    })
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
        width: 100%;
        border-radius: 5px;
        position: absolute;
        top: 50px;
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