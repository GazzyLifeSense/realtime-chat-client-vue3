import Vue from "vue"

export default {
    namespaced: true,
    actions:{
        setFriendList(context, value){
            context.commit("Set_FriendList",value)
        },
        resetFriendList(context, value){
            context.commit("Set_FriendList",[])
        },
    },
    mutations:{
        Set_FriendList(state, value){ state.friendList = value },
        Set_Friend_hasNew(state, value){
            let friend = {}
            for(let i = 0; i < state.friendList.length; i++){
                if(state.friendList[i]._id == value){
                    Vue.set(state.friendList[i],'hasNew','new')
                    console.log(state.friendList[i])
                    friend = state.friendList[i]
                    state.friendList.splice(i,1)
                    state.friendList.unshift(friend)
                }
            }
        },
        Reset_Friend_hasNew(state, value){
            for(let i = 0; i < state.friendList.length; i++){
                if(state.friendList[i]._id == value){
                    Vue.set(state.friendList[i],'hasNew','')
                }
            }
        }
    },
    state:{
        friendList: [],
    },
    getters:{
        getFriendList(state){ return state.friendList },
    }
}