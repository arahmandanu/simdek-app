import { createRouter, createWebHistory } from 'vue-router';
import type { RouteRecordRaw } from 'vue-router';

const routes: RouteRecordRaw[] = [
    {
        path: '/',
        name: 'attract',
        component: () => import('../views/AttractView.vue'),
        meta: {
            title: 'Attract Mode - Slideshow',
        },
    },
    {
        path: '/services',
        name: 'services',
        component: () => import('../views/ServicesView.vue'),
        meta: {
            title: 'Services - Pilih Layanan',
        },
    },
];

const router = createRouter({
    history: createWebHistory('/'),
    routes,
});

export default router;
