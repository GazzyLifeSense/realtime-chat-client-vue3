import { defineStore } from "pinia"

export const useUserStore = defineStore('user',{
    state:()=>({
        user: {
            _id: null
        }
    }),
    actions:{
        resetUser() {
            this.user = { _id: null }
        }
    }
})