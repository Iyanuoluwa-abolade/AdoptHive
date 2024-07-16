import prisma from './prisma.js';


async function galeShapley() {
  const adopters = await prisma.adopter.findMany();
  const adoptees = await prisma.adoptee.findMany();

  const adopterPreferences = await prisma.adopterPreferences.findMany();
  const adopteePreferences = await prisma.adopteePreferences.findMany();

  const matches = {};

  for (const adopter of adopters) {
    const preferences = adopterPreferences.filter((preference) => preference.adopterId === adopter.id);
    for (const preference of preferences) {
      const adoptee = adoptees.find((adoptee) => adoptee.id === preference.adopteeId);
      if (adoptee && !matches[adopter.id]) {
        matches[adopter.id] = {
          firstName:adoptee.firstName,
          lastName:adoptee.lastName,
        };
        break;
      }
    }
  }

  for (const adoptee of adoptees) {
    const preferences = adopteePreferences.filter((preference) => preference.adopteeId === adoptee.id);
    for (const preference of preferences) {
      const adopter = adopters.find((adopter) => adopter.id === preference.adopterId);
      if (adopter && !matches[adopter.id]) {
        matches[adopter.id] = adoptee;
        break;
      }
    }
  }
  
  return matches;
}
export {galeShapley};
