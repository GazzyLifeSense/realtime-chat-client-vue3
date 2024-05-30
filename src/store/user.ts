import { getAppliesCountAPI } from "@/api/user"
import { ResponseType } from "@/types/request"
import { defineStore } from "pinia"

export const useUserStore = defineStore('user',{
    state:()=>({
        user: {
            _id: ''
        } as { _id: string },
        appliesCount: 0
    }),
    actions:{
        resetUser() {
            this.user = { _id: '' }
        },
        // 获取申请信息数量
        getAppliesCount(){
            getAppliesCountAPI(this.user._id).then((resp: ResponseType)=>{
                if(resp.code === 200){
                    this.appliesCount = resp.data
                }else{
                    (this?.$message || console).error(resp.msg)
                }
            })
        }
    }
})