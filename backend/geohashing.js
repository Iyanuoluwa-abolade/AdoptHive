import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function fetchCoordinatesFromDatabase(coordinates_num) {
    const coordinatesArray = await prisma.location.findMany({
        take: coordinates_num,
        select: {
            latitude: true,
            longitude: true,
        },
    });
    return coordinatesArray;
}

export function encodeGeohash(lat, long, precision = 12) {
    const latInterval = [-90, 90];
    const longInterval = [-180, 180];
    let geohash = '';
    const base32Chars = '0123456789bcdefghjkmnpqrstuvwxyz';
    let isEvenBit = true;

    while (geohash.length < precision) {
        let charBits = 0;
        for (let bit = 4; bit >= 0; --bit) {
            if (isEvenBit) {
                const mid = (longInterval[0] + longInterval[1]) / 2;
                if (long > mid) {
                    charBits |= 1 << bit;
                    longInterval[0] = mid;
                } else {
                    longInterval[1] = mid;
                }
            } else {
                const mid = (latInterval[0] + latInterval[1]) / 2;
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
            const { latitude, longitude } = coord;
            const geoHash = encodeGeohash(latitude, longitude);
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

async function startGeohashing() {
    try {
        const coordinates_num = 1000;
        const coordinatesArray = await fetchCoordinatesFromDatabase(coordinates_num);
        const min_long = -180;
        const max_long = 180;
        const min_lat = -90;
        const max_lat = 90;
        const initialGeohash = '';
        const processedCoordinates = geohashes(coordinatesArray, min_long, max_long, min_lat, max_lat, initialGeohash);
        return ('Processed coordinates:', processedCoordinates);
    } catch (error) {
    }
}

startGeohashing();
export default {startGeohashing};
