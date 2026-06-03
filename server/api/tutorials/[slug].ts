// server/api/tutorials/[slug].ts
import prisma from '../../utils/prisma'

export default defineEventHandler(async (event) => {
  // 1. Récupérer le slug depuis l'URL de la requête
  const slug = getRouterParam(event, 'slug')

  try {
    // 2. Chercher le tutoriel correspondant dans MySQL via Prisma
    const tutorial = await prisma.tutorial.findUnique({
      where: { slug: slug }
    })

    // 3. Si le cours n'existe pas, renvoyer une erreur 404
    if (!tutorial) {
      return createError({
        statusCode: 404,
        statusMessage: "Tutoriel introuvable."
      })
    }

    return tutorial
  } catch (error) {
    return createError({
      statusCode: 500,
      statusMessage: "Erreur lors de la récupération du tutoriel."
    })
  }
})