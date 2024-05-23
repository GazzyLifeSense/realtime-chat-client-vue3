import { defineStore } from 'pinia'

export const useGroupStore = defineStore('group',{
    state: ():{
        groupList: {_id: string, banner: string, hasNew: string}[], memberList: {}[]
    }=>({
        groupList: [],
        memberList: [],
    }),
    actions:{
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
        Update_Description(value){
            for(let i = 0; i < this.groupList.length; i++){
                if(this.groupList[i]._id == value[0]){
                    this.groupList[i],'description',value[1]
                }
            }
        },
        Update_Owner(value){
            for(let i = 0; i < this.groupList.length; i++){
                if(this.groupList[i]._id == value[0]){
                    this.groupList[i].owner = value[1]
                }
            }
        },
        Set_Group_hasNew(value){
            let group = {}
            for(let i = 0; i < this.groupList.length; i++){
                if(this.groupList[i]._id == value){
                    this.groupList[i].hasNew = 'new'
                    group = this.groupList[i]
                    this.groupList.splice(i,1)
                    this.groupList.unshift(group)
                }
            }
        },
        Reset_Group_hasNew(value){
            for(let i = 0; i < this.groupList.length; i++){
                if(this.groupList[i]._id == value){
                    this.groupList[i].hasNew = ''
                }
            }
        },
    }
})