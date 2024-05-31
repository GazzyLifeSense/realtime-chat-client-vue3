import { getPrivateMsgAPI } from '@/api/friend'
import { getGroupMsgAPI } from '@/api/group'
import { defineStore } from 'pinia'
import { useUserStore } from './user'
import { usePageStore } from './page'
import { ResponseType } from '@/types/request'
import { inject } from 'vue'

export const useMessageStore = defineStore('message',{
    state:()=>({
        messageList: [],
        msgList: []
    }),
    actions:{
        // 追加消息
        appendMessage(value){
            this.messageList.push(value)
        },
        // 清除该用户的消息
        resetMessage(value){
            this.messageList = this.messageList.filter((item)=>item.from != value)
        },
        // 加载更多消息
        loadMoreMsgs(callback: Function){
            let time
            if(Array.isArray(this.msgList) && this.msgList.length){
                time = this.msgList[0].create_time 
            }else{
                time = -1
            }

            const userStore = useUserStore(), pageStore = usePageStore()
            if(pageStore.page.position == 'private'){
                getPrivateMsgAPI(pageStore.page.to._id, userStore.user._id, 10, time).then((resp: ResponseType)=>{
                // 获取更多历史消息成功
                if(resp.code === 200){
                    if(resp.data.length === 0) return (this?.$message || console).error('已经到顶了')
                        this.msgList.unshift(...(resp.data as []))
                        callback?.()
                    } else (this?.$message || console).error('获取消息失败，请检查网络！')
                })
            }else if(pageStore.page.position == 'group'){
                getGroupMsgAPI(pageStore.page.to._id, 10, time).then((resp: ResponseType)=>{
                // 获取更多历史消息成功
                if(resp.code === 200){
                    if(resp.data.length === 0) return (this?.$message || console).error('已经到顶了')
                        this.msgList.unshift(...(resp.data as []))
                        callback?.()
                    } else (this?.$message || console).error('获取消息失败，请检查网络！')
                })
            }
        },
        recvMsg(){
            const socketInstance = inject('socketInstance'), userStore = useUserStore(), pageStore = usePageStore()
            if(socketInstance.value?.connected){
                socketInstance.value?.on(userStore.user._id,(resp)=>{
                console.log('callback2', pageStore.page.to)
                if([1,2].indexOf(resp.code) != -1){
                    let res_chat_id
                    let chat_id 

                    if(resp.code === 1){
                        res_chat_id = [resp.data.from, resp.data.to].sort().join('_')
                        chat_id = [userStore.user?._id, pageStore.page.to._id].sort().join('_')
                    }
                    
                    if((resp.code === 1 && res_chat_id === chat_id) || (resp.code === 2 && resp.data.to === pageStore.page.to._id)){
                        this.msgList.push(resp.data)
                        console.log(this.msgList)
                    }
                }
                })
            }
        },
        // 获取历史消息
        getHistoryMsgs(callback: Function){
            const pageStore = usePageStore(), userStore = useUserStore()
            if(pageStore.page.position == 'private'){
                getPrivateMsgAPI(pageStore.page.to._id, userStore.user._id, 15,  -1).then((resp: ResponseType)=>{
                // 获取历史消息成功
                if(resp.code === 200){
                    this.msgList = resp.data
                    callback?.()
                }else (this?.$message || console).error(resp.msg)
                })
            }
            else if(pageStore.page.position == 'group'){
                getGroupMsgAPI(pageStore.page.to._id, 15, -1).then((resp: ResponseType)=>{
                    // 获取历史消息成功
                    if(resp.code === 200){
                        this.msgList = resp.data
                        callback?.()
                    }else (this?.$message || console).error(resp.msg)
                })
            }
        }
    }
})