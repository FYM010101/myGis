export default class Interpolation {
    constructor() {
        this.factors = {
            radians: 1,
            meters: 6373000,
            kilometers: 6373,
        };
    }
    getLength(path) {
        let length = 0;
        const coord = path.geometry.coordinates;
        for (let i = 0; i < coord.length - 1; i++) {
            const from = coord[i];
            const to = coord[i + 1];
            length += this.distance(from, to);
        }
        return length;
    }
    rand(min, max) {
        return Math.random() * (max - min) + min;
    }

    distance(from, to) {
        return this.distanceMath(from, to, 'meters');
    }
    along(lineFeature, d) {
        if (d == 0) {
            return {
                direction: 0,
                interpolated: lineFeature.geometry.coordinates[0]
            }
        } else {
            return this.alongMath(lineFeature, d, 'meters');
        }
    }
    alongMath(line, d, units) {
        let coords;
        if (line.type === 'Feature') coords = line.geometry.coordinates;
        // @ts-ignore
        else if (line.type === 'LineString') coords = line.coordinates;
        else throw new Error('input must be a LineString Feature or Geometry');

        let travelled = 0;
        for (let i = 0; i < coords.length; i++) {
            if (d >= travelled && i === coords.length - 1) break;
            else if (travelled >= d) {
                const overshot = d - travelled;
                if (!overshot) return coords[i];
                else {
                    const direction = this.bearing(coords[i], coords[i - 1]) - 180;
                    const interpolated = this.destination(coords[i], overshot, direction, units);
                    return {
                        interpolated,
                        direction
                    };
                }
            } else {
                travelled += this.distanceMath(coords[i], coords[i + 1], units);
            }
        }
        return coords[coords.length - 1];
    }
    destination(
        from,
        distance,
        bearing,
        units) {
        const degrees2radians = Math.PI / 180;
        const radians2degrees = 180 / Math.PI;
        const longitude1 = degrees2radians * from[0];
        const latitude1 = degrees2radians * from[1];
        const bearingRad = degrees2radians * bearing;

        const radians = this.distanceToRadians(distance, units);

        const latitude2 = Math.asin(Math.sin(latitude1) * Math.cos(radians) +
            Math.cos(latitude1) * Math.sin(radians) * Math.cos(bearingRad));
        const longitude2 = longitude1 + Math.atan2(Math.sin(bearingRad) *
            Math.sin(radians) * Math.cos(latitude1),
            Math.cos(radians) - Math.sin(latitude1) * Math.sin(latitude2));

        return [radians2degrees * longitude2, radians2degrees * latitude2];
    }
    bearing(start, end) {
        const degrees2radians = Math.PI / 180;
        const radians2degrees = 180 / Math.PI;

        const lon1 = degrees2radians * start[0];
        const lon2 = degrees2radians * end[0];
        const lat1 = degrees2radians * start[1];
        const lat2 = degrees2radians * end[1];
        const a = Math.sin(lon2 - lon1) * Math.cos(lat2);
        const b = Math.cos(lat1) * Math.sin(lat2) -
            Math.sin(lat1) * Math.cos(lat2) * Math.cos(lon2 - lon1);

        const bearing = radians2degrees * Math.atan2(a, b);

        return bearing;
    }
    distanceToRadians(distance, units) {
        const factor = this.factors[units || 'kilometers'];
        if (factor === undefined) {
            throw new Error('Invalid unit');
        }
        return distance / factor;
    }
    distanceMath(from, to, units) {
        // from = TileUtil.merctor2lonlat(from);
        // to = TileUtil.merctor2lonlat(to);
        const degrees2radians = Math.PI / 180;
        const dLat = degrees2radians * (to[1] - from[1]);
        const dLon = degrees2radians * (to[0] - from[0]);
        const lat1 = degrees2radians * from[1];
        const lat2 = degrees2radians * to[1];

        const a = Math.pow(Math.sin(dLat / 2), 2) +
            Math.pow(Math.sin(dLon / 2), 2) * Math.cos(lat1) * Math.cos(lat2);

        return this.radiansToDistance(2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a)), units);
    }
    radiansToDistance(radians, units) {
        const factor = this.factors[units || 'kilometers'];
        if (factor === undefined) {
            throw new Error('Invalid unit');
        }
        return radians * factor;
    }
}