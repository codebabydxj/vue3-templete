export default {
  key: 'basic',
  title: '基本信息',
  icon: 'HomeFilled',
  access: true,
  routes: [
    {
      path: '/home',
      key: 'home',
      access: true,
      meta: {
        permission: {},
      },
      title: '欢迎使用',
      component: () => import('../../views/middleView/index.vue'),
      children: [
        {
          path: '',
          name: 'home',
          component: () => import('../../views/basic/index.vue'),
        }, {
          path: '_empty',
          name: 'empty',
          component: () => import('../../views/basic/empty/index.vue'),
        },
      ],
    }
  ],
};
