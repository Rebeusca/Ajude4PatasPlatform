/*
  Warnings:

  - You are about to drop the column `adopterAddress` on the `Adoption` table. All the data in the column will be lost.
  - You are about to drop the column `adopterEmail` on the `Adoption` table. All the data in the column will be lost.
  - You are about to drop the column `adopterImageUrl` on the `Adoption` table. All the data in the column will be lost.
  - You are about to drop the column `adopterName` on the `Adoption` table. All the data in the column will be lost.
  - You are about to drop the column `adopterPhone` on the `Adoption` table. All the data in the column will be lost.
  - You are about to drop the column `volunteerInCharge` on the `Adoption` table. All the data in the column will be lost.
  - Added the required column `adopterId` to the `Adoption` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Adoption" DROP COLUMN "adopterAddress",
DROP COLUMN "adopterEmail",
DROP COLUMN "adopterImageUrl",
DROP COLUMN "adopterName",
DROP COLUMN "adopterPhone",
DROP COLUMN "volunteerInCharge",
ADD COLUMN     "adopterId" TEXT NOT NULL,
ADD COLUMN     "observations" TEXT,
ALTER COLUMN "status" SET DEFAULT 'em adaptação',
ALTER COLUMN "adoptionDate" DROP DEFAULT;

-- CreateTable
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
    "birthDate" TIMESTAMP(3) NOT NULL,
    "imageUrl" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Adopter_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Adoption" ADD CONSTRAINT "Adoption_adopterId_fkey" FOREIGN KEY ("adopterId") REFERENCES "Adopter"("id") ON DELETE CASCADE ON UPDATE CASCADE;
