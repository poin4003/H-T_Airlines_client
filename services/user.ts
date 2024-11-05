import { AuthResponse } from "@/types/user";
import { Api } from "./api";

export type LoginCredentials = {
  email: string
  password: string
}

export type RegisterCredentials = {
  email: string
	password: string    
	first_name: string  
	last_name: string
	phone_number: string
	identity_id: string
	passport: string
}

async function login(credentials: LoginCredentials): Promise<AuthResponse> {
  return Api.post("/auth/login", credentials);
}

async function register(credentials: RegisterCredentials): Promise<AuthResponse> {
  return Api.post("/auth/register", credentials);
}

const userService = {
  login,
  register
}

export { userService }