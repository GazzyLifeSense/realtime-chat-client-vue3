import Vue from "vue"

export default {
    namespaced: true,
    actions:{
        appendMessageList(context, value){
            context.commit("Append_Message",value)
        },
        // 清除全部消息
        resetMessageList(context){
            context.commit("Set_Message",[])
        }
    },
    mutations:{
        // 追加消息
        Set_Message(state, value){
            state.messageList = value
        },
        // 追加消息
        Append_Message(state, value){
            state.messageList.push(value)
        },
        // 清除该用户的消息
        Reset_Message(state, value){
            state.messageList = state.messageList.filter((item)=>item.from != value)
        },
    },
    state:{
        messageList: [],
    },
    getters:{
        getMessageList(state){ return state.messageList },
    }
}