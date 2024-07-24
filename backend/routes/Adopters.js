import express from "express";
import { PrismaClient } from "@prisma/client";
import env from 'dotenv';

const adoptersRoute = express.Router();
const prisma = new PrismaClient();
env.config();


adoptersRoute.get("/adopters-profile", async (req, res) => {

    try {
        const AdoptersProfile = await prisma.adopter.findMany();
        res.json(AdoptersProfile)

    } catch(err) {
        res.status(500).json({err: 'Internal Server Error'})
    }

});

adoptersRoute.get('/matches', async (req, res) => {
    try {
      const matches = await galeShapley(req.query.userId, 'adopter');
      res.json(matches);
    } catch (error) {

      res.status(500).json({ error: 'Matching algorithm failed' });
    }
  });


export default adoptersRoute;
