<template>
    <div id="middlebar" :class="{'fold':fold}">
        <FriendList v-if="page.position!=='group'"/>
        <MemberList v-if="page.position=='group'"/>
        <UserBar />
    </div>
</template>

<script>
import UserBar from './UserBar.vue'
import MemberList from '../components/MemberList.vue'
import FriendList from '../components/FriendList.vue'
export default {
    name: 'MiddleBar',
    components: {UserBar, FriendList, MemberList},
    data(){
        return{
            fold: false
        }
    },
    computed:{
        page(){
            return this.$store.getters['pageAbout/getPage']
        }
    },
    created(){
        this.$bus.$on('fold',()=>{
            this.fold = !(this.fold)  
        })
    },
    destroyed(){
        this.$bus.$off('fold')
    }
}
</script>
<style lang="less" scoped>
#middlebar{
    min-width: 0;
    width: 60vw;
    max-width: 260px;
    display: flex;
    flex-direction: column;
    background: #2E3237;
    position: relative;
    overflow: hidden;
}
.fold{
    width: 0 !important;
    overflow-x: hidden;
}
</style>