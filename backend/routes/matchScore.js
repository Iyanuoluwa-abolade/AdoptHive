import express from 'express';
import { calculateAndStoreScores } from '../matchCalculation.js';

const matchesRouter = express.Router();

matchesRouter.get('/api/calculate-matches', async (req, res) => {
    const { userId } = req.query;
    if (!userId) {
        return res.status(400).json({ error: 'User ID is required' });
    }
    try {
        const topMatches = await calculateAndStoreScores(parseInt(userId));
        res.status(200).json(topMatches);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch matches' });
    }
});

export default matchesRouter;
