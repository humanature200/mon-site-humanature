// server/api/comments/index.ts
import prisma from '../../utils/prisma'

export default defineEventHandler(async (event) => {
  const method = event.node.req.method

  // 1. GET : Récupérer les commentaires d'un cours
  if (method === 'GET') {
    const query = getQuery(event)
    const tutorialId = query.tutorialId as string // 👈 Reçu en String directement

    if (!tutorialId) {
      return createError({ statusCode: 400, statusMessage: "tutorialId manquant." })
    }

    return await prisma.comment.findMany({
      where: { tutorialId: tutorialId },
      orderBy: { createdAt: 'desc' }
    })
  }

  // 2. POST : Enregistrer un message (Forum / Tuto)
  if (method === 'POST') {
    const body = await readBody(event)
    const { content, authorId, userName, tutorialId } = body // 👈 tutorialId est une String

    if (!content || !authorId || !userName || !tutorialId) {
      return createError({ statusCode: 400, statusMessage: "Champs manquants." })
    }

    return await prisma.comment.create({
      data: {
        content,
        authorId,
        userName,
        tutorialId // 👈 Plus de parseInt ici !
      }
    })
  }
})