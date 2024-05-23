import { defineStore } from 'pinia'
export const useFriendStore = defineStore('friend', {
    state: () => ({
        friendList: [],
    }),
    actions:{
        setFriendHasNew(value){
            let friend = {}
            for(let i = 0; i < this.friendList.length; i++){
                if(this.friendList[i]._id == value){
                    this.friendList[i].hasNew = 'new'
                    console.log(this.friendList[i])
                    friend = this.friendList[i]
                    this.friendList.splice(i,1)
                    this.friendList.unshift(friend)
                }
            }
        },
        resetFriendHasNew(value){
            for(let i = 0; i < this.friendList.length; i++){
                if(this.friendList[i]._id == value){
                   this.friendList[i].hasNew = ''
                }
            }
        }
    },
})