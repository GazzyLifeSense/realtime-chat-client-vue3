<template>
    <div id="chat">
        <div class="title">{{pageStore.page.to?.nickname || pageStore.page.to?.name}}</div>
 
        <div class="chat-content" ref="msgBoxRef">

          <a href="#" class="loadMoreMsgs" @click.prevent="messageStore.loadMoreMsgs(scrollToLatest)">点击加载更多消息</a>

          <div v-for="item in messageStore.msgList" :key="item._id">
            <!-- 其他人发送的消息 -->
            <div class="othersmsgpack fadeIn" v-if="item.from !== userStore.user._id">

              <div class="avatar" style="cursor: pointer;" @click="pageStore.userInfoCardConfig = {show: true, userId: item.from}">
                <img :src="pageStore.page.position=='private'?getUserAvatar(pageStore.page.to.avatar):getUserAvatar(otherAvatar(item.from))" width="40px" height="40px" />
              </div>
              
              <div class="content-wrap">
                <div class="header flex-center">
                  <div class="username line">{{ pageStore.page.to.nickname?pageStore.page.to.nickname:otherNickname(item.from) }}&nbsp;&nbsp;</div>
                  <div class="time">{{ new Date(item.create_time).toLocaleString() }}</div>
                </div>
                
                <div class="content" style="text-align: left;">
                  <div class="text" v-if="!isLink(item.content) && item.isPic == 0">{{ decodeEmoji(item.content) }}</div>
                  <a :href="item.content" v-if="isLink(item.content)  && item.isPic == 0" target="_blank">{{ item.content }}</a>
                  <ElImage :src="getChatPic(item.content)" :preview-src-list="[getChatPic(item.content)]" v-if="item.isPic == 1" class="pic" />
                </div>
              </div>
            </div>

            <!-- 自己发送的消息 -->
            <div class="mymsgpack fadeIn" v-if="item.from === userStore.user._id">

              <div class="avatar">
                <img :src="getUserAvatar(userStore.user.avatar)" width="40px" height="40px" />
              </div>

              <div class="content-wrap">
                <div class="header flex-center">
                  <div class="username line">{{ userStore.user.nickname }}</div>
                  <div class="time">{{ new Date(item.create_time).toLocaleString() }}&nbsp;&nbsp;</div>
                </div>
                
                <div class="content" style="text-align: left;">
                  <div class="text" v-if="!isLink(item.content) && item.isPic == 0">{{ decodeEmoji(item.content) }}</div>
                  <a :href="item.content" v-if="isLink(item.content)  && item.isPic == 0" target="_blank">{{ item.content }}</a>
                  <ElImage :src="getChatPic(item.content)" :preview-src-list="[getChatPic(item.content)]" v-if="item.isPic == 1" class="pic" />
                </div>
              </div>
            </div>

          </div>
        </div>

        <!-- 输入框 -->
        <div class="chat-form">
            <div class="input-wrap">
                <div class="chat-icon flex-center">
                  <img src="../assets/消息.svg" class="icon" >
                  <input type="file" class="upload-hide" @change="getPic($event)" ref="picRef" accept=".jpg,.jpeg,.png,.webp,.ico,.svg">
                </div>

                  <input type="text" class="chat-input" v-model="msg" @keyup.enter="sendMsg" :placeholder="`给 # ${pageStore.page.to?.nickname || pageStore.page.to?.name} 发信息`" maxlength="50">

                <div class="limit" :class="{shake}" :style="{color: color}">{{encodeEmoji(msg).length}}/50</div>
                
                <img src="../assets/图片.svg" class="icon" @click="sendPic">
                <img src="../assets/表情.svg" class="icon" @click="showEmojiList = !showEmojiList">
                <div class="emoji-list-wrap" @mouseleave="showEmojiList = false" :style="{'display':showEmojiList?'block':'none'}">
                  <div class="emoji-list">
                    <a v-for="emoji of emojiList" @click="msg+=emoji">{{ emoji }}</a>
                  </div>
                </div>
            </div>
        </div>
    </div>
    
</template>

<script lang="ts" setup>
import SparkMD5 from 'spark-md5'
import { getUserAvatar, getChatPic } from '@/utils/pathResolver'
import { isLink } from '@/utils'
import emojiRegex from 'emoji-regex'
import json from '@/assets/emoji/emoji.json'
import { useUserStore } from '@/store/user'
import { usePageStore } from '@/store/page'
import { useGroupStore } from '@/store/group'
import { useSocketStore } from '@/store/socket'
import { onMounted, ref, watch } from 'vue'
import { sendPicAPI } from '@/api/message'
import { useMessageStore } from '@/store/message'
import { ElImage, ElMessage } from 'element-plus'
import { ResponseType } from '@/types/request'

const userStore = useUserStore(),
  pageStore = usePageStore(),
  groupStore = useGroupStore(),
  messageStore = useMessageStore(),
  socketStore = useSocketStore()
    
const msg = ref(''),
  color = ref('white'),
  shake = ref(false),
  emojiList = ref(json.data.split(',')),
  showEmojiList = ref(false),
  msgBoxRef = ref(),
  picRef = ref()

// 对方的昵称
const otherNickname = (id: any) => groupStore.getMemberById(id, { nickname: 'unknown' }).nickname
// 对方的头像
const otherAvatar = (id: any) => groupStore.getMemberById(id)?.avatar

function sendMsg(){
    if(msg.value.trim().length === 0) return ElMessage.error('输入内容不能为空！');

    msg.value = encodeEmoji(msg.value)
    if(msg.value.length > 50) return ElMessage.error('输入内容不得超过50字！')
    
    // 封装消息体，并推送事件到服务器
    socketStore.instance.emit("sendMsg", {
        token: sessionStorage.getItem('securityToken'),
        from: userStore.user._id,
        to: pageStore.page.to._id,
        content: msg.value,
        type: pageStore.page.position==='private'?1:2
    });
    // 重置输入框
    msg.value = "";
    scrollToLatest()
}

function getPic(e: any){
  let file = e.target.files[0]
  if(file.size/1024/1024 > 1){
      return ElMessage.warning('文件大小超过1MB限制！')
  }
  
  // 封装请求数据体
  let formData = new FormData();
  formData.append('userId', userStore.user._id)
  formData.append('to', pageStore.page.to._id)
  formData.append('filename', file.name)
  formData.append('fileType', file.type)
  formData.append('type', pageStore.page.position==='private'?'1':'2')

  // 读取图片数据
  let reader = new FileReader()
  reader.readAsDataURL(file)
  reader.onload = async function(){
    formData.append('file', this.result as string)
    // 生成图片md5，避免相同图片重复上传
    let hash = await SparkMD5.hash(this.result as string)
    formData.append('hash', hash)
    // 发送ajax请求
    sendPicAPI(formData).then((resp: ResponseType)=>{
        if(resp.code === 200){
            ElMessage.success(resp.msg)
        }else{ ElMessage.error(resp.msg) }
    })
  }
}
function sendPic(){
  // 选择文件前，重置input框内容，解决无法连续发送相同图片的问题
  picRef.value.value = ""
  picRef.value.click()
}

// 滚动到最新消息处
function scrollToLatest(){
  setTimeout(()=>{
      msgBoxRef.value.scrollTop = msgBoxRef.value.scrollHeight
  },200)
}

// 将表情编码
function encodeEmoji(str: string){
  const regex = emojiRegex()
  return str.replace(regex, p => `emoji(${p.codePointAt(0)})`)
}

// 通过正则表达式解析文本中的表情
function decodeEmoji(str: string){
  const emojiDecodeRegex = /emoji\(\d+\)/g
  return str.replace(emojiDecodeRegex, p => {
    const filterP = parseInt(p.replace(/[^\d]/g, ''))
    return String.fromCodePoint(filterP)
  })
}

// 消息长度限制
watch(msg, (newV) => {
  if(encodeEmoji(newV).length >= 50){
    color.value = 'red'
    shake.value = true
  }else{
    color.value = 'white'
    shake.value = false
  }
})

watch(pageStore.page, (newV, oldV) => {
  if(oldV && oldV.position == 'group' && oldV.to && oldV.to._id != newV.to._id){
          socketStore.instance.emit('leaveGroupChat', {token: sessionStorage.getItem('securityToken'), groupId: oldV.to._id})
        }
        // 获取历史消息
        messageStore.getHistoryMsgs(scrollToLatest)
}, { deep: true, immediate: true })

onMounted(() => {
  messageStore.recvMsg()
})
</script>


<style lang="less" scoped>
#chat{
    flex: 1 1 0px;
    height: 100%;
    display: flex;
    flex-direction: column;
    background: #37393F;
    color: white;
    .title{
        font-weight: 600;
        padding: 20px;
        border-bottom: 1px solid #292831;
    }

    .chat-content{
        flex: 1;
        overflow-y: scroll;
        padding: 10px 10px 0 20px;
        .loadMoreMsgs{
          width: 100%;
          text-align: center;
          font-size: 14px;
        }
        .othersmsgpack, .mymsgpack{
          justify-content: flex-start;
          padding-bottom: 20px;
          display: flex;
          .content-wrap{
            display: flex;
            flex-direction: column;
            .header{
              margin-bottom: 5px;
              .username{
                font-size: 16px;
              }
              .time{
                font-size: 12px;
                color: #ADAA9C;
              }
            }
            .content{
              padding: 10px;
              border-radius: 10px;
              max-width: 500px;
              .text{
                color: black;
              }
              a{
                word-wrap:break-word;
              }
              .pic{
                display:block;
                width: auto;
                max-width: 300px;
              }
            }
          }
        }
        .othersmsgpack{
          .avatar{
            padding: 5px 20px 0 0;
          }
          .content-wrap{
            align-items: flex-start;
          }
          .content{
            background: white;
          }
        }
        .mymsgpack{
          flex-direction: row-reverse;
          .avatar{
            padding: 5px 0 0 20px;
          }
          .content-wrap{
            align-items: flex-end;
            .header{
              flex-direction: row-reverse;
            }
          }
          .content{
            background: greenyellow;
          }
        }
    }

    // 滚动条
    .chat-content::-webkit-scrollbar{
      width: 10px;
      border-radius: 10px;
      background: #2E3337;
    }
    .chat-content::-webkit-scrollbar-thumb{
      border-radius: 10px;
      background: #212326;
    }

    .chat-form{
        width: 100%;
        height: 80px;
        padding: 15px 20px 20px 20px;
        .input-wrap{
            height: 100%;
            background: #3F454D;
            border-radius: 12px;
            display: flex;
            align-items: center;
            padding: 0 10px 0 5px;
            position: relative;
          
            .chat-icon{
                width: 35px;
                height: 35px;
            }
            .chat-input{
                padding: 0 5px;
                flex: 1;
                background: transparent;
                border: none;
                outline: none;
                color: white;
            }
            .limit{
                font-size: 14px;
            }
            .shake{
                animation-delay: 0s;
                animation-name: shake;
                animation-duration: .1s;
                animation-iteration-count: 3;
                animation-direction: normal;
                animation-timing-function: linear;
            }
            .icon{
              cursor: pointer;
              width: 24px;
              height: 24px;
              margin: 0 5px;
            }
            .emoji-list-wrap{
              border-radius: 10px;
              background-color: white;
              bottom: 60px;
              right: 0;
              position: absolute;
              padding: 8px;
              .emoji-list{
                height: 100px;
                overflow-x: hidden;
                overflow-y: scroll;         
                display: grid;
                grid-template-columns: repeat(10, 20px);
                gap: 5px;
                z-index:1;
              }
              .emoji-list>a{
                display: inline-block;
              }
            }

            @keyframes shake {
                0% {
                    margin-left: 0px;
                    margin-right: 5px;
                    margin-top: 0px;
                }
                100% {
                    margin-left: 5px;
                    margin-right: 0px;
                    margin-top: 5px	;	/* 可以自定义上下左右的幅度 */
                }
	        }
        }
    }
}
</style>