import fetch from 'node-fetch';
import dotenv from 'dotenv';

dotenv.config();

export const geocode = async (city, country) => {
    try {
        const response = await fetch(`https://api.api-ninjas.com/v1/geocoding?city=${city}&country=${country}`, {
            method: 'GET',
            headers: {
              'X-Api-Key': process.env.API_KEY,
              'Content-Type': 'application/json'
            }
        });
        const data = await response.json();
        return data[0];
    } catch (error) {
        console.error(error);
        throw error;
    }
};
