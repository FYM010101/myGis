<!--
 * @Author: FYM010101 814116576@qq.com
 * @Date: 2024-06-07 17:43:45
 * @LastEditors: FYM010101 814116576@qq.com
 * @LastEditTime: 2024-06-25 14:29:46
 * @FilePath: \mytest\src\pages\mapboxPage\pointMove\PointMove.vue
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
-->
<template>
    <el-container>
        <el-header style="padding: 5px; height: 35px;">
            <el-page-header style="padding:0px" @back="goBack" :content="pageName"> </el-page-header>
        </el-header>
        <el-main style="padding:0px">

            <div id="map"></div>
        </el-main>
        <el-footer style="padding:0px;display:none"></el-footer>
    </el-container>
</template>

<script>
import mapboxgl from 'mapbox-gl'
import PointMove from '@/lib/pointMove';
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import CreateLayer from "@/lib/creatLayer";
export default {
    name: "PointMove",
    data: function () {
        return {
            pageName: '点位移动动画'
        }
    },
    methods: {
        goBack() {
            console.log('go back');
            this.$router.go(-1);
        },
    },
    mounted() {
        mapboxgl.accessToken = window.config.mapboxAccessToken;
        const origin = window.origin = [103.9863540618286, 30.72527204410553];
        const map = window.map = new mapboxgl.Map({
            container: 'map',
            style: 'mapbox://styles/mapbox/outdoors-v12',
            center: origin,
            zoom: 12
        });
        // parameters to ensure the model is georeferenced correctly on the map
        const modelOrigin = [103.9863540618286, 30.72527204410553];
        const modelAltitude = 0;
        const modelRotate = [Math.PI / 2, 0, 0];

        const modelAsMercatorCoordinate = mapboxgl.MercatorCoordinate.fromLngLat(
            modelOrigin,
            modelAltitude
        );

        // transformation parameters to position, rotate and scale the 3D model onto the map
        const modelTransform = {
            translateX: modelAsMercatorCoordinate.x,
            translateY: modelAsMercatorCoordinate.y,
            translateZ: modelAsMercatorCoordinate.z,
            rotateX: modelRotate[0],
            rotateY: modelRotate[1],
            rotateZ: modelRotate[2],
            /* Since the 3D model is in real world meters, a scale transform needs to be
             * applied since the CustomLayerInterface expects units in MercatorCoordinates.
             */
            scale: modelAsMercatorCoordinate.meterInMercatorCoordinateUnits()
        };

        // configuration of the custom layer for a 3D model per the CustomLayerInterface
        const customLayer = {
            id: '3d-model',
            type: 'custom',
            renderingMode: '3d',
            onAdd: function (map, gl) {
                this.camera = new THREE.Camera();
                this.scene = new THREE.Scene();
                // gl.enable(gl.DEPTH_TEST);

                // create two three.js lights to illuminate the model
                const directionalLight = new THREE.DirectionalLight(0xffffff);
                directionalLight.position.set(0, -70, 100).normalize();
                this.scene.add(directionalLight);

                const directionalLight2 = new THREE.DirectionalLight(0xffffff);
                directionalLight2.position.set(0, 70, 100).normalize();
                this.scene.add(directionalLight2);

                // use the three.js GLTF loader to add the 3D model to the three.js scene
                const loader = new GLTFLoader();
                loader.load(
                    'https://docs.mapbox.com/mapbox-gl-js/assets/34M_17/34M_17.gltf',
                    (gltf) => {
                        this.scene.add(gltf.scene);
                    }
                );
                this.map = map;

                // use the Mapbox GL JS map canvas for three.js
                this.renderer = new THREE.WebGLRenderer({
                    canvas: map.getCanvas(),
                    context: gl,
                    antialias: true
                });

                this.renderer.autoClear = false;
            },
            render: function (gl, matrix) {
                // gl.enable(gl.DEPTH_TEST);
                const rotationX = new THREE.Matrix4().makeRotationAxis(
                    new THREE.Vector3(1, 0, 0),
                    modelTransform.rotateX
                );
                const rotationY = new THREE.Matrix4().makeRotationAxis(
                    new THREE.Vector3(0, 1, 0),
                    modelTransform.rotateY
                );
                const rotationZ = new THREE.Matrix4().makeRotationAxis(
                    new THREE.Vector3(0, 0, 1),
                    modelTransform.rotateZ
                );

                const m = new THREE.Matrix4().fromArray(matrix);
                const l = new THREE.Matrix4()
                    .makeTranslation(
                        modelTransform.translateX,
                        modelTransform.translateY,
                        modelTransform.translateZ
                    )
                    .scale(
                        new THREE.Vector3(
                            modelTransform.scale,
                            -modelTransform.scale,
                            modelTransform.scale
                        )
                    )
                    .multiply(rotationX)
                    .multiply(rotationY)
                    .multiply(rotationZ);

                this.camera.projectionMatrix = m.multiply(l);
                this.renderer.resetState();
                this.renderer.render(this.scene, this.camera);
                this.map.triggerRepaint();
            }
        };

        map.on('load', function () {
            // window.pointMove = new PointMove(map);
            console.log('>>>地图加载完成', this)
            // map.addLayer(customLayer, 'point');
            const createLayer = new CreateLayer(map);
            // fetch('http://10.0.214.72:8090/points.geojson').then(res => res.json()).then(data => {
            //     map.addSource('pointsSource', {
            //         data: data,
            //         type: 'geojson'
            //     })
            //     createLayer.addMapBoxLayer('pointsSource', 'points', 'circle', null, {
            //         'circle-color': ['match', ['get', 'code'], '1', 'red', '2', 'green', '3', 'blue', 'white'],
            //         'circle-radius': 30
            //     })
            //     createLayer.getImagePromise('http://10.0.214.72:8090/image/pointImage.png', 'pointImage');
            //     let source = map.getSource('pointsSource');
            //     let testFeature = source._data.features[0];
            //     source._data.features.push(testFeature);
            //     source.setData(source._data);
            // })
        })

    }
};
</script>

<style>
.el-container {
    position: relative;
    width: 100%;
    height: 100%;
}

#map {
    position: relative;
    width: 100%;
    height: 100%;
}

.el-main {
    position: relative;
    width: 100%;
    height: 100%;
}

.el-header {
    background-color: rgb(238, 241, 246)
}

.mapboxgl-ctrl {
    display: none !important
}

.mapboxgl-canary {
    display: none !important
}
</style>
