import express from "express";
import { PrismaClient } from "@prisma/client";
import {geocode} from '../geocode.js'
import { encodeGeohash } from "../geohashing.js";

const adopterRouter = express.Router();
const prisma = new PrismaClient();

adopterRouter.post("/adopter-profile", async (req, res) => {
    const { UserId, firstName, lastName, age, sex, status, photoUrl, background, city, country } = req.body;
    if (!UserId || !firstName ||!lastName || !age ||!sex ||!status ||!background ||!city ||!country) {
      return res.status(400).json({message: "All fields are required"});
    }
    try {
        const {latitude, longitude} = await geocode(city, country);
        if ( latitude == null || longitude == null ) {
            return res.json(500).json({message: "Geocoding failed. Invalid city or country"})
        }
        const geohash = encodeGeohash(latitude, longitude);

        const location = await prisma.location.create({
            data: {latitude, longitude, geohash},
        })
        const adopter = await prisma.adopter.create({
            data: {
                firstName,
                lastName,
                age: parseInt(age),
                sex,
                status,
                photoUrl,
                background,
                city,
                country,
                User: {
                  connect: {id: UserId},
                },
                Location: {
                    connect: {id: location.id}
                }
            },
        });
        res.status(201).json(adopter);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

adopterRouter.post('/geohash', async (req, res) => {
    const { latitude, longitude } = req.body;
    if (!latitude || !longitude) {
      return res.status(400).json({ message: 'Latitude and longitude are required' });
    }
    const geohash = encodeGeohash(latitude, longitude);
    res.json({ geohash });
  });

export default adopterRouter;
