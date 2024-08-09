import { defineStore } from "pinia"
import { Socket } from "socket.io-client"

export const useSocketStore = defineStore('user',{
    state:()=>({
        instance: {} as Socket
    }),
    actions:{
        
    }
})