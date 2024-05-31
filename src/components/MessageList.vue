<template>
    <section class="message-list-wrap" v-if="config.display != 'none'">
        <div class="mask" @click.self="hide"></div>
        <div id="messageList" class="flex-center" ref='menu'>
            <img class="cancel" src="@/assets/arrowDown.svg" @click.stop="hide">
            <div class="detail-wrap flex-start-center miniscrollbar">
                <template v-if="Array.isArray(messageStore.messageList)">
                    <div class="detail flex-between-center" v-for="message of messageStore.messageList" :key="message._id" @click="enterPrivateChat(getValue(messageStore.messageList, '_id', message.from))">
                        <div class="left line">
                            <div class="nickname">{{ getValue(messageStore.messageList, "_id", message.from, 'nickname') }}</div>
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

const props = defineProps({ config: null })

const pageStore = usePageStore(),
    messageStore = useMessageStore(),
    friendStore = useFriendStore()

function hide(){
    props.config.display='none'
    console.log(messageStore.messageList);
}

// 进入私聊
function enterPrivateChat(to){
    pageStore.enterPage({ type: 1, to })
    props.config.display = 'none'
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
#messageList{
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
        padding: 1.5em;
        background: linear-gradient(to bottom,rgb(163, 34, 163), 70%, rgb(41, 230, 237));
        flex-direction: column;
        overflow-y: auto;
        .detail{
            font-size: 20px;
            border-radius: 15px;
            padding: 7px 12px 7px;
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