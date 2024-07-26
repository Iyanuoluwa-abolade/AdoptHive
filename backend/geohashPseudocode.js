function generateRandomElement() {
    const latitude = Math.random() * 180 - 90;
    const longitude = Math.random() * 360 - 180;
    return { latitude, longitude };
}

function generateRandomCoordinates(coordinates_num) {
    const coordinatesArray = [];
    for (let i = 0; i < coordinates_num; i++) {
        const coordinates = generateRandomElement();
        coordinatesArray.push(coordinates);
    }
    return coordinatesArray;
}

function encodeGeohash(lat, long, precision = 12) {
    const latInterval = [-90, 90];
    const longInterval = [-180, 180];
    let geohash = '';
    const base32Chars = '0123456789bcdefghjkmnpqrstuvwxyz';
    let isEvenBit = true;

    while (geohash.length < precision) {
        let mid;
        let charBits = 0;
        for (let bit = 4; bit >= 0; --bit) {
            if (isEvenBit) {
                mid = (longInterval[0] + longInterval[1]) / 2;
                if (long > mid) {
                    charBits |= 1 << bit;
                    longInterval[0] = mid;
                } else {
                    longInterval[1] = mid;
                }
            } else {
                mid = (latInterval[0] + latInterval[1]) / 2;
                if (lat > mid) {
                    charBits |= 1 << bit;
                    latInterval[0] = mid;
                } else {
                    latInterval[1] = mid;
                }
            }
            isEvenBit = !isEvenBit;
        }
        geohash += base32Chars[charBits];
    }
    return geohash;
}

function geohashes(coordinates, min_long, max_long, min_lat, max_lat, geohash) {
    if (coordinates.length < 100) {
        return coordinates.map(coord => {
            const lat = coord.latitude;
            const long = coord.longitude;
            const geoHash = encodeGeohash(lat, long);
            return { ...coord, geohash: geoHash };
        });
    } else {
        return subdivide(coordinates, min_long, max_long, min_lat, max_lat, geohash);
    }
}

function subdivide(coordinates, min_long, max_long, min_lat, max_lat, geohash) {
    const midLat = (min_lat + max_lat) / 2;
    const midLong = (min_long + max_long) / 2;

    const topLeft = coordinates.filter(c => c.latitude >= midLat && c.longitude < midLong);
    const topLeftResult = geohashes(topLeft, min_long, midLong, midLat, max_lat, geohash + '0');

    const topRight = coordinates.filter(c => c.latitude >= midLat && c.longitude >= midLong);
    const topRightResult = geohashes(topRight, midLong, max_long, midLat, max_lat, geohash + '1');

    const bottomLeft = coordinates.filter(c => c.latitude < midLat && c.longitude < midLong);
    const bottomLeftResult = geohashes(bottomLeft, min_long, midLong, min_lat, midLat, geohash + '2');

    const bottomRight = coordinates.filter(c => c.latitude < midLat && c.longitude >= midLong);
    const bottomRightResult = geohashes(bottomRight, midLong, max_long, min_lat, midLat, geohash + '3');

    return [
        ...topLeftResult,
        ...topRightResult,
        ...bottomLeftResult,
        ...bottomRightResult,
    ];
}

function startGeohashing() {
    const coordinates_num = 1000000;
    const randomCoordinatesArray = generateRandomCoordinates(coordinates_num);
    const min_long = -180;
    const max_long = 180;
    const min_lat = -90;
    const max_lat = 90;
    const initialGeohash = '';
    const processedCoordinates = geohashes(randomCoordinatesArray, min_long, max_long, min_lat, max_lat, initialGeohash);
}

function testGeohashing() {
    const testCoords = [
        { latitude: 90, longitude: 180 },
        { latitude: -90, longitude: -180 },
        { latitude: 0, longitude: 0 },
        { latitude: 45, longitude: 90 },
        { latitude: -45, longitude: -90 },
    ];
    testCoords.forEach(coord => {
        const [result] = geohashes([coord], -180, 180, -90, 90, '');
    });
}

startGeohashing();
testGeohashing();
