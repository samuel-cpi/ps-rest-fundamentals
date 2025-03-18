import express from "express";
import * as CustomerService from "./customers.service";

export const customersRouter = express.Router();

customersRouter.get("/", async (request, response) => {
  const customers = await CustomerService.getCustomers();
  response.json(customers);
});

customersRouter.get("/:id", async (request, response) => {
  const id = request.params.id;
  const customer = await CustomerService.getCustomerDetail(id);
  if (customer != null) {
    response.json(customer);
  } else {
    response.status(404).json({ message: "Customer not found" });
  }
});

customersRouter.get("/search/:query", async (request, response) => {
  const query = request.params.query;
  const customers = await CustomerService.searchCustomers(query);
  response.json(customers);
});


