import * as Cesium from 'cesium'
import 'cesium/Build/Cesium/Widgets/widgets.css'
export default {
    name: "Slider",
    data: function () {
        return {
            pageName: '卷帘分析'
        }
    },
    methods: {
        goBack() {
            console.log('go back');
            this.$router.go(-1);
        },
        openSlider() {
            cesiumExt.setSliderDisplay();
        },
        closeSlider(direction) {
            cesiumExt.closeMapCompare(direction);
        }
    },
    mounted() {
        // Cesium.Ion.defaultAccessToken = window.config.cesiumAccessToken;
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
        let position = Cesium.Cartesian3.fromDegrees(119.815516, 31.340023, 5000);
        // viewer.camera.flyTo({
        //     destination: position
        // });
        viewer.camera.setView({
            destination: position,
            orientation: {
                heading : Cesium.Math.toRadians(90.0), // east, default value is 0.0 (north)
                pitch : Cesium.Math.toRadians(-90),    // default value (looking down)
                roll : 0.0                             // default value
            }
        });

        class CesiumExt {
            constructor() {
                this.viewer = viewer;
                this.scene = viewer.scene;

                this.resultImageName = [];
                this.baseUrl = 'http://10.0.214.28:9090/';
                this.imageOpt = {
                    'baseImage': {//影像底图
                        show: false,
                        url: 'yxImgTiles_20230602/{z}/{x}/{y}.png',
                        imageLayer: null
                    },
                    'codImage': {//化学需氧量
                        show: false,
                        url: 'result_CODTiles/{z}/{x}/{y}.png',
                        imageLayer: null
                    },
                    'tnImage': {//总氮
                        show: false,
                        url: 'result_TNTiles/{z}/{x}/{y}.png',
                        imageLayer: null
                    },
                    'tpImage': {//总磷
                        show: false,
                        url: 'result_TPTiles/{z}/{x}/{y}.png',
                        imageLayer: null
                    }
                }
                this.sliderImageOpt = {
                    'yxImgTiles_1': this.baseUrl + 'yxImgTiles_1/{z}/{x}/{y}.png',
                    'yxImgTiles_2': this.baseUrl + 'yxImgTiles_2/{z}/{x}/{y}.png'
                }
                this.addSliderControl();
                this.addWaterQualityImage();
                this.addMapCompare();
            }
            addSliderControl() {
                let sliderStyle = document.createElement("style");
                sliderStyle.id = "slider-style";
                sliderStyle.innerHTML =
                    `
                    #slider {
                        position: absolute;
                        left: 50%;
                        top: 0px;
                        background-color: #d3d3d3;
                        width: 5px;
                        height: 100%;
                        z-index: 9999;
                    }
        
                    #slider:hover {
                        cursor: ew-resize;
                    }}`;
                document.querySelector("body").appendChild(sliderStyle);
            }
            switchoverImage(imageKey, direction) {
                const layers = this.viewer.imageryLayers;
                const image = new Cesium.UrlTemplateImageryProvider({
                    url: this.sliderImageOpt[imageKey],
                });
                if (direction === 'left') {
                    if (this.leftImageLayer) {
                        layers.remove(this.leftImageLayer);
                    }
                    this.leftImageLayer = layers.addImageryProvider(image);
                    this.leftImageLayer.splitDirection = -1;
                } else if (direction === 'right') {
                    if (this.rightImageLayer) {
                        layers.remove(this.rightImageLayer);
                    }
                    this.rightImageLayer = layers.addImageryProvider(image);
                    this.rightImageLayer.splitDirection = 1;
                }
            }
            closeMapCompare(direction) {
                this.slider.style.display = 'none';
                if (direction === 'right') {
                    this.slider.style.left = `0%`;
                    this.scene.splitPosition = 0;
                } else if (direction === 'left') {
                    this.slider.style.left = `100%`;
                    this.scene.splitPosition = 1;
                }
            }
            addMapCompare() {
                const thiz = this;
                const layers = this.viewer.imageryLayers;

                const sliderImageName = Object.keys(this.sliderImageOpt);

                const leftImage = new Cesium.UrlTemplateImageryProvider({
                    url: this.sliderImageOpt[sliderImageName[0]],
                });
                this.leftImageLayer = layers.addImageryProvider(leftImage);
                this.leftImageLayer.splitDirection = -1;

                const rightImage = new Cesium.UrlTemplateImageryProvider({
                    url: this.sliderImageOpt[sliderImageName[1]],
                });
                this.rightImageLayer = layers.addImageryProvider(rightImage);
                this.rightImageLayer.splitDirection = 1;

                // 找到父容器
                const cesiumContainer = document.getElementsByClassName('cesium-viewer')[0];

                // 创建一个新的子容器
                this.slider = document.createElement('div');
                this.slider.id = 'slider';
                this.slider.style.display = 'none';

                // 将子容器添加到父容器中
                cesiumContainer.appendChild(this.slider);

                this.scene.splitPosition = this.slider.offsetLeft / this.slider.parentElement.offsetWidth;

                const handler = new Cesium.ScreenSpaceEventHandler(this.slider);

                this.moveActive = false;

                handler.setInputAction(function () {
                    thiz.moveActive = true;
                }, Cesium.ScreenSpaceEventType.LEFT_DOWN);
                handler.setInputAction(function () {
                    thiz.moveActive = true;
                }, Cesium.ScreenSpaceEventType.PINCH_START);

                handler.setInputAction(this.move.bind(this), Cesium.ScreenSpaceEventType.MOUSE_MOVE);
                handler.setInputAction(this.move.bind(this), Cesium.ScreenSpaceEventType.PINCH_MOVE);

                handler.setInputAction(function () {
                    thiz.moveActive = false;
                }, Cesium.ScreenSpaceEventType.LEFT_UP);
                handler.setInputAction(function () {
                    thiz.moveActive = false;
                }, Cesium.ScreenSpaceEventType.PINCH_END);
            }
            move(movement) {
                if (!this.moveActive) {
                    return;
                }
                const relativeOffset = movement.endPosition.x;
                const imagerySplitPosition =
                    (this.slider.offsetLeft + relativeOffset) /
                    this.slider.parentElement.offsetWidth;
                this.slider.style.left = `${100.0 * imagerySplitPosition}%`;
                this.scene.splitPosition = imagerySplitPosition;
            }
            setSliderDisplay() {
                if (this.slider.style.display === 'none') {
                    this.slider.style.display = 'block';
                    this.slider.style.left = `50%`;
                    this.scene.splitPosition = 0.5;
                    this.leftImageLayer.show = true;
                    this.rightImageLayer.show = true;
                    const waterImageName = Object.keys(this.imageOpt);
                    this.setImageLayersShow(waterImageName, false);
                }
            }
            addWaterQualityImage() {
                for (let imageName in this.imageOpt) {
                    const opt = this.imageOpt[imageName];
                    this.imageOpt[imageName].imageLayer = this.addmageTiles(this.baseUrl + opt.url, opt.show);
                    if (imageName != 'baseImage') {
                        this.resultImageName.push(imageName);
                    }
                }
            }
            addmageTiles(url, show) {
                const layers = this.viewer.imageryLayers;

                const image = new Cesium.UrlTemplateImageryProvider({
                    url,
                });
                const imageLayer = layers.addImageryProvider(image);
                imageLayer.show = show;
                return imageLayer;
            }
            setImageLayersShow(imageNames, show) {
                imageNames.forEach(name => {
                    let imageLayer = this.imageOpt[name].imageLayer;
                    if (imageLayer) {
                        imageLayer.show = show;
                    }
                })
            }
            showResultTilesByName(name) {
                const waterImageName = Object.keys(this.imageOpt);
                this.setImageLayersShow(waterImageName, false);
                this.setImageLayersShow(['baseImage', name], true);

                if (this.rightImageLayer.show || this.leftImageLayer.show || this.slider.style.display === 'block') {
                    this.slider.style.display = 'none';
                    this.slider.style.left = `0%`;
                    this.scene.splitPosition = 0;
                    this.leftImageLayer.show = false;
                    this.rightImageLayer.show = false;
                }
            }
        }
        console.log('>>>地图初始化完成');
        window.cesiumExt = new CesiumExt();
    }
}