/*
  Warnings:

  - You are about to drop the `_KBEntryProducts` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "_KBEntryProducts";
PRAGMA foreign_keys=on;

-- CreateTable
CREATE TABLE "_EntryProducts" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL,
    CONSTRAINT "_EntryProducts_A_fkey" FOREIGN KEY ("A") REFERENCES "KBEntry" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "_EntryProducts_B_fkey" FOREIGN KEY ("B") REFERENCES "Product" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "_EntryProducts_AB_unique" ON "_EntryProducts"("A", "B");

-- CreateIndex
CREATE INDEX "_EntryProducts_B_index" ON "_EntryProducts"("B");
