import { defineStore } from 'pinia'
import { useUserStore } from './user'
import { getGroupListAPI, getMemberListAPI } from '@/api/group'
import { ResponseType } from '@/types/request'

export const useGroupStore = defineStore('group',{
    state: ()=>({
        currentGroupId: '',
        groupList: [] as {_id: string, banner: string, hasNew: number}[],
        memberList: [] as any[],
    }),
    actions:{
        // 获取群组列表
        getGroupList(){
            const userStore = useUserStore()
            getGroupListAPI(userStore.user._id).then((resp: ResponseType)=>{
                if(resp.code === 200){
                    this.groupList = resp.data
                }else{
                    (this?.$message || console).error(resp.msg)
                }
            })
        },
        // 获取成员列表
        getMemberList(){
            getMemberListAPI(this.currentGroupId).then((resp: ResponseType)=>{
                if(resp.code === 200) {
                    this.memberList = resp.data
                }else{
                    (this?.$message || console).error(resp.msg)
                }
            })
        },
        updateGroupAvatar(value){
            for(let i = 0; i < this.groupList.length; i++){
                if(this.groupList[i]._id == value[0]){
                    this.groupList[i],'avatar',value[1]
                }
            }
        },
        updateGroupBanner(value){
            for(let i = 0; i < this.groupList.length; i++){
                if(this.groupList[i]._id == value[0]){
                    this.groupList[i].banner = value[1]
                }
            }
        },
        updateDescription(value){
            for(let i = 0; i < this.groupList.length; i++){
                if(this.groupList[i]._id == value[0]){
                    this.groupList[i],'description',value[1]
                }
            }
        },
        updateOwner(value){
            for(let i = 0; i < this.groupList.length; i++){
                if(this.groupList[i]._id == value[0]){
                    this.groupList[i].owner = value[1]
                }
            }
        },
        setGroupNewStatus(targetId: string, value: number = 0){
            for(let i = 0; i < this.groupList.length; i++){
                if(this.groupList[i]._id == targetId){
                    this.groupList[i].hasNew = value
                }
            }
        },
    }
})