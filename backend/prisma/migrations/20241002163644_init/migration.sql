-- CreateTable
CREATE TABLE "KBEntry" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "title" TEXT NOT NULL,
    "resolution" TEXT NOT NULL,
    "environment" TEXT NOT NULL,
    "issue" TEXT NOT NULL,
    "products" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "KBEntry_title_key" ON "KBEntry"("title");
