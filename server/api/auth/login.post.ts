// server/api/auth/login.post.ts
import bcrypt from 'bcrypt'
import prisma from '../../utils/prisma'

export default defineEventHandler(async (event) => {
  try {
    // 1. Récupération des identifiants saisis
    const body = await readBody(event)
    const { email, password } = body

    // 2. Validation basique
    if (!email || !password) {
      throw createError({
        statusCode: 400,
        statusMessage: "Veuillez fournir un email et un mot de passe."
      })
    }

    // 3. Recherche de l'utilisateur dans la base de données
    const user = await prisma.user.findUnique({
      where: { email }
    })

    // 4. Si l'utilisateur n'existe pas
    if (!user) {
      throw createError({
        statusCode: 401,
        statusMessage: "Identifiants incorrects (email introuvable)."
      })
    }

    // 5. Vérification du mot de passe avec bcrypt.compare
    // Cette fonction prend le mot de passe en clair et le compare avec la version hachée de la BDD
    const isPasswordValid = await bcrypt.compare(password, user.password)

    if (!isPasswordValid) {
      throw createError({
        statusCode: 401,
        statusMessage: "Identifiants incorrects (mot de passe invalide)."
      })
    }

    // 6. Connexion réussie ! On renvoie les infos de l'utilisateur (sans le mot de passe)
    return {
      status: "success",
      message: "Connexion réussie ! Bienvenue sur HumaNature.",
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        createdAt: user.createdAt
      }
    }

  } catch (error: any) {
    return createError({
      statusCode: error.statusCode || 500,
      statusMessage: error.statusMessage || "Une erreur est survenue lors de la connexion."
    })
  }
})