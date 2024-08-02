/*
 * @Author: FYM010101 814116576@qq.com
 * @Date: 2024-08-01 15:53:18
 * @LastEditors: FYM010101 814116576@qq.com
 * @LastEditTime: 2024-08-02 11:48:03
 * @FilePath: \myGis\src\lib\lineAnimateCes.js
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
import Interpolation from "./interpolation";
import CreateLayer from "./creatLayer";
export default class LineAnimate {
    constructor(Cesium, cesiumViewer, lineGeojson) {
        this.Cesium = Cesium;
        this.viewer = cesiumViewer;
        this.lineGeojson = lineGeojson;
        this.scene = this.viewer.scene;
        this.startTime = +new Date();
        this.speed = 100;
        this.pathIndex = 0;
        this.pointDisToStart = 0;
        this.active = false;
        this.positions = [];
        this.paths = [];
        this.interpolation = new Interpolation();
        this.createLayer = new CreateLayer();
        this.addPolyline();
    }
    createLineAnimate() {
        // this.addPolyline();
        this.lineFeatures = this.reformFeature(this.lineGeojson.features[0].geometry);
        this.getPath(this.lineFeatures);
        // this.polyLine.polyline.positions._value = [this.positions[0]]
        this.active = true;
        this.start();
    }
    addPolyline() {
        const thiz = this;
        //处理数据positions
        this.lineGeojson.features[0].geometry.coordinates[0].forEach(coord => {
            let position = this.Cesium.Cartesian3.fromDegrees(...coord);
            this.positions.push(position);
        })
        // 创建一条线条
        this.positionsValue = [this.positions[0], this.positions[0]];
        this.polyLine = this.viewer.entities.add({
            polyline: {
                positions: new this.Cesium.CallbackProperty(function () {
                    return [thiz.positions[0], thiz.positions[0]];
                }, false),
                width: 5,
                material: this.Cesium.Color.RED,
            },
        });
        // this.polyLine.polyLine.positions._value.push(this.positions[0]);
        // let polylineInstance = new this.Cesium.GeometryInstance({//创建几何体实例
        //     geometry: new this.Cesium.PolylineGeometry({//创建几何体
        //         positions: [this.positions[0], this.positions[0]],//fromDegreesArrayHeights
        //         width: 5.0,
        //         vertexFormat: this.Cesium.PolylineMaterialAppearance.VERTEX_FORMAT
        //     }),
        //     attributes: {
        //         color: this.Cesium.ColorGeometryInstanceAttribute.fromColor(this.Cesium.Color.RED),//设置颜色 
        //         show: new this.Cesium.ShowGeometryInstanceAttribute(true)//显示 
        //     },
        // })
        // this.polylinePrimitive = new this.Cesium.Primitive({//实例化primitive,便于控制显示隐藏
        //     geometryInstances: polylineInstance,
        //     appearance: new this.Cesium.PolylineColorAppearance({ translucent: false }),
        //     show: true,
        //     releaseGeometryInstances: false
        // });
        // this.scene.primitives.add(this.polylinePrimitive);
    }
    getPath(pathData) {
        pathData.forEach(path => {
            this.paths.push({
                data: path,
                length: this.interpolation.getLength(path)
            })
        })
    }
    //每帧执行动画函数
    // start() {
    //     const thiz = this;
    //     this.startTime = +new Date();
    //     this.scene.postRender.addEventListener(function () {
    //         if (thiz.active) {
    //             thiz.animate();
    //         }
    //     });
    // }
    start() {
        this.startTime = +new Date();
        // requestAnimationFrame(this.animate.bind(this));
        setInterval(() => {
            this.animate();

        }, 200);
    }
    animate() {
        if (this.pointDisToStart <= this.paths[this.pathIndex].length) {
            let now = +new Date();//获取当前时间

            let deltaTime = (now - this.startTime) / 1000;//计算时间间隔

            this.startTime = now;
            const res = this.interpolation.along(this.paths[this.pathIndex].data, this.pointDisToStart);
            let coordinates = this.Cesium.Cartesian3.fromDegrees(
                res.interpolated[0],
                res.interpolated[1]
            );
            //累加距离起点的距离
            this.pointDisToStart += this.speed * deltaTime;

            //设置当前帧路线数据
            // console.log(positionsValue);
            this.positionsValue[this.pathIndex + 1] = coordinates;
            // if (this.polyLine) {
            //     this.viewer.entities.remove(this.polyLine);
            // }
            // // 创建一条线条
            // this.polyLine = this.viewer.entities.add({
            //     polyline: {
            //         positions: positionsValue,
            //         width: 5,
            //         material: this.Cesium.Color.RED,
            //     },
            // });
            this.polyLine.polyline.positions = this.positionsValue;
            // this.polylinePrimitive.geometryInstances.geometry._positions = this.positionsValue;
            // this.polylinePrimitive.geometryInstances = new this.Cesium.GeometryInstance({//创建几何体实例
            //     geometry: new this.Cesium.PolylineGeometry({//创建几何体
            //         positions: this.positionsValue,//fromDegreesArrayHeights
            //         width: 5.0,
            //         vertexFormat: this.Cesium.PolylineMaterialAppearance.VERTEX_FORMAT
            //     }),
            //     attributes: {
            //         color: this.Cesium.ColorGeometryInstanceAttribute.fromColor(this.Cesium.Color.RED),//设置颜色 
            //         show: new this.Cesium.ShowGeometryInstanceAttribute(true)//显示 
            //     },
            // })
            // this.viewer.resize();
            // this.viewer.render();
            // this.scene.requestRender();
            // this.positionsValue = this.polyLine.polyline.positions._value;
            // requestAnimationFrame(this.animate.bind(this));
        } else {
            if (this.pathIndex === this.paths.length - 1) {
                //人员动画结束时，初始化动画参数
                this.pathIndex = 0;
                this.pointDisToStart = 0;
                this.viewer.entities.remove(this.polyLine);
                this.addPolyline()
            } else {
                this.pathIndex += 1;
                this.pointDisToStart = 0;
                // requestAnimationFrame(this.animate.bind(this));
            }
        }
    }
    reformFeature(geometry) {
        let coords = geometry.coordinates[0];
        if (coords.length === 1) {
            coords[1] = coords[0];
        }
        let features = [];
        for (let i = 0; i < coords.length - 1; i++) {
            features.push(this.createLayer.getFeature(i, 'LineString', null, [coords[i], coords[i + 1]]));
        }
        return features;
    }
}