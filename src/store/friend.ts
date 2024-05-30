import { defineStore } from 'pinia'
import { useUserStore } from './user'
import { getFriendListAPI } from '@/api/friend'
import { ResponseType } from '@/types/request'

export const useFriendStore = defineStore('friend', {
    state: () => ({
        friendList: [] as {_id: string, hasNew: number}[],
    }),
    actions:{
        // 刷新好友列表
        getFriendList(){
            const userStore = useUserStore()
            getFriendListAPI(userStore.user._id).then((resp: ResponseType)=>{
                if(resp.code === 200){
                    this.friendList = resp.data
                }else{
                    (this?.$message || console).error(resp.msg)
                }
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