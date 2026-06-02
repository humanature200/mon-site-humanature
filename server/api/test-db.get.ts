// server/api/test-db.get.ts
import prisma from '../utils/prisma'

export default defineEventHandler(async () => {
  try {
    // 1. Création d'un utilisateur Admin
    const adminUser = await prisma.user.create({
      data: {
        name: "Affo Dardaï",
        email: "contact@monsite.com",
        password: "super_mot_de_passe_hache", // À remplacer plus tard par bcrypt
        role: "ADMIN"
      }
    })

    // 2. Création d'un tutoriel de test
    const firstTutorial = await prisma.tutorial.create({
      data: {
        title: "Apprendre Nuxt 3 de A à Z",
        slug: "apprendre-nuxt-3-de-a-z",
        description: "Découvrez comment créer un site dynamique comme Grafikart avec Nuxt, Tailwind et Prisma !",
        videoUrl: "https://www.youtube.com/watch?v=dQw4w9WgXcQ"
      }
    })

    return {
      status: "success",
      message: "Base de données connectée et alimentée avec succès !",
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