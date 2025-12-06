/*
  Warnings:

  - Changed the type of `planId` on the `Subscription` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- CreateEnum
CREATE TYPE "PlanId" AS ENUM ('starter', 'professional', 'enterprise');

-- AlterTable
ALTER TABLE "Subscription" DROP COLUMN "planId",
ADD COLUMN     "planId" "PlanId" NOT NULL;
