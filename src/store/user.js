import Vue from "vue";

export default {
    namespaced: true,
    actions:{
        setUser(context, value){
            context.commit("Set_User",value)
        },
        setNickname(context, value){
            context.commit("Set_Nickname",value)
        },
        setAvatar(context, value){
            context.commit("Set_Avatar",value)
        },
        resetUser({ commit }) {
            commit("Set_User", {
                _id: null
            });
        }
    },
    mutations:{
        Set_User(state, value){ state.user = value },
        Set_Nickname(state, value){ state.user.nickname = value},
        Set_Introduction(state, value){ state.user.introduction = value},
        Set_Avatar(state, value){ Vue.set(state.user,'avatar',value) }
    },
    state:{
        user: {
            _id: null
        }
    },
    getters:{
        getUserId(state){ return state.user._id },
        getNickname(state){ return state.nickname },
        getAvatar(state){ return state.user.avatar },
        getUser(state){ return state.user },
    }
}