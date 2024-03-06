export interface ApiResponse<Data, Error = string | Record<string, string[]>> {
  data?: Data;
  error?: Error;
}
