export default {
    namespaced: true,
    actions:{
        setPage(context, value){
            context.commit("Set_Page",value)
        },
        resetPage({ commit }) {
            commit("Set_Page", {
                position: 'main',
                to: null,
            });
        }
    },
    mutations:{
        Set_Page(state, value){ state.page = value },
    },
    state:{
        page: {
            position: 'main',
            to: null,
        }
    },
    getters:{
        getPage(state){ return state.page },
        getTo(state) { return state.page.to }
    }
}