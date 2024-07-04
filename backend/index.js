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
        secret: 'TOPSECRETWORD',
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
