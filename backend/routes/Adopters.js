import express from "express";
import { PrismaClient } from "@prisma/client";

const adopterRouter = express.Router();
const prisma = new PrismaClient();

adopterRouter.post("/adopter", async (req, res) => {
    const { UserId, firstName, lastName, age, sex, status, photoUrl, background } = req.body;

    if (!UserId || !firstName ||!lastName || !age ||!sex ||!status ||!background) {
      return res.status(400).json({message: "All fields are required"});
    }
    try {
        const adopter = await prisma.adopter.create({
            data: {
                firstName,
                lastName,
                age: parseInt(age),
                sex,
                status,
                photoUrl,
                background,
                User: {
                  connect: {id: UserId},
                }
            },
        });
        res.status(201).json(adopter);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

export default adopterRouter;
