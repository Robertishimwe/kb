"use strict";
// src/services/prismaService.ts
Object.defineProperty(exports, "__esModule", { value: true });
exports.storeInSQL = storeInSQL;
exports.getKBEntryByTitle = getKBEntryByTitle;
exports.getAllKBEntries = getAllKBEntries;
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
async function storeInSQL(entry) {
    return await prisma.kBEntry.create({
        data: entry,
    });
}
async function getKBEntryByTitle(title) {
    return await prisma.kBEntry.findMany({
        where: { title },
    });
}
async function getAllKBEntries() {
    return await prisma.kBEntry.findMany();
}
