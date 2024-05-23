import { defineStore } from 'pinia'

export const usePageStore = defineStore('page',{
    state: ()=>({
        page: {
            position: 'main',
            to: null,
        }
    }),
    actions:{
        setPage(value: { position: string, to: any }){
            this.$state.page = value
        },
        resetPage() {
            this.$state.page = {
                position: 'main',
                to: null,
            }
        }
    }
})