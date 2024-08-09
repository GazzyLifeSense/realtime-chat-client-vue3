import { defineStore } from 'pinia'
import { useGroupStore } from './group'
import { useMessageStore } from './message'
import { useFriendStore } from './friend'
import { useSocketStore } from './socket'

type PagePositionType = 'main' | 'private' | 'group' | 'discovery'

export const usePageStore = defineStore('page',{
    state: ()=>({
        page: {
            position: 'main' as PagePositionType,
            to: { _id: '' } as any,
        },
        userInfoConfig: {
            show: false,
            id: '',
            isFriend: false
        }
    }),
    actions:{
        // 进入聊天界面
        enterPage({ position = 'main' as PagePositionType, to = { _id: '' } }) {
            const socketStore = useSocketStore()

            switch(position){
                case 'private': {
                    const messageStore = useMessageStore(),
                        friendStore = useFriendStore()
                    // 清空消息列记录
                    messageStore.messageList = []
                    // 取消新消息标志
                    friendStore.setFriendNewStatus(to._id)
                    break
                }
                case 'group': {
                    const messageStore = useMessageStore(),
                        groupStore = useGroupStore()
                    groupStore.currentGroupId = to._id
                    // 清空消息列记录
                    messageStore.messageList = []
                    // 取消新消息标志
                    groupStore.setGroupNewStatus(to._id)
                    socketStore.instance.emit('enterGroupChat', { token: sessionStorage.getItem('securityToken'), groupId: to._id })
                    break
                }
            }
            this.page = { position, to }
        },
        // 
    }
})