import Vue from "vue"

export default {
    namespaced: true,
    actions:{
        setGroupList(context, value){
            context.commit("Set_GroupList",value)
        },
        setMemberList(context, value){
            context.commit("Set_MemberList",value)
        },
        resetGroupList(context, value){
            context.commit("Set_GroupList",[])
        },
        resetMemberList(context, value){
            context.commit("Set_MemberList",[])
        },
    },
    mutations:{
        Set_GroupList(state, value){ state.groupList = value },
        Update_GroupAvatar(state, value){
            for(let i = 0; i < state.groupList.length; i++){
                if(state.groupList[i]._id == value[0]){
                    Vue.set(state.groupList[i],'avatar',value[1])
                }
            }
        },
        Update_GroupBanner(state, value){
            for(let i = 0; i < state.groupList.length; i++){
                if(state.groupList[i]._id == value[0]){
                    Vue.set(state.groupList[i],'banner',value[1])
                }
            }
        },
        Update_Description(state, value){
            for(let i = 0; i < state.groupList.length; i++){
                if(state.groupList[i]._id == value[0]){
                    Vue.set(state.groupList[i],'description',value[1])
                }
            }
        },
        Update_Owner(state, value){
            for(let i = 0; i < state.groupList.length; i++){
                if(state.groupList[i]._id == value[0]){
                    Vue.set(state.groupList[i],'owner',value[1])
                }
            }
        },
        Set_Group_hasNew(state, value){
            let group = {}
            for(let i = 0; i < state.groupList.length; i++){
                if(state.groupList[i]._id == value){
                    Vue.set(state.groupList[i],'hasNew','new')
                    group = state.groupList[i]
                    state.groupList.splice(i,1)
                    state.groupList.unshift(group)
                }
            }
        },
        Reset_Group_hasNew(state, value){
            for(let i = 0; i < state.groupList.length; i++){
                if(state.groupList[i]._id == value){
                    Vue.set(state.groupList[i],'hasNew','')
                }
            }
        },
        Set_MemberList(state, value){ state.memberList = value },
    },
    state:{
        groupList: [],
        memberList: [],
    },
    getters:{
        getGroupList(state){ return state.groupList },
        getMemberList(state){ return state.memberList }
    }
}