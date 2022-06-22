/*
  Warnings:

  - Added the required column `googleLinked` to the `User` table without a default value. This is not possible if the table is not empty.
  - Added the required column `kakaoLinked` to the `User` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `User` ADD COLUMN `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    ADD COLUMN `googleLinkId` VARCHAR(191) NULL,
    ADD COLUMN `googleLinked` BOOLEAN DEFAULT(0) NOT NULL,
    ADD COLUMN `gooogleUid` VARCHAR(191) NULL,
    ADD COLUMN `kakaoLinkId` VARCHAR(191) NULL,
    ADD COLUMN `kakaoLinked` BOOLEAN DEFAULT(0) NOT NULL,
    ADD COLUMN `kakaoUid` VARCHAR(191) NULL;
