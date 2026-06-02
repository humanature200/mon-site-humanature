// server/api/test-db.get.ts
import prisma from '../utils/prisma'

export default defineEventHandler(async () => {
  try {
    const testEmail = "contact@monsite.com"

    // 1. On cherche si l'utilisateur existe déjà
    let adminUser = await prisma.user.findUnique({
      where: { email: testEmail }
    })

    let messageStatus = "Déjà présent en base de données"

    // 2. S'il n'existe pas, alors seulement on le crée
    if (!adminUser) {
      adminUser = await prisma.user.create({
        data: {
          name: "Affo Dardaï",
          email: testEmail,
          password: "super_mot_de_passe_hache",
          role: "ADMIN"
        }
      })
      messageStatus = "Créé avec succès !"
    }

    // 3. On récupère ou crée un tutoriel de la même manière
    const testSlug = "apprendre-nuxt-3-de-a-z"
    let firstTutorial = await prisma.tutorial.findUnique({
      where: { slug: testSlug }
    })

    if (!firstTutorial) {
      firstTutorial = await prisma.tutorial.create({
        data: {
          title: "Apprendre Nuxt 3 de A à Z",
          slug: testSlug,
          description: "Découvrez comment créer un site dynamique comme Grafikart avec Nuxt, Tailwind et Prisma !",
          videoUrl: "https://www.youtube.com/watch?v=dQw4w9WgXcQ"
        }
      })
    }

    return {
      status: "success",
      message: `Connexion MySQL opérationnelle. Statut de l'admin : ${messageStatus}`,
      data: {
        user: adminUser,
        tutorial: firstTutorial
      }
    }

  } catch (error: any) {
    return {
      status: "error",
      message: error.message
    }
  }
})