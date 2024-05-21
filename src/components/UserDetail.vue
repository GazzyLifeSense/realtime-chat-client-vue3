<template>
    <div id="userDetail" class="flex-center" ref='menu' v-if="open">
        <div class="banner"></div>
        <img class="cancel" src="@/assets/arrowDown.svg" @click.stop="hide">
        <div class="avatar-wrap">
            <div class="mask">
                <img :src="getUserAvatar(user.avatar)" class="avatar" title="上传头像" @click.stop="uploadAvatar">
            </div>
            <input type="file" hidden @change="getFile($event)" ref="file" accept=".jpg,.jpeg,.png,.webp,.ico,.svg">
            <div class="online"></div>
        </div>
        <div class="detail-wrap flex-center">
            <div class="detail">
                <div class="nickname flex-start"><div class="label">昵称：</div>{{user.nickname}}&nbsp;<a @click="updateNickname"><img src="@/assets/修改.svg"></a></div>
                
                <div class="separator"></div>
                
                <div class="username">
                <h3>用户名</h3>
                <div class="text">{{user.username}}</div>
                </div>
                
                <div class="separator"></div>
                
                <div class="uid">
                <h3>UID</h3>
                <div class="text">{{user._id}}</div>
                </div>
            
                <div class="separator"></div>
                
                <div class="location">
                    <h3>归属地</h3>
                    <div class="text">{{user.location}}</div>
                </div>

                <div class="separator"></div>
                
                <div class="introduction">
                    <h3 class="flex-start">个人介绍&nbsp;<a @click="updateIntroduction"><img src="@/assets/修改.svg"></a></h3>
                    <div class="text">{{user.introduction==''?'此人很懒,没有留下任何信息':user.introduction}}</div>
                </div>
                
                <div class="separator"></div>
                
                <div class="regDate">
                    <h3>注册时间</h3>
                    <div class="text">{{new Date(parseInt(user.regDate)).toLocaleString()}}</div>
                </div>

                <div class="separator"></div>

                <div class="logout flex-start" @click.stop="updatePassword"><img src="@/assets/修改密码.svg">&nbsp;修改密码</div>

            <div class="separator"></div>

                <div class="logout flex-start" @click.stop="logout"><img src="@/assets/logout.svg">&nbsp;注销</div>
            </div>
        </div>

    </div>
</template>

<script>
import imgMixin from '@/mixin/imgMixin.js'
export default {
    name: 'userDetail',
    props: ['open'],
    mixins: [imgMixin],
    methods:{
        hide(){
            this.open = false
        },
        getFile(e){
            let file = e.target.files[0]
            if(file.size/1024/1024 > 1){
                return this.$message.warning('文件大小超过5MB限制！')
            }
            let formData = new FormData();
            formData.append('userId', this.user._id)
            formData.append('filename', file.name)
            formData.append('fileType', file.type)
            var reader = new FileReader()
            reader.readAsDataURL(file)
            var that = this
            reader.onload = function(){
                formData.append('file', this.result)
                that.$axios.post('api/uploadAvatar',formData,{ headers:{ 'Content-Type': 'multipart/formdata'}}).then((resp)=>{
                    if(resp.code === 200){
                        that.$message.success(resp.msg)
                        that.$store.commit("userAbout/Set_Avatar", resp.data)
                    }else{
                        that.$message.error(resp.msg)
                    }
                })
            }
        },
        uploadAvatar(){
            this.$refs.file.click()
        },
        updateNickname(){
            this.$prompt('长度<8',"输入昵称",{
                confirmButtonText: '提交',
                cancelButtonText: '取消',
                inputValidator: (data)=>{
                    if(data.length <= 8) return true
                    return false
                },
                inputErrorMessage: '格式不正确'
            }).then(({value})=>{
                let nickname = value.trim()
                if(nickname.length == 0 || nickname.length > 8){
                    return this.$message.warning('超出长度(8)!'); 
                }
                this.$axios.post('/api/updateNickname', {userId: this.user._id, nickname: value}).then((resp)=>{
                    if(resp.code === 200){
                        this.$message.success(resp.msg)
                        this.$store.commit('userAbout/Set_Nickname', resp.data)
                    }else{
                        this.$message.error('修改失败！')
                    }
                })
            }).catch(()=>{
                this.$message.info('取消操作');   
            })
        },
        updateIntroduction(){
            this.$prompt('长度<25',"输入个人介绍",{
                confirmButtonText: '提交',
                cancelButtonText: '取消',
                inputValidator: (data)=>{
                    if(data.length <= 25) return true
                    return false
                },
                inputErrorMessage: '格式不正确'
            }).then(({value})=>{
                let introduction = value.trim()
                if(introduction.length == 0 || introduction.length > 25){
                    return this.$message.warning('超出长度(25)!'); 
                }
                this.$axios.post('/api/updateIntroduction', {userId: this.user._id, introduction: value}).then((resp)=>{
                    if(resp.code === 200){
                        this.$message.success(resp.msg)
                        this.$store.commit('userAbout/Set_Introduction', resp.data)
                    }else{
                        this.$message.error('修改失败！')
                    }
                })
            }).catch(()=>{
                this.$message.info('取消操作');   
            })
        },
        updatePassword(){
            this.$prompt('长度<15',"输入当前密码",{
                confirmButtonText: '提交',
                cancelButtonText: '取消',
                inputType: 'password',
                inputValidator: (data)=>{
                    if(data.length <= 15) return true
                    return false
                },
                inputErrorMessage: '格式不正确'
            }).then(({value})=>{
                let password = value
                this.$prompt('长度<15',"输入新密码",{
                confirmButtonText: '提交',
                cancelButtonText: '取消',
                inputType: 'password',
                inputValidator: (data)=>{
                    if(data.length <= 15) return true
                    return false
                },
                inputErrorMessage: '格式不正确'
                }).then(({value})=>{
                    let newPassword = value
                    this.$axios.post('/api/updatePassword', {userId: this.user._id, password, newPassword}).then((resp)=>{
                        if(resp.code === 200){
                            this.$message.success(resp.msg)
                            this.$router.replace("/")
                        }else{
                            this.$message.error('修改失败！')
                        }
                    })
                }).catch(()=>{
                    this.$message.info('取消操作');   
                })
            }).catch(()=>{
                this.$message.info('取消操作');   
            })
        },
        // 注销
        logout(){
            sessionStorage.clear()
            this.$socket.emit('logout')
            this.$router.push('/')
        }
    },
    computed:{
        user(){
            return this.$store.getters['userAbout/getUser']
        }
    }
}
</script>

<style lang="less">
#userDetail{
    background: #232429;
    position: absolute;
    left: 50%;
    transform: translateX(-50%);
    bottom: 3.125em;
    border-radius: 1em;
    flex-direction: column;
    justify-content: flex-start;
    align-items: center;
    cursor: default;
    z-index: 1;
    .banner{
        border-radius: 1em 1em 0 0;
        width: 100%;
        height: 3.75em;
        background: linear-gradient(to right,rgb(12, 162, 182),rgb(21, 240, 167));
    }
    .cancel{
        position: absolute;
        right: 15px;
        top: 15px;
        cursor: pointer;
        z-index: 1;
    }
    .avatar-wrap{
        position: absolute;
        left: 1em;
        top: 1em;
        border: 6px solid #232429;
        border-radius: 50%;
        background-color: #232429;
        .mask{
            border-radius: 50%;
        }
        .mask:hover{
            opacity: 0.7;
            cursor: pointer;
        }
        .mask:hover:after{
            content: '上传头像';
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translateX(-50%) translateY(-50%);
            white-space: nowrap;
            pointer-events: none;
        }
        .avatar{
            height: 5em;
            width: 5em;
            position: relative;
            overflow: hidden;
            border-radius: 50%;
        }
        .online{
            background-color: #21A65A;
            height: 1.625em;
            width: 1.625em;        
            top: 3.4375em;
            right: -5px;
            z-index: 1;
            position: absolute;
            border-radius: 50%;
            border: solid 6px #292A2E;
        }   

    }
    .detail-wrap{
        width: 100%;
        padding: 3.7em 1em 1em;
        
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
        .username,.uid{
            font-size: 14px;
            .label{
                font-size: 14px;
            }
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
        .text,.logout{
            font-size: 14px;
            color: #BDBEC6;
        }
        .logout:hover{
            background: #2E3237;
            border-radius: 6px;
            cursor: pointer;
        }
    }
}
</style>