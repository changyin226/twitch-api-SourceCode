import Vue from 'vue';
import VueRouter from 'vue-router';

Vue.use(VueRouter);

const routes = [
  {
    path: '/',
    name: 'Index',
    component: () => import(/* webpackChunkName: "Index" */ '@/views/Home.vue'),
    redirect: { name: 'GameDirectory' },
    children: [
      {
        path: 'directory',
        name: 'GameDirectory',
        component: () => import(/* webpackChunkName: "Index" */ '@/views/GameDirectory.vue'),
      },
      {
        path: 'directory/all',
        name: 'AllStream',
        component: () => import(/* webpackChunkName: "Index" */ '@/views/AllStream.vue'),
        props: (route) => ({
          routeName: route.name,
        }),
      },
    ],
  },
  {
    path: '/directory/game/:name/',
    component: () => import(/* webpackChunkName: "Game" */ '@/views/Game.vue'),
    props: (route) => ({
      gameName: route.params.name,
    }),
    children: [
      {
        path: '',
        name: 'GameStream',
        component: () => import(/* webpackChunkName: "Game" */ '@/views/GameStream.vue'),
        props: (route) => ({
          routeName: route.name,
        }),
      },
      {
        path: 'cliplist',
        name: 'ClipList',
        component: () => import(/* webpackChunkName: "Game" */ '@/views/ClipList.vue'),
        props: (route) => ({
          routeName: route.name,
          gameName: route.params.name,
        }),
      },
    ],
  },
  {
    path: '/stream/:name',
    name: 'Stream',
    component: () => import(/* webpackChunkName: "Stream" */ '@/views/Stream.vue'),
    props: (route) => ({
      name: route.params.name,
    }),
  },
  {
    path: '/:name/clip/:slug',
    name: 'Clip',
    component: () => import(/* webpackChunkName: "Clip" */ '@/views/Clip.vue'),
    props: (route) => ({
      slug: route.params.slug,
    }),
  },
  {
    path: '/team/:name',
    name: 'Team',
    component: () => import(/* webpackChunkName: "Team" */ '@/views/Team.vue'),
    props: (route) => ({
      name: route.params.name,
    }),
  },
  {
    path: '/search',
    name: 'Search',
    component: () => import(/* webpackChunkName: "Search" */ '@/views/Search.vue'),
    props: (route) => ({
      term: route.query.term,
    }),
    redirect: { name: 'GameDirectory' },
    children: [
      {
        path: 'channels',
        name: 'SearchChannels',
        component: () => import(/* webpackChunkName: "Search" */ '@/views/SearchChannels.vue'),
        beforeEnter(to, from, next) {
          if (!to.query.term) next({ name: 'GameDirectory' });
          else next();
        },
      },
      {
        path: 'categories',
        name: 'SearchCategories',
        component: () => import(/* webpackChunkName: "Search" */ '@/views/SearchCategories.vue'),
        beforeEnter(to, from, next) {
          if (!to.query.term) next({ name: 'GameDirectory' });
          else next();
        },
      },
    ],
  },
  {
    path: '*',
    redirect: { name: 'GameDirectory' },
  },
];

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes,
  scrollBehavior() {
    return { x: 0, y: 0 };
  },
});

export default router;
