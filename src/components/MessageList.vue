<template>
    <section class="message-list-wrap" v-if="show">
        <div class="mask" @click.self="emit('update:show', false)"></div>
        <div class="message-list flex-center" ref='menu'>
            <img class="cancel" src="@/assets/arrowDown.svg" @click.stop="emit('update:show', false)">
            <div class="detail-wrap flex-start-center mini-scrollbar">
                <template v-if="Array.isArray(messageStore.newMsgQueue)">
                    <div class="detail flex-between-center" v-for="message of messageStore.newMsgQueue" :key="message._id" @click="enterChat(message)">
                        <div class="left line">
                            <div class="nickname">{{ chatName(message) }}</div>
                            <div class="text">{{ message.content }}</div>
                        </div>
                        <div class="time">{{ parseTime(message.create_time) }}</div>
                    </div>
                </template> 
                <template>
                    <p style="text-align: center">暂无消息</p>
                </template> 
            </div>
        </div>
    </section>
</template>

<script setup>
import { parseTime, getValue } from '@/utils'
import { usePageStore } from '@/store/page'
import { useMessageStore } from '@/store/message'
import { useFriendStore } from '@/store/friend'
import { useGroupStore } from '@/store/group';

const props = defineProps({ show: null })
const emit = defineEmits(['update:show'])

const pageStore = usePageStore(),
    messageStore = useMessageStore(),
    friendStore = useFriendStore(),
    groupStore = useGroupStore()

const chatName = (message) => {
    switch(message.type){
        case 1:
            return getValue(friendStore.friendList, "_id", message.from, 'nickname')
        case 2:
            return getValue(groupStore.groupList, "_id", message.to, 'name')
    }
}

// 进入聊天
let target
function enterChat(message){
    switch(message.type){
        // 私聊
        case 1:
            target = getValue(friendStore.friendList, '_id', message.from)
            emit('update:show', false)
            pageStore.enterPage({ position: 'private', to: target })
            break;
        // 群聊
        case 2:
            target = getValue(groupStore.groupList, '_id', message.to)
            emit('update:show', false)
            pageStore.enterPage({ position: 'group', to: target })
            break;
    }
}
</script>

<style lang="less" scoped>
.message-list-wrap{
    z-index: 1;
    .mask{
        position: fixed;
        left: 0;
        right: 0;
        top: 0;
        bottom: 0;
    }
}
.message-list{
    background: #232429;
    position: fixed;
    width: 340px;
    border: 6px solid;
    border-image: linear-gradient(#63e984, #5c3cec) 20;
    flex-direction: column;
    justify-content: flex-start;
    align-items: center;
    cursor: default;
    z-index: inherit;
    left: 50%;
    top:50%;
    transform: translateX(-50%) translateY(-50%);
    .cancel{
        position: absolute;
        right: .75em;
        top: .75em;
        cursor: pointer;
        z-index: 1;
    }
    .avatar{
        position: absolute;
        left: 15px;
        top: 15px;
        border: 5px solid #232429;
        border-radius: 60%;
        height: 80px;
        img{
            position: relative;
            overflow: hidden;
            border-radius: 50%;
        }
        .online{
            background-color: #21A65A;
            height: 26px;
            width: 26px;        
            top: 55px;
            right: -5px;
            z-index: 1;
            position: absolute;
            border-radius: 50%;
            border: solid 6px #292A2E;
        }   
    }
    .detail-wrap{
        width: 100%;
        max-height: 80vh;
        padding: 3em 1.5em;
        background: linear-gradient(to bottom,rgb(163, 34, 163), 70%, rgb(41, 230, 237));
        flex-direction: column;
        overflow-y: auto;
        .detail{
            border-radius: 15px;
            padding: 7px 12px 7px;
            margin: 5px 0;
            background: #101316;
            width: 100%;
            font-size: 14px;
            color: white;
            .nickname{
                font-weight: 600;
            }
            .text{
                color: #BDBEC6;
            }
            .time{
                margin-left: 5px;
            }
            &:hover{
                background: #55585673;
                cursor: pointer;
            }
        }
    }
}
</style>