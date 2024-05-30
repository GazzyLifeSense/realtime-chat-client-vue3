<template>
    <div id="middlebar" :class="{'fold':fold}">
        <FriendList v-if="pageStore.page.position!=='group'"/>
        <MemberList v-if="pageStore.page.position=='group'"/>
        <UserBar />
    </div>
</template>

<script setup>
import UserBar from './UserBar.vue'
import MemberList from '../components/MemberList.vue'
import FriendList from '../components/FriendList.vue'
import { ref } from 'vue'
import { usePageStore } from '@/store/page'

const pageStore = usePageStore()
const fold = ref(false)
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