import express from 'express';
import { PrismaClient } from '@prisma/client';
import { isAuthenticated } from '../middleware/auth.js';

const preferenceRouter = express.Router();
const prisma = new PrismaClient();

preferenceRouter.get('/adoptee', isAuthenticated, async (req, res) => {
  try {
    const adoptees = await prisma.adoptee.findMany();
    res.status(200).json(adoptees);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

preferenceRouter.get('/adopter', isAuthenticated, async (req, res) => {
  try {
    const adopters = await prisma.adopter.findMany();
    res.status(200).json(adopters);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

preferenceRouter.post('/adopter-preference', isAuthenticated, async (req, res) => {
  const { preferences } = req.body;
  const userId = req.session.user.id;
  if (!Array.isArray(preferences)) {
    return res.status(400).json({ message: 'preferences must be an array' });
  }
  const adopter = await prisma.adopter.findUnique({ where: { UserId: userId } });
  if (!adopter) {
    return res.status(400).json({ message: 'Invalid adopter ID' });
  }
  try {
    await prisma.$transaction(
      preferences.map(pref => prisma.adopterPreference.upsert({
        where: {
          adopterId_adopteeId: {
            adopterId: adopter.id,
            adopteeId: pref.adopteeId
          }
        },
        update: { rank: pref.rank },
        create: {
          adopterId: adopter.id,
          adopteeId: pref.adopteeId,
          rank: pref.rank
        }
      }))
    );
    res.status(200).json({ message: 'Preferences saved successfully' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

preferenceRouter.post('/adoptee-preference', isAuthenticated, async (req, res) => {
  const { preferences } = req.body;
  const userId = req.session.user.id;

  if (!Array.isArray(preferences)) {
    return res.status(400).json({ message: 'preferences must be an array' });
  }
  const adoptee = await prisma.adoptee.findUnique({ where: { UserId: userId } });
  if (!adoptee) {
    return res.status(400).json({ message: 'Invalid adoptee ID' });
  }
  try {
    await prisma.$transaction(
      preferences.map(pref => prisma.adopteePreference.upsert({
        where: {
          adopteeId_adopterId: {
            adopteeId: adoptee.id,
            adopterId: pref.adopterId
          }
        },
        update: { rank: pref.rank },
        create: {
          adopteeId: adoptee.id,
          adopterId: pref.adopterId,
          rank: pref.rank
        }
      }))
    );
    res.status(200).json({ message: 'Preferences saved successfully' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

export default preferenceRouter;
