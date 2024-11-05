import { TicketListReponse, TicketResponse } from "@/types/ticket";
import { Api } from "./api";

async function getOne(id: number): Promise<TicketResponse> {
  return Api.get(`/tickets/${id}`);
}

async function getAll(): Promise<TicketListReponse> {
  return Api.get(`/tickets/`);
}

async function createOne(  
  flight_id: number,
  price: number,
  ticket_type: string,
  description: string,
  available_seat: number,
): Promise<TicketResponse> {
  return Api.post("/tickets", { 
    flight_id,
    price,
    ticket_type,
    description,
    available_seat,
  });
}

async function updateOne(  
  id: number,
  price: number,
  ticket_type: string,
  description: string,
  available_seat: number,
): Promise<TicketResponse> {
  return Api.put(`/tickets/${id}`, { 
    price,
    ticket_type,
    description,
    available_seat,
  });
}

async function deleteOne(id: number): Promise<TicketResponse> {
  return Api.delete(`/tickets/${id}`);
}

const ticketService = {
  getOne,
  getAll,
  createOne,
  updateOne,
  deleteOne,
}

export { ticketService }
