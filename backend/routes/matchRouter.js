import express from 'express';
import { galeShapley } from '../matchAlgorithm.js';
import { isAuthenticated } from '../middleware/auth.js';
import { sendEmail } from '../email.js';
import dotenv from 'dotenv';
dotenv.config();

const matchRouter = express.Router();

matchRouter.get('/run-matching', isAuthenticated, async (req, res) => {
  try {
    const userId = req.session.user.id;
    const userRole = req.session.user.role;
    const result = await galeShapley(userId, userRole);
    const user = await prisma.user.find({
        where:{id: userId},

     })
    if (user && user.email) {
        await sendEmail(
            user.email,
            "Missed Notifications- AdoptHive",
            `You have ${notifications.length} new notifications. Please log in to view them.`
        );
    }

    res.status(200).json(result);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

export default matchRouter;
