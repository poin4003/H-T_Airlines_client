import { ApiResponse } from "./api";
import { Ticket } from "./ticket";

export type FlightResponse = ApiResponse<Flight>;
export type FlightListReponse = ApiResponse<Flight[]>;

export type Flight = {
  ID: number;
  CreatedAt: string | null;
  UpdatedAt: string | null;
  DeletedAt: string | null;
  flight_number: string;
  departure_airport: string;
  arrival_airport: string;
  departure_time: string;
  arrival_time: string;
  aircraft_type: string;
  ticket: Ticket[] | null[];
  status: boolean;
}
