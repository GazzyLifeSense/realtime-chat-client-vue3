import { defineStore } from 'pinia'

export const useMessageStore = defineStore('message',{
    state:()=>({
        messageList: [],
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
    }
})