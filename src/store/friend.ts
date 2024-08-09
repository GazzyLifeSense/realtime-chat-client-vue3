import { defineStore } from 'pinia'
import { useUserStore } from './user'
import { getFriendListAPI } from '@/api/friend'
import { ResponseType } from '@/types/request'
import { ElMessage } from 'element-plus'

export const useFriendStore = defineStore('friend', {
    state: () => ({
        friendList: [] as {_id: string, hasNew: number}[],
        friendApplyList: []
    }),
    actions:{
        // 刷新好友列表
        getFriendList(){
            const userStore = useUserStore()
            getFriendListAPI(userStore.user._id).then((resp: ResponseType)=>{
                if(resp.code === 200){
                    this.friendList = resp.data
                }else{ ElMessage.error(resp.msg) }
            })
        },
        setFriendNewStatus(targetId: string, value: number = 0){
            for(let i = 0; i < this.friendList.length; i++){
                if(this.friendList[i]._id == targetId){
                    this.friendList[i].hasNew = value
                    console.log(this.friendList[i])
                }
            }
        }
    },
})