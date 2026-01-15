-- Criar tabela Adopter primeiro
CREATE TABLE "Adopter" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "address" TEXT NOT NULL,
    "addressNum" TEXT NOT NULL,
    "zipCode" TEXT NOT NULL,
    "neighborhood" TEXT NOT NULL,
    "city" TEXT NOT NULL,
    "state" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "email" TEXT,
    "observations" TEXT NOT NULL DEFAULT 'Nenhuma observação adicionada.',
    "birthDate" TIMESTAMP(3) NOT NULL,
    "imageUrl" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Adopter_pkey" PRIMARY KEY ("id")
);

-- Criar um Adopter padrão para registros sem dados
INSERT INTO "Adopter" ("id", "name", "address", "addressNum", "zipCode", "neighborhood", "city", "state", "phone", "email", "birthDate", "createdAt", "updatedAt")
SELECT 
    'default-adopter-id' as "id",
    'Adotador não informado' as "name",
    'Não informado' as "address",
    '' as "addressNum",
    '' as "zipCode",
    '' as "neighborhood",
    '' as "city",
    '' as "state",
    'Não informado' as "phone",
    NULL as "email",
    CURRENT_TIMESTAMP as "birthDate",
    CURRENT_TIMESTAMP as "createdAt",
    CURRENT_TIMESTAMP as "updatedAt"
WHERE NOT EXISTS (SELECT 1 FROM "Adopter" WHERE "id" = 'default-adopter-id');

-- Adicionar coluna adopterId como opcional primeiro
ALTER TABLE "Adoption" ADD COLUMN IF NOT EXISTS "adopterId" TEXT;
ALTER TABLE "Adoption" ADD COLUMN IF NOT EXISTS "observations" TEXT;

-- Preencher adopterId com o Adopter padrão para todos os registros existentes
UPDATE "Adoption"
SET "adopterId" = 'default-adopter-id'
WHERE "adopterId" IS NULL;

-- Agora tornar adopterId obrigatório
ALTER TABLE "Adoption" ALTER COLUMN "adopterId" SET NOT NULL;

-- Remover colunas antigas
ALTER TABLE "Adoption" 
DROP COLUMN IF EXISTS "adopterAddress",
DROP COLUMN IF EXISTS "adopterEmail",
DROP COLUMN IF EXISTS "adopterImageUrl",
DROP COLUMN IF EXISTS "adopterName",
DROP COLUMN IF EXISTS "adopterPhone",
DROP COLUMN IF EXISTS "volunteerInCharge";

-- Alterar defaults
ALTER TABLE "Adoption" 
ALTER COLUMN "status" SET DEFAULT 'em adaptação';

ALTER TABLE "Adoption"
ALTER COLUMN "adoptionDate" DROP DEFAULT;

-- AddForeignKey
ALTER TABLE "Adoption" ADD CONSTRAINT "Adoption_adopterId_fkey" FOREIGN KEY ("adopterId") REFERENCES "Adopter"("id") ON DELETE CASCADE ON UPDATE CASCADE;
