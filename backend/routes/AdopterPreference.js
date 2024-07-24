import express from 'express';
import { PrismaClient } from '@prisma/client';

const router = express.Router();
const prisma = new PrismaClient();

router.post('/', async (req, res) => {
  const { adopterId, adopteeId, rank } = req.body;

  try {
    const newPreference = await prisma.adopterPreference.upsert({
      where: {
        adopterId_adopteeId: {
          adopterId,
          adopteeId,
        },
      },
      update: {
        rank,
      },
      create: {
        adopterId,
        adopteeId,
        rank,
      },
    });
    res.status(201).json(newPreference);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.get('/:adopterId', async (req, res) => {
  const { adopterId } = req.params;

  try {
    const preferences = await prisma.adopterPreference.findMany({
      where: { adopterId: parseInt(adopterId, 10) },
      include: { adoptee: true },
    });
    res.status(200).json(preferences);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;
