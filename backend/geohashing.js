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
                    charBits |= (1 << bit);
                    longInterval[0] = mid;
                } else {
                    longInterval[1] = mid;
                }
            } else {
                const mid = (latInterval[0] + latInterval[1]) / 2;
                if (lat > mid) {
                    charBits |= (1 << bit);
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
