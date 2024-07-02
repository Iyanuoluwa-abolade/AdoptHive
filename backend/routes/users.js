// import express from "express";
// import bcrypt from "bcrypt";
// import { User } from "../models/user.js";
// import { Op } from "sequelize";

// const router = express.Router();

// router.post("/users", async (req, res) => {
//     const { firstname, middlename, lastname, username, password, confirmPassword, role } = req.body;

//     try {
//         const existingUser = await User.findOne({
//             where: {
//                 [Op.or]: [{ username }]
//             }
//         });

//         if (existingUser) {
//             return res.status(400).json({error: 'Username already exists'});
//         }

//         const hashedPassword = await bcrypt.hash(password, 10);

//         const newUser = await prisma.User.create({ firstname, middlename, lastname, username, password: hashedPassword, confirmPassword: hashedPassword, role });

//         req.session.user = newUser;

//         res.json({ user: newUser });
//     } catch (error) {
//         console.error(error);
//         res.status(500).json({ error: "Server error" });
//     }
// });

// router.post("/users/signin", async (req, res) => {
//     const { username, password } = req.body;

//     try {
//         const user = await User.findOne({ where: { username } });

//         if (!user) {
//             return res.status(401).json({ error: "Invalid username or password" });
//         }

//         const isValidPassword = await bcrypt.compare(password, user.password);

//         if (!isValidPassword) {
//             return res.status(401).json({ error: "Invalid username or password" });
//         }

//         req.session.user = user;

//         res.json({ user });
//     } catch (error) {
//         console.error(error);
//         res.status(500).json({ error: "Server error" });
//     }
// });

// export default router;


import express from "express";
import bcrypt from "bcrypt";
import env from "dotenv";
import { PrismaClient } from "@prisma/client";
// import { User } from "../models/user.js";
// import { Op } from "sequelize";

const router = express.Router();
const port = 3000;
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
            console.error(err);
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
        console.error(err);
        res.status(500).json({ message: err.message });
    }
});



// router.get("/users/search", async (req, res) => {
//     const { query } = req.query;

//     try {
//         const users = await prisma.user.findMany({
//             where: {
//                 OR: [
//                     {
//                         FirstName: {
//                              contains: query,
//                              mode: "insensitive",
//                         },
//                     },

//                     }
//                 ]

export default router;



// router.post("/users", async (req, res) => {
//     const { firstname, middlename, lastname, username, password, confirmPassword, role } = req.body;

//     try {
//         const existingUser = await user.findOne({
//             where: {
//                 [Op.or]: [{ username }]
//             }
//         });

//         if (existingUser) {
//             return res.status(400).json({error: 'Username already exists'});
//         }

//         const hashedPassword = await bcrypt.hash(password, 10);

//         const newUser = await prisma.User.create({ firstname, middlename, lastname, username, password: hashedPassword, confirmPassword: hashedPassword, role });

//         req.session.user = newUser;

//         res.json({ user: newUser });
//     } catch (error) {
//         console.error(error);
//         res.status(500).json({ error: "Server error" });
//     }
// });

// router.post("/users/signin", async (req, res) => {
//     const { username, password } = req.body;

//     try {
//         const user = await User.findOne({ where: { username } });

//         if (!user) {
//             return res.status(401).json({ error: "Invalid username or password" });
//         }

//         const isValidPassword = await bcrypt.compare(password, user.password);

//         if (!isValidPassword) {
//             return res.status(401).json({ error: "Invalid username or password" });
//         }

//         req.session.user = user;

//         res.json({ user });
//     } catch (error) {
//         console.error(error);
//         res.status(500).json({ error: "Server error" });
//     }
// });

// export default router;
