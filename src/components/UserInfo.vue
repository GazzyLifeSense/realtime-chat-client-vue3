<template>
    <div id="userInfo" class="flex-center" ref='menu' :style="{display: config.display}">
         <div class="banner"></div>
         <img class="cancel" src="@/assets/arrowDown.svg" @click.stop="hide">
         <div class="avatar">
            <img :src="getUserAvatar(config.user?.avatar)" height="80" width="80">
            <div class="online">
        </div>
         </div>
         <div class="detail-wrap flex-center">
             <div class="detail">
                 <div class="nickname flex-start"><div class="label">昵称：</div>{{config.user?.nickname}}&nbsp;</div>
                 
                 <div class="separator"></div>
                 
                 <div class="username">
                    <h3>用户名</h3>
                    <div class="text">{{config.user?.username}}</div>
                 </div>
                
                 <div class="separator"></div>
                 
                 <div class="location">
                     <h3>归属地</h3>
                     <div class="text">{{config.user?.location}}</div>
                 </div>

                 <div class="separator"></div>
                 
                 <div class="introduction">
                     <h3 class="flex-start">个人介绍</h3>
                     <div class="text">{{config.user?.introduction==''?'此人很懒,没有留下任何信息':config.user?.introduction}}</div>
                 </div>
                 
                 <div class="separator"></div>
                 
                 <div class="regDate">
                     <h3>注册时间</h3>
                     <div class="text">{{new Date(parseInt(config.user?.regDate)).toLocaleString()}}</div>
                 </div>

                <div class="separator"></div>

                <div class="opt flex-start" @click.stop="applyFriend" v-if="config.type==2">申请好友</div>
                
                <div class="separator"></div>

                <div class="opt flex-start" @click.stop="enterPrivateChat(config.user)" v-if="config.type==2">发送信息</div>
            </div>
         </div>
    </div>
</template>

<script>
import imgMixin from '@/mixin/imgMixin.js'
export default {
    name: 'userInfo',
    props: ['config'],
    mixins: [imgMixin],
    computed:{
        user(){
            return this.$store.getters['userAbout/getUser']
        }
    },
    methods:{
        hide(){
            this.config.display='none'
        },
        applyFriend(){
            this.$axios.post('/api/applyFriend', {userId: this.user._id, username: this.config.user.username}).then((resp)=>{
                if(resp.code === 200){
                    this.$message.success(resp.msg)
                }else{
                    this.$message.error(resp.msg)
                }
            })
        },
        enterPrivateChat(to){
            this.$bus.$emit('enterPage', {type:1, to})
            this.config.display = 'none'
            this.$store.commit('friendAbout/Reset_Friend_hasNew', to._id)
        }
    }
}
</script>

<style lang="less" setup>
#userInfo{
    background: #232429;
    position: fixed;
    width: 340px;
    border: 6px solid;
    border-image: linear-gradient(#0a0701, #5c3cec) 20;
    display: none;
    flex-direction: column;
    justify-content: flex-start;
    align-items: center;
    cursor: default;
    z-index: 1;
    left: 50%;
    top:50%;
    transform: translateX(-50%) translateY(-50%);
    color: white;
    .banner{
        width: 100%;
        height: 60px;
        background: linear-gradient(to right,rgb(70, 59, 95),rgb(32, 36, 34));
    }
    .cancel{
        position: absolute;
        right: 15px;
        top: 15px;
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
        padding: 55px 16px 16px;
        background: linear-gradient(to bottom,rgb(17, 6, 17), 70%, rgb(39, 36, 192));
        font-size: 14px;
        .detail{
            font-size: 20px;
            border-radius: 15px;
            padding: 7px 12px 7px;
            background: #101316;
            width: 100%;
        }
        .nickname{
            font-size: 20px;
        }
        .nickname, .username, .uid, .location, .introduction, .regDate, .logout{
            padding: 5px 0;
        }
        h3{
            font-size: 12px;
            margin: 0;
        }
        .label{
            font-size: 16px;
        }
        .text,.opt{
            font-size: 14px;
            color: #BDBEC6;
        }
        .opt:hover{
            background: #2E3237;
            border-radius: 6px;
            cursor: pointer;
        }
    }
}
</style>