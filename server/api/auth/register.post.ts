// server/api/auth/register.post.ts
import bcrypt from 'bcrypt'
import prisma from '../../utils/prisma'

export default defineEventHandler(async (event) => {
  try {
    // 1. On récupère les données envoyées par le client (frontend)
    const body = await readBody(event)
    const { name, email, password } = body

    // 2. Validation de base : on vérifie que tous les champs sont remplis
    if (!name || !email || !password) {
      throw createError({
        statusCode: 400,
        statusMessage: "Veuillez remplir tous les champs obligatoires (name, email, password)."
      })
    }

    // 3. On vérifie si un utilisateur possède déjà cet email dans MySQL
    const existingUser = await prisma.user.findUnique({
      where: { email }
    })

    if (existingUser) {
      throw createError({
        statusCode: 409,
        statusMessage: "Cet email est déjà utilisé par un autre compte."
      })
    }

    // 4. On hache le mot de passe de manière sécurisée (10 tours de "salt")
    const hashedPassword = await bcrypt.hash(password, 10)

    // 5. On crée l'utilisateur dans la base de données
    const newUser = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        role: "USER" // Par défaut, c'est un étudiant (USER)
      },
      // Sécurité : On sélectionne ce qu'on renvoie pour NE PAS afficher le mot de passe haché dans la réponse
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        createdAt: true
      }
    })

    // 6. On renvoie une réponse positive
    return {
      status: "success",
      message: "Inscription réussie !",
      user: newUser
    }

  } catch (error: any) {
    // On gère les erreurs proprement pour éviter que le serveur crash
    return createError({
      statusCode: error.statusCode || 500,
      statusMessage: error.statusMessage || "Une erreur interne est survenue lors de l'inscription."
    })
  }
})