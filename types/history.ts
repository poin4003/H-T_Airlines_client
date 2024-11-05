import { ApiResponse } from "./api";
import { Ticket } from "./ticket";
import { User } from "./user";

export type HistoryResponse = ApiResponse<History>;
export type HistoryListReponse = ApiResponse<History[]>;

export type History = {
  ID: number;
  user_id: string;
  user: User | null;
	ticket_id: number;
  ticket: Ticket | null;
	total_amount: number;
  seat_number: string;
	gate: string;
  CreatedAt: string | null;
  UpdatedAt: string | null;
  DeletedAt: string | null;
	status: boolean;
}