import { Router } from "express";
import { prismaClient } from "../prismaClient";
import { BadRequestError, NotFoundError } from "../../errors";
import { CreateCustomer, UpdateCustomer } from "../types";

export const customerRouter = Router()

customerRouter.get("/customers", async (request, response) => {
    // const customers = await prismaClient.$queryRaw`SELECT * FROM customers`
    const customers = await prismaClient.customers.findMany();
    return response.json(customers);
  });
  
  customerRouter.get("/customers/:id", async (request, response) => {
    try {
      const id = request.params.id;
      const customer = await prismaClient.customers.findUnique({ where: { id } });
      return response.json(customer);
    } catch (error) {
      throw new BadRequestError("Usuário inválido");
    }
  });
  
  customerRouter.post("/customers", async (request, response) => {
    const data: CreateCustomer = request.body;
    const customer = await prismaClient.customers.create({ data });
    return response.json(customer);
  });
  
  customerRouter.put("/customers/:id", async (request, response) => {
    const id = request.params.id;
    const data: UpdateCustomer = request.body;
  
  //   const customerExists = await prismaClient.customers.findUnique({where: {id}})
  
  //   if (!customerExists) {
  //     throw new NotFoundError('Cliente não existe')
  //   }
  
    const customer = await prismaClient.customers.upsert({
      create: { ...data, id },
      update: { ...data },
      where: { id },
    });
    return response.json(customer);
  });
  
  customerRouter.delete("/customers/:id", async (request, response) => {
      const id = request.params.id;
      const data: UpdateCustomer = request.body;
    
      const customerExists = await prismaClient.customers.findUnique({where: {id}})
    
      if (!customerExists) {
        throw new NotFoundError('Cliente não existe')
      }
    
      await prismaClient.customers.delete({
        where: { id },
      });
  
      return response.status(204);
    });