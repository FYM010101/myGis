<template>
    <div id="map"></div>
</template>

<script>
import mapboxgl from 'mapbox-gl'
import * as THREE from 'three';
const CameraSync = require("@/utils/CameraSync.js");
var Constants = require("@/utils/constants.js");
var utils = require("@/utils/utils.js");

export default {
    name: "SpecialEffects",
    data: function () {
        return {

        }
    },
    methods: {

    },
    mounted() {
        mapboxgl.accessToken = window.config.mapboxAccessToken;
        const origin = [104.072331, 30.664593];
        // const style = {
        //     version: 8,
        //     sources: {
        //     },
        //     layers: [
        //     ],
        //     center: origin,
        //     zoom: 15,
        //     // glyphs: "mapbox://fonts/mapbox/{fontstack}/{range}.pbf"
        // }
        const map = window.map = new mapboxgl.Map({
            container: 'map',
            zoom: 15,
            center: origin,
            style: 'mapbox://styles/mapbox/outdoors-v12',
        });
        // 当前圆柱体地理位置，及展示在three.js所需参数
        // let modelOrigin = origin;
        // let modelAltitude = 0;
        // let modelRotate = [0, 0, 0];
        // let mercatorCoordinate = mapboxgl.MercatorCoordinate.fromLngLat(modelOrigin, modelAltitude);
        // let modelTransform = {
        //     translateX: mercatorCoordinate.x,
        //     translateY: mercatorCoordinate.y,
        //     translateZ: mercatorCoordinate.z,
        //     rotateX: modelRotate[0],
        //     rotateY: modelRotate[1],
        //     rotateZ: modelRotate[2],
        //     scale: mercatorCoordinate.meterInMercatorCoordinateUnits()
        // };
        const vertexShader = `
            varying vec2 vUv;
            
            void main()	{

                vUv = uv;

                gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);

            }
        `
        const fragmentShader = `
            varying vec2 vUv;
            uniform float time;
            #define PI 3.14159265359
            void main() {
                vec2 uv =vUv-0.5;
                vec3 color = vec3(0.0, 0.2, 0.4);
                float alpha = 0.0;
            
                float radius = length(uv); // 计算从中心到当前像素的距离
                float angle = atan(uv.y, uv.x); // 计算角度（从 -π 到 π）
                float rotationSpeed = PI * 2.0 / 2.0; 

                // Adjust angles for three sectors with rotation
                float adjustedAngle1 = mod(angle - rotationSpeed * time, PI * 2.0);
                float adjustedAngle2 = mod(angle - rotationSpeed * time - PI * 2.0 / 3.0, PI * 2.0);
                float adjustedAngle3 = mod(angle - rotationSpeed * time - PI * 4.0 / 3.0, PI * 2.0);
                
                // 绘制线
                float lineWidth = 0.002;
                if (abs(radius - 0.2) < lineWidth ) {
                    color = vec3(1.0, 0.76, 0.3); // Color for the circles
                    alpha = 1.0; // Opaque circles
                }
                
                if( abs(radius - 0.35) < lineWidth){
                     color = vec3(0.3, 1.0, 0.78); // Color for the circles
                    alpha = 1.0; // Opaque circles
                }
                if( abs(radius - 0.5) < lineWidth){
                     color = vec3(0.35, 0.7, 1.0); // Color for the circles
                    alpha = 1.0; // Opaque circles
                }

                // 绘制扇形
                if (radius < 0.5) {
                    if (radius < 0.5 && adjustedAngle3 < PI) {
                        color += mix(vec3(0.0), vec3(0.35, 0.7, 1.0), adjustedAngle3 / PI) * 0.8;
                        alpha += 0.5;
                    }
                    
                    if (radius < 0.35 && adjustedAngle2 < PI) {
                        color += mix(vec3(0.0), vec3(0.3, 1.0, 0.78), adjustedAngle2 / PI) *  .8;
                        alpha += 0.5;
                    }
                    
                    if (radius < 0.2 && adjustedAngle1 < PI) {
                        color += mix(vec3(0.0), vec3(1.0, 0.76, 0.3), adjustedAngle1 / PI) *   0.8;
                        alpha += 0.5;
                    }
                } else {
                    if(radius>0.501){
                        discard;
                    }
                }
            
                // alpha = min(alpha, 1.0);
                gl_FragColor = vec4(color, 0.7);
            }
        `
        // window.constants = Constants;
        let scene = new THREE.Scene();
        let world = new THREE.Group();
        world.name = "world";
        scene.add(world);

        function setObjectsScale() {
            world.children.filter(o => (o.fixedZoom != null)).forEach((o) => { o.setObjectScale(map.transform.scale); });
        }
        function makeGroup (obj, options) {
            let projScaleGroup = new THREE.Group();
            projScaleGroup.name = "scaleGroup";
            projScaleGroup.add(obj)

            var geoGroup = new THREE.Group();
            geoGroup.userData = options || {};
            geoGroup.userData.isGeoGroup = true;
            if (geoGroup.userData.feature) {
                geoGroup.userData.feature.properties.uuid = geoGroup.uuid;
            }
            var isArrayOfObjects = projScaleGroup.length;
            if (isArrayOfObjects) for (o of projScaleGroup) geoGroup.add(o)
            else geoGroup.add(projScaleGroup);

            //utils._flipMaterialSides(projScaleGroup);
            geoGroup.name = "threeboxObject";

            return geoGroup
        }
        map.on('style.load', function () {
            this.once('idle', () => {
                setObjectsScale();
            });
        });

        map.on('load', () => {
            document.getElementsByClassName('mapboxgl-ctrl')[0].style.display = 'none';
            document.getElementsByClassName('mapboxgl-ctrl-attrib-inner')[0].style.display = 'none';

            map.on('zoom', () => {
                setObjectsScale();
            });
            // configuration of the custom layer for a 3D model per the CustomLayerInterface
            const customLayer = {
                id: 'lidaLayer',
                type: 'custom',
                renderingMode: '3d',
                onAdd: function (map, gl) {
                    this.map = map;
                    this.scene = scene;

                    const h = this.map.getCanvas().clientHeight;
                    const w = this.map.getCanvas().clientWidth;
                    this.map.transform.fov = Constants.FOV_DEGREES;
                    this.camera = new THREE.PerspectiveCamera(map.transform.fov, w / h, 0.1, 1e21);
                    this.camera.layers.enable(0);
                    this.camera.layers.enable(1);

                    let cameraSync = new CameraSync(this.map, this.camera, this.world);
                    this.map.repaint = true; // repaint the map
                    // 创建光线
                    // var directionalLight = new THREE.DirectionalLight(0xffffff);
                    // directionalLight.position.set(0, -50, 100).normalize();
                    // this.scene.add(directionalLight);
                    // const geometry = new THREE.SphereGeometry(50, 32, 16);
                    const geometry = new THREE.CircleGeometry(10000, 32);

                    this.uniforms = {
                        time: { value: 1.0 }
                    }

                    const material = new THREE.ShaderMaterial({
                        uniforms: this.uniforms,
                        vertexShader: vertexShader,
                        fragmentShader: fragmentShader,
                        transparent: true,
                        side: THREE.DoubleSide,
                        depthWrite: false,
                    });
                    // const material = new THREE.MeshBasicMaterial({ color: 'red', side: THREE.DoubleSide })

                    let mesh = new THREE.Mesh(geometry, material);
                    // let geoGroup = makeGroup(mesh);
                    // if (obj.userData.topMargin && obj.userData.feature) {
                    //     lnglat[2] += ((obj.userData.feature.properties.height || 0) - (obj.userData.feature.properties.base_height || obj.userData.feature.properties.min_height || 0)) * (obj.userData.topMargin || 0);
                    // }

                    // mesh.coordinates = origin;
                    mesh.position.set(utils.projectToWorld(origin));
                    console.log(utils.projectToWorld(origin));

                    this.scene.add(mesh);

                    // use the Mapbox GL JS map canvas for three.js
                    this.renderer = new THREE.WebGLRenderer({
                        canvas: map.getCanvas(),
                        context: gl,
                        antialias: true,
                        alpha: true,
                        preserveDrawingBuffer: false
                    });
                    // this.renderer.setPixelRatio(window.devicePixelRatio);
                    // this.renderer.setSize(this.map.getCanvas().clientWidth, this.map.getCanvas().clientHeight);
                    // this.renderer.outputEncoding = THREE.sRGBEncoding;
                    this.renderer.autoClear = false;
                },
                render: function (gl, matrix) {
                    // const rotationX = new THREE.Matrix4().makeRotationAxis(
                    //     new THREE.Vector3(1, 0, 0),
                    //     modelTransform.rotateX
                    // );
                    // const rotationY = new THREE.Matrix4().makeRotationAxis(
                    //     new THREE.Vector3(0, 1, 0),
                    //     modelTransform.rotateY
                    // );
                    // const rotationZ = new THREE.Matrix4().makeRotationAxis(
                    //     new THREE.Vector3(0, 0, 1),
                    //     modelTransform.rotateZ
                    // );

                    // const m = new THREE.Matrix4().fromArray(matrix);
                    // const l = new THREE.Matrix4()
                    //     .makeTranslation(
                    //         modelTransform.translateX,
                    //         modelTransform.translateY,
                    //         modelTransform.translateZ
                    //     )
                    //     .scale(
                    //         new THREE.Vector3(
                    //             modelTransform.scale,
                    //             -modelTransform.scale,
                    //             modelTransform.scale
                    //         )
                    //     )
                    //     .multiply(rotationX)
                    //     .multiply(rotationY)
                    //     .multiply(rotationZ);
                    this.map.repaint = false;
                    this.uniforms.time.value = performance.now() / 1000;
                    // this.camera.projectionMatrix.elements = matrix;
                    // this.camera.projectionMatrix = m.multiply(l);
                    this.renderer.resetState();
                    this.renderer.render(this.scene, this.camera);
                    this.map.triggerRepaint();
                }
            };
            map.addLayer(customLayer);
            console.log('>>>地图加载完成')


        })
    }
};
</script>

<style>
#map {
    position: absolute;
    width: 100%;
    height: 100%;
}
</style>