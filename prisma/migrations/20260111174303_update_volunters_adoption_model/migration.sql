/*
  Warnings:

  - You are about to drop the column `email` on the `Volunteer` table. All the data in the column will be lost.
  - You are about to drop the column `phone` on the `Volunteer` table. All the data in the column will be lost.
  - Added the required column `schedule` to the `Volunteer` table without a default value. This is not possible if the table is not empty.
  - Added the required column `workArea` to the `Volunteer` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Adoption" ADD COLUMN     "adopterAddress" TEXT,
ADD COLUMN     "adopterImageUrl" TEXT,
ADD COLUMN     "volunteerInCharge" TEXT,
ALTER COLUMN "status" SET DEFAULT 'finalizado';

-- AlterTable
ALTER TABLE "Volunteer" DROP COLUMN "email",
DROP COLUMN "phone",
ADD COLUMN     "absenteeism" DOUBLE PRECISION NOT NULL DEFAULT 0,
ADD COLUMN     "age" INTEGER,
ADD COLUMN     "imageUrl" TEXT,
ADD COLUMN     "schedule" TEXT NOT NULL,
ADD COLUMN     "workArea" TEXT NOT NULL,
ADD COLUMN     "workedHours" INTEGER NOT NULL DEFAULT 0;
