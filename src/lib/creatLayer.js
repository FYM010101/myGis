export default class CreateLayer {
    constructor(map) {
        this.map = map;
    }
    //加载mapbox数据源和图层
    addMapBoxSource(sourceId, features) {
        this.map.addSource(sourceId, {
            type: 'geojson',
            data: {
                'type': 'FeatureCollection',
                'features': features ? features : [],
            }
        })
    }
    addMapBoxLayer(sourceId, layerId, layerType, layoutObj, paintObj, beforeId) {
        this.map.addLayer({
            id: layerId,
            type: layerType,
            source: sourceId,
            layout: layoutObj ? layoutObj : {},
            paint: paintObj ? paintObj : {},
        }, beforeId)
    }
    getFeature(id, type, properties, coordinates) {
        return {
            'type': 'Feature',
            'id': id,
            'properties': properties ? properties : {},
            'geometry': {
                'type': type,
                'coordinates': coordinates
            }
        }
    }
    createGeojson(features) {
        let geojson = {
            'type': 'FeatureCollection',
            'features': features
        };
        return geojson;
    }
    //加载图片
    getImagePromise(url, id) {
        
        return new Promise((resolve, reject) => {
            
            this.map.loadImage(url, (err, image) => {
                if (err) {
                    reject();
                }
                
                this.map.addImage(id, image);
                resolve(id);
            })
        })
    }
    setMbxmapData(sourceId, features) {
        this.map.getSource(sourceId).setData({
            "type": "FeatureCollection",
            "features": features ? features : []
        });
    }
}