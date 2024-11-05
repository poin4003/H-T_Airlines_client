import { HistoryListReponse, HistoryResponse } from "@/types/history";
import { Api } from "./api";

async function createOne(ticket_id: number): Promise<HistoryResponse> {
  return Api.post(`/bookings/`, { ticket_id });
}

async function getAll(): Promise<HistoryListReponse> {
  return Api.get(`/bookings/`);
}

const historyService = {
  getAll,
  createOne,
}

export { historyService }