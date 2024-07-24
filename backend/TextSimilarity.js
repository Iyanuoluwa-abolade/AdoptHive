import fetch from 'node-fetch';
import dotenv from 'dotenv';

dotenv.config();

export async function fetchCosineSimilarity(text1, text2) {
  const response = await fetch('https://api.api-ninjas.com/v1/textsimilarity', {
    method: 'POST',
    headers: {
      'X-Api-Key':'CqFHPg/nZmeAEHsS8OHRUw==eHzKqFrCJgJ2NIb4',
    },
    body: JSON.stringify({
      text_1: text1,
      text_2: text2,
    }),
  });

  const data = await response.json();
  if (!response.ok) {
    throw new Error('Failed to fetch similarity score');
  }

  return data;
}
