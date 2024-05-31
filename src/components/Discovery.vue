<template>
    <div id="discovery">
        <div class="header flex-center">
            <h2>在这里找到自己的社区</h2>
            <div>从游戏、音乐到学习，总有你的一片天地。</div>
        </div>

        <h3>特色社区</h3>

        <div class="community-list">
            <div class="community-card flex-center" v-for="group of groupList" :key="group._id" @click="applyGroup(group)">
                <img :src="getGroupBanner(group.banner)" class="poster">
                <div class="iconMask">
                    <img :src="getGroupAvatar(group.avatar)" class="icon" height="40" width="40">
                </div>
                <div class="content">
                    <div class="title line"><img src="@/assets/已验证.svg">&nbsp;{{ group.name }}</div>
                    <div class="desc">{{ group.description }}</div>
                </div>
            </div>
        </div>

        <div class="footer flex-center">
            <img src="@/assets/more1.svg">
            <h3>还有更多社区等你发现！</h3>
        </div>
    </div>
</template>
<script setup>
import { getGroupBanner } from '@/utils/pathResolver'
import { useUserStore } from '@/store/user'
import { applyGroupAPI, getRecommendGroupListAPI } from '@/api/group';
import { onBeforeMount } from 'vue';

const userStore = useUserStore()
const groupList = ref([])
    
function applyGroup(group){
    this.$confirm(`是否申请添加群组：${group.name}`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
    }).then(() => {
        applyGroupAPI(userStore.user._id, group._id).then((resp)=>{
            if(resp.code === 200) {
                (this?.$message || console).log(resp.msg)
            }else{
                (this?.$message || console).error(resp.msg)
            }
        })
    })
}
    
onBeforeMount(()=>{
    getRecommendGroupListAPI().then((resp)=>{
        if(resp.code === 200) {
            this.groupList = resp.data
        }else{
            (this?.$message || console).error(resp.msg)
        }
    })
})
</script>
<style lang="less" scoped>
#discovery{
    flex: 1;
    min-width: 450px;
    color: white;
    background: #37393F;
    padding: 32px 16px 32px 32px;
    overflow-y: scroll;
    display: flex;
    flex-direction: column;
    .header{
        flex-direction: column;
        min-height: 320px;
        background: url('@/assets/discovery.svg') no-repeat;
        background-size: cover;
        border-radius: 5px;
        text-align: center;
        h2{
            margin: 10px;
        }
    }
    .community-list{
        width: 100%;
        display: grid;
        justify-content: space-around;
        grid-template-columns: repeat(auto-fill, 250px);
        gap: 20px;
        margin-bottom: 20px;
        .community-card{
            height: 300px;
            background: #292A2E;
            flex-direction: column;
            justify-content: flex-start;
            position: relative;
            border-radius: 5px;
            cursor: pointer;
            z-index: 0;
            .poster{
                width: 100%;
                height: 140px;
                border-radius: 5px;
                margin-bottom: 32px;
            }
            .iconMask{
                background: #292A2E;
                position: absolute;
                left: 10px;
                top: 37%;
                padding: 4px;
                border-radius: 10px;
                font-size: 0;
                .icon{
                    border-radius: 10px;
                }
            }
            .content{
                width: 100%;
                padding: 0 16px 16px;
                display: flex;
                flex-direction: column;
                align-items: flex-start;
                .title{
                    font-weight: 600;
                    display: flex;
                    justify-content: flex-start;
                    align-items: center;
                    img{
                        fill:chartreuse;
                        fill-rule: evenodd;
                    }
                }
                .desc{
                    font-size: 14px;
                    color: #B9BBBE;
                    overflow: hidden;
                }
            }
            &:hover{
            transform: scale(1.02);
            background: #212326;
            border-radius: 10px;
            .poster{
                border-radius: 10px;
            }
        }
        }
        
    }

    .footer{
        flex-direction: column;
        height: 150px;
        width: 100%;
    }
}
#discovery::-webkit-scrollbar{
    width: 10px;
    border-radius: 10px;
    background: #2E3337;
}
#discovery::-webkit-scrollbar-thumb{
    border-radius: 10px;
    background: #212326;
}
</style>