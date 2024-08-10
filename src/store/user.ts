import { getAppliesCountAPI, getUserAPI } from "@/api/user"
import { ResponseType } from "@/types/request"
import { ElMessage } from "element-plus"
import { defineStore } from "pinia"

export const useUserStore = defineStore('user',{
    state:()=>({
        user: { } as UserType,
        appliesCount: 0
    }),
    actions:{
        async getUser(){
            return getUserAPI().then((resp: ResponseType) => {
                if (resp.code === 200) {
                    this.user = resp.data
                }
                return resp
            })
        },
        // 获取申请信息数量
        getAppliesCount(){
            getAppliesCountAPI(this.user._id).then((resp: ResponseType)=>{
                if(resp.code === 200){
                    this.appliesCount = resp.data
                }else{ ElMessage.error(resp.msg) }
            })
        }
    }
})