import { PrismaClient } from '@prisma/client';
import { fetchCosineSimilarity } from './TextSimilarity.js';

const prisma = new PrismaClient();

export async function galeShapley(loggedInUserId, userRole) {
  const adopters = await prisma.adopter.findMany();
  const adoptees = await prisma.adoptee.findMany();
  const rawAdopterPreferences = await prisma.adopterPreference.findMany();
  const rawAdopteePreferences = await prisma.adopteePreference.findMany();

  const adopterPreferences = {};
  const adopteePreferences = {};

  for (const adopter of adopters) {
    const adopterId = adopter.id;
    const preferences = rawAdopterPreferences
      .filter(preference => preference.adopterId === adopterId)
      .sort((a, b) => b.rank - a.rank)
      .map(preference => preference.adopteeId);
    console.log(`Adopter ${adopterId} preferences:`, preferences);
    adopterPreferences[adopterId] = preferences;
  }

  for (const adoptee of adoptees) {
    const adopteeId = adoptee.id;
    const preferences = rawAdopteePreferences
      .filter(preference => preference.adopteeId === adopteeId)
      .sort((a, b) => b.rank - a.rank)
      .map(preference => preference.adopterId);
    console.log(`Adoptee ${adopteeId} preferences:`, preferences);
    adopteePreferences[adopteeId] = preferences;
  }

  const applyGaleShapley = (userPreferences, otherUserPreferences, freeUsers, proposerIndex) => {
    const userMatches = {};
    const otherUserMatches = {};

    while (freeUsers.size > 0) {
      for (const userId of freeUsers) {
        console.log(`Processing userId: ${userId}`);
        console.log(`Proposer index for ${userId}: ${proposerIndex[userId]}`);

        const preferences = userPreferences[userId] || [];
        const index = proposerIndex[userId];

        if (index >= preferences.length) {
          console.error(`Proposer index ${index} is out of bounds for user ${userId}'s preferences`);
          freeUsers.delete(userId); 
          continue;
        }

        const currentOtherUserId = preferences[index];
        console.log(`Current other user ID: ${currentOtherUserId}`);

        proposerIndex[userId]++;

        if (currentOtherUserId === undefined) {
          console.error(`No valid preference found for user ${userId} at index ${index}`);
          freeUsers.delete(userId);
          continue;
        }

        const otherUserPrefList = otherUserPreferences[currentOtherUserId];
        if (!otherUserPrefList) {
          console.error(`No preferences found for user ${currentOtherUserId}`);
          freeUsers.delete(userId);
          continue;
        }

        if (!otherUserMatches[currentOtherUserId]) {
          otherUserMatches[currentOtherUserId] = userId;
          userMatches[userId] = currentOtherUserId;
          freeUsers.delete(userId);
        } else {
          const currentUserId = otherUserMatches[currentOtherUserId];
          const userRank = otherUserPrefList.indexOf(userId);
          const currentUserRank = otherUserPrefList.indexOf(currentUserId);

          if (userRank < currentUserRank) {
            otherUserMatches[currentOtherUserId] = userId;
            userMatches[userId] = currentOtherUserId;
            freeUsers.delete(userId);
            freeUsers.add(currentUserId);
          }
        }
      }
    }
    return { userMatches, otherUserMatches };
  };

  const applyCosineSimilarity = async (currentUser, userPreferences, userType) => {
    let bestMatch = null;
    let bestScore = -1;

    for (const id of userPreferences) {
      const [background, dreams] = userType === 'Adopter'
        ? [currentUser.background, adoptees.find(adoptee => adoptee.id === id)?.dreams || '']
        : [adopters.find(adopter => adopter.id === id)?.background || '', currentUser.dreams];
      const similarity = await fetchCosineSimilarity(background, dreams);
      if (similarity.similarity > bestScore) {
        bestScore = similarity.similarity;
        bestMatch = id;
      }
      await prisma.textScore.upsert({
        where: { adopterId_adopteeId: { adopterId: parseInt(currentUser.id), adopteeId: parseInt(id) } },
        update: { score: similarity.similarity },
        create: { adopterId: parseInt(currentUser.id), adopteeId: parseInt(id), score: similarity.similarity }
      });
    }
    return userType === 'Adopter'
      ? { adopter: currentUser, adoptee: adoptees.find(adoptee => adoptee.id === bestMatch) }
      : { adopter: adopters.find(adopter => adopter.id === bestMatch), adoptee: currentUser };
  };

  if (userRole === 'Adopter') {
    const currentAdopter = adopters.find(adopter => adopter.UserId === loggedInUserId);
    if (!currentAdopter) {
      console.error(`Adopter with UserId ${loggedInUserId} not found`);
      return { error: "Adopter not found" };
    }

    const currentAdopterPrefList = adopterPreferences[currentAdopter.id];
    if (!currentAdopterPrefList || currentAdopterPrefList.length === 0) {
      console.error(`No preferences found for Adopter ${currentAdopter.id}`);
      return await applyCosineSimilarity(currentAdopter, [], 'Adopter');
    }

    const rankDifferent = currentAdopterPrefList.length > 1 &&
      currentAdopterPrefList.some((id, i, arr) => {
        if (i === 0) return false;
        return rawAdopterPreferences.find(pref => pref.adopteeId === id && pref.adopterId === currentAdopter.id).rank !==
          rawAdopterPreferences.find(pref => pref.adopteeId === arr[i - 1] && pref.adopterId === currentAdopter.id).rank;
      });

    if (rankDifferent) {
      const freeAdopters = new Set(adopters.map(adopter => adopter.id));
      const proposerIndex = adopters.reduce((acc, adopter) => ({ ...acc, [adopter.id]: 0 }), {});

      const { userMatches, otherUserMatches } = applyGaleShapley(adopterPreferences, adopteePreferences, freeAdopters, proposerIndex);

      return {
        adopter: currentAdopter,
        adoptee: adoptees.find(adoptee => adoptee.id === userMatches[currentAdopter.id])
      };
    } else {
      return await applyCosineSimilarity(currentAdopter, currentAdopterPrefList, 'Adopter');
    }
  }

  if (userRole === 'Adoptee') {
    const currentAdoptee = adoptees.find(adoptee => adoptee.UserId === loggedInUserId);
    if (!currentAdoptee) {
      console.error(`Adoptee with UserId ${loggedInUserId} not found`);
      return { error: "Adoptee not found" };
    }

    const currentAdopteePrefList = adopteePreferences[currentAdoptee.id];
    if (!currentAdopteePrefList || currentAdopteePrefList.length === 0) {
      console.error(`No preferences found for Adoptee ${currentAdoptee.id}`);
      return await applyCosineSimilarity(currentAdoptee, [], 'Adoptee');
    }

    const rankDifferent = currentAdopteePrefList.length > 1 &&
      currentAdopteePrefList.some((id, i, arr) => {
        if (i === 0) return false;
        return rawAdopteePreferences.find(pref => pref.adopterId === id && pref.adopteeId === currentAdoptee.id).rank !==
          rawAdopteePreferences.find(pref => pref.adopterId === arr[i - 1] && pref.adopteeId === currentAdoptee.id).rank;
      });

    if (rankDifferent) {
      const freeAdoptees = new Set(adoptees.map(adoptee => adoptee.id));
      const proposerIndex = adoptees.reduce((acc, adoptee) => ({ ...acc, [adoptee.id]: 0 }), {});

      const { userMatches, otherUserMatches } = applyGaleShapley(adopteePreferences, adopterPreferences, freeAdoptees, proposerIndex);

      return {
        adopter: adopters.find(adopter => adopter.id === otherUserMatches[currentAdoptee.id]),
        adoptee: currentAdoptee
      };
    } else {
      return await applyCosineSimilarity(currentAdoptee, currentAdopteePrefList, 'Adoptee');
    }
  }

  return { error: "Invalid user role or user not found" };
}
