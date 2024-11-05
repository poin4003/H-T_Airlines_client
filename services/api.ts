import AsyncStorage from "@react-native-async-storage/async-storage"
import axios, { AxiosError, AxiosInstance, AxiosResponse } from "axios"
import { Platform } from "react-native";
import curlirize from 'axios-curlirize'

const url = Platform.OS === "android" ? "https://ticket-booking-backend-2ibf.onrender.com" : "https://ticket-booking-backend-2ibf.onrender.com";

const Api: AxiosInstance = axios.create({ baseURL: url + "/api" });

curlirize(Api)

Api.interceptors.request.use(async config => {
  const token = await AsyncStorage.getItem("token");

  if (token) {
    config.headers.set("Authorization", `Bearer ${token}`)
  }
  return config;
});

Api.interceptors.response.use(
  async (res: AxiosResponse) => {
    return res.data
  },
  async (err: AxiosError) => {
    console.error(err);
    return Promise.resolve(err?.response?.data)
  }
)

export { Api }