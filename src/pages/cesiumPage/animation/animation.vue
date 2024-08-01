<!--
 * @Author: FYM010101 814116576@qq.com
 * @Date: 2024-08-01 15:05:54
 * @LastEditors: FYM010101 814116576@qq.com
 * @LastEditTime: 2024-08-01 17:42:53
 * @FilePath: \myGis\src\pages\cesiumPage\lineAnimate\animation.vue
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
-->
<template>
    <el-container>
        <el-header style="padding: 5px; height: 35px">
            <el-page-header style="padding: 0px" @back="goBack" :content="pageName">
            </el-page-header>
        </el-header>
        <el-main style="padding: 0px">
            <div id="cesiumContainer"></div>
        </el-main>
        <el-footer style="padding: 0px; display: none"></el-footer>
    </el-container>
</template>
<script>
import * as Cesium from 'cesium'
import 'cesium/Build/Cesium/Widgets/widgets.css'
import lineAnimate from '@/lib/lineAnimateCes';
export default {
    name: "Animation",
    data: function () {
        return {
            pageName: '动画场景'
        }
    },
    methods: {
        goBack() {
            console.log('go back');
            this.$router.go(-1);
        }
    },
    mounted() {
        Cesium.Ion.defaultAccessToken = window.config.cesiumAccessToken;
        const viewer = new Cesium.Viewer('cesiumContainer', {
            timeline: false, // 不显示时间线
            animation: false, // 不显示动画控制
            geocoder: false, // 不显示搜索按钮编码器
            homeButton: false, // 显示初视角按钮
            sceneModePicker: false, // 显示投影方式选择器
            baseLayerPicker: false, // 显示基础图层选择器
            navigationHelpButton: false, // 不显示帮助按钮
            fullscreenButton: false, // 显示全屏按钮
        });
        viewer._cesiumWidget._creditContainer.style.display = "none";
        let position = Cesium.Cartesian3.fromDegrees(104.072331, 30.664593, 5000);
        // viewer.camera.flyTo({
        //     destination: position
        // });
        viewer.camera.setView({
            destination: position,
            orientation: {
                heading: Cesium.Math.toRadians(0.0), // east, default value is 0.0 (north)
                pitch: Cesium.Math.toRadians(-90),    // default value (looking down)
                roll: 0.0                             // default value
            }
        });

        console.log('地图加载完成')
        function action() {
            fetch('http://10.0.212.4:9090/testAnimateLine.geojson').then(res => res.json()).then(data => {

                window.lineAnimate = new lineAnimate(Cesium, viewer, data);
                // window.lineAnimate.createLineAnimate();
            })
        }
        action();

    }
}
</script>

<style></style>