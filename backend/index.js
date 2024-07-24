import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import env from 'dotenv';
import session from 'express-session';
import router from './routes/users.js';
import adopterRouter from './routes/Adopters.js';
import adopteeRouter from './routes/Adoptees.js';
import adopterlistRouter from './routes/AdopterList.js';
import adopteelistRouter from './routes/AdopteeList.js';
import preferenceRouter from './routes/Preference.js';
import Sequelize from 'sequelize';
import SequelizeStoreInit from 'connect-session-sequelize';
import matchRouter from './routes/matchRouter.js';

const app = express();
const port = 3004;
const YEAR_TO_MILLISECOND_CONVERSION_FACTOR = 365 * 24 * 60 * 60 * 1000;
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
            sameSite: 'lax',
            secure: false,
            expires: new Date(Date.now() + YEAR_TO_MILLISECOND_CONVERSION_FACTOR),
        },
    })
);

sessionStore.sync()


app.use(router);
app.use(adopteeRouter);
app.use(adopterRouter);
app.use(adopteelistRouter);
app.use(adopterlistRouter);
app.use(preferenceRouter);
app.use(matchRouter);

app.use((req, res, next) => {
    next();
});


app.get("/", (req, res) => {
    res.send("Hello World");
});

app.listen(port, () => {
});
