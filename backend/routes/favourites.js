import express from 'express';
import { PrismaClient } from '@prisma/client';

const favouriteSRouter = express.Router();
const prisma = new PrismaClient();

favouriteSRouter.post('/favourites', async (req, res) => {
    const { UserId, adopterId, adopteeId } = req.body;
    try {
        const favourite = await prisma.favourite.create({
            data: { UserId, adopterId, adopteeId }
        });
        res.status(201).json(favourite);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

favouriteSRouter.delete('/favourites/:userId/:profileId', async (req, res) => {
    const { UserId, profileId } = req.params;
    try {
        await prisma.favourite.deleteMany({
            where: {
                userId: parseInt(UserId),
                OR: [{ adopterId: parseInt(profileId) }, { adopteeId: parseInt(profileId) }]
            }
        });
        res.status(204).send();
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

favouriteSRouter.get('/favourites', async (req, res) => {
    const { userId } = req.query;
    try {
        const favourites = await prisma.favourite.findMany({
            where: { UserId: parseInt(userId) },
            include: {
                adopter: true,
                adoptee: true,
            }
        });
        res.status(200).json(favourites);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

export default favouriteSRouter;
