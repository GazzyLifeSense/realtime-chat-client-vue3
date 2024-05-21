import Vue from 'vue'
import Vuex from 'vuex'
import userAbout from './user'  // 引入user
import friendAbout from './friend'  // 引入friend
import groupAbout from './group'  // 引入group
import pageAbout from './page'  // 引入page
import messageAbout from './message'  // 引入message

Vue.use(Vuex)

//创建并暴露store
export default new Vuex.Store({
    modules: {userAbout, friendAbout, groupAbout, pageAbout, messageAbout}
})