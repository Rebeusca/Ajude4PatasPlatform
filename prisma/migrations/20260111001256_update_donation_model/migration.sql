/*
  Warnings:

  - You are about to drop the column `amount` on the `Donation` table. All the data in the column will be lost.
  - You are about to drop the column `donorEmail` on the `Donation` table. All the data in the column will be lost.
  - You are about to drop the column `method` on the `Donation` table. All the data in the column will be lost.
  - Added the required column `product` to the `Donation` table without a default value. This is not possible if the table is not empty.
  - Added the required column `quantity` to the `Donation` table without a default value. This is not possible if the table is not empty.
  - Made the column `donorName` on table `Donation` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "Donation" DROP COLUMN "amount",
DROP COLUMN "donorEmail",
DROP COLUMN "method",
ADD COLUMN     "donationDate" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "observations" TEXT,
ADD COLUMN     "product" TEXT NOT NULL,
ADD COLUMN     "quantity" TEXT NOT NULL,
ALTER COLUMN "donorName" SET NOT NULL;
