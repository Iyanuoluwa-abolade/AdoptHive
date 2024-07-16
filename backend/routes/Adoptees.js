import express from "express";
import { PrismaClient } from "@prisma/client";
import env from 'dotenv';
import { galeShapley } from '../matchAlgorithm.js';

const adopteesRoute = express.Router();
const prisma = new PrismaClient();
env.config();

adopteesRoute.get("/adoptees-profile", async (req, res) => {
    try {
        const adopteesProfile = await prisma.adoptee.findMany();
        res.json(adopteesProfile);
    } catch (error) {

        res.status(500).json({ error: 'Internal Server Error' });
    }
});
adopteesRoute.get('/matches', async (req, res) => {
    try {
      const matches = await galeShapley(req.query.userId, 'adoptee');
      res.json(matches);
    } catch (error) {
      
      res.status(500).json({ error: 'Matching algorithm failed' });
    }
  });

export default adopteesRoute;
