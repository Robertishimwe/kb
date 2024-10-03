/*
  Warnings:

  - You are about to drop the `Product` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `_EntryProducts` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `products` to the `KBEntry` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "_EntryProducts_B_index";

-- DropIndex
DROP INDEX "_EntryProducts_AB_unique";

-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "Product";
PRAGMA foreign_keys=on;

-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "_EntryProducts";
PRAGMA foreign_keys=on;

-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_KBEntry" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "title" TEXT NOT NULL,
    "resolution" TEXT NOT NULL,
    "environment" TEXT NOT NULL,
    "issue" TEXT NOT NULL,
    "products" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);
INSERT INTO "new_KBEntry" ("createdAt", "environment", "id", "issue", "resolution", "title", "updatedAt") SELECT "createdAt", "environment", "id", "issue", "resolution", "title", "updatedAt" FROM "KBEntry";
DROP TABLE "KBEntry";
ALTER TABLE "new_KBEntry" RENAME TO "KBEntry";
CREATE UNIQUE INDEX "KBEntry_title_key" ON "KBEntry"("title");
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
