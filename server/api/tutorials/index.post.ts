// server/api/tutorials/index.post.ts
import prisma from '../../utils/prisma'

// Petite fonction maison pour transformer "Apprendre Prisma ORM" en "apprendre-prisma-orm"
function slugify(text: string) {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .normalize('NFD')                 // Supprime les accents
    .replace(/[\u0300-\u036f]/g, '')  // Supprime les résidus d'accents
    .replace(/[^a-z0-9 -]/g, '')      // Ne garde que les lettres, chiffres et espaces
    .replace(/\s+/g, '-')             // Remplace les espaces par des tirets
    .replace(/-+/g, '-')              // Évite les doubles tirets
}

export default defineEventHandler(async (event) => {
  try {
    const body = await readBody(event)
    const { title, description, videoUrl } = body

    if (!title || !description) {
      return createError({
        statusCode: 400,
        statusMessage: "Le titre et la description sont obligatoires."
      })
    }

    // 1. Génération automatique du slug à partir du titre transmis
    const generatedSlug = slugify(title)

    // 2. Insertion finale en base de données avec le slug inclus !
    const newTutorial = await prisma.tutorial.create({
      data: {
        title: title,
        description: description,
        videoUrl: videoUrl || "",
        slug: generatedSlug // <-- Le champ obligatoire est maintenant complété !
      }
    })

    return {
      status: 'success',
      message: "Tutoriel ajouté avec succès !",
      tutorial: newTutorial
    }

  } catch (error) {
    console.error("❌ Erreur Prisma détectée :", error)
    return createError({
      statusCode: 500,
      statusMessage: "Erreur lors de la création du tutoriel dans la base MySQL."
    })
  }
})