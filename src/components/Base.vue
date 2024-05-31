<template>
    <div id="base">
        <MiddleBar />
        <Panel v-if="pageStore.page.position==='main'" />
        <Chat v-if="['private','group'].indexOf(pageStore.page.position) != -1" />
        <Discovery v-if="pageStore.page.position==='discovery'"/>
    </div>
    
</template>

<script setup>
import MiddleBar from './MiddleBar.vue'
import Panel from './Panel.vue'
import Chat from './Chat.vue'
import Discovery from './Discovery.vue'
import { usePageStore } from '@/store/page'
import { useUserStore } from '@/store/user'

const pageStore = usePageStore()
const userStore = useUserStore()
</script>

<style lang="less" scoped>
#base{
    display: flex;
    flex: 1;
}
</style>