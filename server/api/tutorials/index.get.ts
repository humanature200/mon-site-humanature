// server/api/tutorials/index.get.ts
import prisma from '../../utils/prisma'

export default defineEventHandler(async () => {
  try {
    // Interroge MySQL pour ramener tous les cours du plus récent au plus ancien
    const tutorials = await prisma.tutorial.findMany({
      orderBy: {
        createdAt: 'desc'
      }
    })
    return tutorials
  } catch (error) {
    return createError({
      statusCode: 500,
      statusMessage: "Impossible de charger les tutoriels depuis la base de données."
    })
  }
})