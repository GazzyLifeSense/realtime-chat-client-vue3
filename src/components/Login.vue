<template>
    <div class="center-container">
        <div class="form-wrap">
            <img src="@/assets/login_side.png" alt="side" />
            <form method="post" name="login-form" v-show="!formType" @submit.prevent="toLogin">
                <h1 class="form-title">欢迎回来！</h1>
                <label for="login_username">用户名<span>*</span></label>
                <input type="text" id="login_username" v-model="loginData.username" maxlength="15" required>
                
                <label for="login_password">密码<span>*</span></label>
                <input type="password" id="login_password" v-model="loginData.password" required>
                
                <button class="form-btn" type="submit">登 录</button>
                <a class="link" @click="formType=1">注册新账号</a>
            </form>
            <form method="post" name="reg-form" v-show="formType == 1" @submit.prevent="toRegister">
                <h1 class="form-title">创建账号</h1>
                <label for="nickname">给你的用户取一个闪亮的昵称<span>*</span></label>
                <input type="text" id="nickname" v-model="regData.nickname" maxlength="6" required />
                
                <label for="reg_username">用户名<span>*</span></label>
                <input type="text" id="reg_username" v-model="regData.username" maxlength="15" required>
                
                <label for="reg_password">密码<span>*</span></label>
                <input type="password" id="reg_password" v-model="regData.password" required>
                
                <label for="reg_check_password">确认密码<span>*</span></label>
                <input type="password" id="reg_check_password" v-model="regData.check_password" required>
                
                <button class="form-btn" type="submit">注 册</button>
                <a class="link tologin" @click="formType=!formType">已有账户？</a>
            </form>
        </div>
    </div>

</template>

<script setup>
import { ref, reactive, onBeforeMount } from 'vue'
import { userLogin, userRegister } from '@/api/user'
import { useRouter } from 'vue-router'

const router = useRouter()
// 0: login | 1: register | 2: reset
const formType = ref(0)
const loginData = reactive({
    username: '',
    password: ''
})
const regData = reactive({
    username: '',
    nickname: '',
    password: '',
    check_password: '',
})

// 登录
function toLogin(){
    userLogin(loginData).then((data) => {
        console.log(data)
        if(data.code == 200) router.push('/mainwrap')
    })
}

// 注册用户
function toRegister(){
    userRegister(regData)
}

onBeforeMount(()=>{
    inject('piniaInstance').state.value = {}
})
    
</script>

<style lang="less" scoped>
.center-container{
    width: 100vw;
    height: 100%;
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