import { getPrivateMsgAPI } from '@/api/friend'
import { getGroupMsgAPI } from '@/api/group'
import { defineStore } from 'pinia'
import { useUserStore } from './user'
import { usePageStore } from './page'
import { ResponseType } from '@/types/request'
import { ElMessage } from 'element-plus'
import { useSocketStore } from './socket'

export const useMessageStore = defineStore('message',{
    state:()=>({
        // 新未读消息队列
        newMsgQueue: [] as MessageType[],
        // 当前聊天窗口消息记录
        msgList: [] as MessageType[]
    }),
    actions:{
        // 去除已读消息源
        clearReadMsg(targetId: string, type: 'private' | 'group'){
            this.newMsgQueue = this.newMsgQueue.filter((item: MessageType)=>
                type == 'private' ? 
                    item.from != targetId && item.type == 1 || item.type != 1
                    : item.to != targetId && item.type == 2 || item.type != 2
            )
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
                    if(resp.data.length === 0) return ElMessage.error('已经到顶了')
                        this.msgList.unshift(...(resp.data as []))
                        callback?.()
                    } else ElMessage.error('获取消息失败，请检查网络！')
                })
            }else if(pageStore.page.position == 'group'){
                getGroupMsgAPI(pageStore.page.to._id, 10, time).then((resp: ResponseType)=>{
                // 获取更多历史消息成功
                if(resp.code === 200){
                    if(resp.data.length === 0) return ElMessage.error('已经到顶了')
                        this.msgList.unshift(...(resp.data as []))
                        callback?.()
                    } else ElMessage.error('获取消息失败，请检查网络！')
                })
            }
        },
        recvMsg(){
            const userStore = useUserStore(), 
                pageStore = usePageStore(),
                socketStore = useSocketStore()

            if(socketStore.instance.connected){
                socketStore.instance.on(userStore.user._id,(resp)=>{
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
        getHistoryMsgs(callback?: Function){
            const pageStore = usePageStore(), userStore = useUserStore()
            if(pageStore.page.position == 'private'){
                getPrivateMsgAPI(pageStore.page.to._id, userStore.user._id, 15,  -1).then((resp: ResponseType)=>{
                    if(resp.code === 200){
                        this.msgList = resp.data
                        callback?.()
                    }else ElMessage.error(resp.msg)
                })
            }
            else if(pageStore.page.position == 'group'){
                getGroupMsgAPI(pageStore.page.to._id, 15, -1).then((resp: ResponseType)=>{
                    if(resp.code === 200){
                        this.msgList = resp.data
                        callback?.()
                    }else ElMessage.error(resp.msg)
                })
            }
        }
    }
})