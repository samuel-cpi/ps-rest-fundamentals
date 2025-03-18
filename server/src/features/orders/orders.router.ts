import express from "express";
import * as OrdersService from "./orders.service";
import { validate } from "../../middleware/validation.middleware";
import { orderItemsDTORequestSchema, pagingRequestSchema } from "../types";
import { request } from "http";

export const ordersRouter = express.Router();


ordersRouter.get("/", validate(pagingRequestSchema), async (request, response) => {
  const { take, skip } = request.query as unknown as { take: number; skip: number }; // Explicitly cast to the expected type
  const orders = await OrdersService.getOrders(skip, take);
  response.json(orders);
});

