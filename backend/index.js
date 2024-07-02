// const { PrismaClient } = require('@prisma/client')
// const prisma = new PrismaClient()
// const cors = require('cors')
// const express = require('express')
// const app = express();
// app.use(express.json())
// app.use(cors());
// require("dotenv").config();
// const bcrypt = require('bcrypt');
// const saltRounds = 14;


// app.post("/users", async (req, res) => {
//     const { FirstName, MiddleName, LastName, Password, Role } = req.body;
//     try {
//         const newUser = await prisma.user.create({
//             data: {
//                 FirstName,
//                 MiddleName,
//                 LastName,
//                 Password: bcrypt.hashSync(Password, saltRounds),
//                 Role,
//             },
//         });
//         res.json(newUser);

//     } catch (error) {
//         console.log(error);
//         res.status(500).json({ error: " Internal Server Error" });
//     }
// });

import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import env from 'dotenv';
import session from 'express-session';
import router from './routes/users.js';
import Sequelize  from 'sequelize';
import SequelizeStoreInit from 'connect-session-sequelize';

const app = express();
const port = 3000;
env.config();

const sequelize = new Sequelize(process.env.DATABASE_URL, {
    dialect: 'postgres',
});

const SequelizeStore = SequelizeStoreInit(session.Store);
const sessionStore = new SequelizeStore({
    db: sequelize,
});

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(
    cors({
        origin: 'http://localhost:5173',
        credentials: true,
    })
);
app.use(
    session({
        secret: 'SECRET',
        resave: false,
        saveUninitialized: false,
        store: sessionStore,
        cookie: {
            sameSite: 'false',
            secure: false,
            expires: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000),
        },
    })
);

sessionStore.sync();
app.use(router);

app.get("/", (req, res) => {
    res.send("Hello World");
});

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
