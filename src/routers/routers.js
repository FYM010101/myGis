/*
 * @Author: FYM010101 814116576@qq.com
 * @Date: 2023-10-18 15:20:43
 * @LastEditors: FYM010101 814116576@qq.com
 * @LastEditTime: 2024-06-07 17:52:22
 * @FilePath: \mytest\src\routers\routers.js
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
import Vue from 'vue';
import Router from 'vue-router'

import circleQuery from "@/pages/mapboxPage/circleQuery/CircleQuery.vue";
import homepage from "@/pages/HomePage.vue";
import slider from "@/pages/cesiumPage/slider/Slider.vue";
import examplePage from "@/pages/ExamplePage.vue";
import specialEffects from "@/pages/mapboxPage/specialEffects/SpecialEffects.vue";
import planeExample from "@/pages/planeExample.vue";
import sphereExample from "@/pages/sphereExample.vue";
import pointMove from "@/pages/mapboxPage/pointMove/PointMove.vue"

Vue.use(Router);

export default new Router({
    routes: [
        {
            path: '/',
            component: homepage
        },
        {
            path: '/circleQuery',
            component: circleQuery
        },
        {
            path: '/examplePage',
            component: examplePage
        },
        {
            path: '/slider',
            component: slider
        },
        {
            path: '/specialEffects',
            component: specialEffects
        },
        {
            path: '/planeExample',
            component: planeExample
        },
        {
            path: '/sphereExample',
            component: sphereExample
        },
        {
            path: '/pointMove',
            component: pointMove
        }
        
    ],
    mode: 'history'
})