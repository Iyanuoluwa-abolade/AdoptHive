import express from "express";
import { PrismaClient } from "@prisma/client";
import env from 'dotenv';

const adopteelistRouter = express.Router();
const prisma = new PrismaClient();
env.config();

adopteelistRouter.get("/adoptee", async (req, res) => {

    try {
        const AdopteeList = await prisma.adoptee.findMany();
        res.status(200).json(AdopteeList)

    } catch(err) {
        res.status(500).json({message: err.message})
    }
});
export default adopteelistRouter;
