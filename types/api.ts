export type ApiResponse<Data> = {
  status?: string | number
  message?: string
  data?: Data
  meta_data?: {
    limit: number
    page: number
    total: number
  }
}