import bcrypt from "bcryptjs"
import { prisma } from "../lib/prisma"

async function createAdmin() {
  const password = process.argv[2]
  const email = process.argv[3]
  const name = process.argv[4] || "Administrador"

  if (!password || !email) {
    console.error("Uso: npm run create-admin <senha> <email> [nome]")
    console.error("")
    console.error("Exemplo: npm run create-admin minhaSenha123 [email protected] \"João Silva\"")
    process.exit(1)
  }

  try {
    // Verificar se o usuário já existe
    const existingUser = await prisma.user.findUnique({
      where: { email }
    })

    if (existingUser) {
      console.error(`❌ Usuário com email ${email} já existe!`)
      process.exit(1)
    }

    // Gerar hash da senha
    const hashedPassword = await bcrypt.hash(password, 10)
    
    // Criar usuário
    const user = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        name,
        role: "admin"
      }
    })

    console.log("\n✅ Usuário administrador criado com sucesso!\n")
    console.log(`📧 Email: ${user.email}`)
    console.log(`👤 Nome: ${user.name}`)
    console.log(`🔑 Role: ${user.role}`)
    console.log(`🆔 ID: ${user.id}\n`)
  } catch (error) {
    console.error("❌ Erro ao criar usuário:", error)
    process.exit(1)
  } finally {
    await prisma.$disconnect()
  }
}

createAdmin()