import { getAppliesCountAPI, getUserAPI } from "@/api/user"
import { ElMessage } from "element-plus"
import { defineStore } from "pinia"

export const useUserStore = defineStore('user',{
    state:()=>({
        user: { } as UserType,
        appliesCount: 0
    }),
    actions:{
        async getUser(){
            return getUserAPI().then((resp) => {
                if (resp.code === 200) {
                    this.user = resp.data
                }else{ ElMessage.error(resp.msg) }
                return resp
            })
        },
        // 获取申请信息数量
        getAppliesCount(){
            getAppliesCountAPI(this.user._id).then((resp)=>{
                if(resp.code === 200){
                    this.appliesCount = resp.data
                }else{ ElMessage.error(resp.msg) }
            })
        }
    }
})