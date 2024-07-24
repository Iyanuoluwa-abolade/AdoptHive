import express from 'express';
import { galeShapley } from '../matchAlgorithm.js';
import { isAuthenticated } from '../middleware/auth.js';

const matchRouter = express.Router();

matchRouter.get('/run-matching', isAuthenticated, async (req, res) => {
  try {
    const userId = req.session.user.id;
    const userRole = req.session.user.role; 
    const result = await galeShapley(userId, userRole);
    res.status(200).json(result);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

export default matchRouter;
