import express from 'express';
import { PrismaClient } from "@prisma/client";
import { galeShapley } from '../matchAlgorithm.js';
import { isAuthenticated } from '../middleware/auth.js';
import { sendEmail } from '../email.js';
import dotenv from 'dotenv';
dotenv.config();

const prisma = new PrismaClient();
const matchRouter = express.Router();

matchRouter.get('/run-matching', isAuthenticated, async (req, res) => {
  try {
    const userId = req.session.user.id;
    const userRole = req.session.user.role;
    const result = await galeShapley(userId, userRole);
    const user = await prisma.user.findUnique({
        where:{id: userId},

     })
    if (user && user.email) {
        const link = 'http://localhost:5173/signin'
        const htmlMessage = `
            <p>You have a new match. Please <a href="${link}">sign in</a> to view it.</p>
        `;
        await sendEmail(
            user.email,
            "Missed Notifications- AdoptHive",
            htmlMessage
        );
    }

    res.status(200).json(result);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

export default matchRouter;
