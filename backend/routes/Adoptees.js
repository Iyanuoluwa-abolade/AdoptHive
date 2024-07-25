import express from "express";
import { PrismaClient } from "@prisma/client";
import {geocode} from '../geocode.js'
import { encodeGeohash } from "../geohashing.js";

const adopteeRouter = express.Router();
const prisma = new PrismaClient();

adopteeRouter.post("/adoptee-profile", async (req, res) => {
    const { UserId, firstName, lastName, age, sex, birthdate, photoUrl, background, interests, education, traits, dreams, city, country } = req.body;
    try {
        const {latitude, longitude} = await geocode(city, country);
        if ( latitude == null || longitude == null ) {
            return res.json(500).json({message: "Geocoding failed. Invalid city or country"})
        }
        const geohash = encodeGeohash(latitude, longitude);

        const location = await prisma.location.create({
            data: {latitude, longitude, geohash},
        })
        
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
                city,
                country,
                User: {
                  connect: { id: UserId},
                },
                  Location: {
                    connect: {id: location.id}
                  }
            },
        });
        res.status(201).json(adoptee);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});
export default adopteeRouter;
