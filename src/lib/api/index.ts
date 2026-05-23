import { API_BASE_URL, USE_MOCK_DATA } from "@/lib/constants";
import { ApiClient } from "./ApiClient";
import { MockApiClient } from "./MockApiClient";

export { getToken, setToken, removeToken } from "./token";

export const api = USE_MOCK_DATA ? new MockApiClient() : new ApiClient(API_BASE_URL);
