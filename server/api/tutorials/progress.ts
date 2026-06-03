// server/api/tutorials/progress.ts
import prisma from '../../utils/prisma'

export default defineEventHandler(async (event) => {
  const method = event.node.req.method

  // 1. Récupérer les paramètres (userId et tutorialId)
  if (method === 'GET') {
    const query = getQuery(event)
    const userId = query.userId as string
    const tutorialId = parseInt(query.tutorialId as string)

    if (!userId || !tutorialId) return { completed: false }

    const progress = await prisma.progress.findUnique({
      where: {
        userId_tutorialId: { userId, tutorialId }
      }
    })

    return { completed: !!progress }
  }

  // 2. Actionner le bouton (Ajouter ou Retirer de la base)
  if (method === 'POST') {
    const body = await readBody(event)
    const { userId, tutorialId } = body

    if (!userId || !tutorialId) {
      return createError({ statusCode: 400, statusMessage: "Données manquantes." })
    }

    // Vérifier si ça existe déjà
    const existingProgress = await prisma.progress.findUnique({
      where: {
        userId_tutorialId: { userId, tutorialId: parseInt(tutorialId) }
      }
    })

    if (existingProgress) {
      // Si ça existe, on le supprime (décocher)
      await prisma.progress.delete({
        where: { id: existingProgress.id }
      })
      return { completed: false, message: "Marqué comme non terminé" }
    } else {
      // Sinon, on l'ajoute
      await prisma.progress.create({
        data: {
          userId,
          tutorialId: parseInt(tutorialId)
        }
      })
      return { completed: true, message: "Marqué comme terminé !" }
    }
  }
})