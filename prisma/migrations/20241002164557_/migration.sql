/*
  Warnings:

  - You are about to drop the column `products` on the `KBEntry` table. All the data in the column will be lost.

*/
-- CreateTable
CREATE TABLE "Product" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "_KBEntryProducts" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL,
    CONSTRAINT "_KBEntryProducts_A_fkey" FOREIGN KEY ("A") REFERENCES "KBEntry" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "_KBEntryProducts_B_fkey" FOREIGN KEY ("B") REFERENCES "Product" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_KBEntry" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "title" TEXT NOT NULL,
    "resolution" TEXT NOT NULL,
    "environment" TEXT NOT NULL,
    "issue" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);
INSERT INTO "new_KBEntry" ("createdAt", "environment", "id", "issue", "resolution", "title", "updatedAt") SELECT "createdAt", "environment", "id", "issue", "resolution", "title", "updatedAt" FROM "KBEntry";
DROP TABLE "KBEntry";
ALTER TABLE "new_KBEntry" RENAME TO "KBEntry";
CREATE UNIQUE INDEX "KBEntry_title_key" ON "KBEntry"("title");
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;

-- CreateIndex
CREATE UNIQUE INDEX "_KBEntryProducts_AB_unique" ON "_KBEntryProducts"("A", "B");

-- CreateIndex
CREATE INDEX "_KBEntryProducts_B_index" ON "_KBEntryProducts"("B");
