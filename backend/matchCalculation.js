import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export function haversineDistance(lat1, lon1, lat2, lon2) {
    const toRad = angle => angle * (Math.PI / 180);
    const R = 6371;
    const dLat = toRad(lat2 - lat1);
    const dLon = toRad(lon2 - lon1);
    const lat1Rad = toRad(lat1);
    const lat2Rad = toRad(lat2);

    const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
              Math.sin(dLon / 2) * Math.sin(dLon / 2) * Math.cos(lat1Rad) * Math.cos(lat2Rad);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    
    return R * c;
}

export async function calculateAndStoreScores(UserId) {
    try {
        const favourites = await prisma.favourite.findMany({
            where: { UserId: UserId },
            select: { adopterId: true, adopteeId: true }
        });
        const favouritesSet = new Set(favourites.map(fav => fav.adopterId || fav.adopteeId));

        const adopters = await prisma.adopter.findMany({
            include: { Location: true }
        });
        const adoptees = await prisma.adoptee.findMany({
            include: { Location: true }
        });

        const user = await prisma.user.findUnique({
            where: { id: UserId },
            include: {
                adopter: {
                    include: {
                        Location: true
                    }
                },
                adoptee: {
                    include: {
                        Location: true
                    }
                }
            }
        });

        let userLat, userLong, userRole;
        if (user.adopter) {
            userLat = user.adopter.Location.latitude;
            userLong = user.adopter.Location.longitude;
            userRole = 'Adopter';
        } else if (user.adoptee) {
            userLat = user.adoptee.Location.latitude;
            userLong = user.adoptee.Location.longitude;
            userRole = 'Adoptee';
        } else {
            throw new Error('User role not found');
        }

        for (let adopter of adopters) {
            const isFavourite = favouritesSet.has(adopter.id) ? 1 : 0;
            const distance = haversineDistance(userLat, userLong, adopter.Location.latitude, adopter.Location.longitude);
            const distanceFactor = 10 / (distance + 1);
            const rank = adopter.rank || 0;

            const score = (isFavourite * 20) + distanceFactor + rank;

            await prisma.adopter.update({
                where: { id: adopter.id },
                data: { matchScore: score }
            });
        }

        for (let adoptee of adoptees) {
            const isFavourite = favouritesSet.has(adoptee.id) ? 1 : 0;
            const distance = haversineDistance(userLat, userLong, adoptee.Location.latitude, adoptee.Location.longitude);
            const distanceFactor = 10 / (distance + 1);
            const rank = adoptee.rank || 0;

            const score = (isFavourite * 20) + distanceFactor + rank;

            await prisma.adoptee.update({
                where: { id: adoptee.id },
                data: { matchScore: score }
            });
        }

        let topMatches;
        if (userRole === 'Adopter') {
            topMatches = await prisma.adoptee.findMany({
                orderBy: { matchScore: 'desc' },
                take: 3
            });
        } else if (userRole === 'Adoptee') {
            topMatches = await prisma.adopter.findMany({
                orderBy: { matchScore: 'desc' },
                take: 3
            });
        }

        return topMatches;

    } catch (error) {
        throw new Error('Failed to calculate and store scores');
    }
}
