import { ApiResponse } from "./api";
import { Flight } from "./flight";

export type TicketResponse = ApiResponse<ResTicket>;
export type TicketListReponse = ApiResponse<Ticket[]>;

type ResTicket = {
  ticket: Ticket
}

export type Ticket = {
  ID: number;
  flight_id: number;
  flight: Flight | null;
	price: number;
	ticket_type: string;
	description: string;
	available_seat: number;
	status: boolean;
  CreatedAt: string | null;
  UpdatedAt: string | null;
  DeletedAt: string | null;
}