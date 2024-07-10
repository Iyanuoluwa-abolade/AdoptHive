import express from "express";
import bcrypt from "bcrypt";
import env from "dotenv";
import { PrismaClient } from "@prisma/client";


const router = express.Router();
const prisma = new PrismaClient();
const saltRounds = 10;
env.config();

router.post("/signup", async (req, res) => {
    const { FirstName, MiddleName, LastName, Username, Password, ConfirmPassword, Role } = req.body;
    if (Password !== ConfirmPassword) {
        return res.status(401).json({ error: "Passwords do not match" });
    } else {
        try {
            const existingUser = await prisma.user.findUnique({
                where: {
                    Username,
                }
            });
            if (existingUser) {
                return res.status(401).json({ error: "Username already exists" });
            }
            const hashedPassword = await bcrypt.hash(Password, saltRounds);
            const user = await prisma.user.create({
                data: {
                    FirstName,
                    MiddleName,
                    LastName,
                    Username,
                    Password: hashedPassword,
                    Role,
                },
            });
            req.session.user = user;
            res.json({ user });

        } catch (err) {

            res.status(500).json({ message: err.message });
        }
    }
});

router.post("/signin", async (req, res) => {
    const { Username, Password } = req.body;
    try {
        const user = await prisma.user.findUnique({
            where: {
                Username,
            },
        });
        if (!user) {
            return res.status(401).json({ error: "Invalid credentials" });
        } else {
            const isMatch = await bcrypt.compare(Password, user.Password);
            if (!isMatch) {
                return res.status(401).json({ error: "Invalid credentials" });
            }
            req.session.user = user;
            res.json({ user });
        }
    } catch (err) {

        res.status(500).json({ message: err.message });
    }
});




export default router;
