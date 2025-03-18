import { PrismaClient } from "@prisma/client";
import { Item, ItemDTO, ItemDetail } from "../types";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library";

const prisma = new PrismaClient();

/**
 * Fetch all items with their basic details.
 * @returns A promise that resolves to an array of items.
 */
export async function getItems(): Promise<Item[]> {
  return prisma.item.findMany({
    select: {
      id: true,
      name: true,
    },
  });
}

/**
 * Fetch detailed information about a specific item.
 * @param itemId - The ID of the item to fetch.
 * @returns A promise that resolves to the item details or null if not found.
 */
export async function getItemDetail(itemId: number): Promise<ItemDetail | null> {
  return prisma.item.findFirst({
    where: { id: itemId },
  });
}

/**
 * Create or update an item in the database.
 * @param item - The item data to create or update.
 * @param itemId - The ID of the item to update (optional). If not provided, a new item will be created.
 * @returns A promise that resolves to the created or updated item.
 */
export async function upsertItem(
  item: ItemDTO,
  itemId?: number | null
): Promise<Item | null | undefined> {
  if (!item) {
    throw new Error("Item data is required");
  }

  try {
    // Check if itemId is provided and valid
    if (itemId !== undefined && itemId !== null) {
      return await prisma.item.upsert({
        where: {
          id: itemId,
        },
        update: {
          name: item.name,
          description: item.description,
        },
        create: {
          name: item.name,
          description: item.description,
        },
      });
    } else {
      // If itemId is not provided, create a new item
      return await prisma.item.create({
        data: {
          name: item.name,
          description: item.description,
        },
      });
    }
  } catch (error) {
    console.error("Error in upsertItem:", error);    
  }
}

/**
 * Delete an item from the database.
 * @param itemId - The ID of the item to delete.
 * @returns A promise that resolves to the deleted item or null if the item does not exist.
 */
export async function deleteItem(itemId: number): Promise<Item | null> {
  try {
    return await prisma.item.delete({
      where: { id: itemId },
    });
  } catch (error) {
    if (
      error instanceof PrismaClientKnownRequestError &&
      error.code === "P2025" // "Record to delete does not exist."
    ) {
      return null;
    } else {
      console.log("Error in deleteItem:", error);
      throw error;
    }
  }
}