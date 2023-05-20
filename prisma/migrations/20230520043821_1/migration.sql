/*
  Warnings:

  - The primary key for the `useraddress` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `id` on the `useraddress` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `useraddress` DROP PRIMARY KEY,
    DROP COLUMN `id`,
    ADD COLUMN `addressesId` INTEGER NOT NULL DEFAULT 0,
    ADD PRIMARY KEY (`userId`, `addressesId`);

-- AddForeignKey
ALTER TABLE `UserAddress` ADD CONSTRAINT `UserAddress_addressesId_fkey` FOREIGN KEY (`addressesId`) REFERENCES `Address`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
