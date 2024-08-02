import express from 'express';
import { PrismaClient } from '@prisma/client';

const favouritesRouter = express.Router();
const prisma = new PrismaClient();

favouritesRouter.post('/favourites', async (req, res) => {
    const { UserId, adopterId, adopteeId } = req.body;
    // try {
    //     const existingFavourite = await prisma.favourite.findUnique({
    //         where: {
    //             UserId: parseInt(UserId),
    //             OR: [
    //                 { adopterId: parseInt(adopterId) },
    //                 { adopteeId: parseInt(adopteeId) }
    //             ]
    //         }
    //     });
    //     if (existingFavourite) {
    //         return res.status(400).json({ error: 'This adoptee or adopter has already been liked.' });
    //     }
        const favourite = await prisma.favourite.create({
            data: { UserId, adopterId, adopteeId }
        });
        res.status(201).json(favourite);
    // } catch (error) {
    //     res.status(500).json({ error: error.message });
    // }
});

favouritesRouter.delete('/favourites/:UserId/:profileId', async (req, res) => {
    const { UserId, profileId } = req.params;
    try {
        await prisma.favourite.deleteMany({
            where: {
                UserId: parseInt(UserId),
                OR: [{ adopterId: parseInt(profileId) }, { adopteeId: parseInt(profileId) }]
            }
        });
        res.status(204).send();
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

favouritesRouter.get('/favourites', async (req, res) => {
    const { userId } = req.query;
    if (!userId || isNaN(parseInt(userId))) {
        return res.status(400).json({ error: 'User ID is required and must be a number.' });
    }
    // try {
        const favourites = await prisma.favourite.findMany({
            where: { UserId: parseInt(userId) },
            include: {
                adopter: true,
                adoptee: true,
            }
        });
        res.status(200).json(favourites);
    // } catch (error) {
    //     res.status(500).json({ error: error.message });
    // }
});

export default favouritesRouter;
