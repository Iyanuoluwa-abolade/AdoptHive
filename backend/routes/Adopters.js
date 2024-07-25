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

adopterRouter.get("/filter-adoptees", async (req, res) => {
    const { adopterId } = req.query;
    if (!adopterId) {
        return res.status(400).json({ message: "Adopter ID is required" });
    }
    try {
        const adopter = await prisma.adopter.findUnique({
            where: { id: parseInt(adopterId) },
            include: { Location: true },
        });
        if (!adopter || !adopter.Location) {
            return res.status(404).json({ message: "Adopter not found or has no location" });
        }
        const geohashPrefix = adopter.Location.geohash.slice(0, 5);
        const nearbyAdoptees = await prisma.adoptee.findMany({
            where: {
                Location: {
                    geohash: {
                        startsWith: geohashPrefix,
                    }
                }
            },
            include: { Location: true },
        });
        res.status(200).json(nearbyAdoptees);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: err.message });
    }
});
export default adopterRouter;
