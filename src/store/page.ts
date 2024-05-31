import { defineStore } from 'pinia'
import { inject } from 'vue'
import { useGroupStore } from './group'
import { useMessageStore } from './message'
import { useFriendStore } from './friend'

export const usePageStore = defineStore('page',{
    state: ()=>({
        page: {
            position: 'main',
            to: { _id: '' },
        },
        userInfoConfig: {
            show: false,
            id: '',
            isFriend: false
        }
    }),
    actions:{
        // 进入聊天界面
        enterPage({ type = 0, to = { _id: '' } } = { type: 0, to: { _id: '' }}) {
            const PageList = { 0: 'main', 1: 'private', 2: 'group', 3: 'discovery' }
            const socketInstance = inject('socketInstance')

            switch(type){
                case 1: {
                    const messageStore = useMessageStore(),
                        friendStore = useFriendStore()
                    // 清空消息列记录
                    messageStore.messageList = []
                    // 取消新消息标志
                    friendStore.setFriendNewStatus(to._id)
                    break
                }
                case 2: {
                    const messageStore = useMessageStore(),
                        groupStore = useGroupStore()
                    groupStore.currentGroupId = to._id
                    // 清空消息列记录
                    messageStore.messageList = []
                    // 取消新消息标志
                    groupStore.setGroupNewStatus(to._id)
                    socketInstance.value.emit('enterGroupChat', { token: sessionStorage.getItem('securityToken'), groupId: to._id })
                    break
                }
            }
            this.page = { position: PageList[type], to }
        },
        // 
    }
})