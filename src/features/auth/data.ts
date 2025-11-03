import api from "@/src/shared/lib/api";
import {
  LoginInput,
  LoginInputSchema,
  LoginResponseSchema,
  RegisterInput,
  RegisterInputSchema,
  User,
  UserSchema,
} from "./types";

// Auth API functions
export async function login(
  input: LoginInput & { grant_type?: string } = { email: "", password: "" }
): Promise<User | { user: User; accessToken?: string }> {
  const payload = LoginInputSchema.parse(input);

  // Sets custom header if grant type is provided
  const headers: Record<string, string> = {};
  if (input.grant_type) {
    headers["x-grant-type"] = input.grant_type;
  }

  // Makes API call to login endpoint
  const res = await api.post("/auth/login", payload, { headers });
  const data = LoginResponseSchema.parse(res.data);

  // Returns user and accessToken if present
  if (!data.accessToken) return data.user;
  return { user: data.user, accessToken: data.accessToken };
}

// Refresh token function
export async function refresh(): Promise<void> {
  await api.post("/auth/refresh");
}

// Logout function
export async function logout(): Promise<void> {
  await api.post("/auth/logout");
}

// Fetch current user function
export async function getMe(): Promise<User> {
  const res = await api.get("/users/me");
  return UserSchema.parse(res.data);
}

// User API functions
export async function registerUser(input: RegisterInput): Promise<User> {
  const payload = RegisterInputSchema.parse(input);
  const res = await api.post("/users", payload);
  const user = UserSchema.parse(res.data);
  return user;
}
