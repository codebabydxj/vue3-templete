<template>
  <header>
    <nav class="navbar-top">
      <div class="tabs-wrap">
        <slot name="tabs"></slot>
      </div>
      <div class="user-info">
        <el-tooltip effect="dark" content="刷新" placement="bottom">
          <el-link class="screenfull" @click="refresh">
            <el-icon color="#efefef" :size="20">
              <Refresh />
            </el-icon>
          </el-link>
        </el-tooltip>
        <el-tooltip effect="dark" content="全屏" placement="bottom">
          <el-link class="screenfull" @click="screenfullTog">
            <el-icon color="#efefef" :size="20">
              <FullScreen />
            </el-icon>
          </el-link>
        </el-tooltip>
        <div id="he-plugin-simple"></div>
        <el-dropdown class="head" @command="handleCommand">
          <el-avatar class="avatar" icon="el-icon-user-solid" :size="30"
            src="/src/assets/avatar.png" fit="fill"
            v-loading.fullscreen.lock="fullscreenLoading"></el-avatar>
          <template #dropdown>
            <el-dropdown-menu>
              <el-dropdown-item command="center">个人中心</el-dropdown-item>
              <el-dropdown-item command="setCore">设置中心</el-dropdown-item>
              <el-dropdown-item command="logout" divided>退出登录</el-dropdown-item>
            </el-dropdown-menu>
          </template>
        </el-dropdown>
      </div>
    </nav>
  </header>
</template>

<script lang="ts">
import { defineComponent, inject, onMounted, ref } from 'vue'
import screenfull from 'screenfull'
import routers from '@/routers'
import { globalStore } from '@/store'
import { client } from '@/utils/https/client';
import * as API from '@/api';
import { ElMessage, ElMessageBox } from 'element-plus'

export default defineComponent({
  setup() {
    // 加载和风天气
    onMounted(() => {
      (window as any).WIDGET = {
        'CONFIG': {
          'modules': '2014',
          'background': '5',
          'tmpColor': '409eff',
          'tmpSize': '15',
          'cityColor': '409eff',
          'citySize': '15',
          'aqiColor': '409eff',
          'aqiSize': '15',
          'weatherIconSize': '24',
          'alertIconSize': '16',
          'padding': '10px 10px 5px 10px',
          'shadow': '0',
          'language': 'auto',
          'fixed': 'false',
          'vertical': 'top',
          'horizontal': 'left',
          'key': '12e37ffc392d47e48ce3d066029270bb'
        }
      }
      let script = document.createElement('script')
      script.type = 'text/javascript'
      script.src = 'https://widget.qweather.net/simple/static/js/he-simple-common.js?v=2.0'
      document.getElementsByTagName('head')[0].appendChild(script)
    })

    const myStore: any = globalStore()
    const globalFunc: any = inject('globalFunc')
    const fullscreenLoading = ref(false)

    const refresh = () => {
      globalFunc.refreshView()
    }
    const screenfullTog = () => {
      if (screenfull.isEnabled) {
        screenfull.toggle();
      } else {
        ElMessage({
          showClose: true,
          type: 'warning',
          message: '浏览器不能全屏',
        })
      }
    }
    const handleCommand = (command: any) => {
      // 退出登录
      if (command === 'logout') {
        ElMessageBox.confirm(
          '您是否确认退出登录?',
          '温馨提示',
          {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning',
          }
        ).then(() => {
          fullscreenLoading.value = true
          client.get(API.loginOut)
          .then(() => {
            myStore.logout()
            routers.replace('/login');
            setTimeout(() => {
              window.location.reload();
            }, 100)
          }).catch(() => {
          }).finally(() => {
            fullscreenLoading.value = false
          });
        }).catch(() => {
        })
      }
      // 个人中心
      // 设置中心
    }
    return {
      fullscreenLoading,
      refresh,
      screenfullTog,
      handleCommand,
    };
  }
});
</script>

<style scoped lang="scss">
header {
  flex: 0 0 auto;
  // background-color: rgba(43, 55, 61, 1);
  // border-bottom: 1px solid rgba(68, 87, 96, 1);
  background-color: #191a20;
  // border-bottom: 1px solid #dfe4ed;
  z-index: 2005;
}

header .navbar-top {
  height: 100%;
  display: flex;
  flex-direction: row;
}

header .navbar-top .tabs-wrap {
  flex: 1 1 auto;
  width: calc(100% - 250px);
}

header .navbar-top .user-info {
  flex: 0 0 auto;
  width: 250px;
  display: flex;
  justify-content: flex-end;
  align-items: center;
}

header .navbar-top .user-info .screenfull {
  margin: 0 0 0 15px;
  padding: 0;
  color: inherit;
  cursor: pointer;
}

header .navbar-top .user-info .head {
  margin-right: 8px;

  .avatar {
    cursor: pointer;
    background-color: transparent;
  }
}
</style>
