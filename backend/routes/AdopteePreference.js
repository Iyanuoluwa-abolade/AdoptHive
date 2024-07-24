import express from 'express';
import { PrismaClient } from '@prisma/client';

const router = express.Router();
const prisma = new PrismaClient();

router.post('/', async (req, res) => {
  const { adopteeId, adopterId, rank } = req.body;

  try {
    const newPreference = await prisma.adopteePreference.upsert({
      where: {
        adopteeId_adopterId: {
          adopteeId,
          adopterId,
        },
      },
      update: {
        rank,
      },
      create: {
        adopteeId,
        adopterId,
        rank,
      },
    });
    res.status(201).json(newPreference);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.get('/:adopteeId', async (req, res) => {
  const { adopteeId } = req.params;

  try {
    const preferences = await prisma.adopteePreference.findMany({
      where: { adopteeId: parseInt(adopteeId, 10) },
      include: { adopter: true },
    });
    res.status(200).json(preferences);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;
