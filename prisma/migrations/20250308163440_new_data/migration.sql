/*
  Warnings:

  - Made the column `email` on table `Company` required. This step will fail if there are existing NULL values in that column.
  - Made the column `phone` on table `Company` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE `Company` MODIFY `email` VARCHAR(191) NOT NULL,
    MODIFY `phone` VARCHAR(191) NOT NULL;
