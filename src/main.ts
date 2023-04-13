import { createApp } from 'vue'

// 全局组件
import flexCard from '@/components/flexCard/index.vue'

import App from './App.vue'

// 样式组件
import '@/baseStyle/base.scss'
import ElementPlus from 'element-plus'
import * as ElementIcon from '@element-plus/icons-vue'
import zhCN from 'element-plus/es/locale/lang/zh-cn'
import * as AntdIcons from '@vicons/antd'
import 'element-plus/dist/index.css'
import 'element-plus/theme-chalk/dark/css-vars.css'
import '@/baseStyle/element-dark.scss'
import '@/baseStyle/element.scss'

// 路由
import routers from './routers'

// 状态管理库
import { pinia } from './store'

// 全局调用封装路由
import { globalRouter } from '@/utils/globalRouter'

// 加载全局 svg-icon 标签
import SvgIcon from '@/icons'

/* px转rem 自适应 */
// import '@/utils/rem' 

const app = createApp(App);

// 将globalRouter方法挂载在全局
app.provide('globalRouter', globalRouter);

app.component('flex-card', flexCard);

const Icons = { ...ElementIcon, ...AntdIcons }
Object.keys(Icons).forEach(key => {
  app.component(key, Icons[key as keyof typeof Icons])
})

app.use(routers).use(pinia).use(SvgIcon).use(ElementPlus, { locale: zhCN }).mount('#app')
