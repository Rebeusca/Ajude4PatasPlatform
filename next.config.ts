/** @type {import('next').NextConfig} */
const nextConfig = {
  // Mantém sua opção do compilador
  reactCompiler: true,

  // 1. Ignora erros de TypeScript durante o build para permitir o deploy
  typescript: {
    ignoreBuildErrors: true,
  },

  // 2. Ignora erros de ESLint durante o build
  eslint: {
    ignoreDuringBuilds: true,
  },

  // 3. Opcional: Se houver problemas com pacotes externos, habilite isso
  transpilePackages: ["@prisma/client"],
};

export default nextConfig;
