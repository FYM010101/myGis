/*
 * @Author: FYM010101 814116576@qq.com
 * @Date: 2024-06-11 10:45:55
 * @LastEditors: FYM010101 814116576@qq.com
 * @LastEditTime: 2024-06-11 15:28:05
 * @FilePath: \mytest\src\lib\pointMove.js
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
import CreateLayer from "./creatLayer";
import Interpolation from "./interpolation";
export default class PointMove {
    constructor(map) {
        this.map = map;
        this.interpolation = new Interpolation();
        this.createLayer = new CreateLayer(map);

        this.startTime = new Date();
        this.paths = [];
        this.pathIndex = 0;

        this.pointDisToStart = 0;
        this.speed = 200;//速度（米/秒）
        this.requestAnimation = null;
        this.pointLayer = 'point';
        this.lineLayer = 'line';
        this.serveUrl = 'http://10.0.214.28:8090';
        this.addPointAndLine();
    }
    addPointAndLine() {
        this.createLayer.addMapBoxSource(this.lineLayer, []);
        
        this.createLayer.addMapBoxLayer(this.lineLayer, this.lineLayer, 'line', null, {
            "line-color": '#FF7F50',
            "line-width": 3
        })
        fetch(this.serveUrl + '/line.geojson').then(res => res.json()).then(response => {
            this.map.getSource(this.lineLayer).setData(response);
        })
        this.createLayer.addMapBoxSource(this.pointLayer, []);
        this.createLayer.addMapBoxLayer(this.pointLayer, this.pointLayer, 'symbol', {
            "icon-image": "pointImage",
            "icon-offset": [0, -16]
        })
        this.createLayer.getImagePromise(this.serveUrl + '/image/pointImage.png', 'pointImage');
    }
    startAnimation(lineFeatures) {
        if (lineFeatures.length > 0) {
            this.getPath(lineFeatures);
            this.start();
        }
    }
    start() {
        if(this.requestAnimation) {
            cancelAnimationFrame(this.requestAnimation);
        }
        this.startTime = +new Date();
        this.pointAnimate();
    }
    stop() {
        cancelAnimationFrame(this.requestAnimation);
    }
    /**
     * 动画函数，每帧计算图标的位置
     */
    pointAnimate() {
        if (this.pointDisToStart <= this.paths[this.pathIndex].length) {
            let now = +new Date();
            // let now = this.startTime;
            let deltaTime = (now - this.startTime) / 1000;
            this.startTime = now;

            const res = this.interpolation.along(this.paths[this.pathIndex].data, this.pointDisToStart);
            let coordinates = res.interpolated;
            let geojson = this.createLayer.createGeojson([this.createLayer.getFeature(0, 'Point', null, coordinates)]);
            this.map.getSource(this.pointLayer).setData(geojson);

            this.pointDisToStart += this.speed * deltaTime;
            this.requestAnimation = requestAnimationFrame(this.pointAnimate.bind(this));
        } else {
            if (this.pathIndex === this.paths.length - 1) {
                this.featuresQueried = [];
                this.pathIndex = 0;
                this.pointDisToStart = 0;
                this.start();
            } else {
                this.pathIndex += 1;
                this.pointDisToStart = 0;
                this.start();
            }
        }
    }

    getPath(pathData) {
        pathData.forEach(path => {
            this.paths.push({
                data: path,
                length: this.interpolation.getLength(path)
            })
        })
    }
}
