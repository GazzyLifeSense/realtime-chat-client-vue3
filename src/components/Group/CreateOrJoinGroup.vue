<script lang="ts" setup>
import { ref } from 'vue';
import { applyGroupAPI, createGroupAPI } from '@/api/group'
import { ElMessage } from 'element-plus'
import { useUserStore } from '@/store/user';
import { useGroupStore } from '@/store/group';

defineProps({ show: null })
const emit = defineEmits(['update:show'])

const groupTypes: { [key: string]: {[label: string]: string} } = {'game': { label: '游戏'}, 'hobby': { label: '兴趣'}, 'study': { label: '学习'}}
const 
    groupType = ref(''),
    groupName = ref(''),
    groupId = ref('')

const
    userStore = useUserStore(),
    groupStore = useGroupStore()

// 创建群组
function createGroup(){
    if(groupType.value === '') {
        console.info('请选择服务器类型！')
        return
    }else if(groupName.value === ''){
        console.info('请输入服务器名称！')
        return
    }
    createGroupAPI(groupName.value, userStore.user._id, groupType.value).then((resp)=>{
        if(resp.code === 200){
            ElMessage.success(resp.msg)
            groupStore.getGroupList()
            emit('update:show', false)
        }else{
            ElMessage.error(resp.msg)
        }
    })
}

// 切换群组种类
function switchType(targetType: string){
    groupType.value = targetType
}



// 申请加入群组
function addGroup(){
    applyGroupAPI(userStore.user._id, groupId.value).then((resp)=>{
        if(resp.code === 200)
            ElMessage.success(resp.msg)
        else{
            ElMessage.error(resp.msg)
        }
    })
}
</script>

<template>
    <div class="backdrop flex-center" v-show="show" @click.self="emit('update:show', false)">
        <div class="Group-layer">
            <div class="header flex-center">
                <h1>创建群组</h1>
                <div>群组是您和好友聚首的地方。创建您自己的群组，开始畅聊吧。</div>
            </div>
            
            <div class="info flex-center">
                <div class="type-wrap">
                    <button v-for="type of Object.keys(groupTypes)" :key="type" class="type" @click="switchType(type)" :class="{selected:groupType == type}">
                        <img :src="`/src/assets/${type}.svg`" height="48" width="48">
                        <div class="desc">{{ groupTypes[type].label }}</div>
                    </button>
                </div>
                <div class="input-wrap">
                    <input type="text" v-model="groupName" maxlength="15" placeholder="请输入群组名称">
                    <button style="border-radius: 0 8px 8px 0;" @click="createGroup">创建</button>
                </div>
            </div>
            <div class="footer flex-center">
                <div class="row">
                    <h2>已经有了邀请？</h2>
                    <input type="text" v-model="groupId" placeholder="请输入群组GID(12位)">
                </div>
                
                <button class="addGroup" @click="addGroup">加入群组</button>
            </div>
        </div>
    </div>    
</template>

<style lang="less" scoped>
.backdrop{
    width: 100vw;
    height: 100vh;
    position: fixed;
    left: 0;
    top: 0;
    z-index: 2;
    background: rgba(0, 0, 0, 0.85);
    .selected{
        border: 2px solid black !important;
    }
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
                margin-top: 20px;
                overflow: hidden;
                input{
                    border-radius: 8px 0 0 8px;
                    padding: 10px;
                    flex:1;
                    border: 0;
                    outline: 0;
                } 
            }
            .input-wrap:focus-within >input{
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
</style>