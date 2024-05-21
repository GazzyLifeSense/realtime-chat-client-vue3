<template>
    <div id="base">
        <MiddleBar :type="page.position" :to='page.to'/>
        <Panel v-if="page.position==='main'" />
        <Chat v-if="['private','group'].indexOf(page.position) != -1" />
        <Discovery v-if="page.position==='discovery'"/>
    </div>
    
</template>

<script>
import MiddleBar from './MiddleBar.vue'
import Panel from './Panel.vue'
import Chat from './Chat.vue'
import Discovery from './Discovery.vue'
export default {
    name: 'Base',
    components: {MiddleBar, Panel, Chat, Discovery},
    data(){
        return{
            user: this.$store.getters['userAbout/getUser']
        }
    },
    computed:{
        page(){
            return this.$store.getters['pageAbout/getPage']
        }
    },
    methods:{
        enterPage({type=0, to=null}){
            let PageList = {0: 'main', 1: 'private', 2: 'group', 3: 'discovery'}
            if(type==2 && to){
                this.$socket.emit('enterGroupChat', {token:sessionStorage.getItem('securityToken'), groupId:to._id})
            }
            this.$store.commit('pageAbout/Set_Page', {position:PageList[type], to})
        },
    },
    created(){
        this.$bus.$on('enterPage', this.enterPage)
    },
    destroyed(){
        this.$bus.$off('enterPage')
    }
}
</script>

<style lang="less" scoped>
#base{
    display: flex;
    flex: 1;
}
</style>