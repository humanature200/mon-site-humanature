// server/api/tutorials/index.get.ts
import prisma from '../../utils/prisma'

export default defineEventHandler(async (event) => {
  // 1. Récupérer l'ID de l'utilisateur connecté s'il est passé en paramètre
  const query = getQuery(event)
  const userId = query.userId as string

  try {
    // 2. Récupérer tous les tutoriels de MySQL
    const tutorials = await prisma.tutorial.findMany({
      orderBy: { id: 'desc' }
    })

    // 3. Si un userId est fourni, on va chercher ses progressions
    if (userId) {
      const userProgress = await prisma.progress.findMany({
        where: { userId: userId }
      })

      // On crée un Set des IDs de tutoriels terminés pour une recherche ultra rapide
      const completedIds = new Set(userProgress.map(p => p.tutorialId))

      // On ajoute une propriété "isCompleted" à chaque tutoriel
      return tutorials.map(tuto => ({
        ...tuto,
        isCompleted: completedIds.has(tuto.id)
      }))
    }

    // Si pas d'utilisateur connecté, on renvoie les cours sans statut
    return tutorials.map(tuto => ({ ...tuto, isCompleted: false }))

  } catch (error) {
    return createError({
      statusCode: 500,
      statusMessage: "Impossible de récupérer les tutoriels."
    })
  }
})