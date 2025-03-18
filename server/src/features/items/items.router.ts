import express from "express";
import * as ItemsService from "./items.service";
import { validate } from "../../middleware/validation.middleware";
import { itemPOSTRequestSchema } from "../types";
import { upsertItem } from "./items.service";

export const itemsRouter = express.Router();

itemsRouter.get("/", async (require, response) => {
  const items = await ItemsService.getItems();
  items.forEach((item) => {
    item.imageUrl = buildImageUrl(require, item.id);
  });
  response.json(items);
});


itemsRouter.post("/", validate(itemPOSTRequestSchema), async (request, response) => {
  try {
      // Extract validated data from the request
      const data = itemPOSTRequestSchema.parse(request.body);
      const item = await upsertItem(data.body); // Assuming upsertItem is a function that handles the logic
      if (item != null) {
          response.status(201).json(item);
      } else {
          response.status(500).json({ message: "Failed to add items to order" });
      }
  } catch (error) {
      console.error('Error:', error); // Log the error for debugging
      response.status(400).json({ message: "Validation Error" });
  }
});

export default itemsRouter;


// eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars
function buildImageUrl(req: any, id: number): string {
  return `${req.protocol}://${req.get("host")}/images/${id}.jpg`;
}