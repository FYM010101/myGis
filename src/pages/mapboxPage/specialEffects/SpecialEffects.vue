<!--
 * @Author: FYM010101 814116576@qq.com
 * @Date: 2024-05-14 19:46:37
 * @LastEditors: FYM010101 814116576@qq.com
 * @LastEditTime: 2024-07-31 13:41:02
 * @FilePath: \mytest\src\pages\mapboxPage\specialEffects\SpecialEffects.vue
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
-->
<template>
    <div id="map"></div>
</template>

<script>
import mapboxgl from 'mapbox-gl';
import * as THREE from 'three';
import { Threebox } from 'threebox-plugin';

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
        const map = window.map = new mapboxgl.Map({
            container: 'map',
            zoom: 15,
            center: origin,
            style: 'mapbox://styles/mapbox/outdoors-v12',
        });
        const vertexShader = `
            varying vec3 vPosition;
            varying vec2 vUv;
            void main(){
                vUv = uv;
                vec4 viewPosition = viewMatrix * modelMatrix *vec4(position,1);
                gl_Position = projectionMatrix * viewPosition;
                vPosition = position;
            }
            `
        const fragmentShader = `
            varying vec3 vPosition;
            uniform float uHeight;
            varying vec2 vUv;
            uniform float iTime;
            void main(){
                const int zoom = 40;
                const float brightness = 0.975;
                float fScale = 1.25;

                float time = iTime * 1.25;
                vec2 uv = vUv;
                vec2 p  = 1.0 / uv * 2.0;
                // vec2 uv = fragCoord.xy / iResolution.xy;
	            // vec2 p  = (2.0-1.0/uv)/1980.0;
                float ct = (((1.0 + cos(radians(time*5.0))) * 0.5) * 3.0) + 1.1;
                float xBoost = (((1.0 + cos(radians(time*0.2))) * 5.0) * 5.0) + 1.1;
                float yBoost = (((1.0 + cos(radians(time*0.1))) * 10.0) * 5.0) + 1.1;

                fScale = (((1.0 + cos(radians(time*15.5))) * 1.25) * 0.5) + 1.1;

                for(int i=1;i<zoom;i++) {
                    float _i = float(i);
                    vec2 newp=p;
                    newp.x+=0.25/_i*sin(_i*p.y+time*cos(ct)*0.5/20.0+0.005*_i)*fScale+xBoost;		
                    newp.y+=0.25/_i*sin(_i*p.x+time*ct*0.3/40.0+0.03*float(i+15))*fScale+yBoost;
                    p=newp;
                }

                vec3 col=vec3(0.5*sin(3.0*p.x)+0.5,0.5*sin(3.0*p.y)+0.5,sin(p.x+p.y));
                col *= brightness;

                float vigAmt = 5.0;
                float vignette = (1.-vigAmt*(uv.y-.5)*(uv.y-.5))*(1.-vigAmt*(uv.x-.5)*(uv.x-.5));
                float extrusion = (col.x + col.y + col.z) / 4.0;
                extrusion *= 1.5;
                extrusion *= vignette;

                gl_FragColor = vec4(col, extrusion);
                // gl_FragColor = vec4(1.0,1.0,0,1.0);
            }
            `
        
        const shaderMaterial = new THREE.ShaderMaterial({
            vertexShader: vertexShader,
            fragmentShader: fragmentShader,
            transparent: true,
            side: THREE.DoubleSide,
        });

        map.on('load', () => {
            document.getElementsByClassName('mapboxgl-ctrl')[0].style.display = 'none';
            document.getElementsByClassName('mapboxgl-ctrl-attrib-inner')[0].style.display = 'none';

            const customLayer = {
                id: 'lidaLayer',
                type: 'custom',
                renderingMode: '3d',
                onAdd: function (map, mbxContext) {
                    this.map = map;
                    window.tb = new Threebox(
                        map,
                        mbxContext,
                        {
                            defaultLights: true,
                            // enableSelectingFeatures: true, //change this to false to disable fill-extrusion features selection
                            // eableSelectingObjects: true, //change this to false to disable 3D objects selection
                            // enableDraggingObjects: true, //change this to false to disable 3D objects drag & move once selected
                            // enableRotatingObjects: true, //change this to false to disable 3D objects rotation once selected
                            // enableTooltips: true
                        }
                    );
                    // 半球光罩 
                    let cylinderGeom = new THREE.SphereGeometry(10, 32, 32, 0, Math.PI)
                    let lightRingMesh = new THREE.Mesh(cylinderGeom, shaderMaterial);
                    lightRingMesh.rotation.x = -0.5 * Math.PI;
                    lightRingMesh.geometry.computeBoundingBox();
                    shaderMaterial.uniforms.iTime = {
                        value: 1.0
                    }

                    lightRingMesh = window.tb.Object3D({ obj: lightRingMesh, bbox: true, anchor: 'center' })
                        .setCoords([104.072331, 30.664593, 10])
                    window.tb.add(lightRingMesh);
                },
                render: function (gl, matrix) {
                    shaderMaterial.uniforms.iTime.value = performance.now() / 1000;
                    window.tb.update();
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