<template>
  <main class="main-interface">
    <router-view v-slot="{ Component, route }">
      <transition appear :name="isTransition ? 'fade-transform' : ''" mode="out-in">
        <keep-alive :include="keepAliveName">
          <component :is="Component" :key="route.fullPath" v-if="isRefreshRouter" />
        </keep-alive>
      </transition>
    </router-view>
  </main>
</template>

<script setup lang="ts">
import { ref, watch, provide } from "vue";
import { storeToRefs } from "pinia";
import { globalStore } from "@/store";
import { useKeepAliveStore } from "@/store/keepAlive";

// 入场动画配置
const myStore: any = globalStore()
const isTransition: any = ref(myStore.themeConfig.isTransition)

// keep页面缓存
const keepAliveStore = useKeepAliveStore()
const { keepAliveName } = storeToRefs(keepAliveStore);

/**
 * desc: 注入全局刷新路由方法
 * use: const refreshCurrentRouter: Function = inject("refresh") as Function; refreshCurrentRouter(true/false);
 */
const isRefreshRouter = ref(true);
const refreshCurrentRouter = (val: boolean) => (isRefreshRouter.value = val);
provide("refresh", refreshCurrentRouter);

watch(() => myStore.themeConfig.isTransition, (newVal: any) => {
  isTransition.value = newVal
})
</script>

<style scoped lang="scss">
.main-interface {
  flex: 1 1 auto;
  display: flex;
  overflow: auto;
  background-color: var(--el-bg-color-page);
}
</style>
