import { centerImage } from "./canvasSymbol.js";
import CreateLayer from "./creatLayer.js";

export default class DrawCircle {
    constructor(map, mapboxgl) {
        this.map = map;
        this.createLayer = new CreateLayer(map);
        this.active = false;
        this.c = 40075000;
        this.MercatorCoordinate = mapboxgl.MercatorCoordinate;

        this.circleLayerId = []
        this.circleSourceId = [];
        this.circleCoordinates = [];
        this.circleFeatures = null;

        this.circle = {
            centers: [],
            radius: [],
            radiusPointFeature: null,
        };
        this.activeOpt = {
            'darwCircle': false,    
            'addCircleByClick': false,
            'addCircleByMouseMove': false
        }
    }

    drawCircle(centers, radius, color) {
        this.clearData();
        this.circle.centers = centers;
        this.circle.radius = radius;

        this.circleLayerId = ['fill', 'line', 'radiusLine', 'radiusLineLable', 'radiusPointOnCircle', 'centerPoint'];
        this.circleSourceId = ['fillSource', 'lineSource', 'radiusLineSource', 'radiusPointSource', 'centerSource'];
        let circleDatas = [];
        centers.forEach((center, i) => {
            let features = this.getCircleFeatures(center, radius[i]);
            features.forEach(feature => {
                feature.properties.id = i;
            })
            circleDatas.push(features);
        })
        let fillFeatures = [], lineFeatures = [], radiusLineFeatures = [], radiusPointFeatures = [], centerPointFeatures = [];
        circleDatas.forEach(data => {
            fillFeatures.push(data[0]);
            lineFeatures.push(data[1]);
            radiusLineFeatures.push(data[2]);
            radiusPointFeatures.push(data[3]);
            centerPointFeatures.push(data[4])
        })
        if (!this.circleFeatures) {
            this.circleFeatures = [
                fillFeatures,
                lineFeatures,
                radiusLineFeatures,
                radiusPointFeatures,
                centerPointFeatures
            ]
        }
        //加载圈图层
        this.createLayer.addMapBoxSource(this.circleSourceId[0], fillFeatures);
        this.createLayer.addMapBoxSource(this.circleSourceId[1], lineFeatures);

        this.createLayer.addMapBoxLayer(this.circleSourceId[0], this.circleLayerId[0], 'fill', null, {
            "fill-color": color,
            "fill-opacity": 0.3
        });
        this.createLayer.addMapBoxLayer(this.circleSourceId[1], this.circleLayerId[1], 'line', null, {
            "line-color": color,
            "line-width": 3
        });

        //加载半径标注图层
        this.createLayer.addMapBoxSource(this.circleSourceId[2], radiusLineFeatures);

        this.createLayer.addMapBoxLayer(this.circleSourceId[2], this.circleLayerId[2], 'line', null, {
            "line-color": "#ffffff",
            "line-width": 3
        })
        this.createLayer.addMapBoxLayer(this.circleSourceId[2], this.circleLayerId[3], 'symbol', {
            'symbol-placement': 'line-center',
            'text-field': ['get', 'radius'],
            // "text-font": ['Microsoft YaHei Regular'],
            "text-size": 22,
            'text-anchor': 'bottom',
        }, {
            "text-color": "#ffffff",
            "text-halo-blur": 0.5,
            "text-halo-color": "#ffffff",
            "text-halo-width": 1.5
        })
        //添加半径端点图层
        this.createLayer.addMapBoxSource(this.circleSourceId[3], radiusPointFeatures);
        this.createLayer.addMapBoxLayer(this.circleSourceId[3], this.circleLayerId[4], 'circle', null, {
            "circle-color": "#ffffff",
            "circle-radius": 6,
            // "circle-blur": 2
            "circle-stroke-color": "#696969",
            "circle-stroke-width": 2
        })
        //添加中心点图层
        centerImage.map = this.map;
        if(!this.map.hasImage('center')){
            this.map.addImage('center', centerImage, { pixelRatio: 2 });
        }
        this.createLayer.addMapBoxSource(this.circleSourceId[4], centerPointFeatures);
        this.createLayer.addMapBoxLayer(this.circleSourceId[4], this.circleLayerId[5], 'symbol', {
            "icon-image": "center",
            "icon-offset": [0, -16]
        })
    }
    addCircleFeature(center, radius) {

    }

    getCircleFeatures(center, radius) {
        let coordinates = this.getCircleCoordinates(center, radius);
        this.circleCoordinates = coordinates;

        let circleLineFeature = this.createLayer.getFeature(null, 'LineString', null, coordinates);
        let circleFillFeature = this.createLayer.getFeature(null, 'Polygon', null, [coordinates]);

        let radiusNumber = radius / 1000, radiusLineText;
        if (radiusNumber < 1) {
            radiusLineText = (radius / 1000).toFixed(2) + ' 千米';
        } else {
            radiusLineText = Math.round(radius / 1000) + ' 千米';
        }

        let radiusPoint = this.getRadiusCoordinate(center, radius);

        let radiusLineFeature = this.createLayer.getFeature(null, 'LineString', {
            'radius': radiusLineText
        }, [center, radiusPoint]);

        let radiusPointFeature = this.createLayer.getFeature(0, 'Point', null, radiusPoint);
        let centerPointFeature = this.createLayer.getFeature(0, 'Point', null, center);

        return [circleFillFeature, circleLineFeature, radiusLineFeature, radiusPointFeature, centerPointFeature];
    }

    getRadiusCoordinate(center, radius) {
        let mercatorCenter = this.lngLatToMercator(center);
        let radiusPointx = mercatorCenter[0] + radius;
        let levelPoint = this.mercatorToLngLat([radiusPointx, mercatorCenter[1]]);
        return levelPoint;
    }

    getCircleCoordinates(center, radius) {
        let i, angle, x, y;
        let size = 100;
        let coordinates = [];
        let mercatorCenter = this.lngLatToMercator(center);
        for (i = 0; i <= size; i++) {
            angle = i / size * Math.PI * 2;
            x = mercatorCenter[0] + radius * Math.sin(angle);
            y = mercatorCenter[1] + radius * Math.cos(angle);

            let lngLatCoord = this.mercatorToLngLat([x, y]);
            coordinates.push(lngLatCoord);
        }
        return coordinates;
    }

    getRadius(center, endPoint) {
        let end = this.lngLatToMercator(endPoint),
            endx = end[0],
            endy = end[1];
        let cen = this.lngLatToMercator(center),
            centerx = cen[0],
            centery = cen[1];
        let radius = Math.sqrt(
            Math.pow(endx - centerx, 2) +
            Math.pow(endy - centery, 2)
        );
        return radius;
    }

    lngLatToMercator(point) {
        const mercator = this.MercatorCoordinate.fromLngLat({ lng: point[0], lat: point[1] }, 0);
        return [(mercator.x - 0.5) * this.c, (0.5 - mercator.y) * this.c];
    }
    mercatorToLngLat(coord) {
        const [x, y] = coord;
        return new this.MercatorCoordinate((x + this.c / 2) / this.c,
            (this.c / 2 - y) / this.c).toLngLat().toArray();
    }
    clearData() {
        if (this.circleLayerId.length > 0) {
            this.circleLayerId.forEach(id => {
                this.map.removeLayer(id);
            })
            this.circleLayerId = [];
        }
        if (this.circleSourceId.length > 0) {
            this.circleSourceId.forEach(id => {
                this.map.removeSource(id);
            })
            this.circleSourceId = [];
        }
    }
    editCircleData(curId, circlePoint, colorFilter) {

        let center = this.circle.centers[curId];
        let radius = this.getRadius(center, circlePoint);
        this.circle.radius[curId] = radius;
        //获取当前编辑状态圆数据
        let circleFeatures = this.getCircleFeatures(center, radius);
        circleFeatures.forEach(f => {
            f.properties.id = curId;
        })
        this.circleFeatures.forEach((feature, i) => {
            feature[curId] = circleFeatures[i];
        })
        this.setCircleData(this.circleFeatures);
        this.circle.radiusPointFeature = this.circleFeatures[3];
        //设置圆圈颜色为未编辑状态
        this.map.setPaintProperty('fill', 'fill-color', colorFilter);
        this.map.setPaintProperty('line', 'line-color', colorFilter);
    }
    //设置圆相关的数据源
    setCircleData(circleFeatures) {
        this.circleSourceId.forEach((id, index) => {
            this.createLayer.setMbxmapData(id, circleFeatures[index]);
        })
    }
}