/*
  Warnings:

  - Made the column `observations` on table `Adopter` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "Adopter" ALTER COLUMN "observations" SET NOT NULL,
ALTER COLUMN "observations" SET DEFAULT 'Nenhuma observação adicionada.';
