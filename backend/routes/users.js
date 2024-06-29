import express from "express";
import bcrypt from "bcrypt";
import { user } from "../models/user.js";
import { Op } from "sequelize";

const router = express.Router();

router.post("/users", async (req, res) => {
    const { username, password } = req.body;

    try {
        const existingUser = await user.findOne({
            where: {
                [Op.or]: [{ username }]
            }
        });

        if (existingUser) {
            return res.status(400).json({error: 'Username already exists'});
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const newUser = await user.create({ username, password: hashedPassword });

        req.session.user = newUser;

        res.json({ user: newUser });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Server error" });
    }
});

router.post("/users/signin", async (req, res) => {
    const { username, password } = req.body;

    try {
        const user = await user.findOne({ where: { username } });

        if (!user) {
            return res.status(401).json({ error: "Invalid username or password" });
        }

        const isValidPassword = await bcrypt.compare(password, user.password);

        if (!isValidPassword) {
            return res.status(401).json({ error: "Invalid username or password" });
        }

        req.session.user = user;

        res.json({ user });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Server error" });
    }
});

export default router;
