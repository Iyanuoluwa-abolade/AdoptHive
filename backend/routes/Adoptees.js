import express from "express";
import { PrismaClient } from "@prisma/client";
import cors from 'cors';
import env from 'dotenv';

const routing = express.Router();
const port = 3001;
const prisma = new PrismaClient();
const saltRounds = 10;
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
