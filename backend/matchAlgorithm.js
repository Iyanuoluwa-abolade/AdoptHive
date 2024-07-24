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
    adopterPreferences[adopterId] = rawAdopterPreferences
      .filter(preference => preference.adopterId === adopterId)
      .sort((a, b) => b.rank - a.rank)
      .map(preference => preference.adopteeId);
  }

  for (const adoptee of adoptees) {
    const adopteeId = adoptee.id;
    adopteePreferences[adopteeId] = rawAdopteePreferences
      .filter(preference => preference.adopteeId === adopteeId)
      .sort((a, b) => b.rank - a.rank)
      .map(preference => preference.adopterId);
  }

  const applyGaleShapley = (userPreferences, otherUserPreferences, freeUsers, proposerIndex) => {
    const userMatches = {};
    const otherUserMatches = {};

    while (freeUsers.size > 0) {
      for (const userId of freeUsers) {
        const currentOtherUserId = userPreferences[userId][proposerIndex[userId]];
        proposerIndex[userId]++;

        if (!otherUserMatches[currentOtherUserId]) {
          otherUserMatches[currentOtherUserId] = userId;
          userMatches[userId] = currentOtherUserId;
          freeUsers.delete(userId);
        } else {
          const currentUserId = otherUserMatches[currentOtherUserId];
          const otherUserPrefList = otherUserPreferences[currentOtherUserId];
          const [userRank, currentUserRank] = [otherUserPrefList.indexOf(userId), otherUserPrefList.indexOf(currentUserId)];

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
    const currentAdopterPrefList = adopterPreferences[currentAdopter.id];

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
    const currentAdopteePrefList = adopteePreferences[currentAdoptee.id];

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
