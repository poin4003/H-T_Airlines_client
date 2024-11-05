import { ApiResponse } from "./api"

export enum UserRole {
  Manager = "manager",
  Customer = "customer"
}

export type AuthResponse = ApiResponse<{user: User, token: string}>

export type User = {
  ID: number
  first_name: string
	last_name: string
	email: string
	phone_number: string
	identity_id: string
	passport: string
	role: UserRole
	status: boolean
  CreatedAt: string
  UpdatedAt: string
}