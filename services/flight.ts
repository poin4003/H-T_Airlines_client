import { FlightListReponse, FlightResponse } from "@/types/flight";
import { Api } from "./api";

async function getOne(id: number): Promise<FlightResponse> {
  return Api.get(`/flights/${id}`);
}

async function getAll(): Promise<FlightListReponse> {
  return Api.get('/flights');
}

async function createOne(  
  flight_number: string,
  departure_airport: string,
  arrival_airport: string,
  departure_time: Date | string,
  arrival_time: Date | string,
  aircraft_type: string,
): Promise<FlightListReponse> {
  return Api.post("/flights", { 
    flight_number, 
    departure_airport, 
    arrival_airport,
    departure_time,
    arrival_time,
    aircraft_type
  });
}

async function updateOne(  
  id: number,
  flight_number: string,
  departure_airport: string,
  arrival_airport: string,
  departure_time: Date | string,
  arrival_time: Date | string,
  aircraft_type: string,
): Promise<FlightListReponse> {
  return Api.put(`/flights/${id}`, { 
    flight_number, 
    departure_airport, 
    arrival_airport,
    departure_time,
    arrival_time,
    aircraft_type
  });
}

async function deleteOne(id: number): Promise<FlightResponse> {
  return Api.delete(`/flights/${id}`);
}


const flightService = {
  getOne,
  getAll,
  createOne,
  updateOne,
  deleteOne,
}

export { flightService }