<template>
    <div id="sidebar">
        <ul class="tree">
            <div class="rowItem" :class="{'active':pageStore.page.to==null}" @click="enterMainPage">
                <div class="barWrap">
                    <span class="bar"></span>
                </div>
                <div class="itemWrap" >
                    <img src="../assets/avatar.png" title="主页" class="icon">
                </div>
            </div>

            <div class="separator"></div>
            
            <div class="groupList miniscrollbar">
                <div class="rowItem" :class="{'active':page.to&&page.to._id==group._id}" v-for="group in groupStore.groupList" :key="group._id" @click="enterGroup(group)">
                    <div class="barWrap">
                        <span class="bar"></span>
                    </div>
                    <div class="itemWrap server">
                        <img :src="getGroupAvatar(group.avatar)" :title="group.name" height=48 width=48 class="icon">
                        <div class="newMsg" v-if="group.hasNew">{{group.hasNew}}</div>
                    </div>
                </div>
            </div>
            

            <div class="rowItem">
                <div class="itemWrap" @click="show='flex'">
                   <img src="../assets/add.svg" title="添加" class="icon">
                </div>
            </div>

            <div class="separator"></div>

            <div class="rowItem" @click="enterDiscovery">
                <div class="itemWrap" >
                    <img src="../assets/探索发现.svg" title="探索" class="icon flex-center">
                </div>
            </div>

            <div class="separator"></div>

            <div class="rowItem" @click="showNewMsgList">
                <div class="itemWrap" >
                    <img src="../assets/消息1.svg" title="未读消息" class="icon flex-center">
                    <div class="pot" v-if="messageStore.messageList.length"></div>
                </div>
            </div>

            <div class="separator"></div>

            <div class="rowItem" @click="fold">
                <div class="itemWrap" >
                    <img src="../assets/折叠.svg" title="折叠" class="icon flex-center fold" :class="{isFold}">
                </div>
            </div>
        </ul>

        <div class="backdrop flex-center" :style={display:show} @click.self="show='none'">
            <div class="Group-layer">
                <div class="header flex-center">
                    <h1>创建服务器</h1>
                    <div>服务器是您和好友聚首的地方。创建您自己的服务器，开始畅聊吧。</div>
                </div>
                
                <div class="info flex-center">
                    <div class="type-wrap">
                        <button class="type" @click="switchType('game')" :class="{selected:type=='game'}">
                            <img src="../assets/game.svg" height="48" width="48">
                            <div class="desc">游戏</div>
                        </button>
                        <button class="type" @click="switchType('hobby')" :class="{selected:type=='hobby'}"> 
                            <img src="../assets/hobby.svg" height="48" width="48">
                            <div class="desc">兴趣</div>
                        </button>
                        <button class="type" @click="switchType('study')" :class="{selected:type=='study'}">
                            <img src="../assets/study.svg" height="48" width="48">
                            <div class="desc">学习</div>
                        </button>
                    </div>
                    <div class="input-wrap">
                        <input type="text" v-model="groupName" maxlength="15" placeholder="请输入服务器名称">
                        <button style="border-radius: 0 8px 8px 0;" @click="createGroup">创建</button>
                    </div>
                </div>
                <div class="footer flex-center">
                    <div class="row">
                        <h2>已经有了邀请？</h2>
                        <input type="text" v-model="groupId" placeholder="请输入服务器GID(12位)">
                    </div>
                    
                    <button class="addGroup" @click="addGroup">加入服务器</button>
                </div>
            </div>
        </div>    

        <message-list :config="messageListConfig"></message-list>
    </div>
</template>

<script setup>
import { reactive, ref, watch } from 'vue';
import { getGroupAvatar } from '@/utils/pathResolver'
import MessageList from '@/components/MessageList.vue'
import { useUserStore } from '@/store/user'
import { usePageStore } from '@/store/page'
import { useMessageStore } from '@/store/message'
import { useFriendStore } from '@/store/friend'
import { useGroupStore } from '@/store/group'
import { applyGroupAPI, createGroupAPI } from '@/api/group';

const userStore = useUserStore(),
    pageStore = usePageStore(),
    messageStore = useMessageStore(),
    friendStore = useFriendStore(),
    groupStore = useGroupStore()

const show = ref('none'),
    type = ref(''),
    groupName = ref(''),
    groupId = ref(''),
    isFold = ref(false),
    messageListConfig = reactive({ display: 'none' })

watch(() => userStore.user, () => {
    groupStore.getGroupList()
}, { deep: true })
    

// 返回首页
function enterMainPage(){
    pageStore.enterPage()
}
// 创建群组
function createGroup(){
    if(this.type === '') {
        console.info('请选择服务器类型！')
        return
    }else if(this.groupName === ''){
        console.info('请输入服务器名称！')
        return
    }
    createGroupAPI(groupName.value, userStore.user._id, type.value).then((resp)=>{
        if(resp.code === 200){
            (this?.$message || console).log(resp.msg)
            groupStore.getGroupList()
            show.value = 'none'
        }else{
            (this?.$message || console).error(resp.msg)
        }
    })
}
// 切换群组种类
function switchType(targetType){
    type.value = targetType
}
// 进入群组聊天
function enterGroup(to){
    pageStore.enterPage({type:2,to})
}
// 申请加入群组
function addGroup(){
    applyGroupAPI(userStore.user._id, groupId.value).then((resp)=>{
        if(resp.code === 200)
            (this?.$message || console).log(resp.msg)
        else{
            (this?.$message || console).error(resp.msg)
        }
    })
}
// 进入探索页面
function enterDiscovery(){
    pageStore.enterPage({type:3})
}

function showNewMsgList(){
    messageListConfig.display='flex'
}

function fold(){
    isFold.value = !isFold.value
}
    
</script>

<style lang="less" scoped>
#sidebar{
    background: #212326;
    width: 10vw;
    max-width: 5em;
    flex-shrink: 0;
    .tree{
        overflow-y: auto;
        .separator{
            width: 80%;
        }
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
                    height: auto;
                    width: auto;
                    padding: 0 4px;
                    bottom: -3px;
                    right: 0px;

                    position: absolute;
                    border-radius: 12px;
                    border: solid 4px #1E1F23;

                    text-align: center;
                    font-size: .75em;
                    font-weight: bold;
                    color: #FFFFEF;
                    pointer-events: none;
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
                    &:hover{
                        transform: scale(1.2)
                    }
                }
                .icon{
                    width: 80%;
                }
                .fold{
                    width: 70%;
                    transition: 1.5s transform !important;
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
    .backdrop{
        width: 100vw;
        height: 100vh;
        position: fixed;
        left: 0;
        top: 0;
        z-index: 2;
        background: rgba(0, 0, 0, 0.85);
        .Group-layer{
            max-height: 90vh;
            background: white;
            border-radius: .5em;
            display: flex;
            justify-content: flex-end;
            align-items: center;
            flex-direction: column;
            color: black;
            .header,.info,.footer{
                flex-direction: column;
            }
            .header{
                padding: 24px 16px 0;
                text-align: center;
            }
            .info{
                width: 100%;
                padding: 20px;
                .type-wrap{
                    width: 100%;
                    display: flex;
                    justify-content: space-evenly;
                    .type{
                        color: black;
                        background: white;
                        border: 1px solid #DEDFDE;
                        .desc{
                            font-weight: 600;
                        }   
                    }
                    .type:hover{
                        background: #E7EAEC;
                    }
                }
                .input-wrap{
                    display: flex;
                    width: 100%;
                    border-radius: 8px 0 0 8px;
                    margin-top: 20px;
                    overflow: hidden;
                    input{
                        padding: 10px;
                        flex:1;
                        border: 0;
                        outline: 0;
                    } 
                }
                .input-wrap:focus-within{
                    border: 1px solid rgb(0, 217, 255);
                }
            }
            .footer{
                width: 100%;
                padding: 0 16px 24px;
                background: #F2F3F4;
                border-radius: 5px;
                .row{
                    display:flex;
                    align-items: center;
                    input{
                        border: 0;
                        border-radius: 5px;
                        outline: 0;
                        height: 30px;
                        padding: 5px;
                    }
                }
                .addGroup{
                    color: white;
                    background: #6B7481;
                    width: 100%;
                }
            }
            
        }
    }
    .selected{
        border: 2px solid black !important;
    }

    .isFold{
        transform: rotateY(180deg);
    }
}
</style>