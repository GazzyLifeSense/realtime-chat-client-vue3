<template>
  <div id="app">
    <router-view />
  </div>
</template>

<script>
import NProgress from 'nprogress'
import router from './route';
export default {
  name: "App",
  created(){
    // request拦截器设置
    this.$axios.interceptors.request.use(
      (config) => {
        // 附带token
        config.headers['token'] = sessionStorage.getItem('securityToken')
        // 开启进度条
		    NProgress.start();
        return config
      },
      (error) =>{
        this.$message.error("请检查网络~")
        Promise.reject(error)
      }
    )
    // response拦截器
    this.$axios.interceptors.response.use(
      (response) =>{
        // 关闭进度条
        NProgress.done()
        console.log(response.data)
        if(response.data && response.data.code === 401){
          return this.$router.push('/')
        }
        return response.data;
      },
      (error) => {
        this.$message.error("请检查网络~")
        Promise.reject(error)
      }
    )
  }
};
</script>

<style scoped>
.logo {
  height: 6em;
  padding: 1.5em;
  will-change: filter;
  transition: filter 300ms;
}
.logo:hover {
  filter: drop-shadow(0 0 2em #646cffaa);
}
.logo.vue:hover {
  filter: drop-shadow(0 0 2em #42b883aa);
}
</style>
