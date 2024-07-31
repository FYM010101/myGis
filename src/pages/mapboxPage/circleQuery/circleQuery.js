/*
 * @Author: FYM010101 814116576@qq.com
 * @Date: 2023-10-18 15:08:50
 * @LastEditors: FYM010101 814116576@qq.com
 * @LastEditTime: 2024-06-11 16:03:49
 * @FilePath: \mytest\src\pages\mapboxPage\circleQuery\circleQuery.js
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
import mapboxgl from 'mapbox-gl'
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';

import DrawCircle from '@/lib/drawCircle.js'

export default {
    name: "CircleQuery",
    data: function () {
        return {
            drawCircleInstance: null,
            pageName: '画圈查询'
        }
    },
    methods: {
        goBack() {
            console.log('go back');
            this.$router.go(-1);
        },
        drawCircle() {
            console.log('开始画圈');
            // window.mapExt.drawCircleTool.drawCircle([[104.072331, 30.664593], [104.066384, 30.663553]], [500, 300], '#26fcff');
            window.mapExt.drawCircleTool.drawCircle([window.origin, [window.origin[0] + 0.005, window.origin[1]]], [500, 300], '#26fcff');
        },
        clearCircle() {
            console.log('清除画圈');
            window.mapExt.drawCircleTool.clearData();
        }
    },
    mounted() {
        // mapboxgl.accessToken = window.config.mapboxAccessToken;
        function MapExt(map) {
            this.map = map;
            this.drawCircleTool = new DrawCircle(map, mapboxgl);
            this.activeDarwCircle = false;
            this.registEvents();
        }
        MapExt.prototype = {
            registEvents() {
                this.map.on('click', this.clickHandler.bind(this));
                this.map.on('mousemove', this.mousemoveHandler.bind(this));
                this.map.on('mouseenter', 'radiusPointOnCircle', this.mouseenterHandler.bind(this));
                this.map.on('mouseleave', 'radiusPointOnCircle', this.mouseleaveHandler.bind(this));
            },
            clickHandler(event) {
                const point = event.point;
                const width = 10;
                const height = 20;
                const features = this.map.queryRenderedFeatures([
                    [point.x - width / 2, point.y - height / 2],
                    [point.x + width / 2, point.y + height / 2]
                ], { layers: ['radiusPointOnCircle'] });
                if (features[0]) {
                    //点击半径端点时触发编辑圆
                    if (this.activeDarwCircle == false) {
                        this.activeDarwCircle = true;
                        this.currentEditCircleId = features[0].properties.id;//保存当前编辑圆id
                        console.log(this.currentEditCircleId);
                    } else if (this.activeDarwCircle == true) {
                        //结束编辑
                        this.activeDarwCircle = false;
                        //重新设置编辑后的圈数据
                        this.drawCircleTool.editCircleData(this.currentEditCircleId, [event.lngLat.lng, event.lngLat.lat], '#26fcff');
                        //查询所有点位图层数据
                        // let layersForQuery = this.getLayersForQuery();
                        // this.queryTool.queryDataByCircle(layersForQuery, ugisExt.circle.centers, ugisExt.circle.radius);
                    }
                }
            },
            mousemoveHandler(e) {
                if (this.activeDarwCircle) {
                    if (this.map.getLayer('fill')) {
                        let circlePoint = [e.lngLat.lng, e.lngLat.lat];
                        let curId = this.currentEditCircleId;
                        this.drawCircleTool.editCircleData(curId, circlePoint, ['match', ['get', 'id'], curId, 'red', '#26fcff']);
                    }
                }
            },
            mouseleaveHandler() {
                this.map.getCanvas().style.cursor = '';
            },
            mouseenterHandler() {
                this.map.getCanvas().style.cursor = 'pointer';
            },
        }
        // const origin = [104.072331, 30.664593];
        const origin = window.origin = [119.815516, 31.340023];
        const map = window.map = new mapboxgl.Map({

            localIdeographFontFamily: '',
            container: 'map',
            style: {
                version: 8,
                sources: {
                    // 'afterMapSource': {
                    //     "type": "raster",
                    //     "tiles": ['http://10.0.214.28:9090/yxImgTiles_1/{z}/{x}/{y}.png'],
                    //     "tileSize": 256
                    // }
                },
                layers: [
                    // {
                    //     id: 'aMap',
                    //     type: 'raster',
                    //     source: 'afterMapSource',
                    //     paint: {
                    //         "raster-opacity": 1
                    //     },
                    //     layout: {
                    //         visibility: 'visible',
                    //     },
                    // }
                ],
                center: origin,
                zoom: 15,
                // glyphs: "mapbox://fonts/mapbox/{fontstack}/{range}.pbf"
            },
            // zoom: 15,
            // center: origin,
            // style: 'mapbox://styles/mapbox/streets-v11',
        });

        map.on('load', () => {
            // if (document.getElementsByClassName('mapboxgl-control-container')[0]) {
            //     document.getElementsByClassName('mapboxgl-control-container')[0].style.display = 'none';
            // }
            // if (document.getElementsByClassName('mapboxgl-ctrl mapboxgl-ctrl-attrib mapboxgl-attrib-empty')[0]) {
            //     document.getElementsByClassName('mapboxgl-ctrl mapboxgl-ctrl-attrib mapboxgl-attrib-empty')[0].style.display = 'none';
            // }
            window.mapExt = new MapExt(map);
            console.log('>>>地图加载完成')
        })
    }
};