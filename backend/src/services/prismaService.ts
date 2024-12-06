// src/services/prismaService.ts

import { PrismaClient } from '@prisma/client';
import { KBEntry } from '../models/kbEntry';

const prisma = new PrismaClient();

export async function storeInSQL(entry: any) {
  return await prisma.kBEntry.create({
    data: entry,
  });
}

export async function getKBEntryByTitle(title: string) {
  return await prisma.kBEntry.findMany({
    where: { title },
  });
}

export async function getAllKBEntries() {
  return await prisma.kBEntry.findMany();
}
