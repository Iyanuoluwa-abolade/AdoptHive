import express from "express";
import { PrismaClient } from "@prisma/client";
import env from 'dotenv';

const routing = express.Router();
const prisma = new PrismaClient();
env.config();


routing.get("/adoptee-profile", async (req, res) => {

    try {
        const AdopteesProfile = await prisma.adoptee.findMany();
        res.json(AdopteesProfile)

    } catch(err) {
        res.status(500).json({err: 'Internal Server Error'})
    }


});

export default routing;
