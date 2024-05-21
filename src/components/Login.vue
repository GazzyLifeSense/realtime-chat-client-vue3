<template>
    <div class="center-container">
        <div class="form-wrap">
            <img src="@/assets/login_side.png" alt="side" />
            <form method="post" name="login-form" v-show="!formType">
                <h1 class="form-title">欢迎回来！</h1>
                <label for="login_username">用户名<span>*</span></label>
                <input type="text" id="login_username" v-model="user.username" maxlength="15" required>
                
                <label for="login_password">密码<span>*</span></label>
                <input type="password" id="login_password" v-model="user.password" required>
                
                <button class="form-btn" @click.prevent="toLogin">登 录</button>
                <a class="link" @click="formType=1">注册新账号</a>
            </form>
            <form method="post" name="reg-form" v-show="formType == 1">
                <h1 class="form-title">创建账号</h1>
                <label for="nickname">给你的用户取一个闪亮的昵称<span>*</span></label>
                <input type="text" id="nickname" v-model="user.nickname" maxlength="6" required>
                
                <label for="reg_username">用户名<span>*</span></label>
                <input type="text" id="reg_username" v-model="user.username" maxlength="15" required>
                
                <label for="reg_password">密码<span>*</span></label>
                <input type="password" id="reg_password" v-model="user.password" required>
                
                <label for="reg_check_password">确认密码<span>*</span></label>
                <input type="password" id="reg_check_password" v-model="check_password" required>
                
                <button class="form-btn" @click.prevent="toRegister">注 册</button>
                <a class="link tologin" @click="formType=!formType">已有账户？</a>
            </form>
        </div>
    </div>

</template>

<script>
import Vue from 'vue'
export default {
    name: 'Login',
    data(){
        return {
            // 0: login | 1: register | 2: reset
            formType: 0,
            check_password: '',
            user: {
                username: '',
                nickname: '',
                password: '',
            }
        }
    },
    methods:{
        // 登录
        toLogin(){
            sessionStorage.removeItem("securityToken")
            if(this.user.username && this.user.password){
                this.$axios.post("/api/login", {username: this.user.username, password: this.user.password}).then((resp)=>{
                    if(resp.code === 200) {
                        // 存储token
                        sessionStorage.setItem("securityToken", JSON.stringify(resp.data).replaceAll("\"", ""))

                        this.$router.push('/mainwrap')
                    }else{
                        this.$message.error(resp.msg)
                    }
                })
            }else this.$message.warning('请输入用户名和密码！')
            
        },

        // 注册用户
        toRegister(){
            if(this.user.nickname && this.user.username && this.user.password && this.check_password)
            {
                // 密码一致
                if(this.user.password === this.check_password){
                    this.$axios.post("/api/register", this.user).then((data)=>{
                        if(data.code === 200){
                            this.$message.success(data.msg)

                            // 跳转登录页面
                            this.$router.go(0)
                        } else{
                            this.$message.error(data.msg)
                        }
                    })
                }else this.$message.error('密码不一致！')
            }else this.$message.warning('请输入信息！')
        }
    },
    async created(){
        await this.$store.dispatch('userAbout/resetUser')
        await this.$store.dispatch('pageAbout/resetPage')
        await this.$store.dispatch('messageAbout/resetMessageList')
        await this.$store.dispatch('groupAbout/resetGroupList')
        await this.$store.dispatch('groupAbout/resetMemberList')
        await this.$store.dispatch('friendAbout/resetFriendList')
    }
}
</script>

<style lang="less" scoped>
.center-container{
    width: 100vw;
    height: 100vh;
    padding: 1em;
    background: url('../assets/login_bg.avif') no-repeat;
    background-size: cover;
    color: white;
}
h1{ text-align: center; }
.form-wrap{
    max-width: 50em;
    border-radius: .8em;
    display: flex;
    overflow: hidden;
    img{
        width: 50%;
    }
    form{
        color: #305C70;
        width: 50%;
        padding: 2em;
        display: flex;
        flex-direction: column;
        background: white;
    }
}
label{
    font-size: 12px;
    display: block;
    margin-bottom: 8px;
    color: #9CA3B1;
    span{
        color: red;
    }
}
input{
    display: flex;
    outline: none;
    border: 2px solid currentColor !important;
    border-radius: .6em;
    padding:10px;
    margin-bottom: 20px;
    background-color: white;
    color: inherit !important;
}
.form-btn{
    background-color: #305C70;
    border: none;
    border-radius: .5em;
    padding: .5em;
    margin-bottom: .4em;
    font-size: 18px;
    font-weight: 600;
}
</style>