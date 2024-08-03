import express from "express";
import { PrismaClient } from "@prisma/client";
import env from 'dotenv';

const adopterlistRouter = express.Router();
const prisma = new PrismaClient();
env.config();

adopterlistRouter.get("/adopter", async (req, res) => {
    try {
        const AdopterList = await prisma.adopter.findMany();
        res.status(200).json(AdopterList)

    } catch(err) {
        res.status(500).json({message: err.message})
    }
});

export default adopterlistRouter;
