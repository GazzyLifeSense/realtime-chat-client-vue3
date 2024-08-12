<template>
    <div id="sidebar">
        <ul class="tree">
            <div class="rowItem" :class="{'active':!pageStore.page.to._id}" @click="enterMainPage">
                <div class="barWrap">
                    <span class="bar"></span>
                </div>
                <div class="itemWrap" >
                    <img src="../assets/avatar.png" title="主页" class="icon">
                </div>
            </div>

            <div class="separator"></div>

            <div class="rowItem">
                <div class="itemWrap" @click="IsAddGroupShow = true">
                    <img src="@/assets/add.svg" title="添加" class="icon">
                </div>
            </div>

            <div class="separator"></div>

            <div class="rowItem" @click="enterDiscovery">
                <div class="itemWrap" >
                    <img src="../assets/探索发现.svg" title="探索" class="icon flex-center">
                </div>
            </div>

            <div class="separator"></div>

            <div class="rowItem" @click="IsMessageListShow = true">
                <div class="itemWrap">
                    <img src="../assets/消息1.svg" title="未读消息" class="icon flex-center">
                    <div class="pot" v-if="messageStore.newMsgQueue.length"></div>
                </div>
            </div>

            <div class="separator" v-show="groupStore.groupList.length"></div>

            <div class="group-li mini-scrollbar">
                <div class="rowItem" :class="{'active':pageStore.page.to&&pageStore.page.to._id==group._id}" v-for="group of groupStore.groupList" :key="group._id" @click="enterGroup(group)">
                    <div class="barWrap">
                        <span class="bar"></span>
                    </div>
                    <div class="itemWrap server">
                        <img :src="getGroupAvatar(group.avatar)" :title="group.name" height=48 width=48 class="icon">
                        <div class="newMsg" v-if="group.hasNew">new</div>
                    </div>
                </div>
            </div>
        </ul>

        <!-- 创建群组 -->
        <CreateOrJoinGroup v-model:show="IsAddGroupShow"></CreateOrJoinGroup>

        <!-- 消息列表 -->
        <MessageList v-model:show="IsMessageListShow"></MessageList>
    </div>
</template>

<script lang="ts" setup>
import { ref, watch } from 'vue';
import { getGroupAvatar } from '@/utils/pathResolver'
import MessageList from '@/components/MessageList.vue'
import CreateOrJoinGroup from '@/components/Group/CreateOrJoinGroup.vue';
import { useUserStore } from '@/store/user'
import { usePageStore } from '@/store/page'
import { useMessageStore } from '@/store/message'
import { useGroupStore } from '@/store/group'

const 
    userStore = useUserStore(),
    pageStore = usePageStore(),
    messageStore = useMessageStore(),
    groupStore = useGroupStore()

const
    IsAddGroupShow = ref(false),
    IsMessageListShow = ref(false)

watch(() => userStore.user, () => {
    groupStore.getGroupList()
}, { deep: true })
    

// 返回首页
function enterMainPage(){
    pageStore.enterPage()
}

// 进入群组聊天
function enterGroup(to: GroupType){
    pageStore.enterPage({position:'group',to})
}

// 进入探索页面
function enterDiscovery(){
    pageStore.enterPage({position:'discovery'})
}
</script>

<style lang="less" scoped>
#sidebar{
    background: #212326;
    width: 10vw;
    max-width: 5em;
    flex-shrink: 0;
    .tree{
        display: flex;
        flex-direction: column;
        height: 100%;
        .separator{
            width: 80%;
        }
        .group-li{ overflow-y: auto; overflow-x: hidden; }
        .group-li::-webkit-scrollbar { width: 0; }
        .rowItem{
            margin: .5em 0;
            display: flex;
            .barWrap{
                display: flex;
                overflow: hidden;
                justify-content: flex-start;
                align-items: center;
                .bar{
                    display: block;
                    background: white;
                    height: 0.4em;
                    width: 0.4em;
                    margin-left: -0.2rem;
                    border-radius: 0 0.2rem 0.2rem 0;
                    transition: 0.5s height;
                }
            }
            .server{
                position: relative;
                img{
                    border-radius: 50%;
                }
                .newMsg{
                    background-color: #F74142;
                    padding: 0 4px;
                    bottom: -2px;
                    right: -4px;

                    position: absolute;
                    border-radius: 12px;
                    border: solid 4px #1E1F23;

                    text-align: center;
                    font-weight: bold;
                    color: #FFFFEF;
                    pointer-events: none;
                    transform: scale(.7);
                }
            }
            .itemWrap{
                flex:1;
                display: flex;
                justify-content: center;
                cursor: pointer;
                position: relative;
                .pot{
                    width: 10px;
                    height: 10px;
                    background-color: rgb(248, 63, 63);
                    border-radius: 50%;
                    position: absolute;
                    right: 10px;
                    top: 2px;
                }
                img{
                    transition: 0.5s transform;
                }
                .icon{
                    width: 80%;
                }
            }
        }
        .rowItem:hover{ 
            .bar{
                height: 30%;
            }   
            
        }
        .rowItem[class*="active"]{
            .bar{
                height: 80%;
            }
            .itemWrap{
                img{
                    border-radius: 30%;
                }
            }
        }
    }
}
</style>