import express from "express";
import { PrismaClient } from "@prisma/client";

const adopteeRouter = express.Router();
const prisma = new PrismaClient();

adopteeRouter.post("/adoptee", async (req, res) => {
    const { UserId, firstName, lastName, age, sex, birthdate, photoUrl, background, interests, education, traits, dreams } = req.body;
    try {
        const adoptee = await prisma.adoptee.create({
            data: {
                firstName,
                lastName,
                age: parseInt(age),
                sex,
                birthdate,
                photoUrl,
                background,
                interests,
                education,
                traits,
                dreams,
                User: {
                  connect: { id: UserId}
                }
            },
        });
        res.status(201).json(adoptee);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

export default adopteeRouter;
